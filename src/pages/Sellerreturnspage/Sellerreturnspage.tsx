import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerReturnsPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

type ReturnStatus = 'awaiting' | 'review' | 'refunded';

interface ReturnRequest {
  id: string;        // номер заявки
  orderId: string;   // номер замовлення
  product: string;
  reason: string;
  amount: number;    // сума в гривнях
  status: ReturnStatus;
}

interface Stat {
  title: string;
  value: string;
  note: string;
  positive: boolean;
}

const STATUS_LABEL: Record<ReturnStatus, string> = {
  awaiting: 'Очікує товар',
  review: 'На перевірці',
  refunded: 'Кошти повернуто',
};

const STATUS_CLASS: Record<ReturnStatus, string> = {
  awaiting: styles.statusAwaiting,
  review: styles.statusReview,
  refunded: styles.statusRefunded,
};

// TODO(бэк): заменить моки на данные с сервера
const STATS: Stat[] = [
  { title: 'Активні заявки', value: '3', note: '- 1 до тижня', positive: true },
  { title: 'Частка повернень', value: '3,1 %', note: 'нижче середньої', positive: true },
  { title: 'Утримання коштів', value: '3 360 ₴', note: '1 кейс', positive: false },
  { title: 'Середній розгляд', value: '1,4', note: '- 0,3 дня', positive: true },
];

const RETURNS: ReturnRequest[] = [
  { id: 'R-2011', orderId: 'BM-104821', product: 'Кросівки для бігу', reason: 'Не підійшов розмір', amount: 3530, status: 'awaiting' },
  { id: 'R-2081', orderId: 'BM-103821', product: 'Розумна колонка', reason: 'Не працює Wi-Fi', amount: 1930, status: 'review' },
  { id: 'R-2099', orderId: 'BM-105821', product: 'Повербанк 20000 MAh', reason: 'Передумав', amount: 930, status: 'refunded' },
];

const priceFormat = new Intl.NumberFormat('uk-UA');

export default function SellerReturnsPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const handleView = (item: ReturnRequest) => {
    // TODO: открыть детали заявки (макета пока нет)
    void item;
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Повернення</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Повернення та спори</h1>

            <div className={styles.stats}>
              {STATS.map((s) => (
                <div key={s.title} className={styles.statCard}>
                  <span className={styles.statTitle}>{s.title}</span>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={s.positive ? styles.statUp : styles.statDown}>{s.note}</span>
                </div>
              ))}
            </div>

            {RETURNS.length === 0 ? (
              <p className={styles.empty}>Заявок на повернення поки немає.</p>
            ) : (
              <div className={styles.table} role="table" aria-label="Заявки на повернення">
                {/* ── Заголовки (на планшете и телефоне скрыты) ── */}
                <div className={styles.head} role="row">
                  <span className={styles.headCellLeft} role="columnheader">Заявка</span>
                  <span className={styles.headCellLeft} role="columnheader">Замовлення</span>
                  <span className={styles.headCellLeft} role="columnheader">Товар</span>
                  <span className={styles.headCellLeft} role="columnheader">Причина</span>
                  <span role="columnheader">Сума</span>
                  <span role="columnheader">Статус</span>
                  <span className={styles.srOnly} role="columnheader">Дії</span>
                </div>

                {RETURNS.map((r) => (
                  <div key={r.id} className={styles.row} role="row">
                    <div className={styles.cellId} role="cell">
                      {r.id}
                    </div>
                    <div className={`${styles.cell} ${styles.cellOrder}`} role="cell" data-label="Замовлення">
                      {r.orderId}
                    </div>
                    <div className={`${styles.cell} ${styles.cellProduct}`} role="cell" data-label="Товар">
                      {r.product}
                    </div>
                    <div className={`${styles.cell} ${styles.cellReason}`} role="cell" data-label="Причина">
                      {r.reason}
                    </div>
                    <div className={`${styles.cell} ${styles.cellSum}`} role="cell" data-label="Сума">
                      {priceFormat.format(r.amount)} ₴
                    </div>

                    <div className={`${styles.cell} ${styles.cellStatus}`} role="cell">
                      <span className={`${styles.status} ${STATUS_CLASS[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellAction}`} role="cell">
                      <button type="button" className={styles.viewBtn} onClick={() => handleView(r)}>
                        Переглянути
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}