import { Component, OnInit } from '@angular/core';
import { BasketItem } from 'src/app/common/basket-item';
import { BasketService } from 'src/app/services/basket.service';

@Component({
  selector: 'app-basket-details',
  templateUrl: './basket-details.component.html',
  styleUrls: ['./basket-details.component.css']
})
export class BasketDetailsComponent implements OnInit {

  basketItems: BasketItem [] = []
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.listBasketDetails();
  }

  listBasketDetails() {
    
    //get a handle to the basket items
    this.basketItems = this.basketService.basketItems;

    //subscribe to the basket totalprice
    this.basketService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the basket totalquantity
    this.basketService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute basket total price and quantity
    this.basketService.computeBasketTotals();

  }

  incrementQuantity(theBasketItem: BasketItem){
    this.basketService.addToBasket(theBasketItem);
  }

  decrementQuantity(theBasketItem: BasketItem){
    this.basketService.decrementQuantity(theBasketItem);
  }

  remove(theBasketItem: BasketItem){
    this.basketService.remove(theBasketItem);
  }

}
