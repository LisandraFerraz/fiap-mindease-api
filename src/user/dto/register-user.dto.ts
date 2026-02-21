import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterUserDTO {
  @IsString({ message: 'Nome deve ser uma sequência de alfanuméricos.' })
  @IsNotEmpty({ message: 'Nome precisa ser informado.' })
  @MinLength(3, { message: 'Nome deve ter mais de 3 caracteres.' })
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
