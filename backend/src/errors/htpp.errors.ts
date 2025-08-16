export class HttpError extends Error {
    public readonly statusCode: number;
    public readonly title: string;

    constructor(statusCode: number, title: string, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.title = title;
        
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string = 'Recurso no encontrado') {
        super(404, 'No Encontrado', message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string = 'Petición incorrecta') {
        super(400, 'Petición Incorrecta', message);
    }
}

export class ConflictError extends HttpError {
    constructor(message: string = 'Existe un conflicto con el estado actual del recurso') {
        super(409, 'Conflicto', message);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string = 'No autorizado') {
        super(401, 'No Autorizado', message);
    }
}