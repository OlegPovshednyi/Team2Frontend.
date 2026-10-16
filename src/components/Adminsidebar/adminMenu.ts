export interface MenuItem {
  label: string;
  to: string;
  soon?: boolean; // страницы ещё нет — пункт неактивен
}

// Пути должны совпадать с <Route path=...> в App.tsx.
// Когда сделаете страницу и добавите маршрут — удалите у пункта soon: true
export const ADMIN_MENU: MenuItem[] = [
  { label: 'Дашборд', to: '/admin' },
  { label: 'Користувачі', to: '/admin/users' },
  { label: 'Продавці', to: '/admin/sellers' },
  { label: 'Модернізація товарів', to: '/admin/moderation' },
  { label: 'Категорії', to: '/admin/categories' },
  { label: 'Реклама і банери', to: '/admin/ads' },
  { label: 'Комісії та фінанси', to: '/admin/finance' },
  { label: 'Спори', to: '/admin/disputes' },
  { label: 'Інтеграції', to: '/admin/integrations' },
  { label: 'Безпека', to: '/admin/security' },
];