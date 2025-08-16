import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsEmail({}, { message: 'Debe proporcionar un email válido.' })
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
    password!: string;
}