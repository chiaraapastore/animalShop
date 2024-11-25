import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/order.service';
import { ToastrService } from "ngx-toastr";

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
  showConfirmationPopup: boolean = false;
  orderToCancelId: number | null = null;

  constructor(
    private ordersService: OrdersService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService
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

    this.currentPage = 1;
    this.updatePagination();
    this.errorMessage =
      this.filteredOrders.length === 0 ? 'Nessun ordine corrisponde ai tuoi filtri.' : '';
  }

  updatePagination(): void {
    if (this.filteredOrders.length === 0) {
      this.paginatedOrders = [];
      this.totalPages = 1;
      return;
    }
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = this.currentPage * this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(start, end);
  }

  viewOrderDetails(order: Order): void {
    this.toastr.info(
      `
    <div style="display: flex; align-items: center;">
        <p><strong>Numero Ordine:</strong> <span style="color: #1976d2;">${order.orderNumber}</span></p>
        <p><strong>Data:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
        <p><strong>Totale:</strong> <span style="color: #4caf50;">€${order.totalAmount}</span></p>
        <p><strong>Stato:</strong> <span style="color: ${
        order.status === 'PENDING' ? '#ff9800' : '#4caf50'
      };">${order.status}</span></p>
      </div>
    </div>
    `,
      'Dettaglio Ordine',
      { enableHtml: true }
    );
  }


  showCancelConfirmation(orderId: number): void {
    this.orderToCancelId = orderId;
    this.showConfirmationPopup = true;
  }

  confirmCancel(): void {
    if (this.orderToCancelId !== null) {
      this.ordersService.cancelOrder(this.orderToCancelId).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== this.orderToCancelId);
          this.filteredOrders = this.filteredOrders.filter(order => order.id !== this.orderToCancelId);
          this.updatePagination();
          this.toastr.success('Ordine cancellato con successo.', 'Cancellazione Completata');
          this.closePopup();
        },
        error: () => {
          this.toastr.error('Errore durante la cancellazione.', 'Errore');
        }
      });
    }
  }


  cancelAction(): void {
    this.closePopup();
    this.toastr.info('Cancellazione annullata.', 'Operazione Annullata');
  }

  closePopup(): void {
    this.showConfirmationPopup = false;
    this.orderToCancelId = null;
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
}
