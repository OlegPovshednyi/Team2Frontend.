import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerStockPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

interface Stat {
  title: string;
  value: string;
  note: string;
  positive: boolean;
}

interface LowStockItem {
  id: number;
  name: string;
  quantity: number; // остаток, шт
}

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'Позицій в наявності', value: '10', note: 'з 10', positive: true },
  { title: 'Закінчуються', value: '3', note: 'менше 10 шт', positive: false },
  { title: 'Резерв під замовлення', value: '12', note: 'шт', positive: true },
  { title: 'Оборотність', value: '18 днів', note: '- 2 дня', positive: true },
];

const LOW_STOCK: LowStockItem[] = [
  { id: 1, name: 'Смартфон Nortex Vega 5 128 ГБ', quantity: 10 },
  { id: 2, name: 'Розумна колонка Orbita Mini', quantity: 4 },
  { id: 3, name: 'Телевізор Nortex 43” 4K Smart TV', quantity: 5 },
  { id: 4, name: 'Зарядна станція Power 300 Вт', quantity: 15 },
  { id: 5, name: 'Ноутбук Vela Book 14” i5/ 16 ГБ/ 512 ГБ', quantity: 8 },
];

export default function SellerStockPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const handleReorder = (item: LowStockItem) => {
    // TODO: оформить поповнення (макета пока нет)
    void item;
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Залишки</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Управління залишками</h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            <section>
              <h2 className={styles.sectionTitle}>Потребують поповнення</h2>

              {LOW_STOCK.length === 0 ? (
                <p className={styles.empty}>Усі товари в достатній кількості.</p>
              ) : (
                <ul className={styles.list}>
                  {LOW_STOCK.map((item) => (
                    <li key={item.id} className={styles.row}>
                      <span className={styles.name}>{item.name}</span>
                      <span className={styles.qty}>{item.quantity} шт</span>
                      <button
                        type="button"
                        className={styles.orderBtn}
                        onClick={() => handleReorder(item)}
                        aria-label={`Замовити: ${item.name}`}
                      >
                        Замовити
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}