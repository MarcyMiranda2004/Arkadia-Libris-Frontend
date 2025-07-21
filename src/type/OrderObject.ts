export interface OrderDto {
  orderId: number;
  orderDate: string;
  totalAmmount: number;
  orderStatus: string;
  items: { productId: number; productName: string; quantity: number; price: number }[];
}