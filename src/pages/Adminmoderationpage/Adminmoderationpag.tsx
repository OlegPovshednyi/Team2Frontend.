import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminModerationPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

type ModerationStatus = 'pending' | 'stockCheck' | 'certificate';

interface ModerationItem {
  id: number;
  name: string;
  image?: string; // путь к картинке; если нет — покажется заглушка
  seller: string;
  category: string;
  price: number;
  status: ModerationStatus;
}

const STATUS_LABEL: Record<ModerationStatus, string> = {
  pending: 'Очікує перевірку',
  stockCheck: 'Перевірка складу',
  certificate: 'Потрібен сертифікат ЕСЕ',
};

// TODO(бэк): заменить моки на данные с сервера
// TODO: подставить реальные картинки в поле image
const INITIAL_ITEMS: ModerationItem[] = [
  { id: 1, name: 'Ноутбук ігровий', seller: 'TechnoLine', category: 'Електроніка', price: 52390, status: 'pending' },
  { id: 2, name: 'Розумна колонка', seller: 'TechnoLine', category: 'Електроніка', price: 1290, status: 'stockCheck' },
  { id: 3, name: 'Йога-килимок', seller: 'SportFactory', category: 'Спорт і відпочинок', price: 720, status: 'certificate' },
];

const priceFormat = new Intl.NumberFormat('uk-UA');

const ImageIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m4 18 5-5 4 4 3-3 4 4" />
  </svg>
);

export default function AdminModerationPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;
  const [items, setItems] = useState<ModerationItem[]>(INITIAL_ITEMS);

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleApprove = (id: number) => {
    // TODO(бэк): отправить решение «схвалити» на сервер
    setItems((list) => list.filter((i) => i.id !== id));
  };

  const handleReject = (id: number) => {
    // TODO(бэк): отправить решение «відхилити» на сервер (возможно, с причиной — макета пока нет)
    setItems((list) => list.filter((i) => i.id !== id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Модернізація товарів</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Модернізація товарів</h1>

            {items.length === 0 ? (
              <p className={styles.empty}>Усі товари перевірено. Нових заявок поки немає.</p>
            ) : (
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.id} className={styles.card}>
                    <div className={styles.thumb}>
                      {item.image ? <img src={item.image} alt="" loading="lazy" /> : <ImageIcon />}
                    </div>

                    <div className={styles.info}>
                      <h2 className={styles.name}>{item.name}</h2>
                      <p className={styles.details}>
                        {item.seller}, {item.category}, {priceFormat.format(item.price)} ₴
                      </p>
                    </div>

                    <span className={styles.badge}>{STATUS_LABEL[item.status]}</span>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.approveBtn}
                        onClick={() => handleApprove(item.id)}
                        aria-label={`Схвалити: ${item.name}`}
                      >
                        Схвалити
                      </button>
                      <button
                        type="button"
                        className={styles.rejectBtn}
                        onClick={() => handleReject(item.id)}
                        aria-label={`Відхилити: ${item.name}`}
                      >
                        Відхилити
                      </button>
                    </div>
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