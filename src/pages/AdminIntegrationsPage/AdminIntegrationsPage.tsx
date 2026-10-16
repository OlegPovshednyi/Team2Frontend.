import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminIntegrationsPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

type IntegrationStatus = 'active' | 'testing';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  statusLabel?: string; // свой текст бейджа, например "2 підключення"
}

interface IntegrationGroup {
  title: string;
  items: Integration[];
}

const STATUS_LABEL: Record<IntegrationStatus, string> = {
  active: 'Активна',
  testing: 'Тестування',
};

const STATUS_CLASS: Record<IntegrationStatus, string> = {
  active: styles.badgeOk,
  testing: styles.badgeWarn,
};

// TODO(бэк): заменить моки на данные с сервера
const GROUPS: IntegrationGroup[] = [
  {
    title: 'Платежі',
    items: [
      { id: 'liqpay', name: 'LiqPay', description: 'Еквайринг, 1,3%', status: 'active' },
      { id: 'wallets', name: 'Apple Pay / Google Pay', description: 'Резервний провайдер', status: 'active' },
      { id: 'banks', name: 'Партнерські банки', description: 'Розстрочка й кредит', status: 'testing' },
    ],
  },
  {
    title: 'Логістика',
    items: [
      { id: 'novaposhta', name: 'Нова Пошта', description: 'ТТН, статуси, поштомати', status: 'active' },
      { id: 'ukrposhta', name: 'Укрпошта API', description: 'ТТН і трекінг', status: 'active' },
      { id: 'blitzexpress', name: 'BlitzExpress', description: 'Власна кур’єрська служба', status: 'active' },
    ],
  },
  {
    title: 'Бізнес-системи',
    items: [
      { id: 'crm', name: 'CRM', description: 'Люди та звернення', status: 'active' },
      { id: '1c', name: '1С / BAS', description: 'Залишки й номенклатура', status: 'active' },
      { id: 'erp', name: 'ERP партнерів', description: 'Обмін замовленнями', status: 'active', statusLabel: '2 підключення' },
    ],
  },
  {
    title: 'Комунікації та соцмережі',
    items: [
      { id: 'sms', name: 'SMS-шлюз', description: 'Коди та статуси', status: 'active' },
      // TODO: в макеті блок обрізаний — уточнити назву, опис і статус
      { id: 'telegram', name: 'Telegram-бот', description: 'Сповіщення та підтримка', status: 'active' },
    ],
  },
];

export default function AdminIntegrationsPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleConfigure = (item: Integration) => {
    // TODO: открыть настройки интеграции (макета пока нет)
    void item;
  };

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Інтеграції</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Інтеграції</h1>

            {GROUPS.map((group) => (
              <section key={group.title} className={styles.group}>
                <h2 className={styles.sectionTitle}>{group.title}</h2>
                <ul className={styles.list}>
                  {group.items.map((item) => (
                    <li key={item.id} className={styles.card}>
                      <div className={styles.cardHead}>
                        <h3 className={styles.cardName}>{item.name}</h3>
                        <span className={`${styles.badge} ${STATUS_CLASS[item.status]}`}>
                          {item.statusLabel ?? STATUS_LABEL[item.status]}
                        </span>
                      </div>
                      <p className={styles.desc}>{item.description}</p>
                      <button
                        type="button"
                        className={styles.outlineBtn}
                        onClick={() => handleConfigure(item)}
                        aria-label={`Налаштувати: ${item.name}`}
                      >
                        Налаштувати
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </main>
        </div>
      </div>

      <div className={styles.siteChrome}>
        <Footer />
      </div>
    </div>
  );
}