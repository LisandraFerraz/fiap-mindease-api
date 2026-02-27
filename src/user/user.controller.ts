import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { User } from './schema/user/user.schema';
import { JWTAuthGuard } from './../auth/jwt-auth.guard';
import { PlataformService } from 'src/plataform-tools/services/plataform-tools.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private plataformService: PlataformService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() user: RegisterUserDTO | any,
  ): Promise<{ message: string }> {
    const userResponse: any = await this.userService.registerUser(user);

    await this.plataformService.createPlataformTool(userResponse.userId);

    return { message: 'Usuário registrado com sucesso.' };
  }

  @Get()
  async listAllUsers(): Promise<User[]> {
    return await this.userService.listAllUsers();
  }

  @UseGuards(JWTAuthGuard)
  @Get('one/:id')
  async listAccount(@Param('id') id: string) {
    return await this.userService.findUser(id);
  }

  @Patch(':id')
  async updateUserAccount(
    @Param('id') id: string,
    @Body() updatedUser: Partial<User>,
  ) {
    return await this.userService.updateUserAccount(id, updatedUser);
  }
}
