import { ProductList } from "../product/product-list";

export interface OnlineOrderItemDet {
    id:string;
    product:ProductList;
    amount:number;
}
