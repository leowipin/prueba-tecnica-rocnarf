// services/auth.service.ts
import { AppDataSource } from "../config/data-source";
import { RegisterDto } from "../dtos/auth/register.dto";
import { UserResponseDto } from "../dtos/auth/user-response.dto"; // <-- Importamos el nuevo DTO
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { ConflictError } from "../errors/htpp.errors";

export class AuthService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    public async register(registerDto: RegisterDto): Promise<UserResponseDto> {
        const { username, email, password } = registerDto;

        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }]
        });

        if (existingUser) {
            throw new ConflictError('El email o el nombre de usuario ya están en uso.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userEntity = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(userEntity);

        const response: UserResponseDto = {
            id: savedUser.id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
        };

        return response;
    }
}