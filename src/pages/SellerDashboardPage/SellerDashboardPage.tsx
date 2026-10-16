import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerDashboardPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

// TODO(бэк): заменить моки на данные с сервера
const STATS = [
  { title: 'Продажі за 30 днів', value: '184 360 ₴', note: '+12,4% до липня', positive: true },
  { title: 'Замовлення', value: '128', note: '+8 сьогодні', positive: true },
  { title: 'Середній чек', value: '1 439 ₴', note: '-3,1%', positive: false },
  { title: 'Рейтинг магазину', value: '4.8', note: '1 240 відгуків', positive: true },
];

const WEEK = [
  { day: 'ПН', value: 52 },
  { day: 'ВТ', value: 78 },
  { day: 'СР', value: 105 },
  { day: 'ЧТ', value: 78 },
  { day: 'ПТ', value: 52 },
  { day: 'СБ', value: 125 },
  { day: 'НД', value: 150 },
];

const ATTENTION = [
  { title: '2 нові замовлення', sub: 'Зберіть до 18:00' },
  { title: '3 товари закінчуються', sub: 'Залишок менше 10 шт' },
  { title: '1 відгук без відповіді', sub: 'Оцінка 3 ☆' },
];

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const maxWeek = Math.max(...WEEK.map((w) => w.value), 1); // 1 — защита от деления на 0

  // Пускаем только продавца
  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

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
                <h3 className={styles.sectionTitle}>Продажі за тиждень</h3>
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