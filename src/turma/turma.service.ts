import { Injectable } from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TurmaService {
  constructor(private prisma: PrismaService) {}

  async validacaoID(tabela: string, id: number) {
    const sqlValidacaoId = `select * from ${tabela} where id =${id}`;
    const resultValidacaoId: [] =
      await this.prisma.$queryRawUnsafe(sqlValidacaoId);

    if (resultValidacaoId.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async create(body: CreateTurmaDto) {
    const validacaoId = await this.validacaoID(
      'tbl_professor',
      body.id_professor,
    );
    if (validacaoId == false) {
      return 'Id do professor não foi econtrado';
    }

    const query = `call procInsertTurma(
      '${body.nome}',
      '${body.descricao}',
      ${body.id_professor}
    )`;
    const response = await this.prisma.$queryRawUnsafe(query);
    return 'Turma criada com sucesso';
  }

  async findAll() {
    const query = `select 
    tbl_turma.id,
    tbl_turma.nome,
    tbl_turma.descricao,
    tbl_turma.id_professor,
    tbl_professor.nome as nomeProfessor
    
    from tbl_turma
    
    Inner Join tbl_professor ON tbl_professor.id = tbl_turma.id_professor;`;
    const responseValidation: [] = await this.prisma.$queryRawUnsafe(query);
    if (responseValidation.length !== 0) {
      const result = await this.prisma.$queryRawUnsafe(query);
      return result;
    } else {
      return 'Nenhum registro foi encontrado no servidor.';
    }
  }

  async findOne(id: number) {
    const validacaoIdTurma = await this.validacaoID('tbl_turma', id);
    if (validacaoIdTurma == false) {
      return `Não foi encontrado nenhum registro de turma com este ID: ${id} `;
    }
    const query = `select 
    tbl_turma.id,
    tbl_turma.nome,
    tbl_turma.descricao,
    tbl_turma.id_professor,
    tbl_professor.nome as nomeProfessor
    
    from tbl_turma
    
    Inner Join tbl_professor ON tbl_professor.id = tbl_turma.id_professor 
    where tbl_turma.id = ${id};`;
    const idCadastro = `@A2KJBAWOB24920KNB39U32B${id}Y34##D93904HJHBD38`;
    return {
      idCadastro,
      response: await this.prisma.$queryRawUnsafe(query),
    };
  }

  async update(id: number, body: UpdateTurmaDto) {
    const validacaoIdTurma = await this.validacaoID('tbl_turma', id);
    if (validacaoIdTurma == false) {
      return `Não foi encontrado nenhum registro de turma com este ID: ${id} `;
    }
    const query = `call procUpdateTurma(
      ${id},
      '${body.nome}',
      '${body.descricao}',
      ${body.id_professor}
      );`;
    const response = await this.prisma.$queryRawUnsafe(query);
    return 'Registro de turma atualizado com suscesso!';
  }

  async remove(id: number) {
    const validacaoIdTurma = await this.validacaoID('tbl_turma', id);
    if (validacaoIdTurma == false) {
      return `Não foi encontrado nenhum registro de turma com este ID: ${id} `;
    }
    const query = `call procprocDeleteTurma(${id});`;
    return 'Registro de turma deletado com sucesso!';
  }
}
