import { Expose, Type } from 'class-transformer';
import { UsernameResponseDto } from '../user/username-response.dto';

export class CommentResponseDto {
    @Expose()
    id!: string;

    @Expose()
    content!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    @Type(() => UsernameResponseDto)
    user!: UsernameResponseDto;
}