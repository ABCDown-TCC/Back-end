import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTurmaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @IsNotEmpty()
  id_professor: number;
}
