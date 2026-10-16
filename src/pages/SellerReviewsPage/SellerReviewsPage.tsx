import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SellerReviewsPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SellerSidebar from '../../components/Sellersidebar/Sellersidebar';

interface SellerReview {
  id: number;
  author: string;
  product: string;
  rating: number; // 1..5
  text: string;
  reply?: string; // если есть, ответ уже дан
}

// TODO(бэк): заменить моки на данные с сервера
const INITIAL_REVIEWS: SellerReview[] = [
  {
    id: 1,
    author: 'Олена К.',
    product: 'Бездротові навушники BlitzAir',
    rating: 5,
    text: 'Шумозаглушення реально працює. Заряд тримає тиждень.',
    reply: 'Дякуємо за відгук!',
  },
  {
    id: 2,
    author: 'Ігор М.',
    product: 'Розумна колонка BlitzHome',
    rating: 3,
    text: 'Застосунок не бачить з першого разу.',
  },
];

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} aria-label={`Оцінка ${value} з 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? styles.starOn : styles.starOff}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function SellerReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<SellerReview[]>(INITIAL_REVIEWS);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" replace />;
  }

  const handleReply = (id: number) => {
    const text = (drafts[id] ?? '').trim();
    if (!text) return;

    // TODO(бэк): отправить ответ на сервер, например POST /seller/reviews/:id/reply
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text } : r)));
    setDrafts((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Кабінет продавця</span> / <span>Відгуки</span>
        </nav>

        <div className={styles.greenArea}>
          <SellerSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Відгуки покупців</h1>

            <div className={styles.list}>
              {reviews.map((r) => (
                <article key={r.id} className={styles.card}>
                  <div className={styles.head}>
                    <div className={styles.avatar}>{r.author.charAt(0).toUpperCase()}</div>
                    <div className={styles.headInfo}>
                      <span className={styles.author}>{r.author}</span>
                      <span className={styles.product}>{r.product}</span>
                    </div>
                    <Stars value={r.rating} />
                  </div>

                  <p className={styles.text}>{r.text}</p>

                  {r.reply ? (
                    <span className={styles.badge}>Відповідь надано</span>
                  ) : (
                    <div className={styles.replyRow}>
                      <input
                        className={styles.replyInput}
                        type="text"
                        placeholder="Ваша відповідь"
                        value={drafts[r.id] ?? ''}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleReply(r.id);
                        }}
                      />
                      <button
                        type="button"
                        className={styles.replyBtn}
                        onClick={() => handleReply(r.id)}
                        disabled={!(drafts[r.id] ?? '').trim()}
                      >
                        Відповісти
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}