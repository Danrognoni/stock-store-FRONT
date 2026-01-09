export interface InventoryItemDet {
    id:string;
    product:ProductDet[];
    stock:number;
    expireDate: Date;
}
