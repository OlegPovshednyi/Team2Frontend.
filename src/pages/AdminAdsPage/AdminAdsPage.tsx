import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminAdsPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

type BannerStatus = 'active' | 'paused';

interface Banner {
  id: number;
  name: string;
  status: BannerStatus;
  description: string; // например: "Знижки до 30% · 15.09-15.10"
}

const STATUS_LABEL: Record<BannerStatus, string> = {
  active: 'Активна',
  paused: 'На паузі',
};

const STATUS_CLASS: Record<BannerStatus, string> = {
  active: styles.badgeOk,
  paused: styles.badgeWarn,
};

// TODO(бэк): заменить моки на данные с сервера
const BANNERS: Banner[] = [
  { id: 1, name: 'Головний баннер', status: 'active', description: 'Доставка день у день · 01-30.10' },
  { id: 2, name: 'Промо-блок “Акції”', status: 'active', description: 'Знижки до 30% · 15.09-15.10' },
  { id: 3, name: 'Баннер продавця', status: 'paused', description: 'TechnoLine · Очікує оплати' },
];

export default function AdminAdsPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleEdit = (banner: Banner) => {
    // TODO: открыть редактирование баннера (макета пока нет)
    void banner;
  };

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Реклама і банери</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Реклама і банери</h1>

            {BANNERS.length === 0 ? (
              <p className={styles.empty}>Банерів поки немає.</p>
            ) : (
              <ul className={styles.list}>
                {BANNERS.map((b) => (
                  <li key={b.id} className={styles.card}>
                    <div className={styles.cardHead}>
                      <h2 className={styles.cardName}>{b.name}</h2>
                      <span className={`${styles.badge} ${STATUS_CLASS[b.status]}`}>{STATUS_LABEL[b.status]}</span>
                    </div>
                    <p className={styles.desc}>{b.description}</p>
                    <button
                      type="button"
                      className={styles.outlineBtn}
                      onClick={() => handleEdit(b)}
                      aria-label={`Редагувати: ${b.name}`}
                    >
                      Редагувати
                    </button>
                  </li>
                ))}
              </ul>
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