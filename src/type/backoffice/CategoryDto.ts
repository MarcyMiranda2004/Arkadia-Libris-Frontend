export interface CategoryDto {
  id: number;
  name: string;
  productCategoryType: string;
}

export interface CreateAndUpdateCategoryRequestDto {
  name: string;
  productCategoryType: string;
}
