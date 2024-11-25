import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class UtenteShopService {
  private apiUrl = 'http://localhost:8081/api/utente';

  constructor(private http: HttpClient) {}


  createUser(utenteShop: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createUser`, utenteShop);
  }


  getUserDetailsDataBase():Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/userDetailsDataBase`);
  }

}
