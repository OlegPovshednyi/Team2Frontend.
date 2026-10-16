import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminFinancePage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

interface Stat {
  title: string;
  value: string;
  note: string;
  positive: boolean;
}

interface MonthReport {
  id: number;
  period: string;     // например: "Вересень 2026"
  gmv: number;        // в гривнях
  commission: number;
  payouts: number;
}

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'Дохід з комісій', value: '414 500 ₴', note: 'вересень', positive: true },
  { title: 'Виплати продавцям', value: '4 405 000 ₴', note: 'вересень', positive: true },
  { title: 'Утримано за спори', value: '12 400 ₴', note: '3 кейси', positive: true },
  { title: 'Середня комісія', value: '8,6%', note: '+0,2 п.п.', positive: true },
];

const REPORTS: MonthReport[] = [
  { id: 1, period: 'Вересень 2026', gmv: 4820000, commission: 414500, payouts: 4405500 },
  { id: 2, period: 'Серпень 2026', gmv: 4210000, commission: 362060, payouts: 3847940 },
  { id: 3, period: 'Липень 2026', gmv: 3880000, commission: 333680, payouts: 3546320 },
];

const numberFormat = new Intl.NumberFormat('uk-UA');
const money = (n: number) => `${numberFormat.format(n)} ₴`;

/** Простая выгрузка в CSV на стороне фронта. TODO(бэк): заменить на файл с сервера */
function downloadReport(report: MonthReport) {
  const rows = [
    ['Період', 'GMV, ₴', 'Комісія, ₴', 'Виплати, ₴'],
    [report.period, report.gmv, report.commission, report.payouts],
  ];
  const csv = '\uFEFF' + rows.map((r) => r.join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report-${report.period.replace(/\s+/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminFinancePage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Комісії та фінанси</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Комісії та фінанси</h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            <h2 className={styles.sectionTitle}>Звіти</h2>

            {REPORTS.length === 0 ? (
              <p className={styles.empty}>Звітів поки немає.</p>
            ) : (
              <ul className={styles.list}>
                {REPORTS.map((r) => (
                  <li key={r.id} className={styles.card}>
                    <h3 className={styles.cardName}>{r.period}</h3>
                    <dl className={styles.facts}>
                      <div className={styles.fact}>
                        <dt className={styles.factLabel}>GMV</dt>
                        <dd className={styles.factValue}>{money(r.gmv)}</dd>
                      </div>
                      <div className={styles.fact}>
                        <dt className={styles.factLabel}>Комісія</dt>
                        <dd className={styles.factValue}>{money(r.commission)}</dd>
                      </div>
                      <div className={styles.fact}>
                        <dt className={styles.factLabel}>Виплати</dt>
                        <dd className={styles.factValue}>{money(r.payouts)}</dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      className={styles.outlineBtn}
                      onClick={() => downloadReport(r)}
                      aria-label={`Вивантажити звіт: ${r.period}`}
                    >
                      Вивантажити
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