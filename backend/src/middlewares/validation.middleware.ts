import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (
    dtoClass: any,
    source: 'body' | 'params' | 'query' = 'body'
    ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dataToValidate = req[source];
        const dtoInstance = plainToInstance(dtoClass, dataToValidate);

        const errors: ValidationError[] = await validate(dtoInstance);

        if (errors.length > 0) {
            const messages = errors.map((error: ValidationError) => 
                (Object as any).values(error.constraints)
            ).flat();
            const title = 'Error de validación';
            const description = 'Por favor, corrige los errores y vuelve a intentar.';
            return res.status(400).json({ title: title, description: description, errors: messages });
        }
        
        if (source === 'body') {
            req.body = dtoInstance;
        }
        
        next();
    };
};