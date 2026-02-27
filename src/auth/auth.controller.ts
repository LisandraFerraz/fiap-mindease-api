import { LoginDto } from './../user/dto/register-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() loginBody: LoginDto) {
    const user = await this.authService.validateUser(
      loginBody.email,
      loginBody.password,
    );
    return this.authService.loginUser(user);
  }

  @Post('/verifica-senha')
  async verificaSenha(@Body() body: { password: string; usuarioId: string }) {
    return await this.authService.verificaSenha(body);
  }
}
