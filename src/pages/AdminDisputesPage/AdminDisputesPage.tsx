import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminDisputesPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = false;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

export default function AdminDisputesPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  // Пускаем только администратора
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Спори</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Спори</h1>

            <p className={styles.empty}>
              Система розгляду спорів поки недоступна — на бекенді ще немає сутності для
              претензій між покупцем і продавцем.
            </p>
          </main>
        </div>
      </div>

      <div className={styles.siteChrome}>
        <Footer />
      </div>
    </div>
  );
}