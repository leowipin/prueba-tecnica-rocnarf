import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: 'El contenido del comentario no puede estar vacío.' })
    @MaxLength(1000, { message: 'El comentario no puede exceder los 1000 caracteres.'})
    content!: string;
}