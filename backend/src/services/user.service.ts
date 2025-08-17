import { Repository, Not } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../models/user.model';
import { plainToInstance } from 'class-transformer';
import { UsernameResponseDto } from '../dtos/user/username-response.dto';

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    public async findAll(currentUserId: string): Promise<UsernameResponseDto[]> {
        const users = await this.userRepository.find({
            where: {
                id: Not(currentUserId),
                role: UserRole.USER
            },
            order: {
                username: 'ASC'
            }
        });

        return plainToInstance(UsernameResponseDto, users, {
            excludeExtraneousValues: true,
        });
    }
}