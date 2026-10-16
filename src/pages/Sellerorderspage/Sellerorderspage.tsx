import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerOrdersPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

type OrderStatus = 'new' | 'picking' | 'shipping' | 'delivered' | 'canceled';

interface Order {
  id: string;       // номер замовлення
  date: string;     // ISO-дата, напр. '2026-08-26'
  buyer: string;
  city: string;
  total: number;    // сума в гривнях
  status: OrderStatus;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'Новий',
  picking: 'Комплектується',
  shipping: 'У дорозі',
  delivered: 'Доставлено',
  canceled: 'Скасовано',
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  new: styles.statusNew,
  picking: styles.statusPicking,
  shipping: styles.statusShipping,
  delivered: styles.statusDelivered,
  canceled: styles.statusCanceled,
};

// TODO(бэк): лучше определять по наличию номера ТТН в данных заказа, а не по статусу
const HAS_TTN: Record<OrderStatus, boolean> = {
  new: false,
  picking: false,
  shipping: true,
  delivered: true,
  canceled: true,
};

// TODO(бэк): заменить моки на данные с сервера
const ORDERS: Order[] = [
  { id: 'BM-104821', date: '2026-08-26', buyer: 'О. Коваль', city: 'Київ', total: 3530, status: 'picking' },
  { id: 'BM-104825', date: '2026-08-26', buyer: 'І. Мельник', city: 'Львів', total: 1530, status: 'new' },
  { id: 'BM-104818', date: '2026-08-26', buyer: 'О. Коваль', city: 'Київ', total: 3530, status: 'shipping' },
  { id: 'BM-104817', date: '2026-08-26', buyer: 'О. Коваль', city: 'Київ', total: 3530, status: 'delivered' },
  { id: 'BM-104816', date: '2026-08-26', buyer: 'О. Коваль', city: 'Київ', total: 3530, status: 'canceled' },
];

const priceFormat = new Intl.NumberFormat('uk-UA');
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });

export default function SellerOrdersPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const handleTtn = (order: Order) => {
    // TODO: HAS_TTN[order.status] ? открыть ТТН : создать ТТН (макета пока нет)
    void order;
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Замовлення</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Замовлення</h1>

            {ORDERS.length === 0 ? (
              <p className={styles.empty}>Замовлень поки немає. Нові замовлення з’являться тут.</p>
            ) : (
              <div className={styles.table} role="table" aria-label="Замовлення">
                {/* ── Заголовки (на планшете и телефоне скрыты) ── */}
                <div className={styles.head} role="row">
                  <span className={styles.headCellLeft} role="columnheader">Номер</span>
                  <span role="columnheader">Дата</span>
                  <span role="columnheader">Покупець</span>
                  <span role="columnheader">Місто</span>
                  <span role="columnheader">Сума</span>
                  <span role="columnheader">Статус</span>
                  <span className={styles.srOnly} role="columnheader">Дії</span>
                </div>

                {ORDERS.map((o) => (
                  <div key={o.id} className={styles.row} role="row">
                    <div className={styles.cellNumber} role="cell">
                      {o.id}
                    </div>
                    <div className={styles.cell} role="cell" data-label="Дата">
                      {formatDate(o.date)}
                    </div>
                    <div className={styles.cell} role="cell" data-label="Покупець">
                      {o.buyer}
                    </div>
                    <div className={styles.cell} role="cell" data-label="Місто">
                      {o.city}
                    </div>
                    <div className={`${styles.cell} ${styles.cellStrong}`} role="cell" data-label="Сума">
                      {priceFormat.format(o.total)} ₴
                    </div>

                    <div className={`${styles.cell} ${styles.cellStatus}`} role="cell">
                      <span className={`${styles.status} ${STATUS_CLASS[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    </div>

                    <div className={`${styles.cell} ${styles.cellAction}`} role="cell">
                      <button type="button" className={styles.ttnBtn} onClick={() => handleTtn(o)}>
                        {HAS_TTN[o.status] ? 'Переглянути ТТН' : 'Створити ТТН'}
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