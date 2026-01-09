import { OnlineOrderItemDet } from "../onlineOrderItem/online-order-item-det";

export interface OnlineOrderDet {
    id:string;
    saleDate:Date;
    onlineOrderItems:OnlineOrderItemDet;
}
