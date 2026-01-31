import { CategoryApi } from './category-api.model';

export interface ProductApi {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  quantity: number;

  categoryId?: number | null;
  category?: CategoryApi | null;

  imageUrl?: string | null;
}
