import { KanbanDataDTO } from './../dto/kanban.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { NotificationsDTO } from '../dto/notifications.dto';
import { GetDaysCount } from '../utils/get-remaining-days';
import { ChecklistDataDTO } from '../dto/checklist.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getNotifications(platId: string) {
    const platData = await this.plataformModel.findById(platId);

    if (!platData) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${platId}`,
      );
    }

    // lista de itens kanban
    const kanbanNotifi = platData.kanbanData
      .map((kb: KanbanDataDTO) => {
        let notification;
        const exceptionDue = ['CONCLUIDO', 'BACKLOG'];

        if (exceptionDue.includes(kb.status)) return;

        const remainingD = GetDaysCount(kb.dueDate);
        const isRead = platData.readNotificationsOfItems.includes(kb!.id);

        if (remainingD < 3 && !isRead) {
          notification = {
            id: kb.id,
            read: false,
            route: 'kanban',
            title: `[Kanban] Sua tarefa precisa de atenção!`,
            description: `O prazo definido para "${kb.title}" termina em ${remainingD} dias.`,
            alertType: 'WARN',
          };
        }
        if (remainingD === 1 && !isRead) {
          notification = {
            id: kb.id,
            read: false,
            route: 'kanban',
            title: `[Kanban] O prazo expira hoje!`,
            description: `O prazo de "${kb.title}" termina hoje!.`,
            alertType: 'SEVERE',
          };
        }

        return notification;
      })
      .filter(Boolean) as NotificationsDTO[];

    const checklistIncomplete = platData.checklist
      .flatMap((clGroup) => {
        const checkItem = clGroup.data.map((cl: ChecklistDataDTO) => {
          if (!cl.completed) {
            return {
              ...cl,
              checklistName: clGroup.name,
            };
          }
        });

        return checkItem;
      })
      .filter(Boolean);

    // lista de itens checklist
    const checklistNotif = checklistIncomplete
      .map((cl) => {
        if (cl) {
          let notification;

          const daysCount = GetDaysCount(cl?.lastUpdated);
          const isRead = platData.readNotificationsOfItems.includes(cl!.id);

          if (daysCount > 2 && !isRead) {
            notification = {
              id: cl?.id,
              read: isRead,
              route: 'kanban',
              title: `[Checklist] To-dos esperando você.`,
              description: `Existem itens na checklist "${cl?.checklistName}" em aberto há ${daysCount} dias.`,
              alertType: 'WARN',
            };
          }

          return notification;
        }
      })
      .filter(Boolean);

    return {
      kanbanNotificacoes: kanbanNotifi,
      checklistNotificacoes: checklistNotif,
    };
  }

  async markOneNotificationAsRead(platId: string, itemId: string) {
    const platData = await this.plataformModel.findById(platId);

    if (!platData) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${platId}`,
      );
    }

    if (platData.readNotificationsOfItems.includes(itemId)) {
      throw new NotFoundException(
        `ID do item já foi registrado como lido. ID ${itemId}`,
      );
    }

    const body = {
      ...platData.toObject(),
      readNotificationsOfItems: [...platData.readNotificationsOfItems, itemId],
    };

    return this.plataformModel
      .findByIdAndUpdate(platId, body, { new: true })
      .then((data) => {
        if (data) return data.readNotificationsOfItems;
      });
  }

  async markAllNotificationsAsRead(platId: string, itemsId: string[]) {
    const platData = await this.plataformModel.findById(platId);

    if (!platData) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${platId}`,
      );
    }

    console.log('body :: ', itemsId);

    const newReadFiltered = itemsId.filter(
      (nt) => !platData.readNotificationsOfItems.includes(nt),
    );

    const result = platData.readNotificationsOfItems.concat(newReadFiltered);

    const body = {
      ...platData.toObject(),
      readNotificationsOfItems: result,
    };

    return this.plataformModel
      .findByIdAndUpdate(platId, body, { new: true })
      .then((data) => {
        if (data) return data.readNotificationsOfItems;
      });
  }
}
