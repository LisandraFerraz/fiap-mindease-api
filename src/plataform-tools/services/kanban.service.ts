import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { KanbanDataDTO } from '../dto/kanban.dto';

@Injectable()
export class KanbanService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getAllKanbanItems(id: string) {
    const data = await this.plataformModel.findById(id);

    if (!data)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    return await { kanbanData: data.kanbanData };
  }

  async addKanbanItem(id: string, dataBody: KanbanDataDTO) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const body = {
      ...data.toObject(),
      kanbanData: [...data.kanbanData, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { kanbanData: data.kanbanData };
      });
  }

  async updateKanbanItem(id: string, dataBody: KanbanDataDTO) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const itemTarget = data.kanbanData.find((kbi) => kbi.id === dataBody.id);

    if (!itemTarget) {
      throw new NotFoundException(
        `Item do Kanban ${id} não encontrado. Item ID: ${dataBody.id}`,
      );
    }

    const updatedTodos = data.kanbanData.filter(
      (kbi) => kbi.id !== itemTarget.id,
    );

    const body = {
      ...data.toObject(),
      kanbanData: [...updatedTodos, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { kanbanData: data.kanbanData };
      });
  }

  async deleteKanbanItem(id: string, todoId) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const itemTarget = data.kanbanData.find((kbi) => kbi.id === todoId);

    if (!itemTarget) {
      throw new NotFoundException(`Item de Kanban não encontrado. ID ${id}`);
    }

    const updatedTodos = data.kanbanData.filter(
      (kbi) => kbi.id !== itemTarget.id,
    );

    const body = {
      ...data.toObject(),
      kanbanData: [...updatedTodos],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { kanbanData: data.kanbanData };
      });
  }
}
