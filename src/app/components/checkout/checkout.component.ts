import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { BasketService } from 'src/app/services/basket.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NFTMarketPlaceFormService } from 'src/app/services/nftmarket-place-form.service';
import { NftMarketPlaceValidators } from 'src/app/validators/nft-market-place-validators';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  //initialize stripe
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private nftMarketPlaceFormService: NFTMarketPlaceFormService,
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {

    //setup stripe form
    this.setupStripePaymentForm();

    this.reviewBasketDetails();

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          NftMarketPlaceValidators.notOnlyWhiteSpace,
        ]),

        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          NftMarketPlaceValidators.notOnlyWhiteSpace,
        ]),

        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
                                    NftMarketPlaceValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
          NftMarketPlaceValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
          NftMarketPlaceValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
          NftMarketPlaceValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
        */
      })
    });

    //populate credit card months
    /*
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.nftMarketPlaceFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });

    //populate credit card years

    this.nftMarketPlaceFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });
    */

    //populate countries

    this.nftMarketPlaceFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });

  }

  reviewBasketDetails() {
    
    //Subscribe to basketService.totalQuantity
    this.basketService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //Subscribe to basketService.totalPrice
      this.basketService.totalPrice.subscribe(
        totalPrice => this.totalPrice = totalPrice
      );

  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  

  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //console.log(this.checkoutFormGroup.get('customer').value);
    //console.log('The email adress is: ' + this.checkoutFormGroup.get('customer').value.email);

    //console.log('The country name is ' + this.checkoutFormGroup.get('billingAddress').value.country.name);
    //console.log('The state name is: ' + this.checkoutFormGroup.get('billingAddress').value.state.name);

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get basket items
    const basketItems = this.basketService.basketItems;

    //create orderItems from basketItems
    // - long way
    /*let orderItems: OrderItem[] = [];
    for (let i=0; i< basketItems.length; i++){
      orderItems[i] = new OrderItem(basketItems[i]);
    }
    */
    
  
    // - short way
    let orderItems: OrderItem[] = basketItems.map(tempBasketItem => new OrderItem(tempBasketItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    
    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "EUR";

    //if valid form then
    // - create payment intent
    // -confirm card payment
    // - place order

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement
              }
            }, { handleActions: false })
          .then((result: any) => {
            if (result.error) {
              // inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
            } else {
              // call REST API via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response: any) => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                  // reset cart
                  this.resetBasket();
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);
                }
              })
            }            
          });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }

  resetBasket() {
    //reset basket data
    this.basketService.basketItems = [];
    this.basketService.totalPrice.next(0);
    this.basketService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");

  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value.expirationYear
    );

    console.log(
      'Selected year: ' + Number(creditCardFormGroup.value.expirationYear)
    );

    //if the current year equals the selected year

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.nftMarketPlaceFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }

  getStates(formGroupName: string) {
    const FormGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = FormGroup.value.country.code;
    const countryName = FormGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.nftMarketPlaceFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'billingAddress') {
        this.billingAddressStates = data;
      }

      //select first item by default
      FormGroup.get('state').setValue(data[0]);
    });
  }
}
