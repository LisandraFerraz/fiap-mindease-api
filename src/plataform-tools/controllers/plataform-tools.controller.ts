import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlataformService } from '../services/plataform-tools.service';
import { PlataformToolsDTO } from '../dto/plataform.dto';

@Controller('tools')
export class PlataformToolsController {
  constructor(private plataformService: PlataformService) {}

  @Get(':id')
  async getPlataformToolsByUserID(@Param('id') userID: string) {
    this.plataformService.getPlataformToolsByUserID(userID);
  }

  @Post('criar-ferramentas/:userId')
  async createPlataformTools(@Param('userId') userId: string) {
    return await this.plataformService.createPlataformTool(userId);
  }

  @Delete(':id/deletar-ferramentas')
  async deletePlataformTools(@Param('id') id: string) {
    return await this.plataformService.deletePlataformTool(id);
  }
}
