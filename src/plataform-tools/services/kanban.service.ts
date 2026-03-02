import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { KanbanDataDTO } from '../dto/kanban.dto';
import { DefineDaysLeft, FormatKanbanColumns } from '../utils/format-kanban';
import { KanbanDataSchema } from '../plataform-tools.schema/kanban.schema';

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

    const kanbanItems = data.kanbanData;

    const kanbanColumns = FormatKanbanColumns(kanbanItems);

    return kanbanColumns;
  }

  async addKanbanItem(id: string, dataBody: KanbanDataDTO) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const idExists = data.kanbanData.find((id) => id.id === dataBody.id);

    if (idExists) {
      throw new NotFoundException(`Já um item com esse ID: ${dataBody.id}`);
    }

    const body = {
      ...data.toObject(),
      kanbanData: [...data.kanbanData, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return FormatKanbanColumns(body.kanbanData);
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

    const updatedKanbanItems = data.kanbanData.map((item) =>
      item.id === dataBody.id ? { ...item, ...dataBody } : item,
    );

    const body = {
      ...data.toObject(),
      kanbanData: updatedKanbanItems,
    };

    const kanbanColumns = FormatKanbanColumns(body.kanbanData);

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return kanbanColumns;
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
    const kanbanColumns = FormatKanbanColumns(body.kanbanData);

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return kanbanColumns;
      });
  }
}
