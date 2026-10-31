import React from "react";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TodoBox } from "../components/TodoBox";
import { TabBar, TabItem } from "../components/TabBar";   // ← Tab Bar giao diện đã dựng sẵn
import { useCart } from "../store/hooks";

// Emoji tương ứng với từng tab
const EMOJI: Record<string, string> = {
  Home: "🏠",
  Categories: "🗂️",
  Cart: "🛒",
  Account: "👤",
};

// Nối Tab Bar tự dựng với React Navigation: nhận { state, descriptors, navigation }
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // TODO BT7.1a: dựng mảng `items: TabItem[]` từ state.routes
  //   key = route.key · label = descriptors[route.key].options.title ?? route.name · emoji tra theo route.name
  // TODO BT7.1a: viết onPress(key): emit "tabPress" rồi navigation.navigate(route.name) nếu chưa focus
  // TODO BT7.1a: return <TabBar items={items} activeKey={state.routes[state.index].key} onPress={onPress} />
  // TODO BT7.3e: gắn badge = totalQuantity (từ useCart) cho route "Cart"
  const { totalQuantity } = useCart();

  const items: TabItem[] = state.routes.map((route) => ({
    key: route.key,
    label: descriptors[route.key].options.title ?? route.name,
    emoji: EMOJI[route.name] ?? "•",
    badge: route.name === "Cart" ? totalQuantity : undefined,
  }));

  // TODO BT7.1a: phát sự kiện tabPress rồi chuyển màn nếu chưa focus
  const onPress = (key: string) => {
    const route = state.routes.find((r) => r.key === key);

    if (!route) return;

    const isFocused = state.routes[state.index].key === key;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // TODO BT7.1a: sử dụng component TabBar có sẵn
  return (
    <TabBar
      items={items}
      activeKey={state.routes[state.index].key}
      onPress={onPress}
    />
  );
  void state; void descriptors; void navigation;
  return <TodoBox id="BT7.1a">Viết CustomTabBar: dùng lại component TabBar có sẵn (xem // TODO trong file).</TodoBox>;
}
