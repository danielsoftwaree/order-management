import { IsString } from "class-validator";

import { IsEmail } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class UserResponseDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    balance: number;
}

