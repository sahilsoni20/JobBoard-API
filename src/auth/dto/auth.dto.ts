import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsEnum(Role)
    role: Role

    session: Record<string, any>
}