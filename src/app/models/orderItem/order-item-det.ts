import { ProductDet } from "../product/product-det";

export interface OrderItemDet {
  id:string;
  product:ProductDet[];
  amount:number;
}
