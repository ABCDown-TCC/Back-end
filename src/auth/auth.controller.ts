import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignAuthDto } from './dto/create-auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/professor')
  loginUserProfessor(@Body() body: SignAuthDto) {
    return this.authService.signInProfessor(body);
  }
  @Post('login/responsavel')
  loginUserResponsavel(@Body() body: SignAuthDto) {
    return this.authService.signInResponsavel(body);
  }
}
