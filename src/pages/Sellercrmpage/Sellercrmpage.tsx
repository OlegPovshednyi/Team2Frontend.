import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerCrmPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

type Segment = 'regular' | 'active' | 'new' | 'vip' | 'churn';

interface Customer {
  id: number;
  name: string;
  ordersCount: number;
  totalSpent: number;  // сума покупок в гривнях
  lastOrder: string;   // ISO-дата, напр. '2026-08-26'
  segment: Segment;
}

const SEGMENT_LABEL: Record<Segment, string> = {
  regular: 'Постійний',
  active: 'Активний',
  new: 'Новий',
  vip: 'VIP',
  churn: 'Ризик відтоку',
};

const SEGMENT_CLASS: Record<Segment, string> = {
  regular: styles.segRegular,
  active: styles.segActive,
  new: styles.segNew,
  vip: styles.segVip,
  churn: styles.segChurn,
};

// TODO(бэк): заменить моки на данные с сервера
const CUSTOMERS: Customer[] = [
  { id: 1, name: 'О. Коваль', ordersCount: 7, totalSpent: 18400, lastOrder: '2026-08-26', segment: 'regular' },
  { id: 2, name: 'І. Мельник', ordersCount: 3, totalSpent: 5200, lastOrder: '2026-08-26', segment: 'active' },
  { id: 3, name: 'А. Шевчук', ordersCount: 1, totalSpent: 11990, lastOrder: '2026-08-26', segment: 'new' },
  { id: 4, name: 'Д. Бондар', ordersCount: 12, totalSpent: 31530, lastOrder: '2026-08-26', segment: 'vip' },
  { id: 5, name: 'К. Ткач', ordersCount: 2, totalSpent: 3530, lastOrder: '2026-08-26', segment: 'churn' },
];

const priceFormat = new Intl.NumberFormat('uk-UA');
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
const initial = (name: string) => name.trim().charAt(0).toUpperCase();

export default function SellerCrmPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'Seller') {
    return <Navigate to="/login" replace />;
  }

  const handlePromo = (customer: Customer) => {
    // TODO: отправка промокода клиенту (макета пока нет)
    void customer;
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>CRM</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>CRM: клієнти</h1>

            {CUSTOMERS.length === 0 ? (
              <p className={styles.empty}>Клієнтів поки немає. Вони з’являться після перших замовлень.</p>
            ) : (
              <div className={styles.table} role="table" aria-label="Клієнти">
                {/* ── Заголовки (на планшете и телефоне скрыты) ── */}
                <div className={styles.head} role="row">
                  <span className={styles.headCellLeft} role="columnheader">Клієнт</span>
                  <span role="columnheader">Замовлень</span>
                  <span role="columnheader">Сума</span>
                  <span role="columnheader">Останнє</span>
                  <span role="columnheader">Сегмент</span>
                  <span className={styles.srOnly} role="columnheader">Дії</span>
                </div>

                {CUSTOMERS.map((c) => (
                  <div key={c.id} className={styles.row} role="row">
                    <div className={styles.cellClient} role="cell">
                      <span className={styles.avatar} aria-hidden="true">
                        {initial(c.name)}
                      </span>
                      <span className={styles.clientName}>{c.name}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellOrders}`} role="cell" data-label="Замовлень">
                      {c.ordersCount}
                    </div>
                    <div className={`${styles.cell} ${styles.cellSum}`} role="cell" data-label="Сума">
                      {priceFormat.format(c.totalSpent)} ₴
                    </div>
                    <div className={`${styles.cell} ${styles.cellLast}`} role="cell" data-label="Останнє">
                      {formatDate(c.lastOrder)}
                    </div>

                    <div className={`${styles.cell} ${styles.cellSegment}`} role="cell">
                      <span className={`${styles.segment} ${SEGMENT_CLASS[c.segment]}`}>
                        {SEGMENT_LABEL[c.segment]}
                      </span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellAction}`} role="cell">
                      <button type="button" className={styles.promoBtn} onClick={() => handlePromo(c)}>
                        Надіслати промокод
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