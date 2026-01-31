export interface CategoryApi {
  id: number;
  name: string;
  description?: string | null;
  parentCategoryId?: number | null;
}