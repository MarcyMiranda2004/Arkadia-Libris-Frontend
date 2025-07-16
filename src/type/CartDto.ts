export interface CartItemDto {
  productId: number;
  productName: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartDto {
  userId: number;
  items: CartItemDto[];
  totalPrice: number;
}
