import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface AlunoParams {
  nome: string;
  cpf: string;
  data_nascimento: string;
  foto: string;
  usuario: string;
  senha: string;
  id_genero: number;
  id_responsavel: number;
  id_turma: number;
}

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  async validacaoCpf(body: AlunoParams) {
    const query = `select id from tbl_aluno where cpf = '${body.cpf}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }
  async validacaoCodigoTurma(body: AlunoParams) {
    const query = `select id from tbl_aluno where cpf = '${body.cpf}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }
  async validacaoUsuario(body: AlunoParams) {
    const query = `select id from tbl_aluno where usuario = '${body.usuario}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }

  async validacaoID(id: number) {
    const sqlValidacaoId = `select * from tbl_aluno where id =${id}`;
    const resultValidacaoId: [] =
      await this.prisma.$queryRawUnsafe(sqlValidacaoId);

    if (resultValidacaoId.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
  async validacaoInsercaoTurma(id: number) {
    const sqlValidacaoId = `select * from tbl_turma_aluno where id_aluno =${id}`;
    const resultValidacaoId: [] =
      await this.prisma.$queryRawUnsafe(sqlValidacaoId);

    if (resultValidacaoId.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async create(newAluno: CreateAlunoDto) {
    const validacaoCpf = await this.validacaoCpf(newAluno);
    if (validacaoCpf.length === 0) {
      const validacaoUsuario = await this.validacaoUsuario(newAluno);
      if (validacaoUsuario.length === 0) {
        const aluno = `call procInsertAluno(
          '${newAluno.nome}',
          '${newAluno.cpf}',
          '${newAluno.data_nascimento}', 
          '${newAluno.foto}',
          '${newAluno.usuario}',
          '${newAluno.senha}',
          '${newAluno.id_responsavel}',
          '${newAluno.id_turma}',
          '${newAluno.id_genero}'
          )`;

        const id = `select * from tbl_aluno where id = LastIdAluno();`;
        const response = await this.prisma.$queryRawUnsafe(aluno);
        const idAluno = await this.prisma.$queryRawUnsafe(id);
        return {
          aluno: idAluno,
        };
      } else {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Usuário já cadastrado',
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
    tbl_aluno.id,
    tbl_aluno.nome,
    tbl_aluno.cpf,
    DATE_FORMAT(tbl_aluno.data_nascimento, '%d/%m/%Y') as data_nascimento,
    tbl_aluno.foto,
    tbl_aluno.usuario,
    tbl_aluno.senha,
    tbl_responsavel.nome as nome_responsavel,
    tbl_responsavel.email as email_responsavel,
    tbl_genero.nome AS nome_genero,
    tbl_telefone_responsavel.numero as numeroResponsavel,
    tbl_turma.nome as nomeTurma,
    tbl_turma.descricao 
    FROM
        tbl_aluno
    INNER JOIN
        tbl_responsavel ON tbl_aluno.id_responsavel = tbl_responsavel.id
    INNER JOIN
        tbl_genero ON tbl_responsavel.id_genero = tbl_genero.id
    INNER JOIN
        tbl_telefone_responsavel ON tbl_responsavel.id = tbl_telefone_responsavel.id_responsavel
    INNER JOIN 
        tbl_turma ON tbl_aluno.id_turma = tbl_turma.id;
`;
    const response = await this.prisma.$queryRawUnsafe(query);
    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} aluno`;
  }

  update(id: number, updateAlunoDto: UpdateAlunoDto) {
    return `This action updates a #${id} aluno`;
  }

  remove(id: number) {
    return `This action removes a #${id} aluno`;
  }
}
