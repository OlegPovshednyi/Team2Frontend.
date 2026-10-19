import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerDashboardPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';
import { sellersApi } from '../../api/sellers';
import { productsApi } from '../../api/products';
import { reviewsApi } from '../../api/reviews';
import type { Product, Review } from '../../types';

const LOW_STOCK_THRESHOLD = 10;

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'Seller') return;
    sellersApi.getMine(user.email).then(async (seller) => {
      if (!seller) return;
      const search = await productsApi.search({ sellerId: seller.id, pageSize: 200 }).catch(() => ({ items: [] as Product[] }));
      setProducts(search.items);
      const perProduct = await Promise.all(search.items.map((p) => reviewsApi.getByProduct(p.id).catch(() => [] as Review[])));
      setReviews(perProduct.flat());
    });
  }, [user]);

  if (!user || user.role !== 'Seller') {
    return <Navigate to="/login" replace />;
  }

  const ratings = products.filter((p) => p.rating != null).map((p) => p.rating as number);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';
  const lowStockCount = products.filter((p) => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) < LOW_STOCK_THRESHOLD).length;
  const outOfStockCount = products.filter((p) => (p.quantity ?? 0) <= 0).length;

  const STATS = [
    { title: 'Товарів у каталозі', value: String(products.length), note: '', positive: true },
    { title: 'Рейтинг магазину', value: avgRating, note: `${reviews.length} відгуків`, positive: true },
    { title: 'Закінчуються', value: String(lowStockCount), note: `менше ${LOW_STOCK_THRESHOLD} шт`, positive: false },
    { title: 'Немає в наявності', value: String(outOfStockCount), note: '', positive: false },
  ];

  const byCategory = new Map<string, number>();
  products.forEach((p) => {
    const name = p.categoryName ?? 'Інші';
    byCategory.set(name, (byCategory.get(name) ?? 0) + 1);
  });
  const WEEK = Array.from(byCategory.entries()).map(([day, value]) => ({ day, value }));
  const maxWeek = Math.max(...WEEK.map((w) => w.value), 1);

  const ATTENTION = [
    ...(lowStockCount > 0 ? [{ title: `${lowStockCount} товарів закінчуються`, sub: `Залишок менше ${LOW_STOCK_THRESHOLD} шт` }] : []),
    ...(outOfStockCount > 0 ? [{ title: `${outOfStockCount} товарів немає в наявності`, sub: 'Поповніть залишки' }] : []),
    ...(reviews.length === 0 ? [{ title: 'Поки немає відгуків', sub: 'Додайте товари, щоб отримати перші відгуки' }] : []),
  ];

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Дашборд</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          {/* ── Основная часть ── */}
          <main className={styles.main}>
            <h1 className={styles.title}>Дашборд - {user.name}</h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            <div className={styles.bottom}>
              <section className={styles.col}>
                <h3 className={styles.sectionTitle}>Товари за категоріями</h3>
                <div className={styles.chart}>
                  {WEEK.map((w) => (
                    <div key={w.day} className={styles.barCol}>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.bar}
                          style={{ height: `${(w.value / maxWeek) * 90}%` }}
                          title={`${w.day}: ${w.value}`}
                        />
                      </div>
                      <span className={styles.barLabel}>{w.day}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.col}>
                <h3 className={styles.sectionTitle}>Потребує уваги</h3>
                <div className={styles.attention}>
                  {ATTENTION.map((a) => (
                    <div key={a.title} className={styles.attentionItem}>
                      <div>
                        <div className={styles.attentionTitle}>{a.title}</div>
                        <div className={styles.attentionSub}>{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}