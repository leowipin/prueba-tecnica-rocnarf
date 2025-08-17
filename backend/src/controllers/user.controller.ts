import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getUsernames = async (req: Request, res: Response): Promise<Response> => {
        const currentUserId = req.user!.id;
        
        const users = await this.userService.findAll(currentUserId);

        console.log(users);
        
        return res.status(200).json(users);
    }
}