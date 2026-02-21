import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './../user/schema/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException(
        'Credenciais estão incorretas ou não foram registradas.',
      );
    }

    const isPassValid = password === user.password;

    if (!isPassValid) {
      throw new UnauthorizedException(
        'Credenciais inválidas.',
        this.configService.get<string>('JWT_SECRET'),
      );
    }

    return { _id: user._id };
  }

  async loginUser(user: any) {
    const payload = { id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
