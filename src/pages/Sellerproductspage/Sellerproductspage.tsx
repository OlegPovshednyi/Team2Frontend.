import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerProductsPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

type ProductStatus = 'active' | 'moderation' | 'hidden' | 'out';

interface Product {
  id: number;
  name: string;
  image?: string; // путь к картинке; если нет — покажется заглушка
  category: string;
  price: number;
  stock: number;
  rating: number;
  status: ProductStatus;
}

const STATUS_LABEL: Record<ProductStatus, string> = {
  active: 'Активний',
  moderation: 'На модерації',
  hidden: 'Прихований',
  out: 'Закінчився',
};

const STATUS_CLASS: Record<ProductStatus, string> = {
  active: styles.statusActive,
  moderation: styles.statusModeration,
  hidden: styles.statusHidden,
  out: styles.statusOut,
};

// TODO(бэк): заменить моки на данные с сервера (запрос с номером страницы)
// TODO: подставить реальные картинки в поле image
const PRODUCTS: Product[] = [
  { id: 1, name: 'Бездротові навушники', category: 'Електроніка', price: 1972, stock: 15, rating: 4.6, status: 'active' },
  { id: 2, name: 'Бездротові навушники', category: 'Електроніка', price: 1190, stock: 8, rating: 3.2, status: 'active' },
  { id: 3, name: 'LED лампа', category: 'Електроніка', price: 290, stock: 5, rating: 3.4, status: 'active' },
  { id: 4, name: 'Ноутбук ігровий', category: 'Електроніка', price: 52390, stock: 1, rating: 5.0, status: 'active' },
  { id: 5, name: 'Ноутбук ігровий', category: 'Електроніка', price: 52390, stock: 4, rating: 4.8, status: 'active' },
];
const TOTAL_PAGES = 100; // TODO(бэк): приходит с сервера

const priceFormat = new Intl.NumberFormat('uk-UA');

/** Какие кнопки показывать: 1 2 3 4 5 … 100 */
function getPageItems(current: number, total: number): (number | 'dots-left' | 'dots-right')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'dots-right', total];
  if (current >= total - 3) return [1, 'dots-left', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'dots-left', current - 1, current, current + 1, 'dots-right', total];
}

const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 18 5-5 4 4 3-3 4 4" />
  </svg>
);

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const handleEdit = (id: number) => {
    // TODO: открыть страницу/модалку редактирования товара (макета пока нет)
    void id;
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Товари</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Каталог товарів</h1>

            <div className={styles.table} role="table" aria-label="Каталог товарів">
              {/* ── Заголовки (на телефоне скрыты) ── */}
              <div className={styles.head} role="row">
                <span className={styles.headCellLeft} role="columnheader">Товар</span>
                <span role="columnheader">Категорія</span>
                <span role="columnheader">Ціна</span>
                <span role="columnheader">Залишок</span>
                <span role="columnheader">Рейтинг</span>
                <span role="columnheader">Статус</span>
                <span className={styles.srOnly} role="columnheader">Дії</span>
              </div>

              {/* ── Строки ── */}
              {PRODUCTS.map((p) => (
                <div key={p.id} className={styles.row} role="row">
                  <div className={styles.cellProduct} role="cell">
                    <div className={styles.thumb}>
                      {p.image ? <img src={p.image} alt="" loading="lazy" /> : <ImageIcon />}
                    </div>
                    <span className={styles.name}>{p.name}</span>
                  </div>

                  <div className={`${styles.cell} ${styles.cellCategory}`} role="cell" data-label="Категорія">
                    {p.category}
                  </div>
                  <div className={`${styles.cell} ${styles.cellStrong}`} role="cell" data-label="Ціна">
                    {priceFormat.format(p.price)} ₴
                  </div>
                  <div className={`${styles.cell} ${styles.cellStrong}`} role="cell" data-label="Залишок">
                    {p.stock}
                  </div>
                  <div className={`${styles.cell} ${styles.cellRating}`} role="cell" data-label="Рейтинг">
                    {p.rating.toFixed(1)} <span aria-hidden="true">★</span>
                  </div>

                  <div className={`${styles.cell} ${styles.cellStatus}`} role="cell">
                    <span className={`${styles.status} ${STATUS_CLASS[p.status]}`}>{STATUS_LABEL[p.status]}</span>
                  </div>

                  <div className={`${styles.cell} ${styles.cellEdit}`} role="cell">
                    <button type="button" className={styles.editBtn} onClick={() => handleEdit(p.id)}>
                      Редагувати
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Пагинация ── */}
            <nav className={styles.pagination} aria-label="Сторінки каталогу">
              {getPageItems(page, TOTAL_PAGES).map((item) =>
                typeof item === 'number' ? (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.pageBtn} ${item === page ? styles.pageBtnActive : ''}`}
                    aria-current={item === page ? 'page' : undefined}
                    aria-label={`Сторінка ${item}`}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className={styles.dots} aria-hidden="true">
                    …
                  </span>
                )
              )}
            </nav>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}