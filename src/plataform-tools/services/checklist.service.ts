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

    const targetChecklist = targetTools.checklist.find(
      (cl) => cl.id === checkid,
    );

    if (!targetChecklist) {
      throw new NotFoundException(`Checklist não encontrada. ID ${checkid}`);
    }

    const itemExists = targetChecklist.data.find(
      (item) => item.id === dataBody.id,
    );

    if (itemExists) {
      throw new NotFoundException(
        `Já existe um item com o ID ${dataBody.id} nessa checklist ${id}`,
      );
    }

    const targetChecklistUpdated = {
      ...targetChecklist,
      data: [...targetChecklist.data, dataBody],
    } as ChecklistDTO;

    const checklistsFiltered = targetTools.checklist.filter(
      (cl) => cl.id !== checkid,
    );

    const body = {
      ...targetTools.toObject(),
      checklist: [...checklistsFiltered, targetChecklistUpdated],
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

    const updatedChecklist: ChecklistDTO[] = data.checklist.filter(
      (cl) => cl.id !== clTarget.id,
    );

    const withItems: ChecklistDTO = {
      ...clTarget,
      name: dataBody.name,
      color: dataBody.color,
    };

    const body = {
      ...data.toObject(),
      checklist: [...updatedChecklist, withItems],
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

    const clTarget = data.checklist.find((cl) => cl.id === checklistId);

    if (!clTarget) {
      throw new NotFoundException(
        `Checklist ${id} não encontrado. Item ID: ${checklistId}`,
      );
    }

    const itemTarget = clTarget.data.find((td) => td.id === itemId);

    if (!itemTarget) {
      throw new NotFoundException(
        `Item de checklist ${dataBody.id} não encontrado. Item ID: ${itemId}`,
      );
    }

    // .data
    const newData = clTarget.data.filter((item) => item.id !== itemTarget.id);

    const updatedTargetChecklist = {
      ...clTarget,
      data: [...newData, dataBody],
    };

    const filteredChecklist = data.checklist.filter(
      (cl) => cl.id !== clTarget.id,
    );

    const body = {
      ...data.toObject(),
      checklist: [...filteredChecklist, updatedTargetChecklist],
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

  async deleteChecklistItem(id: string, checklistId, todoId) {
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

    const todoTarget = clTarget.data.find((td) => td.id === todoId);

    if (!todoTarget) {
      throw new NotFoundException(
        `Item to-do de checklist não encontrado. ID ${todoId}`,
      );
    }

    const newData = clTarget.data.filter((td) => td.id !== todoTarget.id);

    const filteredChecklist = data.checklist.filter(
      (cl) => cl.id !== clTarget.id,
    );

    const updatedTargetChecklist = {
      ...clTarget,
      data: [newData],
    };

    const body = {
      ...data.toObject(),
      checklist: [...filteredChecklist, updatedTargetChecklist],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { checklist: data.checklist };
      });
  }
}
