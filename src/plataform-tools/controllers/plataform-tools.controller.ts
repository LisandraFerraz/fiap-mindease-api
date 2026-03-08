import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlataformService } from '../services/plataform-tools.service';
import { DashboardService } from '../services/dashboard.service';

@Controller('tools')
export class PlataformToolsController {
  constructor(
    private plataformService: PlataformService,
    private dashboardService: DashboardService,
  ) {}

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

  // Dashboard
  @Get(':id/dashboard')
  async getDashboardData(@Param('id') platId: string) {
    return await this.dashboardService.getDashboardData(platId);
  }
}
