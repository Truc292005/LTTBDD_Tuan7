import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategoryChips } from "../components/CategoryChips";
import { PriceFilter } from "../components/PriceFilter";
import { BookGrid } from "../components/BookGrid";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { TodoBox } from "../components/TodoBox";
import { LoadingView } from "../components/LoadingView";
import { ErrorView } from "../components/ErrorView";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { getErrorMessage } from "../api/client";
// import { EmptyState } from "../components/EmptyState";
// import { useDebounce } from "../hooks/useDebounce";
// import { filterBooks } from "../utils/filters";
import { PriceRange } from "../utils/filters";
import { TabScreenProps } from "../navigation/types";
import { colors } from "../theme";
import { Book, Category } from "../types";
import { useCart } from "../store/hooks";

export function HomeScreen({ navigation }: TabScreenProps<"Home">) {
  // TODO BT7.3d: lấy { totalQuantity } từ useCart() và truyền vào <FloatingCartButton count=... />
  const { totalQuantity } = useCart();

  // TODO BT7.5b: thay dữ liệu giả bằng state: books, categories, loading, error  (useState)
  //   rồi viết hàm load() gọi SONG SONG: const [b, c] = await Promise.all([getBooks(), getCategories()])
  //   gọi load() trong useEffect(…, []) — nhớ try/catch/finally.

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hàm load dữ liệu sách và danh mục từ API
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Hai API độc lập nên gọi SONG SONG bằng Promise.all
      const [b, c] = await Promise.all([
        getBooks(),
        getCategories(),
      ]);

      setBooks(b);
      setCategories(c);
    } catch (e) {
      // Lấy thông báo lỗi đã được xử lý từ api/client.ts
      setError(getErrorMessage(e));
    } finally {
      // Luôn tắt trạng thái loading dù thành công hay thất bại
      setLoading(false);
    }
  }, []);

  // Gọi API khi màn Home được khởi tạo
  useEffect(() => {
    load();
  }, [load]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);

  // TODO BT7.7a: const debouncedKeyword = useDebounce(keyword, 400);
  // TODO BT7.7c: visibleBooks = useMemo(() => filterBooks(books, { keyword: debouncedKeyword, categoryId, priceRange }), [...])
  const visibleBooks = books;

  // TODO BT7.8b: nhận categoryId từ route.params (Tab Danh mục gửi sang) → setCategoryId(id) rồi navigation.setParams({ categoryId: undefined })

  // TODO BT7.5c: hiển thị <LoadingView/> khi loading, <ErrorView message onRetry={load}/> khi error, ngược lại là BookGrid
  if (loading) {
    return <LoadingView label="Đang tải sách…" />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={load} />;
  }

  // TODO BT7.7d: ListEmptyComponent = <EmptyState emoji="🔎" title="Không tìm thấy sách phù hợp" … actionLabel="Xóa bộ lọc" /> + hàm clearFilters
  // TODO BT7.7e: nút "✕ Xóa bộ lọc" (chỉ hiện khi đang có bộ lọc) trong header của lưới

  return (
    <View style={styles.container}>
      <Header
        title="📚 BookStore"
        onSearchPress={() => setSearchOpen((v) => !v)}
      />

      {searchOpen && (
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          onClose={() => {
            setSearchOpen(false);
            setKeyword("");
          }}
        />
      )}

      <BookGrid
        data={visibleBooks}
        // TODO BT7.2a: onPressBook → navigation.navigate("BookDetail", { bookId: b.id })
        onPressBook={(b) =>
          navigation.navigate("BookDetail", { bookId: b.id })
        }
        ListHeaderComponent={
          <View>
            <CategoryChips
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />

            <PriceFilter
              value={priceRange}
              onChange={setPriceRange}
            />

            {/* TODO BT7.5b: đã thay dữ liệu giả bằng dữ liệu API */}
          </View>
        }
      />

      <FloatingCartButton
        count={totalQuantity}
        onPress={() => navigation.navigate("Cart")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});