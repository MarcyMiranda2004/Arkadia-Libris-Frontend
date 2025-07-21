export interface OrderDetailDto {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  totalAmmount: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  billingAddress?: {
    name: string;
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  items: {
    productId: number;
    productName: string;
    unitPrice?: number;
    price?: number;
    quantity: number;
  }[];
}
