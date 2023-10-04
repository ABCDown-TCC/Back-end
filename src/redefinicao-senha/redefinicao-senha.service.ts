import { Injectable } from '@nestjs/common';
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

  private tokenCache: { [email: string]: string } = {};

  
  gerarNumeroAleatorio() {
    const token = Math.floor(Math.random() * 9000) + 1000;

    return token;
  }

  

  // Este método gera um token de 4 dígitos aleatório
  private gerarToken(email: string): string {
    // Configure a chave secreta e o tempo de expiração como necessário
    const chaveSecreta = 'sua_chave_secreta';
    const expiresIn = '1h'; // Tempo de expiração do token (por exemplo, 1 hora)

    const token = this.jwtService.sign(
      { email },
      { expiresIn, secret: chaveSecreta },
    );

    return token;
  }

  async enviarTokenPorEmail(email: string): Promise<number> {
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
    
    return token;
  }

  async validarToken(email: string, token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verify(token);
      return payload.email === email;
    } catch (error) {
      return false;
    }
  }

  async redefinirSenha(
    email: string,
    token: string,
    novaSenha: string,
  ): Promise<void> {
    if (!this.validarToken(email, token)) {
      throw new Error('Token de redefinição de senha inválido');
    }

    const queryUser = `select * from tbl_professor where email = '${email}'`;
    const result: Professor =
      await this.prismaService.$queryRawUnsafe(queryUser);

    if (result[0]) {
      novaSenha = await bcrypt.hash(novaSenha, 10);
      const queryResetPassword = `Update tbl_professor set senha = '${novaSenha}' where id = ${result[0].id}`;
      const resultRedefine =
        await this.prismaService.$queryRawUnsafe(queryResetPassword);
    } else {
      return console.log('não foi possivel redefinir sua senha');
    }

    delete this.tokenCache[email];
  }
}
