import { ProductDet } from "../product/product-det";

export interface InventoryItemDet {
    id:string;
    product:ProductDet[];
    stock:number;
    expireDate: Date;
}
