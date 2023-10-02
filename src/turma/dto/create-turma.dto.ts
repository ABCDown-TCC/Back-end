import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTurmaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  id_professor: number;

  @IsNotEmpty()
  @IsString()
  codigoTurma: string;
}
