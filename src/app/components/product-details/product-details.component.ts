import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketItem } from 'src/app/common/basket-item';
import { Product } from 'src/app/common/product';
import { BasketService } from 'src/app/services/basket.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
                        private basketService: BasketService,
                        private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  handleProductDetails() {
    
    //get the id param string. convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToBasket(){

    console.log(`Adding to cart: ${ this.product.name }, ${ this.product.unitPrice}`);
    const theBasketItem = new BasketItem(this.product);
    this.basketService.addToBasket(theBasketItem);
    
  }
}
