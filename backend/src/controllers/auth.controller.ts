import { Request, Response } from 'express';
import { AuthService } from '../services/auth.services';
import { RegisterDto } from '../dtos/auth/register.dto';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }
    
    public register = async (req: Request, res: Response): Promise<Response> => {
        const registerDto: RegisterDto = req.body;
        const newUserResponse = await this.authService.register(registerDto);
        return res.status(201).json(newUserResponse);
    }
}