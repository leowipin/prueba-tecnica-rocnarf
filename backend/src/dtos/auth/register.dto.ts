import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío.' })
    @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
    username!: string;

    @IsEmail({}, { message: 'Debe proporcionar un email válido.' })
    @IsNotEmpty({ message: 'El email no puede estar vacío.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    password!: string;
}