import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { PlataformToolsDTO } from '../dto/plataform.dto';

@Injectable()
export class PlataformService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getPlataformToolsByUserID(userId: string) {
    const platTarget: any = await this.plataformModel.findOne({
      usuarioId: userId,
    });

    if (!platTarget) {
      throw new NotFoundException(
        `Usuario id ${userId} não foi encontrado. Não foi possível localizar suas ferramentas da plataforma.`,
      );
    }

    platTarget.toObject();

    const data = {
      checklist: platTarget.checklist,
      kanbanData: platTarget.kanbanData,
      pomodoroData: platTarget.pomodoroData,
      stickyNotes: platTarget.stickyNotes,
      usuarioId: platTarget.usuarioId,
      platToolsId: platTarget._id,
    };

    return data;
  }

  async createPlataformTool(userId: string) {
    const userAssociated = await this.plataformModel.findOne({
      usuarioId: userId,
    });

    if (userAssociated)
      throw new NotFoundException(
        `Usuário já possui conjunto de ferramentas associadas a ele. User ID: ${userId}`,
      );

    const body: PlataformToolsDTO = {
      usuarioId: userId.toString(),
      pomodoroData: [],
      kanbanData: [],
      stickyNotes: [],
      checklist: [],
      readNotificationsOfItems: [],
    };

    return await this.plataformModel.create(body);
  }

  async deletePlataformTool(id: string) {
    const platToolExists = await this.plataformModel.findById(id);

    if (!platToolExists)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID: ${id}`,
      );

    return await this.plataformModel.findByIdAndDelete(id);
  }
}
