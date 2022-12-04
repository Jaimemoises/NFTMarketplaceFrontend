import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/services/basket.service';

@Component({
  selector: 'app-basket-status',
  templateUrl: './basket-status.component.html',
  styleUrls: ['./basket-status.component.css']
})
export class BasketStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.updateBasketStatus();
  }

  updateBasketStatus() {
    
    //subscribe to the basket totalprice
    this.basketService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the basket totalquantity
    this.basketService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

  }

}
