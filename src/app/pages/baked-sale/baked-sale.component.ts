import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'tlgyo-baked-sale',
  templateUrl: './baked-sale.component.html',
  styleUrls: ['./baked-sale.component.scss']
})
export class BakedSaleComponent implements OnInit {
  @ViewChild('orderInfoModal', { static: false }) orderInfoModal?: ModalDirective;
  products: any = [];
  cart: any = [];
  alertConfig = {
    type: 'success',
    msg: '',
    show: false,
    timeout: 5,
  };
  modalRef?: BsModalRef;
  isOrderInfoModalShown = false;

  constructor(private dataService: DataService, private modalService: BsModalService) { }

  addToCart(itemId: number) {
    const {price, title, quantity} = this.products[itemId];
    if (quantity < 1) {
      this.alertConfig.show = true;
      this.alertConfig.type = 'danger';
      this.alertConfig.msg = 'Oops! You must set a quantity first!';
      return;
    }
    this.cart.push({item: title, price, quantity})
    console.log('added to cart')
    if (quantity > 0 && this.cart.length === 1) {
      this.isOrderInfoModalShown = true;
    }
  }

  orderItems(data: any) {
    this.dataService.addToCollection('baked-sale-orders', data)
    .then((response: any) => {
      this.alertConfig.show = true;
      this.alertConfig.msg = 'Way To Go! Your order has been sent!'
    })
    .catch(err => {})
  }

  setQuantity(itemId: number, setTo: number = 1) {
    this.products[itemId].quantity = setTo;
  }

  increment(itemId: number) {
    let item = this.products[itemId];
    if (item.quantity > 100) return;
    item.quantity++;
  }

  decrement(itemId: number) {
    let item = this.products[itemId];
    if (item.quantity === 0) return;
    item.quantity--;
  }

  openModal(template: TemplateRef<any>, modalOpts?: ModalOptions) {
    this.modalRef = this.modalService.show(template, modalOpts);
  }

  hideModal(modalName: string) {
    this[modalName].hide();
  }

  onModalHidden(modalToggleName: string) {
    this[modalToggleName] = false;
  }

  ngOnInit(): void {
    this.dataService.getDBList('baked-sale').valueChanges().subscribe(items => this.products = items);

  }

}
