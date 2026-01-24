export interface ProductRequest {
  name:string;
  imageUrl:string;
  price:number;
  barcode?:string;
  categoriesId:number[];
}
