import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';
  selectedStatus: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(
    private ordersService: OrdersService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('orders-page');
    }
    this.loadOrders();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('orders-page');
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.ordersService.getMyOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.filteredOrders = [...this.orders];
        this.updatePagination();
        this.loading = false;
        this.errorMessage = this.orders.length === 0 ? 'Non hai ancora effettuato alcun ordine.' : '';
      },
      (error) => {
        console.error('Errore nel caricamento degli ordini', error);
        this.errorMessage = 'Si è verificato un errore nel recupero degli ordini. Riprova più tardi.';
        this.loading = false;
      }
    );
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesSearch = this.searchTerm
        ? order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesStatus = this.selectedStatus
        ? order.status.toLowerCase() === this.selectedStatus.toLowerCase()
        : true;
      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePagination();
    this.errorMessage =
      this.filteredOrders.length === 0 ? 'Nessun ordine corrisponde ai tuoi filtri.' : '';
  }


  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(start, end);
  }

  viewOrderDetails(order: Order): void {
    alert(`Dettaglio Ordini:
  - Numero Ordine: ${order.orderNumber}
  - Data Ordine: ${new Date(order.orderDate).toLocaleDateString()}
  - Totale: €${order.totalAmount}
  - Stato: ${order.status}`);
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }


  cancelOrder(orderId: number): void {
    if (confirm('Sei sicuro di voler cancellare questo ordine?')) {
      this.ordersService.cancelOrder(orderId).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== orderId);
          this.applyFilters();
          alert('Ordine cancellato con successo.');
        },
        error: (err) => {
          console.error('Errore durante l\'annullamento dell\'ordine:', err);
          alert('Si è verificato un errore. Per favore riprova più tardi.');
        }
      });
    }
  }
}
