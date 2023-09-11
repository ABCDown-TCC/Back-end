import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/authRequest';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @Post('professor')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  loginProfessor(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
  @IsPublic()
  @Post('responsavel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  loginResponsavel(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
