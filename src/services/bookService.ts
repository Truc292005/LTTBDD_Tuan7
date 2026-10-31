import { api } from "../api/client";
import { Book } from "../types";

export interface BookQuery {
  categoryId?: number;
  q?: string;
}

// Component KHÔNG gọi axios trực tiếp — mọi lời gọi API nằm trong thư mục services
export async function getBooks(params?: BookQuery): Promise<Book[]> {
  // TODO BT7.5a: const res = await api.get<Book[]>("/books", { params }); return res.data;
  const res = await api.get<Book[]>("/books", { params });
  return res.data;
}

export async function getBookById(id: number): Promise<Book> {
  // TODO BT7.5a: api.get<Book>(`/books/${id}`) → trả res.data
  const res = await api.get<Book>(`/books/${id}`);
  return res.data;
}