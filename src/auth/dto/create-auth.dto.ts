import { IsNotEmpty, IsString } from 'class-validator';

export class SignAuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}
