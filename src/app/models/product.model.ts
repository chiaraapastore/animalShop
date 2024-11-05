import {Category} from "./category.model";

export interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  availableQuantity: number;
  category: Category;
}
