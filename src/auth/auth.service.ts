import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ProfessorService } from 'src/professor/professor.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ResponsavelService } from 'src/responsavel/responsavel.service';

interface SignInParams {
  email: string;
  senha: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly professorServie: ProfessorService,
    private readonly responsavelServie: ResponsavelService,
  ) {}

  async signInProfessor({ email, senha }: SignInParams) {
    const findUser = await this.professorServie.findByEmail(email);

    if (!findUser) {
      throw new NotFoundException({ message: 'Usuário não encontrado' });
    }

    const hashedPassword = findUser.senha;
    const isValidPassword = await bcrypt.compare(senha, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    return this.generateJWT(findUser.name, findUser.id);
  }

  private async generateJWT(name: string, id?: number) {
    const token = jwt.sign(
      {
        name: name,
        id: id,
      },
      process.env.DATABASE_URL,
      {
        expiresIn: 10000,
      },
    );
    return { statusCode: 201, message: token };
  }
  async signInResponsavel({ email, senha }: SignInParams) {
    const findUser = await this.responsavelServie.findByEmail(email);

    if (!findUser) {
      throw new NotFoundException({ message: 'Usuário não encontrado' });
    }

    const hashedPassword = findUser.senha;
    const isValidPassword = await bcrypt.compare(senha, hashedPassword);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    return this.generateJWT(findUser.name, findUser.id);
  }
}
