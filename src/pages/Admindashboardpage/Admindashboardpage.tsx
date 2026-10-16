import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './Admindashboardpage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

interface Stat {
  title: string;
  value: string;
  note: string;
  positive: boolean;
}

interface MonthGmv {
  month: string;
  gmv: number; // в тысячах гривен
}

interface CategoryShare {
  name: string;
  percent: number; // доля оборота, %
}

interface Task {
  id: number;
  title: string;
  subtitle: string;
  to: string;
  soon?: boolean; // страницы ещё нет — пункт неактивен
}

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'GMV за 30 днів', value: '4 820 000 ₴', note: '+18,2 %', positive: true },
  { title: 'Замовлень', value: '9 412', note: '+6,4%', positive: true },
  { title: 'Активних продавців', value: '284', note: '+12', positive: true },
  { title: 'Дохід з комісій', value: '414 500 ₴', note: '+14,1%', positive: true },
];

const GMV_BY_MONTH: MonthGmv[] = [
  { month: 'Березень', gmv: 2900 },
  { month: 'Квітень', gmv: 3250 },
  { month: 'Травень', gmv: 3410 },
  { month: 'Червень', gmv: 3880 },
  { month: 'Липень', gmv: 4210 },
  { month: 'Серпень', gmv: 4820 },
];

const CATEGORIES: CategoryShare[] = [
  { name: 'Електроніка', percent: 42 },
  { name: 'Дім і кухня', percent: 26 },
  { name: 'Одяг і взуття', percent: 14 },
  { name: 'Спорт', percent: 10 },
  { name: 'Інші', percent: 8 },
];

// TODO(бэк): тексты и количество приходят с сервера. Уберите soon, когда появится страница «Спори»
const TASKS: Task[] = [
  { id: 1, title: 'Модернізація товарів', subtitle: '3 товари очікують перевірки', to: '/admin/moderation' },
  { id: 2, title: 'Спори', subtitle: '2 відкриті спори', to: '/admin/disputes', soon: true },
  { id: 3, title: 'Продавці', subtitle: '1 магазин на верифікації', to: '/admin/sellers' },
];

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export default function AdminDashboardPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const maxGmv = Math.max(...GMV_BY_MONTH.map((m) => m.gmv), 1); // 1 — защита от деления на 0

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Дашборд</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>
              <span className={styles.titleFull}>Дашборд платформи</span>
              <span className={styles.titleShort}>Дашборд</span>
            </h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            <div className={styles.middle}>
              <section className={`${styles.col} ${styles.chartCol}`}>
                <h2 className={styles.sectionTitle}>GMV по місяцях, ₴</h2>
                <div className={styles.chart}>
                  {GMV_BY_MONTH.map((m) => (
                    <div key={m.month} className={styles.barCol}>
                      <span className={styles.barValue}>{m.gmv}к</span>
                      <div className={styles.barTrack}>
                        <div className={styles.bar} style={{ height: `${(m.gmv / maxGmv) * 100}%` }} />
                      </div>
                      <span className={styles.barLabel}>
                        <span className={styles.labelFull}>{m.month}</span>
                        <span className={styles.labelShort} aria-hidden="true">
                          {m.month.slice(0, 3)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${styles.col} ${styles.tasksCol}`}>
                <h2 className={styles.sectionTitle}>Черга завдань</h2>
                <div className={styles.tasks}>
                  {TASKS.length === 0 ? (
                    <p className={styles.tasksEmpty}>Завдань поки немає.</p>
                  ) : (
                    <ul className={styles.taskList}>
                      {TASKS.map((t) => {
                        const content = (
                          <>
                            <span className={styles.taskText}>
                              <span className={styles.taskTitle}>{t.title}</span>
                              <span className={styles.taskSub}>{t.subtitle}</span>
                            </span>
                            <span className={styles.taskChevron}>
                              <ChevronIcon />
                            </span>
                          </>
                        );
                        return (
                          <li key={t.id} className={styles.taskLi}>
                            {t.soon ? (
                              <div className={`${styles.taskItem} ${styles.taskSoon}`} aria-disabled="true">
                                {content}
                              </div>
                            ) : (
                              <Link to={t.to} className={styles.taskItem}>
                                {content}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            </div>

            <section className={styles.categories}>
              <h2 className={styles.sectionTitle}>Категорії за оборотом</h2>
              <ul className={styles.catList}>
                {CATEGORIES.map((c) => (
                  <li key={c.name} className={styles.catRow}>
                    <span className={styles.catName}>{c.name}</span>
                    <div
                      className={styles.catTrack}
                      role="progressbar"
                      aria-label={c.name}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={c.percent}
                    >
                      <div className={styles.catFill} style={{ width: `${Math.min(Math.max(c.percent, 0), 100)}%` }} />
                    </div>
                    <span className={styles.catPercent}>{c.percent}%</span>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>
      </div>

      <div className={styles.siteChrome}>
        <Footer />
      </div>
    </div>
  );
}