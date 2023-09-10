import { Injectable } from '@nestjs/common';
import { ProfessorService } from 'src/professor/professor.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/userPayload';
import { JwtService } from '@nestjs/jwt';
import { Professor } from 'src/professor/entities/professor.entity';
import { UserToken } from './models/userToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly professorService: ProfessorService,
    private readonly jwtService: JwtService,
  ) {}
  login(user: Professor): UserToken {
    // TRANSFORMA O USER EM JWT
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
    };
    const jwtToken = this.jwtService.sign(payload);

    return {
      acess_token: jwtToken,
    };
  }
  async validateUser(email: string, senha: string) {
    const professor = await this.professorService.findByEmail(email);

    if (professor) {
      const isPasswordValid = await bcrypt.compare(senha, professor.senha);
      if (isPasswordValid) {
        return {
          ...professor,
          senha: undefined,
        };
      }
    }
    // Se chegar aqui, significa que não encontrou um user.
    throw new Error('E-mail ou senha estão incorretos');
  }
}
