import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BasketItem } from '../common/basket-item';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  
  basketItems: BasketItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //storage: Storage = sessionStorage;
  storage: Storage = sessionStorage;

  constructor() {

    //Read data from storage
    let data = JSON.parse(this.storage.getItem('basketItems')!);

    if(data != null){
      this.basketItems = data;

      //compute totals based on the data that is read from storage
      this.computeBasketTotals();
    }

  }

  addToBasket(theBasketItem: BasketItem) {
    //to check if we have the item in our basket
    let alreadyExistsInBasket: boolean = false;
    let existingBasketItem: BasketItem | undefined;

    if (this.basketItems.length > 0) {
      //find the item in the basket base on item id
      
      existingBasketItem = this.basketItems.find( tempBasketItem => tempBasketItem.id === theBasketItem.id);

    //check if found
    alreadyExistsInBasket = existingBasketItem != undefined;
    }
    if (alreadyExistsInBasket) {

      existingBasketItem?.quantity ? existingBasketItem.quantity++ : 0;
    } 
    else {
      //add item to the array
      this.basketItems.push(theBasketItem);
    }

    //compute total price and quantity
    this.computeBasketTotals();
  }

  computeBasketTotals() {
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentBasketItem of this.basketItems){
      totalPriceValue += currentBasketItem.quantity * currentBasketItem.unitPrice;
      totalQuantityValue += currentBasketItem.quantity;
    }

    //publish the new value.. all subs will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log basket for debugging
    this.logBasketData(totalPriceValue, totalQuantityValue);

    //persist basket data
    this.persistBasketItems();
  }

  persistBasketItems(){
    this.storage.setItem('basketItems', JSON.stringify(this.basketItems));
  }

  logBasketData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the basket');
    for(let tempBasketItem of this.basketItems){
      const subTotalPrice = tempBasketItem.quantity * tempBasketItem.unitPrice;
      console.log(`name: ${tempBasketItem.name}, quantity: ${tempBasketItem.quantity}, unitPrice: ${tempBasketItem.unitPrice}, subTotalPrice: ${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('------');
  }

  decrementQuantity(theBasketItem: BasketItem) {
    
    theBasketItem.quantity--;

    if(theBasketItem.quantity === 0){
      this.remove(theBasketItem);
    }
    else{
      this.computeBasketTotals();
    }
  }

  remove(theBasketItem: BasketItem) {
    
    //Get index of item in the array
    const itemIndex = this.basketItems.findIndex(tempBasketItem => tempBasketItem.id === theBasketItem.id);

    //if Found, remove the item from the array at the give index
    if(itemIndex > -1){
      this.basketItems.splice(itemIndex, 1);

      this.computeBasketTotals();
    }

  }

}
