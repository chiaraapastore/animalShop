import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../models/product.model";
//addProduct emissione evento in questo caso un oggetto, il prodotto che aggiungo va ad emettere il nome del prodotto che ho scritto
//apertura se il mio modale è aperta e chiusura (close(), la stochiudendo e viene emesso in output un evento che viene chiusa la modale)

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() products: Product[] = [];
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() addProduct: EventEmitter<Product> = new EventEmitter();
  @Output() deleteProducts: EventEmitter<number> = new EventEmitter();

  productName: string = '';
  productsToDeleteCount: number = 0;

  close(): void {
    this.closeModal.emit();
  }

  addNewProduct(): void {
    const newProduct: Product = {
      id: 0,
      productName: this.productName,
      price: 100,
      description: 'New product description',
      availableQuantity: 50,
      categoryName: 'category',
      sizeProduct: 'M',
      imageUrl: '',
      quantity: 1,
      category: { id: 0, categoryName: 'category', countProduct: 0 },
    };
    this.addProduct.emit(newProduct);
    this.close();
  }

  deleteProductCount(): void {
    this.deleteProducts.emit(this.productsToDeleteCount);
    this.close();
  }
}
