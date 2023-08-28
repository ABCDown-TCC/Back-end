import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  async create(@Body() body: CreateProfessorDto) {
    return {
      dados: await this.professorService.create(body),
    };
  }

  @Get()
  findAll() {
    return { professore: this.professorService.findAll() };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { professor: this.professorService.findOne(+id) };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProfessorDto) {
    const responseValidacao = await this.professorService.update(+id, body);
    if (responseValidacao == false) {
      return {
        mensagem: 'O professor não foi encontrado',
      };
    }
    return {
      mensagem: await this.professorService.update(+id, body),
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
    return { message: await this.professorService.remove(+id) };
  }
}
