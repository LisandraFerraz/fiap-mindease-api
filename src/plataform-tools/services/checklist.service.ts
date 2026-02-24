import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { ChecklistDataDTO, ChecklistDTO } from '../dto/checklist.dto';
import { PlataformToolsDTO } from '../dto/plataform.dto';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getAllChecklistItems(id: string) {
    const data = await this.plataformModel.findById(id);

    if (!data)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    return await { checklist: data.checklist };
  }

  async createChecklist(id: string, dataBody: ChecklistDTO) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const body = {
      ...data.toObject(),
      checklist: [...data.checklist, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }

  async addChecklistItem(
    id: string,
    checkid: string,
    dataBody: ChecklistDataDTO,
  ) {
    const targetTools = await this.plataformModel.findById(id);

    if (!targetTools) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const targetChecklist = targetTools.checklist.some(
      (cl) => cl.id === checkid,
    );

    if (!targetChecklist) {
      throw new NotFoundException(`Checklist não encontrada. ID ${checkid}`);
    }

    const updatedChecklist = targetTools.checklist.map((cl) => {
      if (cl.id !== checkid) return cl;

      const itemExists = cl.data.some((item) => item.id === dataBody.id);

      if (itemExists) {
        throw new NotFoundException(
          `Já existe um item com o ID ${dataBody.id} nessa checklist ${id}`,
        );
      }

      return {
        ...cl,
        data: [...cl.data, dataBody],
      };
    });

    const body = {
      ...targetTools.toObject(),
      checklist: updatedChecklist,
    } as PlataformToolsDTO;

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }

  async updateChecklist(
    id: string,
    checklistId: string,
    dataBody: ChecklistDTO,
  ) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const clTarget = data.checklist.find((cl) => cl.id === checklistId);

    if (!clTarget) {
      throw new NotFoundException(
        `Checklist não encontrado. Item ID: ${checklistId}`,
      );
    }

    const updatedChecklist: ChecklistDTO[] = data.checklist.map((cl) =>
      cl.id === checklistId
        ? {
            ...cl,
            name: dataBody.name ?? cl.name,
            color: dataBody.color ?? cl.color,
          }
        : cl,
    );

    const body = {
      ...data.toObject(),
      checklist: updatedChecklist,
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }

  async updateChecklistItem(
    id: string,
    checklistId: string,
    itemId: string,
    dataBody: ChecklistDataDTO,
  ) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const checklistExists = data.checklist.some((cl) => cl.id === checklistId);

    if (!checklistExists) {
      throw new NotFoundException(
        `Checklist não encontrado. Item ID: ${checklistId}`,
      );
    }

    const updatedChecklist = data.checklist.map((cl) => {
      if (cl.id !== checklistId) return cl;

      const itemExists = cl.data.some((item) => item.id === itemId);

      if (!itemExists) {
        throw new NotFoundException(
          `Item de checklist não encontrado. Item ID: ${itemId}`,
        );
      }

      return {
        ...cl,
        data: cl.data.map((item) =>
          item.id === itemId ? { ...item, ...dataBody } : item,
        ),
      };
    });

    const body = {
      ...data.toObject(),
      checklist: updatedChecklist,
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }

  async deleteChecklist(id: string, checklistId) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const clTarget = data.checklist.find((cl) => cl.id === checklistId);

    if (!clTarget) {
      throw new NotFoundException(
        `Checklist não encontrado. ID ${checklistId}`,
      );
    }

    const updatedChecklist = data.checklist.filter(
      (cl) => cl.id !== clTarget.id,
    );

    const body = {
      ...data.toObject(),
      checklist: [...updatedChecklist],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }

  async deleteChecklistItem(id: string, checklistId: string, todoId: string) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const checklistExists = data.checklist.some((cl) => cl.id === checklistId);

    if (!checklistExists) {
      throw new NotFoundException(
        `Checklist não encontrado. ID ${checklistId}`,
      );
    }

    const updatedChecklist = data.checklist.map((cl) => {
      if (cl.id !== checklistId) return cl;

      const todoExists = cl.data.some((td) => td.id === todoId);

      if (!todoExists) {
        throw new NotFoundException(
          `Item to-do de checklist não encontrado. ID ${todoId}`,
        );
      }

      return {
        ...cl,
        data: cl.data.filter((td) => td.id !== todoId),
      };
    });

    const body = {
      ...data.toObject(),
      checklist: updatedChecklist,
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }
}
