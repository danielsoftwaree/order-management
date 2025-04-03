import {
    IsString,
    IsEmail,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string; // TODO: need to validate email

    @IsString()
    @MinLength(6)
    password: string;
}