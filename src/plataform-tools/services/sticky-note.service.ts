import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { StickyNoteDTO, StickyNotesGroupDTO } from '../dto/sticky-note.dto';
import { PlataformToolsDTO } from '../dto/plataform.dto';

@Injectable()
export class StickyNoteService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getAllStickyNotesGroups(id: string) {
    const data = await this.plataformModel.findById(id);

    if (!data)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    return await { stickyNotes: data.stickyNotes };
  }

  async getStickyNotesGroup(id: string, groupId: string) {
    const data = (await this.plataformModel.findById(id)) as PlataformToolsDTO;

    if (!data)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    const targetGroup = data.stickyNotes.find((group) => groupId === group.id);

    return await { stickyNotes: targetGroup };
  }

  async createStickyNotesGroup(id: string, dataBody: StickyNotesGroupDTO) {
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
        if (data) {
          return { stickyNotes: data.stickyNotes };
        }
      });
  }

  async addStickyNote(id: string, groupId: string, dataBody: StickyNoteDTO) {
    const targetTools = await this.plataformModel.findById(id);

    if (!targetTools) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const targetStickyNotesGroup = targetTools.stickyNotes.some(
      (sg) => sg.id === groupId,
    );

    if (!targetStickyNotesGroup) {
      throw new NotFoundException(
        `Grupo de post-its não encontrado. ID ${groupId}`,
      );
    }

    const updatedStickyNotesGroup = targetTools.stickyNotes.map(
      (stickyNotesGroup) => {
        if (stickyNotesGroup.id !== groupId) return stickyNotesGroup;

        const itemExists = stickyNotesGroup.data.some(
          (item) => item.id === dataBody.id,
        );

        if (itemExists) {
          throw new NotFoundException(
            `Já existe um item com o ID ${dataBody.id} nesse grupo de post-its ${id}`,
          );
        }
        const noteParsed = {
          ...dataBody,
          description: dataBody.description.replace(/\r\n|\n|\r/gm, ''),
        } as StickyNoteDTO;

        return {
          ...stickyNotesGroup,
          data: [...stickyNotesGroup.data, noteParsed],
        };
      },
    );

    const body = {
      ...targetTools.toObject(),
      stickyNotes: updatedStickyNotesGroup,
    } as PlataformToolsDTO;

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }

  async updateStickyNotesGroup(
    id: string,
    stickyGroupId: string,
    dataBody: StickyNotesGroupDTO,
  ) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const snGroupTarget = data.stickyNotes.some(
      (sn) => sn.id === stickyGroupId,
    );

    if (!snGroupTarget) {
      throw new NotFoundException(
        `Grupo de post-its não encontrado. Item ID: ${stickyGroupId}`,
      );
    }

    const updatedStickyNotesGroup: StickyNotesGroupDTO[] = data.stickyNotes.map(
      (sn) =>
        sn.id === stickyGroupId
          ? {
              ...sn,
              groupName: dataBody.groupName,
            }
          : sn,
    );

    const body = {
      ...data.toObject(),
      stickyNotes: updatedStickyNotesGroup,
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }

  async updateStickyNote(
    id: string,
    stickyNotesGroupId: string,
    postId: string,
    dataBody: StickyNoteDTO,
  ) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const stickyNotesGroupExists = data.stickyNotes.find(
      (sn) => sn.id === stickyNotesGroupId,
    );

    if (!stickyNotesGroupExists) {
      throw new NotFoundException(
        `Grupo de post-its não encontrado. Item ID: ${stickyNotesGroupId}`,
      );
    }

    const updatedStickyNotesGroup = data.stickyNotes.map((sn) => {
      if (sn.id !== stickyNotesGroupId) return sn;

      const itemExists = sn.data.some((item) => item.id === postId);

      if (!itemExists) {
        throw new NotFoundException(
          `Post-it  não encontrado. Item ID: ${postId}`,
        );
      }

      return {
        ...sn,
        data: sn.data.map((item) =>
          item.id === postId ? { ...item, ...dataBody } : item,
        ),
      };
    });

    const body = {
      ...data.toObject(),
      stickyNotes: updatedStickyNotesGroup,
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }

  async deleteStickyNotesGroup(id: string, stickyNotesGroupId) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const snTarget = data.stickyNotes.find(
      (sn) => sn.id === stickyNotesGroupId,
    );

    if (!snTarget) {
      throw new NotFoundException(
        `Grupo de post-its não encontrado. ID ${stickyNotesGroupId}`,
      );
    }

    const updatedStickyNotesGroup = data.stickyNotes.filter(
      (sn) => sn.id !== snTarget.id,
    );

    const body = {
      ...data.toObject(),
      stickyNotes: [...updatedStickyNotesGroup],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }

  async deleteSitckyNote(
    id: string,
    stickyNotesGroupId: string,
    stickyNoteId: string,
  ) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const stickyNotesGroupExistgs = data.stickyNotes.some(
      (sn) => sn.id === stickyNotesGroupId,
    );

    if (!stickyNotesGroupExistgs) {
      throw new NotFoundException(
        `Grupo de post-its não encontrado. ID ${stickyNotesGroupId}`,
      );
    }

    const updatedStickyNotesGroup = data.stickyNotes.map((sn) => {
      if (sn.id !== stickyNotesGroupId) return sn;

      const stickyNoteExists = sn.data.some((td) => td.id === stickyNoteId);

      if (!stickyNoteExists) {
        throw new NotFoundException(
          `Post-it não encontrado. ID ${stickyNoteId}`,
        );
      }

      return {
        ...sn,
        data: sn.data.filter((td) => td.id !== stickyNoteId),
      };
    });

    const body = {
      ...data.toObject(),
      stickyNotes: updatedStickyNotesGroup,
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { stickyNotes: data.stickyNotes };
      });
  }
}
