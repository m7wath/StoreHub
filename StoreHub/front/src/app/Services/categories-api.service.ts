import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { CategoryApi } from '../Models/category-api.model';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  private url = `${API_BASE_URL}/api/Categories`;

  constructor(private http: HttpClient) {}

  getList(value = '', pageNum = 1, pageSize = 1000): Observable<CategoryApi[]> {
    const params = new HttpParams()
      .set('value', value)
      .set('pageNum', pageNum)      // ✅ مهم: pageNum مش pageNumber
      .set('pageSize', pageSize);

    // ✅ يدعم الحالتين: Array OR { items: [] }
    return this.http.get<any>(this.url, { params }).pipe(
      map((res) => {
        if (Array.isArray(res)) return res as CategoryApi[];
        return (res?.items ?? res?.data ?? []) as CategoryApi[];
      })
    );
  }

create(dto: { name: string; description?: string | null; parentCategoryId?: number | null }) {
  return this.http.post(this.url, dto);
}

delete(id: number) {
  return this.http.delete(`${this.url}/${id}`);
}
update(id: number, dto: any) {
  return this.http.put(`${this.url}/${id}`, dto);
}

}
