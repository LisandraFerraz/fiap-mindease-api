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
import { StickyNoteDTO, StickyNotesGroupDTO } from '../dto/sticky-note.dto';
import { v4 as generateUID } from 'uuid';

@Controller('tools')
export class StickyNoteController {
  constructor(private stickyNoteService: StickyNoteService) {}

  @Get(':id/sticky-notes')
  async getAllStickyNotesGroups(@Param('id') id: string) {
    return await this.stickyNoteService.getAllStickyNotesGroups(id);
  }

  @Get(':id/sticky-notes/:stickyGroupId')
  async getStickyNotesGroup(
    @Param('id') id: string,
    @Param('stickyGroupId') stickyGroupId: string,
  ) {
    return await this.stickyNoteService.getStickyNotesGroup(id, stickyGroupId);
  }

  @Post(':id/sticky-notes/novo-sticky-note-group')
  async createStickyNotesGroup(
    @Body() body: StickyNotesGroupDTO,
    @Param('id') id: string,
  ) {
    await this.stickyNoteService.createStickyNotesGroup(id, body);

    const stickyBody = {
      id: generateUID(),
      color: 'BLUE',
      title: 'Novo post-it',
      description: 'Sem descrição...',
    } as StickyNoteDTO;

    const newGroup = await this.stickyNoteService.addStickyNote(
      id,
      body.id,
      stickyBody,
    );

    return newGroup;
  }

  @Post(':id/sticky-notes/:stickyGroupId/novo-sticky-note')
  async addStickyNote(
    @Body() body: StickyNoteDTO,
    @Param('id') id: string,
    @Param('stickyGroupId') stickyGroupId: string,
  ) {
    return await this.stickyNoteService.addStickyNote(id, stickyGroupId, body);
  }

  @Patch(':id/sticky-notes/:stickyGroupId/atualiza-sticky-note-group')
  async updateStickyNotesGroup(
    @Body() body: StickyNotesGroupDTO,
    @Param('id') id: string,
    @Param('stickyGroupId') stickyGroupId: string,
  ) {
    return await this.stickyNoteService.updateStickyNotesGroup(
      id,
      stickyGroupId,
      body,
    );
  }

  @Patch(':id/sticky-notes/:stickyGroupId/atualiza-sticky-note/:noteId')
  async updateStickyNote(
    @Body() body: StickyNoteDTO,
    @Param('id') id: string,
    @Param('stickyGroupId') stickyGroupId: string,
    @Param('noteId') noteId: string,
  ) {
    return await this.stickyNoteService.updateStickyNote(
      id,
      stickyGroupId,
      noteId,
      body,
    );
  }

  @Delete(':id/sticky-notes/deleta-grupo-sticky-note/:stickyGroupId')
  async deleteStickyNotesGroup(
    @Param('id') id: string,
    @Param('stickyGroupId') stickyGroupId: string,
  ) {
    return await this.stickyNoteService.deleteStickyNotesGroup(
      id,
      stickyGroupId,
    );
  }

  @Delete(':id/sticky-notes/:stickyGroupId/deleta-sticky-note/:noteId')
  async deleteSitckyNote(
    @Param('id') id: string,
    @Param('stickyGroupId') stickyGroupId: string,
    @Param('noteId') noteId: string,
  ) {
    return await this.stickyNoteService.deleteSitckyNote(
      id,
      stickyGroupId,
      noteId,
    );
  }
}
