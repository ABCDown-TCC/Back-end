import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.validateUser(
        email,
        password,
        'professor',
      );
      if (!user) {
        throw new UnauthorizedException('E-mail ou senha estão incorretos');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('E-mail ou senha estão incorretos');
    }
  }
}