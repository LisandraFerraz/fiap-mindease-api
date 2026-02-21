import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { User } from './schema/user/user.schema';
import { JWTAuthGuard } from './../auth/jwt-auth.guard';
import { PlataformService } from 'src/plataform-tools/services/plataform-tools.service';
import { PlataformToolsDTO } from 'src/plataform-tools/dto/plataform.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private plataformService: PlataformService,
  ) {}

  @Post('register')
  async registerUser(
    @Body() user: RegisterUserDTO | any,
  ): Promise<PlataformToolsDTO> {
    const userResponse: any = await this.userService.registerUser(user);

    const plataformTools = await this.plataformService.createPlataformTool(
      userResponse._id.toString(),
    );

    return plataformTools;
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

  @Put(':id')
  async updateUserAccount(
    @Param('id') id: string,
    @Body() updatedUser: User,
  ): Promise<User> {
    return await this.userService.updateUserAccount(id, updatedUser);
  }
}
