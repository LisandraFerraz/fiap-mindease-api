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

@Controller('tools')
export class KanbanController {
  constructor(private kanbanService: KanbanService) {}

  @Get(':id/kanban')
  async getAllKanbanItems(@Param('id') id: string) {
    return await this.kanbanService.getAllKanbanItems(id);
  }

  @Post(':id/kanban/novo-kanban-item')
  async addKanbanItem(@Body() body: KanbanDataDTO, @Param('id') id: string) {
    return await this.kanbanService.addKanbanItem(id, body);
  }

  @Patch(':id/kanban/atualiza-kanban-item')
  async updateKanbanItem(@Body() body: KanbanDataDTO, @Param('id') id: string) {
    return await this.kanbanService.updateKanbanItem(id, body);
  }

  @Delete(':id/kanban/deleta-kanban-item/:itemId')
  async deleteKanbanItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return await this.kanbanService.deleteKanbanItem(id, itemId);
  }
}
