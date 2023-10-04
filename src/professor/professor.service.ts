import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Decodificadora } from 'src/descoficadorToken';

export interface ProfessorParams {
  nome: string;
  cpf: string;
  email: string;
  data_nascimento: string;
  senha: string;
  foto: string;
  id_genero: number;
  numero: string;
  cep: string;
  numeroTelefone: string;
}

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}

  async validacaoCpf(body: ProfessorParams) {
    const query = `select id from tbl_professor where cpf = '${body.cpf}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }

  async validacaoEmail(body: ProfessorParams) {
    const query = `select id from tbl_professor where email = '${body.email}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }

  async validacaoID(id: number) {
    const sqlValidacaoId = `select * from tbl_professor where id =${id}`;
    const resultValidacaoId: [] =
      await this.prisma.$queryRawUnsafe(sqlValidacaoId);

    if (resultValidacaoId.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  
  async create(body: CreateProfessorDto) {
    const validacaoCpf = await this.validacaoCpf(body);

    if (validacaoCpf.length === 0) {
      const validacaoEmail = await this.validacaoEmail(body);
      if (validacaoEmail.length === 0) {
        const newProfessor = `call procInsertProfessor(
          '${body.nome}',
          '${body.cpf}',
          '${body.data_nascimento}', 
          '${body.foto}',
          '${body.email}',
          '${await bcrypt.hash(body.senha, 10)}',
          '${body.id_genero}',
          '${body.numero}',
          '${body.cep}',
          '${body.numeroTelefone}'
          )`;

        const id = `select * from tbl_professor where id = LastIdProfessor();`;

        const endereco = `select * from tbl_endereco_professor where id_professor = LastIdProfessor();`;

        const telefone = `select * from tbl_telefone_professor where id_professor = LastIdProfessor();`;
        const response = await this.prisma.$queryRawUnsafe(newProfessor);
        const idProfessor = await this.prisma.$queryRawUnsafe(id);
        const enderecoProfessor = await this.prisma.$queryRawUnsafe(endereco);
        const telefoneProfessor = await this.prisma.$queryRawUnsafe(telefone);

        return {
          professor: idProfessor,
          endereco: enderecoProfessor,
          telefone: telefoneProfessor,
        };
      } else {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'E-mail já cadastrado',
          },
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Cpf já cadastrado',
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async findAll() {
    const query = `
    SELECT
    tbl_professor.id,
    tbl_professor.nome,
    tbl_professor.cpf,
    DATE_FORMAT(tbl_professor.data_nascimento, '%d/%m/%Y') AS data_nascimento,
    tbl_professor.foto,
    tbl_professor.email,
    tbl_professor.senha,
    tbl_endereco_professor.numero,
    tbl_endereco_professor.cep,
    tbl_genero.nome AS nome_genero,
    tbl_telefone_professor.numero AS numeroProfessor
    FROM
        tbl_professor
    INNER JOIN
        tbl_endereco_professor ON tbl_professor.id = tbl_endereco_professor.id_professor
    INNER JOIN
        tbl_genero ON tbl_professor.id_genero = tbl_genero.id
    INNER JOIN
        tbl_telefone_professor ON tbl_professor.id = tbl_telefone_professor.id_professor;
`;
    const result = await this.prisma.$queryRawUnsafe(query);
    return result;
  }

  async findOne(token: string) {
    const decodificador = new Decodificadora();

    const idUser = await decodificador.decodificadorToken(token);

    if (decodificador) {
      const query = `SELECT
    tbl_professor.id,
    tbl_professor.nome,
    tbl_professor.cpf,
    DATE_FORMAT(tbl_professor.data_nascimento, '%d/%m/%Y') AS data_nascimento,
    tbl_professor.foto,
    tbl_professor.email,
    tbl_professor.senha,
    tbl_endereco_professor.numero,
    tbl_endereco_professor.cep,
    tbl_genero.nome AS nome_genero,
    tbl_telefone_professor.numero AS numeroProfessor
    FROM
        tbl_professor
    INNER JOIN
        tbl_endereco_professor ON tbl_professor.id = tbl_endereco_professor.id_professor
    INNER JOIN
        tbl_genero ON tbl_professor.id_genero = tbl_genero.id
    INNER JOIN
        tbl_telefone_professor ON tbl_professor.id = tbl_telefone_professor.id_professor
     where tbl_professor.id = ${idUser}`;

      const result = await this.prisma.$queryRawUnsafe(query);

      const response: [] = await this.prisma.$queryRawUnsafe(query);
      if (response.length !== 0) {
        return result;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Professor não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async findEmail(email: string){
    const query = `select * from tbl_professor where email = ${email}`
    const resultQuery = await this.prisma.$queryRawUnsafe(query);
    let result = {}

    if(resultQuery){
      result = {
        message: 'Professor encontrado com sucesso',
        status: HttpStatus.OK
        }
      } else{
        result = {
          message: 'Professor não encontrado',
          status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }      
  }
  
  async findByEmail(email: string) {
    const sql = `SELECT * FROM tbl_professor WHERE email = ?`;
    const result = await this.prisma.$queryRawUnsafe(sql, email);
    // Aqui, você precisa converter o resultado para o tipo desejado
    // dependendo do que a consulta realmente retorna.

    return result[0];
  }

  async update(id: number, body: UpdateProfessorDto) {
    const validacaoId = await this.validacaoID(id);
    if (validacaoId == false) {
      return false;
    }
    const query = `call procUpdateProfessor(
     ${id},
     '${body.nome}',
     '${body.cpf}',
     '${body.data_nascimento}', 
     '${body.foto}',
     '${body.email}',
     '${body.senha}',
     ${body.id_genero},
     '${body.numero}',
     '${body.cep}',
     '${body.numeroTelefone}')`;

    const result = await this.prisma.$queryRawUnsafe(query);

    return { mesnsagem: 'Professor editado com sucesso!', result };
  }

  async remove(id: number) {
    const validacaoId = await this.validacaoID(id);
    if (validacaoId == false) {
      return 'Professor não encontrado';
    }
    const query = `call procDeleteProfessor(${id})`;
    const result = await this.prisma.$queryRawUnsafe(query);

    return 'Registro deletado com sucesso';
  }
}
