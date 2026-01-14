import { CategoryDet } from "../category/category-det";
import { CategoryList } from "../category/category-list";
import { InventoryItemDet } from "../inventoryItem/inventory-item-det";

export interface ProductDet {
  id:string;
  name:string;
  imageUrl:string;
  price:number;
  inventoryItems:InventoryItemDet[];
  categories:CategoryList[];
}
