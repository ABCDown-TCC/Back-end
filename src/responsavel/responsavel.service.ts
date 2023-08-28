import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface ResponsavelParams {
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
export class ResponsavelService {
  constructor(private prisma: PrismaService) {}

  async validacaoCpf(body: ResponsavelParams) {
    const query = `select id from tbl_responsavel where cpf = '${body.cpf}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }
  async validacaoEmail(body: ResponsavelParams) {
    const query = `select id from tbl_responsavel where email = '${body.email}';`;

    const result: [] = await this.prisma.$queryRawUnsafe(query);

    return result;
  }

  async validacaoID(id: number) {
    const sqlValidacaoId = `select * from tbl_responsavel where id =${id}`;
    const resultValidacaoId: [] =
      await this.prisma.$queryRawUnsafe(sqlValidacaoId);

    if (resultValidacaoId.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async create(createResponsavel: ResponsavelParams) {
    const validacaoCpf = await this.validacaoCpf(createResponsavel);

    if (validacaoCpf.length === 0) {
      const validacaoEmail = await this.validacaoEmail(createResponsavel);
      if (validacaoEmail.length === 0) {
        const responsavel = `call procInsertResponsaveis(
          '${createResponsavel.nome}',
          '${createResponsavel.cpf}',
          '${createResponsavel.data_nascimento}', 
          '${createResponsavel.foto}',
          '${createResponsavel.email}',
          '${createResponsavel.senha}',
          '${createResponsavel.id_genero}',
          '${createResponsavel.numero}',
          '${createResponsavel.cep}',
          '${createResponsavel.numeroTelefone}'
          )`;

        const id = `select * from tbl_responsavel where id = LastIdResponsavel();`;

        const endereco = `select * from tbl_endereco_professor where id_professor = LastIdProfessor();`;

        const response = await this.prisma.$queryRawUnsafe(responsavel);
        const idResponsavel = await this.prisma.$queryRawUnsafe(id);
        const enderecoResponsavel = await this.prisma.$queryRawUnsafe(endereco);

        return {
          responsavel: idResponsavel,
          endereco: enderecoResponsavel,
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
    tbl_responsavel.id,
    tbl_responsavel.nome,
    tbl_responsavel.cpf,
    tbl_responsavel.data_nascimento,
    tbl_responsavel.foto,
    tbl_responsavel.email,
    tbl_responsavel.senha,
    tbl_endereco_responsavel.numero,
    tbl_endereco_responsavel.cep,
    tbl_genero.nome AS nome_genero,
    tbl_telefone_responsavel.numero as numeroResponsavel
    FROM
        tbl_responsavel
    INNER JOIN
        tbl_endereco_responsavel ON tbl_responsavel.id = tbl_endereco_responsavel.id_responsavel
    INNER JOIN
    tbl_genero ON tbl_responsavel.id_genero = tbl_genero.id
    INNER join
    tbl_telefone_responsavel ON tbl_responsavel.id = tbl_telefone_responsavel.id_responsavel 
    order by id asc;`;
    const result = await this.prisma.$queryRawUnsafe(query);
    return result;
  }

  async findOne(id: number) {
    const query = `
    SELECT
    tbl_responsavel.id,
    tbl_responsavel.nome,
    tbl_responsavel.cpf,
    tbl_responsavel.data_nascimento,
    tbl_responsavel.foto,
    tbl_responsavel.email,
    tbl_responsavel.senha,
    tbl_endereco_responsavel.numero,
    tbl_endereco_responsavel.cep,
    tbl_genero.nome AS nome_genero,
    tbl_telefone_responsavel.numero as numeroResponsavel
    FROM
        tbl_responsavel
    INNER JOIN
        tbl_endereco_responsavel ON tbl_responsavel.id = tbl_endereco_responsavel.id_responsavel
    INNER JOIN
    tbl_genero ON tbl_responsavel.id_genero = tbl_genero.id
    INNER join
    tbl_telefone_responsavel ON tbl_responsavel.id = tbl_telefone_responsavel.id_responsavel where tbl_responsavel.id = ${id}`;
    const result = await this.prisma.$queryRawUnsafe(query);

    const response: [] = await this.prisma.$queryRawUnsafe(query);
    if (response.length !== 0) {
      return result;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Responsável não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: number, body: UpdateResponsavelDto) {
    const validacaoId = await this.validacaoID(id);
    if (validacaoId == false) {
      return false;
    }
    const query = `call procUpdateResponsavel(
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

    return { mesnsagem: 'Responsavel editado com sucesso!', result };
  }

  async remove(id: number) {
    const validacaoId = await this.validacaoID(id);
    if (validacaoId == false) {
      return 'Responsável não encontrado';
    }
    const query = `call procDeleteResponsavel(${id})`;
    const result = await this.prisma.$queryRawUnsafe(query);

    return 'Registro deletado com sucesso';
  }
}
