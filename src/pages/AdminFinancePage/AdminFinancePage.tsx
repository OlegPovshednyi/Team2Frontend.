import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import { paymentsApi, type Payment } from '../../api/payments';
import styles from './AdminFinancePage.module.css';

interface MonthReport {
  id: string;
  period: string;
  gmv: number;
  count: number;
}

const numberFormat = new Intl.NumberFormat('uk-UA');
const money = (n: number) => `${numberFormat.format(n)} ₴`;

function downloadReport(report: MonthReport) {
  const rows = [
    ['Період', 'GMV, ₴', 'Кількість оплат'],
    [report.period, report.gmv, report.count],
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
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'Admin') return;
    paymentsApi
      .getAll()
      .then(setPayments)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  const completed = payments.filter((p) => p.status === 'Completed');
  const gmv = completed.reduce((s, p) => s + p.amount, 0);
  const avgCheck = completed.length ? gmv / completed.length : 0;

  const stats = [
    { title: 'Загальний оборот (GMV)', value: money(gmv), note: `${completed.length} оплат`, positive: true },
    { title: 'Середній чек', value: money(avgCheck), note: '', positive: true },
    { title: 'Усього платежів', value: String(payments.length), note: '', positive: true },
    { title: 'Неуспішні/в очікуванні', value: String(payments.length - completed.length), note: '', positive: false },
  ];

  const byMonth = new Map<string, { gmv: number; count: number }>();
  completed.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const entry = byMonth.get(key) ?? { gmv: 0, count: 0 };
    entry.gmv += p.amount;
    entry.count += 1;
    byMonth.set(key, entry);
  });
  const monthLabel = (key: string) => {
    const [y, m] = key.split('-');
    return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  };
  const reports: MonthReport[] = Array.from(byMonth.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, v]) => ({ id: key, period: monthLabel(key), gmv: v.gmv, count: v.count }));

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
              {stats.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            <h2 className={styles.sectionTitle}>Звіти</h2>

            {loading ? (
              <p className={styles.empty}>Завантаження...</p>
            ) : reports.length === 0 ? (
              <p className={styles.empty}>Звітів поки немає.</p>
            ) : (
              <ul className={styles.list}>
                {reports.map((r) => (
                  <li key={r.id} className={styles.card}>
                    <h3 className={styles.cardName}>{r.period}</h3>
                    <dl className={styles.facts}>
                      <div className={styles.fact}>
                        <dt className={styles.factLabel}>GMV</dt>
                        <dd className={styles.factValue}>{money(r.gmv)}</dd>
                      </div>
                      <div className={styles.fact}>
                        <dt className={styles.factLabel}>Оплат</dt>
                        <dd className={styles.factValue}>{r.count}</dd>
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