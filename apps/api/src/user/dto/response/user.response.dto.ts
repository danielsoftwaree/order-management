import { Decimal } from '@prisma/client/runtime/library';
import { IsString, IsEmail, IsNumber, IsDecimal } from 'class-validator';

export class UserResponseDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsDecimal()
    balance: Decimal;
}

