export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  description?: string[];
  author?: string[];
  isbn?: string;
}
