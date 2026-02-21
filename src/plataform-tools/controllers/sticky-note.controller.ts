import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StickyNoteService } from '../services/sticky-note.service';
import { StickyNoteDTO } from '../dto/sticky-note.dto';

@Controller('sticky-note')
export class StickyNoteController {
  constructor(private stickyNoteService: StickyNoteService) {}

  @Get(':id')
  async getAllStickyNotes(@Param('id') id: string) {
    return await this.stickyNoteService.getAllStickyNotes(id);
  }

  @Post(':id/novo-sticky-note')
  async addStickyNote(@Body() body: StickyNoteDTO, @Param('id') id: string) {
    return await this.stickyNoteService.addStickyNote(id, body);
  }

  @Patch(':id/atualiza-sticky-note')
  async updateStickyNote(@Body() body: StickyNoteDTO, @Param('id') id: string) {
    return await this.stickyNoteService.updateStickyNote(id, body);
  }

  @Delete(':id/deleta-sticky-note/:noteId')
  async deleteStickyNote(
    @Param('id') id: string,
    @Param('noteId') noteId: string,
  ) {
    return await this.stickyNoteService.deleteStickyNote(id, noteId);
  }
}
