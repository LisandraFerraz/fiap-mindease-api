import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PomodoroService } from '../services/pomodoro.service';
import { PlataformService } from '../services/plataform-tools.service';
import { PlataformToolsDTO } from '../dto/plataform.dto';

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

  @Delete(':id/deletar-ferramentas')
  async deletePlataformTools(@Param('id') id: string) {
    return await this.plataformService.deletePlataformTool(id);
  }
  // -- FIM PLATAFORMA -- //
}
