import { api } from "../api/client";
import { Category } from "../types";

export async function getCategories(): Promise<Category[]> {
  // TODO BT7.6a: GET /categories → trả res.data (cùng khuôn với bookService)
  const res = await api.get<Category[]>("/categories");
  return res.data;
}