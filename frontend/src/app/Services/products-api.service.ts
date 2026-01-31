import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { ProductApi } from '../Models/product-api.model';
@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private url = `${API_BASE_URL}/api/Products`;

  constructor(private http: HttpClient) {}

  getList(value = '', pageNumber = 1, pageSize = 10): Observable<ProductApi[]> {
    let params = new HttpParams()
      .set('value', value)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<ProductApi[]>(this.url, { params });
  }

  getById(id: number): Observable<ProductApi> {
    return this.http.get<ProductApi>(`${this.url}/${id}`);
  }

  create(dto: any): Observable<any> {
    return this.http.post(this.url, dto);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
