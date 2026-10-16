import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerAdsPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

type CampaignStatus = 'active' | 'paused';

interface Campaign {
  id: number;
  name: string;
  status: CampaignStatus;
  budget: string; // текст бюджета: "₴ 3 000 / тиж" или "без бюджету"
  result: string; // главный показатель: CTR или рост продаж
}

// TODO(бэк): заменить моки на данные с сервера
const CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Баннер на головній', status: 'active', budget: '₴ 3 000 / тиж', result: 'CTR 1,8%' },
  { id: 2, name: 'Просування в пошуку', status: 'paused', budget: '₴ 1 200 / тиж', result: 'CTR 4,2%' },
  { id: 3, name: 'Знижка-акція “-15%”', status: 'active', budget: 'без бюджету', result: '+38% продажів' },
];

const STATUS_LABEL: Record<CampaignStatus, string> = {
  active: 'Активна',
  paused: 'Пауза',
};

export default function SellerAdsPage() {
     const user = { name: 'Тест Продавець', role: 'seller' }; // TODO: убрать, когда появится бэкенд

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const handleManage = (id: number) => {
    // TODO: открыть управление кампанией (редактирование, пауза, удаление)
    console.log('manage campaign', id);
  };

  const handleCreate = () => {
    // TODO: открыть форму создания новой кампании
    console.log('create campaign');
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Реклама</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Рекламні компанії</h1>

            <div className={styles.cards}>
              {CAMPAIGNS.map((c) => (
                <div key={c.id} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardName}>{c.name}</span>
                    <span
                      className={`${styles.badge} ${
                        c.status === 'active' ? styles.badgeActive : styles.badgePaused
                      }`}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </div>

                  <span className={styles.budget}>{c.budget}</span>
                  <span className={styles.result}>{c.result}</span>

                  <button
                    type="button"
                    className={styles.manageBtn}
                    onClick={() => handleManage(c.id)}
                  >
                    Керувати
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className={styles.createBtn} onClick={handleCreate}>
              + Нова компанія
            </button>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}