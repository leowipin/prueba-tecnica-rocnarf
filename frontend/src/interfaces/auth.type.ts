export interface LoginDto {
    email:string;
    password:string;
}

export interface RegisterDto extends LoginDto {
    username: string;
}

export interface LoginResponseDto{
    token:string;
}

export interface UserResponseDto {
    id:       string;
    username: string;
    email:    string;
    role:     string;
}