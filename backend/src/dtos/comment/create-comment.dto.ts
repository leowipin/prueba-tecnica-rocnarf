import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: 'El contenido del comentario no puede estar vacío.' })
    content!: string;
}