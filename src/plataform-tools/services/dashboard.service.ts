import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { DefineTodosExpireSoon } from '../utils/format-kanban';
import { PlataformToolsDTO } from '../dto/plataform.dto';
import { StickyNoteDTO } from '../dto/sticky-note.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getDashboardData(id: string) {
    const platData = (await this.plataformModel.findById(
      id,
    )) as PlataformToolsDTO;

    if (!platData)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    const kanbanItems = platData.kanbanData;
    const stickyNotes = platData.stickyNotes;

    const allStickyNotes = stickyNotes.flatMap((sg) => sg.data);

    let kanbanToExpire = DefineTodosExpireSoon(kanbanItems).slice();
    let favoriteStickyNotes = allStickyNotes.filter(
      (sn: StickyNoteDTO) => sn.isFavorite,
    );

    kanbanToExpire =
      kanbanToExpire.length > 4 ? kanbanToExpire.slice(0, 4) : kanbanToExpire;

    return;
  }
}
