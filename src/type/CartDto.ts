export interface CartItemDto {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrls?: string;
}

export interface CartDto {
  userId: number;
  items: CartItemDto[];
  totalPrice: number;
}
