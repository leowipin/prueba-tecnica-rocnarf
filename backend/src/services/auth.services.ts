import { AppDataSource } from "../config/data-source";
import { RegisterDto } from "../dtos/auth/register.dto";
import { UserResponseDto } from "../dtos/auth/user-response.dto";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Repository } from "typeorm";
import { ConflictError, UnauthorizedError } from "../errors/htpp.errors";
import { LoginUserDto } from "../dtos/auth/login.dto";
import { LoginResponseDto } from "../dtos/auth/login-response.dto";

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

    public async login(loginDto: LoginUserDto): Promise<LoginResponseDto> {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedError('Credenciales inválidas.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Credenciales inválidas.');
        }

        const payload = { 
            id: user.id, 
            role: user.role 
        };

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno.');
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '6h'
        } as jwt.SignOptions);

        const response: LoginResponseDto = { token };

        return response;
    }
}