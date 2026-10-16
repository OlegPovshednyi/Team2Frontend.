import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminSellersPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

type SellerStatus = 'active' | 'verification' | 'blocked';

interface Seller {
  id: number;
  name: string;
  since: string;        // ISO-дата регистрации, напр. '2024-02-12'
  city: string;
  productsCount: number;
  revenue: number;      // оборот в гривнях
  commission: number;   // комиссия, %
  rating: number;
  status: SellerStatus;
}

const STATUS_LABEL: Record<SellerStatus, string> = {
  active: 'Активний',
  verification: 'Верифікація',
  blocked: 'Заблокований',
};

const STATUS_CLASS: Record<SellerStatus, string> = {
  active: styles.statusActive,
  verification: styles.statusVerification,
  blocked: styles.statusBlocked,
};

// TODO(бэк): заменить моки на данные с сервера
const SELLERS: Seller[] = [
  { id: 1, name: 'TechnoLine', since: '2024-02-12', city: 'Київ', productsCount: 412, revenue: 1284000, commission: 8, rating: 4.8, status: 'active' },
  { id: 2, name: 'HomeArtStudio', since: '2024-06-12', city: 'Львів', productsCount: 268, revenue: 512000, commission: 10, rating: 4.6, status: 'active' },
  { id: 3, name: 'SportFactory', since: '2023-09-21', city: 'Одеса', productsCount: 530, revenue: 947000, commission: 8, rating: 4.9, status: 'active' },
  { id: 4, name: 'BeautyRoom', since: '2026-08-19', city: 'Дніпро', productsCount: 64, revenue: 78000, commission: 12, rating: 4.3, status: 'verification' },
  { id: 5, name: 'KidsWorld', since: '2026-03-05', city: 'Харків', productsCount: 41, revenue: 23000, commission: 12, rating: 4.1, status: 'blocked' },
  { id: 6, name: 'AutoPro', since: '2025-01-15', city: 'Київ', productsCount: 190, revenue: 286000, commission: 9, rating: 4.9, status: 'active' },
  { id: 7, name: 'ZooLand', since: '2024-11-22', city: 'Львів', productsCount: 87, revenue: 198000, commission: 10, rating: 4.9, status: 'active' },
];

const numberFormat = new Intl.NumberFormat('uk-UA');
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('uk-UA');

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </svg>
);

export default function AdminSellersPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleOpen = (seller: Seller) => {
    // TODO: открыть карточку продавца (макета пока нет)
    void seller;
  };

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Продавці</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Продавці</h1>

            {SELLERS.length === 0 ? (
              <p className={styles.empty}>Продавців поки немає.</p>
            ) : (
              <div className={styles.table} role="table" aria-label="Продавці">
                {/* ── Заголовки (на планшете и телефоне скрыты) ── */}
                <div className={styles.head} role="row">
                  <span className={styles.headCellLeft} role="columnheader">Магазин</span>
                  <span className={styles.headCellLeft} role="columnheader">Місто</span>
                  <span role="columnheader">Товарів</span>
                  <span role="columnheader">Оборот</span>
                  <span role="columnheader">Комісія</span>
                  <span role="columnheader">Рейтинг</span>
                  <span role="columnheader">Статус</span>
                  <span className={styles.srOnly} role="columnheader">Дії</span>
                </div>

                {SELLERS.map((s) => (
                  <div key={s.id} className={styles.row} role="row">
                    <div className={styles.cellStore} role="cell">
                      <span className={styles.avatar} aria-hidden="true">
                        {s.name.slice(0, 2)}
                      </span>
                      <span className={styles.storeInfo}>
                        <span className={styles.storeName}>{s.name}</span>
                        <span className={styles.storeSince}>з {formatDate(s.since)}</span>
                      </span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellCity}`} role="cell" data-label="Місто">
                      {s.city}
                    </div>
                    <div className={`${styles.cell} ${styles.cellProducts}`} role="cell" data-label="Товарів">
                      {s.productsCount}
                    </div>
                    <div className={`${styles.cell} ${styles.cellStrong} ${styles.cellRevenue}`} role="cell" data-label="Оборот">
                      {numberFormat.format(s.revenue)} ₴
                    </div>
                    <div className={`${styles.cell} ${styles.cellStrong} ${styles.cellCommission}`} role="cell" data-label="Комісія">
                      {s.commission}%
                    </div>
                    <div className={`${styles.cell} ${styles.cellRating}`} role="cell" data-label="Рейтинг">
                      {s.rating.toFixed(1)} <span className={styles.star} aria-hidden="true">★</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellStatus}`} role="cell">
                      <span className={`${styles.status} ${STATUS_CLASS[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellAction}`} role="cell">
                      <button
                        type="button"
                        className={styles.openBtn}
                        onClick={() => handleOpen(s)}
                        aria-label={`Відкрити картку: ${s.name}`}
                      >
                        Картка <span className={styles.arrow}><ArrowIcon /></span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <div className={styles.siteChrome}>
        <Footer />
      </div>
    </div>
  );
}