import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  async create(@Body() body: CreateTurmaDto) {
    return {
      data: await this.turmaService.create(body),
      turma: body,
    };
  }

  @Get()
  async findAll() {
    return {
      turmas: await this.turmaService.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      turma: await this.turmaService.findOne(+id),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTurmaDto: UpdateTurmaDto,
  ) {
    return { data: await this.turmaService.update(+id, updateTurmaDto) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      mensagem: await this.turmaService.remove(+id),
    };
  }
}
