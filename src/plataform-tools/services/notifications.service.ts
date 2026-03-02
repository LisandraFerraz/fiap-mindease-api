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

        const remainingD = GetDaysCount(kb.dueDate, true);
        const isRead = platData.readNotificationsOfItems.includes(kb!.id);

        if (remainingD === 0 && !isRead) {
          notification = {
            id: kb.id,
            read: false,
            route: 'kanban',
            title: `O prazo expira hoje!`,
            description: `O prazo de "${kb.title}" termina hoje!.`,
            alertType: 'TODAY',
          };
        }
        if (remainingD < 0 && !isRead) {
          const expiredDays = remainingD * -1;
          notification = {
            id: kb.id,
            read: false,
            route: 'kanban',
            title: `O prazo acabou...`,
            description: `O prazo definido para "${kb.title}" expirou há ${expiredDays} dia(s)!`,
            alertType: 'EXPIRED',
          };
        }
        if (remainingD > 0 && remainingD <= 2 && !isRead) {
          notification = {
            id: kb.id,
            read: false,
            route: 'kanban',
            title: `Sua tarefa precisa de atenção!`,
            description: `O prazo definido para "${kb.title}" termina em ${remainingD} dia(s).`,
            alertType: 'SOON',
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

          let daysCount = GetDaysCount(cl?.lastUpdated, false);
          const isRead = platData.readNotificationsOfItems.includes(cl!.id);

          daysCount = daysCount * -1;

          if (daysCount >= 2 && !isRead) {
            notification = {
              id: cl?.id,
              read: isRead,
              route: 'lista-de-tarefas',
              title: `To-dos esperando você.`,
              description: `Existem itens na checklist "${cl?.checklistName}" em aberto há ${daysCount} dias.`,
              alertType: 'SOON',
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
