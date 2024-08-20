import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}
  products: Product[] = [];
  totalRecord: number = 0;
  rows: number = 15;

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  toggelEditPopup(product:Product){
    this.selectedProduct= product;
    this.displayEditPopup = true;
  }
  toggelDeletePopup(product:Product){
    
  }
  toggleAddPopup(){
    this.displayAddPopup = true;
  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  onConfirmEdit(product: Product) {
    if(!this.selectedProduct.id){
      return;
    }
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }
  onConfirmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onProductOutput(product: Product) {
    console.log(product, 'Output');
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', {
        page,
        perPage,
      })
      .subscribe({
        next: (response: Products) => {
          this.products = response.items;
          this.totalRecord = response.total;
          console.log(response.items, 'response.data');
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }
  editProduct(product: Product, id: number) {
    this.productsService
      .editProduct(`http://localhost:3000/clothes/${id}`, product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(`http://localhost:3000/clothes/${id}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  addProduct(product: Product) {
    this.productsService
      .addProduct(`http://localhost:3000/clothes`, product)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }
}
