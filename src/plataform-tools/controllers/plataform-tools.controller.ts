import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PlataformService } from '../services/plataform-tools.service';
import { PlataformToolsDTO } from '../dto/plataform.dto';

@Controller('tools')
export class PlataformToolsController {
  constructor(private plataformService: PlataformService) {}

  @Post('criar-ferramentas')
  async createPlataformTools(@Body() body: PlataformToolsDTO) {
    return await this.plataformService.createPlataformTool(body);
  }

  @Delete(':id/deletar-ferramentas')
  async deletePlataformTools(@Param('id') id: string) {
    return await this.plataformService.deletePlataformTool(id);
  }
}
