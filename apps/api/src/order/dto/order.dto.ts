export class OrderDto {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
}
