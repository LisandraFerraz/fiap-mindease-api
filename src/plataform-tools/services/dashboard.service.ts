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
    const parsedStickyNotes = platData.stickyNotes.flatMap((sn) => sn.data);
    const checklistItems = platData.checklist.flatMap((cl) => cl.data);

    const stickyNotes = parsedStickyNotes.map((sn) => {
      return {
        ...sn,
        description:
          sn.description.length >= 100
            ? sn.description.slice(0, 100) + '...'
            : sn.description,
      };
    });

    const buildGraphStats = (
      items: any[],
      labelKey: string,
      statusKey: string,
      statusValue: any,
    ) => {
      const notDone = items.filter(
        (item) => item[statusKey] !== statusValue,
      ).length;
      const done = items.filter(
        (item) => item[statusKey] === statusValue,
      ).length;
      return { notDone, done, label: labelKey };
    };

    const kanbanStats = buildGraphStats(
      kanbanItems,
      'Kanban',
      'status',
      'CONCLUIDO',
    );
    const checklistStats = buildGraphStats(
      checklistItems,
      'Checklist',
      'completed',
      true,
    );

    const graphData = [
      {
        left: kanbanStats.notDone,
        leftBarLabel: `${kanbanStats.notDone}`,
        rightBarLabel: `${kanbanStats.done}`,
        right: kanbanStats.done,
        midAxisLabel: kanbanStats.label,
      },
      {
        left: checklistStats.notDone,
        leftBarLabel: `${checklistStats.notDone}`,
        rightBarLabel: `${checklistStats.done}`,
        right: checklistStats.done,
        midAxisLabel: checklistStats.label,
      },
    ];

    let kanbanToExpire = DefineTodosExpireSoon(kanbanItems);
    kanbanToExpire =
      kanbanToExpire.length > 4 ? kanbanToExpire.slice(0, 4) : kanbanToExpire;

    let favoriteStickyNotes = stickyNotes.filter(
      (sn: StickyNoteDTO) => sn.isFavorite,
    );

    return {
      graphData,
      kanbanToExpire,
      favoriteStickyNotes,
    };
  }
}
