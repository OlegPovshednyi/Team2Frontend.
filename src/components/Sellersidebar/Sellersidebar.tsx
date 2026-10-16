import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './SellerSidebar.module.css';

interface MenuItem {
  label: string;
  to: string;
  soon?: boolean; // страницы ещё нет — пункт неактивен
}

// Пути должны совпадать с <Route path=...> в App.tsx.
// Когда сделаете страницу и добавите маршрут — удалите у пункта soon: true
const MENU: MenuItem[] = [
  { label: 'Дашборд', to: '/seller' },
  { label: 'Верифікація', to: '/seller/verification' },
  { label: 'Товари', to: '/seller/products' },
  { label: 'Замовлення', to: '/seller/orders' },
  { label: 'Повернення', to: '/seller/returns' },
  { label: 'Залишки', to: '/seller/stock' },
  { label: 'CRM клієнти', to: '/seller/crm' },
  { label: 'Аналітика', to: '/seller/analytics' },
  { label: 'Фінанси', to: '/seller/finance' },
  { label: 'Реклама', to: '/seller/ads' },
  { label: 'Відгуки', to: '/seller/reviews' },
  { label: 'API та інтеграції', to: '/seller/api', soon: true },
];

export default function SellerSidebar() {
  const menuRef = useRef<HTMLUListElement>(null);
  const { pathname } = useLocation();

  // На телефоне меню — горизонтальная лента: центрируем активный пункт
  useEffect(() => {
    const menu = menuRef.current;
    const active = menu?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!menu || !active) return;
    menu.scrollTo({ left: active.offsetLeft - (menu.clientWidth - active.clientWidth) / 2 });
  }, [pathname]);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Кабінет продавця</h2>
      <ul className={styles.menu} ref={menuRef}>
        {MENU.map((item) => (
          <li key={item.to} className={styles.li}>
            {item.soon ? (
              <span
                className={`${styles.item} ${styles.itemSoon}`}
                aria-disabled="true"
                title="Скоро буде доступно"
              >
                {item.label}
              </span>
            ) : (
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `${styles.item} ${isActive ? styles.itemActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}