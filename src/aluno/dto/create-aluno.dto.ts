import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlunoDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  usuario: string;

  @IsNotEmpty()
  @IsDateString()
  data_nascimento: string;

  @IsNotEmpty()
  @IsString()
  senha: string;

  @IsNotEmpty()
  @IsString()
  foto: string;

  @IsNotEmpty()
  @IsNumber()
  id_genero: number;

  @IsNotEmpty()
  @IsNumber()
  id_responsavel: number;

  @IsNotEmpty()
  @IsNumber()
  id_turma: number;
}
