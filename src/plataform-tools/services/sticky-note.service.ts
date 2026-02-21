import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { StickyNoteDTO } from '../dto/sticky-note.dto';

@Injectable()
export class StickyNoteService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getAllStickyNotes(id: string) {
    const data = await this.plataformModel.findById(id);

    if (!data)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    return await { stickyNotes: data.stickyNotes };
  }

  async addStickyNote(id: string, dataBody: StickyNoteDTO) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const body = {
      ...data.toObject(),
      stickyNotes: [...data.stickyNotes, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }

  async updateStickyNote(id: string, dataBody: StickyNoteDTO) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const itemTarget = data.stickyNotes.find((sn) => sn.id === dataBody.id);

    if (!itemTarget) {
      throw new NotFoundException(
        `Sticky note ${id} não encontrado. Item ID: ${dataBody.id}`,
      );
    }

    const updatedStickyNotes = data.stickyNotes.filter(
      (sn) => sn.id !== itemTarget.id,
    );

    const body = {
      ...data.toObject(),
      stickyNotes: [...updatedStickyNotes, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }

  async deleteStickyNote(id: string, todoId) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const itemTarget = data.stickyNotes.find((sn) => sn.id === todoId);

    if (!itemTarget) {
      throw new NotFoundException(`Sticky note não encontrado. ID ${id}`);
    }

    const updatedStickyNotes = data.stickyNotes.filter(
      (sn) => sn.id !== itemTarget.id,
    );

    const body = {
      ...data.toObject(),
      stickyNotes: [...updatedStickyNotes],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }
}
