import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { PomodoroDataSchema } from '../plataform-tools.schema/pomodoro.schema';
import { PomodoroDataDTO } from '../dto/pomodoro.dto';

@Injectable()
export class PomodoroService {
  constructor(
    @InjectModel(PlataformToolSchema.name)
    private plataformModel: mongoose.Model<PlataformToolSchema>,
  ) {}

  async getAllPomodoroTodos(id: string) {
    const data = await this.plataformModel.findById(id);

    if (!data)
      throw new NotFoundException(
        `Conjunto de ferramentas não localizada. ID ${id}`,
      );

    return await { pomodoroData: data.pomodoroData };
  }

  async addPomodoroTodo(id: string, dataBody: PomodoroDataSchema) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const body = {
      ...data.toObject(),
      pomodoroData: [...data.pomodoroData, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { pomodoroData: data.pomodoroData };
      });
  }

  async updatePomodoroTodo(id: string, dataBody: PomodoroDataSchema) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const todoTarget = data.pomodoroData.find((td) => td.id === dataBody.id);

    if (!todoTarget) {
      throw new NotFoundException(`Item de To-do não encontrado. ID ${id}`);
    }

    const updatedTodos = data.pomodoroData.filter(
      (td) => td.id !== todoTarget.id,
    );

    const body = {
      ...data.toObject(),
      pomodoroData: [...updatedTodos, dataBody],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { pomodoroData: data.pomodoroData };
      });
  }

  async deletePomodorTodo(id: string, todoId) {
    const data = await this.plataformModel.findById(id);

    if (!data) {
      throw new NotFoundException(
        `Conjunto de ferramentas não existe. ID ${id}`,
      );
    }

    const todoTarget = data.pomodoroData.find((td) => td.id === todoId);

    if (!todoTarget) {
      throw new NotFoundException(`Item de To-do não encontrado. ID ${id}`);
    }

    const updatedTodos = data.pomodoroData.filter(
      (td) => td.id !== todoTarget.id,
    );

    const body = {
      ...data.toObject(),
      pomodoroData: [...updatedTodos],
    };

    return this.plataformModel
      .findByIdAndUpdate(id, body, { new: true })
      .then((data) => {
        if (data) return { pomodoroData: data.pomodoroData };
      });
  }
}
