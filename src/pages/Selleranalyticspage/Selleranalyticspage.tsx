import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerAnalyticsPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

interface Stat {
  title: string;
  value: string;
  note: string;
  positive: boolean;
}

interface DayViews {
  day: string;
  views: number;
}

interface TopProduct {
  id: number;
  name: string;
  revenue: number; // виручка в гривнях
}

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'Перегляди картки', value: '24 108', note: '+15 %', positive: true },
  { title: 'Конверсія у кошик', value: '6,4%', note: '+0,8 п.п.', positive: true },
  { title: 'Викуп', value: '92%', note: '+1%', positive: true },
  { title: 'Повернення', value: '3,1 %', note: '0,4%', positive: true },
];

const WEEK_VIEWS: DayViews[] = [
  { day: 'ПН', views: 760 },
  { day: 'ВТ', views: 820 },
  { day: 'СР', views: 940 },
  { day: 'ЧТ', views: 805 },
  { day: 'ПТ', views: 530 },
  { day: 'СБ', views: 1208 },
  { day: 'НД', views: 1465 },
];

const TOP_PRODUCTS: TopProduct[] = [
  { id: 1, name: 'Телевізор Nortex 43” 4K Smart TV', revenue: 860320 },
  { id: 2, name: 'Ноутбук Vela Book 14” i5/ 16 ГБ/ 512 ГБ', revenue: 560983 },
  { id: 3, name: 'Смартфон Nortex Vega 5 128 ГБ', revenue: 239800 },
];

const numberFormat = new Intl.NumberFormat('uk-UA');

export default function SellerAnalyticsPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const maxViews = Math.max(...WEEK_VIEWS.map((d) => d.views), 1); // 1 — защита от деления на 0

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Аналітика</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Аналітика</h1>

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
                <h2 className={styles.sectionTitle}>Перегляди по днях</h2>
                <div className={styles.chart}>
                  {WEEK_VIEWS.map((d) => (
                    <div key={d.day} className={styles.barCol}>
                      <span className={styles.barValue}>{numberFormat.format(d.views)}</span>
                      <div className={styles.barTrack}>
                        <div className={styles.bar} style={{ height: `${(d.views / maxViews) * 100}%` }} />
                      </div>
                      <span className={styles.barLabel}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.col}>
                <h2 className={styles.sectionTitle}>Топ товарів за виручкою</h2>
                <ul className={styles.top}>
                  {TOP_PRODUCTS.map((p) => (
                    <li key={p.id} className={styles.topItem}>
                      <span className={styles.topName}>{p.name}</span>
                      <span className={styles.topRevenue}>{numberFormat.format(p.revenue)} ₴</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}