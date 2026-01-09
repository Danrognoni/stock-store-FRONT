import { ProductList } from "../product/product-list";

export interface SupplierDet {
  id:string;
  name:string;
  email:string;
  phoneNumber:string;
  products:ProductList[];
}
