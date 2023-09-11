import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProfessorService } from 'src/professor/professor.service';
import { ResponsavelService } from 'src/responsavel/responsavel.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/userPayload';
import { JwtService } from '@nestjs/jwt';
import { Professor } from 'src/professor/entities/professor.entity';
import { Responsavel } from 'src/responsavel/entities/responsavel.entity';
import { UserToken } from './models/userToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly professorService: ProfessorService,
    private readonly responsavelService: ResponsavelService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    userType: 'professor' | 'responsavel',
  ): Promise<Professor | Responsavel> {
    let user: Professor | Responsavel;

    if (userType === 'professor') {
      user = await this.professorService.findByEmail(email);
    } else if (userType === 'responsavel') {
      user = await this.responsavelService.findByEmail(email);
    }

    if (user) {
      console.log(user);

      const isPasswordValid = await bcrypt.compare(password, user.senha);

      if (isPasswordValid) {
        return {
          ...user,
          senha: undefined,
        };
      }
    }

    throw new UnauthorizedException('E-mail ou senha estão incorretos');
  }

  login(user: Professor | Responsavel): UserToken {
    const payload: UserPayload = {
      id: user.id,
      email: user.email,
    };
    const jwtToken = this.jwtService.sign(payload);

    return {
      acess_token: jwtToken,
    };
  }
}
