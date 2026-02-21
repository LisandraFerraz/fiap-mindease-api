import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChecklistService } from '../services/checklist.service';
import { ChecklistDataDTO, ChecklistDTO } from '../dto/checklist.dto';

@Controller('tools')
export class ChecklistController {
  constructor(private checklistService: ChecklistService) {}

  @Get(':id/checklist')
  async getAllChecklistItems(@Param('id') id: string) {
    return await this.checklistService.getAllChecklistItems(id);
  }

  @Post(':id/checklist/nova-checklist')
  async addChecklistItem(@Body() body: ChecklistDTO, @Param('id') id: string) {
    return await this.checklistService.addChecklistItem(id, body);
  }

  @Patch(':id/checklist/atualiza-checklist/:checklistId')
  async updateChecklist(
    @Body() body: ChecklistDTO,
    @Param('id') id: string,
    @Param('checklistId') checklistId: string,
  ) {
    return await this.checklistService.updateChecklist(id, checklistId, body);
  }

  @Patch(':id/checklist/atualiza-checklist/:checklistId/item/:itemId')
  async updateChecklistItem(
    @Param('id') id: string,
    @Param('checklistId') checklistId: string,
    @Param('itemId') itemId: string,
    @Body() body: ChecklistDataDTO,
  ) {
    return await this.checklistService.updateChecklistItem(
      id,
      checklistId,
      itemId,
      body,
    );
  }

  @Delete(':id/checklist/deleta-checklist/:clId')
  async deleteChecklist(@Param('id') id: string, @Param('clId') clId: string) {
    return await this.checklistService.deleteChecklist(id, clId);
  }

  @Delete(':id/checklist/deleta-checklist/:clId/item/:itemId')
  async deleteChecklistItem(
    @Param('id') id: string,
    @Param('clId') clId: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.checklistService.deleteChecklistItem(id, clId, itemId);
  }
}
