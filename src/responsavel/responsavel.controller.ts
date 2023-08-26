import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';

@Controller('responsavel')
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}

  @Post()
  async create(@Body() body: CreateResponsavelDto) {
    return {
      dados: await this.responsavelService.create(body),
    };
  }

  @Get()
  async findAll() {
    return { responsaveis: await this.responsavelService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      responsavel: await this.responsavelService.findOne(+id),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateResponsavelDto) {
    const responseValidacao = await this.responsavelService.update(+id, body);
    if (responseValidacao == false) {
      return {
        mensagem: 'O responsável não foi encontrado',
      };
    }
    return {
      mensagem: await this.responsavelService.update(+id, body),
      id: id,
      dadosInseridos: [
        {
          nome: body.nome,
          cpf: body.cpf,
          data_nascimento: body.data_nascimento,
          foto: body.foto,
          email: body.email,
          senha: body.senha,
          id_genero: body.id_genero,
        },
      ],
      telefone: { numero: body.numeroTelefone },
      endereco: { numero: body.numero, cep: body.cep },
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { message: await this.responsavelService.remove(+id) };
  }
}
