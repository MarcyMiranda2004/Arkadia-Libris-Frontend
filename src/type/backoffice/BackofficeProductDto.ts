export interface BackOfficeProductDto {
  id: number;
  title: string;
  isbn?: string;
  author: string;
  publisher?: string;
  description?: string;
  price: number;
  categories?: string[];
  images?: string[];
  stock?: number;
}

export interface BackOfficeCreateProductRequestDto {
  title: string;
  isbn?: string;
  author: string;
  publisher: string;
  description: string;
  price: number;
  productType: string;
  categories: string[];
  images?: string[];
  initialStock: number;
}

export interface BackOfficeUpdateProductRequestDto {
  title: string;
  isbn?: string;
  author: string;
  publisher: string;
  description: string;
  price: number;
  categories: string[];
  images?: string[];
}
