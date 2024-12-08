import { Category } from "./category.model";

export interface Product {
  id: number;
  quantity: number;
  productName: string;
  description: string;
  price: number;
  availableQuantity: number;
  categoryName: string;
  sizeProduct: string;
  imageUrl: string;
  category: Category;
}
