import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerProductsPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';
import { sellersApi } from '../../api/sellers';
import { productsApi } from '../../api/products';
import type { Product } from '../../types';

const STATUS_LABEL = {
  active: 'Активний',
  hidden: 'Прихований',
  out: 'Закінчився',
};

const STATUS_CLASS: Record<string, string> = {
  active: styles.statusActive,
  hidden: styles.statusHidden,
  out: styles.statusOut,
};

function statusOf(p: Product): keyof typeof STATUS_LABEL {
  if (!p.isActive) return 'hidden';
  if ((p.quantity ?? 0) <= 0) return 'out';
  return 'active';
}

const PAGE_SIZE = 12;

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
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'Seller') return;
    sellersApi.getMine(user.email).then((seller) => {
      if (!seller) {
        setLoading(false);
        return;
      }
      setSellerId(seller.id);
    });
  }, [user]);

  useEffect(() => {
    if (sellerId == null) return;
    setLoading(true);
    productsApi
      .search({ sellerId, page, pageSize: PAGE_SIZE })
      .then((res) => {
        setProducts(res.items);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [sellerId, page]);

  if (!user || user.role !== 'Seller') {
    return <Navigate to="/login" replace />;
  }

  const handleEdit = (id: number) => {
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

              {loading ? (
                <p style={{ padding: 20 }}>Завантаження...</p>
              ) : products.length === 0 ? (
                <p style={{ padding: 20 }}>У вас ще немає товарів.</p>
              ) : (
                products.map((p) => (
                  <div key={p.id} className={styles.row} role="row">
                    <div className={styles.cellProduct} role="cell">
                      <div className={styles.thumb}>
                        {p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : <ImageIcon />}
                      </div>
                      <span className={styles.name}>{p.name}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellCategory}`} role="cell" data-label="Категорія">
                      {p.categoryName ?? '—'}
                    </div>
                    <div className={`${styles.cell} ${styles.cellStrong}`} role="cell" data-label="Ціна">
                      {priceFormat.format(p.price)} ₴
                    </div>
                    <div className={`${styles.cell} ${styles.cellStrong}`} role="cell" data-label="Залишок">
                      {p.quantity ?? 0}
                    </div>
                    <div className={`${styles.cell} ${styles.cellRating}`} role="cell" data-label="Рейтинг">
                      {p.rating != null ? p.rating.toFixed(1) : '—'} <span aria-hidden="true">★</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellStatus}`} role="cell">
                      <span className={`${styles.status} ${STATUS_CLASS[statusOf(p)]}`}>{STATUS_LABEL[statusOf(p)]}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellEdit}`} role="cell">
                      <button type="button" className={styles.editBtn} onClick={() => handleEdit(p.id)}>
                        Редагувати
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ── Пагинация ── */}
            <nav className={styles.pagination} aria-label="Сторінки каталогу">
              {getPageItems(page, totalPages).map((item) =>
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