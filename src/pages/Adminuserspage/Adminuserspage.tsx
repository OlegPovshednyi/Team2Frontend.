import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminUsersPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

type UserRole = 'buyer' | 'seller';
type UserStatus = 'active' | 'new' | 'verification' | 'blocked';

interface Stat {
  title: string;
  value: string;
  note: string;
  positive: boolean;
}

interface PlatformUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string; // ISO-дата, напр. '2025-08-25'
  ordersCount: number;
  status: UserStatus;
}

const ROLE_LABEL: Record<UserRole, string> = {
  buyer: 'Покупець',
  seller: 'Продавець',
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: 'Активний',
  new: 'Новий',
  verification: 'Верифікація',
  blocked: 'Заблокований',
};

const STATUS_CLASS: Record<UserStatus, string> = {
  active: styles.statusActive,
  new: styles.statusNew,
  verification: styles.statusVerification,
  blocked: styles.statusBlocked,
};

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'Усього', value: '12 480', note: '+248 за тиждень', positive: true },
  { title: 'Активні', value: '7 902', note: '63%', positive: true },
  { title: 'Покупці з замовленнями', value: '5 140', note: '41%', positive: true },
  { title: 'Заблоковані', value: '37', note: '0,3%', positive: false },
];

const USERS: PlatformUser[] = [
  { id: 1, name: 'О. Коваль', email: 'olena@example.com', role: 'buyer', registeredAt: '2025-08-25', ordersCount: 7, status: 'active' },
  { id: 2, name: 'І. Мельник', email: 'ihor@example.com', role: 'buyer', registeredAt: '2026-06-02', ordersCount: 3, status: 'active' },
  { id: 3, name: 'TechnoLine', email: 'sales@techoline.com', role: 'seller', registeredAt: '2023-01-05', ordersCount: 412, status: 'new' },
  { id: 4, name: 'BeautyRoom', email: 'hi@beautyroom.ua', role: 'seller', registeredAt: '2026-08-18', ordersCount: 64, status: 'verification' },
  { id: 5, name: 'KidsWorld', email: 'info@kidsworld.ua', role: 'seller', registeredAt: '2026-03-06', ordersCount: 41, status: 'blocked' },
];

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('uk-UA');

/** Инициалы для аватара: две заглавные буквы имени, иначе первая буква */
function getInitials(name: string): string {
  const capitals = name.match(/\p{Lu}/gu) ?? [];
  if (capitals.length >= 2) return capitals.slice(0, 2).join('');
  return name.trim().charAt(0).toUpperCase();
}

export default function AdminUsersPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleActions = (u: PlatformUser) => {
    // TODO: меню действий (заблокировать/разблокировать, открыть профиль и т.д.) — макета пока нет
    void u;
  };

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Користувачі</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Користувачі</h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            {USERS.length === 0 ? (
              <p className={styles.empty}>Користувачів поки немає.</p>
            ) : (
              <div className={styles.table} role="table" aria-label="Користувачі">
                {/* ── Заголовки (на планшете и телефоне скрыты) ── */}
                <div className={styles.head} role="row">
                  <span className={styles.headCellLeft} role="columnheader">Користувач</span>
                  <span className={styles.headCellLeft} role="columnheader">Роль</span>
                  <span role="columnheader">Реєстрація</span>
                  <span role="columnheader">Замовлень</span>
                  <span role="columnheader">Статус</span>
                  <span className={styles.srOnly} role="columnheader">Дії</span>
                </div>

                {USERS.map((u) => (
                  <div key={u.id} className={styles.row} role="row">
                    <div className={styles.cellUser} role="cell">
                      <span className={styles.avatar} aria-hidden="true">
                        <span className={styles.initialsFull}>{getInitials(u.name)}</span>
                        <span className={styles.initialsShort}>{u.name.trim().charAt(0).toUpperCase()}</span>
                      </span>
                      <span className={styles.userInfo}>
                        <span className={styles.userName}>{u.name}</span>
                        <span className={styles.userEmail}>{u.email}</span>
                      </span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellRole}`} role="cell" data-label="Роль">
                      {ROLE_LABEL[u.role]}
                    </div>
                    <div className={`${styles.cell} ${styles.cellDate}`} role="cell" data-label="Реєстрація">
                      {formatDate(u.registeredAt)}
                    </div>
                    <div className={`${styles.cell} ${styles.cellOrders}`} role="cell" data-label="Замовлень">
                      {u.ordersCount}
                    </div>

                    <div className={`${styles.cell} ${styles.cellStatus}`} role="cell">
                      <span className={`${styles.status} ${STATUS_CLASS[u.status]}`}>{STATUS_LABEL[u.status]}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellAction}`} role="cell">
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => handleActions(u)}
                        aria-label={`Дії для ${u.name}`}
                      >
                        Дії
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