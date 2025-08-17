import { Expose } from 'class-transformer';

export class UsernameResponseDto {
    @Expose()
    id!: string;

    @Expose()
    username!: string;
}