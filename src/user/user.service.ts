import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user/user.schema';
import mongoose from 'mongoose';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async registerUser(
    user: RegisterUserDTO,
  ): Promise<{ userId: string; message: string }> {
    const emailExists = await this.userModel.findOne({ email: user.email });

    if (emailExists) {
      throw new ConflictException('Endereço de e-mail já existe na base.');
    }

    const newUser: any = await this.userModel.create(user);
    const userId = newUser._id.toString();

    return { userId: userId, message: 'Usuário criado!' };
  }

  async listAllUsers(): Promise<User[]> {
    const response = await this.userModel.find();

    return response;
  }

  async findUser(id: string) {
    const response = await this.userModel.findById(id);
    return response;
  }

  async updateUserAccount(id: string, updateBody: Partial<User>) {
    const userTarget = await this.userModel.findById(id);

    if (!userTarget) {
      throw new NotFoundException(`Usuário id ${id} não foi encontrado.`);
    }

    const userUpdated = {
      ...userTarget,
      updateBody,
    };

    return this.userModel
      .findByIdAndUpdate(id, userUpdated, {
        new: true,
        runValidators: true,
      })
      .then((res) => {
        if (res) return { result: 'Atualizado com sucesso!' };
        else return { result: 'Não foi possível atualizar.' };
      });
  }
}
