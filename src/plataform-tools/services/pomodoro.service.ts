import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlataformToolSchema } from '../plataform-tools.schema/plataform-tools.schema';
import mongoose from 'mongoose';
import { PomodoroDataSchema } from '../plataform-tools.schema/pomodoro.schema';

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

    const pomodoroData = await data.pomodoroData;

    return await pomodoroData;
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

    return await this.plataformModel.findByIdAndUpdate(id, body, { new: true });
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

    return await this.plataformModel.findByIdAndUpdate(id, body, { new: true });
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

    return await this.plataformModel.findByIdAndUpdate(id, body, { new: true });
  }
}
