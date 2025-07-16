export interface WishlistItemDto {
  productId: number;
  productName: string;
  imageUrls?: string[];
  price: number;
}

export interface WishlistDto {
  wishlistId: number;
  items: WishlistItemDto[];
}
