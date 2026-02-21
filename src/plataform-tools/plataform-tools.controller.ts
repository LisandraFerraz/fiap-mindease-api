import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PomodoroService } from './services/pomodoro.service';
import { PlataformService } from './services/plataform-tools.service';
import { PlataformToolsDTO } from './dto/plataform.dto';
import { PomodoroDataDTO } from './dto/pomodoro.dto';

@Controller('plataform-tools')
export class PlataformToolsController {
  constructor(
    private plataformService: PlataformService,
    private pomodoroService: PomodoroService,
  ) {}

  // -- INICIO PLATAFORMA -- //
  @Post('criar-ferramentas')
  async createPlataformTools(@Body() body: PlataformToolsDTO) {
    return await this.plataformService.createPlataformTool(body);
  }

  @Delete('deletar-ferramentas/:id')
  async deletePlataformTools(@Param('id') id: string) {
    return await this.plataformService.deletePlataformTool(id);
  }
  // -- FIM PLATAFORMA -- //

  // -- INICIO POMODORO --//
  @Get()
  async getAllPomodoroTodos(@Param('id') id: string) {
    return await this.pomodoroService.getAllPomodoroTodos(id);
  }

  @Post(':id/novo-pomodoro-todo')
  async addPomodoroTodo(
    @Body() body: PomodoroDataDTO,
    @Param('id') id: string,
  ) {
    return await this.pomodoroService.addPomodoroTodo(id, body);
  }

  @Patch(':id/atualiza-pomodoro-todo')
  async updatePomodoroTodo(
    @Body() body: PomodoroDataDTO,
    @Param('id') id: string,
  ) {
    return await this.pomodoroService.updatePomodoroTodo(id, body);
  }

  @Delete(':id/deleta-pomodoro-todo/:todoId')
  async deletePomodorTodo(
    @Param('id') id: string,
    @Param('todoId') todoId: string,
  ) {
    return await this.pomodoroService.deletePomodorTodo(id, todoId);
  }
}
