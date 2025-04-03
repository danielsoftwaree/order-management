import { IsString } from "class-validator";

import { IsNumber, IsPositive, IsNotEmpty } from "class-validator";

export class ProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    stock: number;
}
