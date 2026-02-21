import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { KanbanService } from '../services/kanban.service';
import { KanbanDataDTO } from '../dto/kanban.dto';

@Controller('kanban')
export class KanbanController {
  constructor(private kanbanService: KanbanService) {}

  @Get(':id')
  async getAllKanbanItems(@Param('id') id: string) {
    return await this.kanbanService.getAllKanbanItems(id);
  }

  @Post(':id/novo-kanban-item')
  async addKanbanItem(@Body() body: KanbanDataDTO, @Param('id') id: string) {
    return await this.kanbanService.addKanbanItem(id, body);
  }

  @Patch(':id/atualiza-kanban-item')
  async updateKanbanItem(@Body() body: KanbanDataDTO, @Param('id') id: string) {
    return await this.kanbanService.updateKanbanItem(id, body);
  }

  @Delete(':id/deleta-kanban-item/:itemId')
  async deleteKanbanItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.kanbanService.deleteKanbanItem(id, itemId);
  }
}
