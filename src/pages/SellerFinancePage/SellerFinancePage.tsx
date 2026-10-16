import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerFinancePage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

type Tone = 'green' | 'red';
type PayoutStatus = 'paid' | 'processing';

interface Stat {
  title: string;
  value: string;
  note: string;
  tone: Tone;
}

interface Payout {
  id: number;
  period: string;
  turnover: number;
  commission: number;
  toPay: number;
  status: PayoutStatus;
}

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'До виплати', value: '46 820 ₴', note: 'виплата 06.10', tone: 'green' },
  { title: 'Комісія платформи', value: '8%', note: '14 736 ₴', tone: 'green' },
  { title: 'Виплачено за місяць', value: '137 400 ₴', note: '3 транзакції', tone: 'green' },
  { title: 'Утримання та повернення', value: '3 360 ₴', note: '1 кейс', tone: 'red' },
];

const PAYOUTS: Payout[] = [
  { id: 1, period: '01-15.08', turnover: 92400, commission: 7390, toPay: 83060, status: 'paid' },
  { id: 2, period: '16-31.08', turnover: 91800, commission: 7402, toPay: 84340, status: 'processing' },
  { id: 3, period: '01-15.07', turnover: 78200, commission: 6240, toPay: 71248, status: 'paid' },
];

const STATUS_LABEL: Record<PayoutStatus, string> = {
  paid: 'Виплачено',
  processing: 'В обробці',
};

const numberFormat = new Intl.NumberFormat('uk-UA');
const money = (n: number) => `${numberFormat.format(n)} ₴`;

export default function SellerFinancePage() {
  const { user } = useAuth();

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Фінанси</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Фінанси</h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.tone === 'green' ? styles.statUp : styles.statDown}>
                    {s.note}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.tableWrap}>
              <div className={styles.table}>
                <div className={`${styles.row} ${styles.head}`}>
                  <span>ПЕРІОД</span>
                  <span>ОБОРОТ</span>
                  <span>КОМІСІЯ</span>
                  <span>ДО ВИПЛАТИ</span>
                  <span>СТАТУС</span>
                </div>

                <div className={styles.body}>
                  {PAYOUTS.map((p) => (
                    <div key={p.id} className={styles.row}>
                      <span className={styles.cellBold}>{p.period}</span>
                      <span className={styles.cellBold}>{money(p.turnover)}</span>
                      <span className={styles.cellBold}>{money(p.commission)}</span>
                      <span className={styles.cellBold}>{money(p.toPay)}</span>
                      <span>
                        <span
                          className={`${styles.badge} ${
                            p.status === 'paid' ? styles.badgePaid : styles.badgeProcessing
                          }`}
                        >
                          {STATUS_LABEL[p.status]}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}