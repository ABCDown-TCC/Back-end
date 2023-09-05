import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTurmaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNotEmpty()
  @IsString()
  codigoTurma: string;

  @IsNumber()
  @IsNotEmpty()
  id_professor: number;
}
