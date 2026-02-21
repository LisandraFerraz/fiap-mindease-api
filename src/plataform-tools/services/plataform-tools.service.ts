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
