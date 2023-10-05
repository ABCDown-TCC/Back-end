import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ProfessorService } from 'src/professor/professor.service';

interface Professor {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  foto: string;
  email: string;
  senha: string;
  idGenero: number;
}

@Injectable()
export class RedefinicaoSenhaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly professorService : ProfessorService
  ) {}

  private tokenCache: { token: number };

  
  gerarNumeroAleatorio() {
    const token = Math.floor(Math.random() * 9000) + 1000;
    this.tokenCache = {
      token: token
    }
    return token;

  }


  async enviarTokenPorEmail(email: string): Promise<{}> {
    const professorValidation =  await this.professorService.findEmail(email)
    if(professorValidation){
      const token = this.gerarNumeroAleatorio();      
          const transporter = nodemailer.createTransport({
                  service: 'Gmail', // ou qualquer outro serviço de e-mail
                  auth: {
                    user: `kaue.lima@uxgroup.com.br`,
                    pass: '301906Ka.',
                  },
                });
                  const mailOptions = {
                    from: 'kaue.lima@uxgroup.com.br',
                    to: email,
                    subject: 'Redefinição de Senha - Conta ABCDown',
                    text: `Seu código de redefinição de senha: ${token}`,
                  };
                  
                  await transporter.sendMail(mailOptions);
                  
                  return email;  
      }else{
        console.log('não foi');      
    }
  }

  async validarToken(email: string, token: number){

    
    const user = await this.professorService.findEmail(email)
    if(user){
      if(token == this.tokenCache.token){
        return{
          HttpCode: HttpStatus.OK
        }
      } else{
        return{
          HttpCode: HttpStatus.CONFLICT
        }
      }
      
    } 
  
  }

  async redefinirSenha(
    email: string,
    token: number,
    novaSenha: string,
  ): Promise<void> {
   


    this.validarToken(email,token) 
    if(this.validarToken){
      const queryUser = `select * from tbl_professor where email = '${email}'`;
    
    
      const result: Professor =
        await this.prismaService.$queryRawUnsafe(queryUser);
  
      if (result[0]) {
      const idUser = result[0].id

        const novaSenhaa = await bcrypt.hash(novaSenha, 10);
        const queryResetPassword = `update tbl_professor set senha = '${novaSenhaa}' where id = ${idUser};`;
        
        
        const resultRedefine =
          await this.prismaService.$queryRawUnsafe(queryResetPassword);
          if(resultRedefine){
            console.log("foi"); 
            
          }
  
      } else {
        return console.log('não foi possivel redefinir sua senha');
      }
  
      delete this.tokenCache[email]; 
    }
    } 
    
}
