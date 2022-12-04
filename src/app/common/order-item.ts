import { BasketItem } from "./basket-item";

export class OrderItem {
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    //Check later if string or number 210
    productId: number;

    constructor(basketItem: BasketItem){
        this.imageUrl = basketItem.imageUrl;
        this.quantity = basketItem.quantity;
        this.unitPrice = basketItem.unitPrice;
        this.productId = basketItem.id;
    }
}
