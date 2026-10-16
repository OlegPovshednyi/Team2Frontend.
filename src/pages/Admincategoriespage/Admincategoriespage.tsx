import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AdminSidebar from '../../components/Adminsidebar/Adminsidebar';
import styles from './AdminCategoriesPage.module.css';

// TODO: поставить false, когда появится бэкенд (или удалить флажок вместе с DEV_USER)
const DEV_SKIP_AUTH = true;
const DEV_USER = { name: 'Тест Адмін', role: 'admin' };

const DEFAULT_COMMISSION = 10; // комиссия для новой категории, %

interface Category {
  id: number;
  name: string;
  productsCount: number;
}

// TODO(бэк): заменить моки на данные с сервера
const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Електроніка', productsCount: 12 },
  { id: 2, name: 'Дім і кухня', productsCount: 11 },
  { id: 3, name: 'Одяг і взуття', productsCount: 5 },
  { id: 4, name: 'Краса і здоров’я', productsCount: 3 },
  { id: 5, name: 'Спорт і відпочинок', productsCount: 3 },
  { id: 6, name: 'Дитячі товари', productsCount: 2 },
  { id: 7, name: 'Зоотовари', productsCount: 2 },
  { id: 8, name: 'Автотовари', productsCount: 2 },
];

// Комиссии храним как строки, чтобы поле можно было временно очистить при вводе
const INITIAL_COMMISSIONS: Record<number, string> = {
  1: '6',
  2: '10',
  3: '12',
  4: '12',
  5: '9',
  6: '10',
  7: '10',
  8: '8',
};

/** 1 товар, 2–4 товари, 5+ товарів */
function productsLabel(n: number): string {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return `${n} товар`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} товари`;
  return `${n} товарів`;
}

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export default function AdminCategoriesPage() {
  const { user: authUser } = useAuth();
  const user = DEV_SKIP_AUTH ? DEV_USER : authUser;

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [commissions, setCommissions] = useState<Record<number, string>>(INITIAL_COMMISSIONS);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');
  const [treeError, setTreeError] = useState('');

  const [commMsg, setCommMsg] = useState('');
  const [commErr, setCommErr] = useState('');

  // Пускаем только администратора
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  /* ── Дерево категорий ── */
  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (categories.some((c) => sameName(c.name, name))) {
      setTreeError('Категорія з такою назвою вже існує');
      return;
    }
    // TODO(бэк): создать категорию на сервере и взять id из ответа
    const id = Date.now();
    setCategories((list) => [...list, { id, name, productsCount: 0 }]);
    setCommissions((c) => ({ ...c, [id]: String(DEFAULT_COMMISSION) }));
    setNewName('');
    setTreeError('');
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setDraftName(c.name);
    setTreeError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTreeError('');
  };

  const handleRename = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = draftName.trim();
    if (!name) {
      setTreeError('Назва не може бути порожньою');
      return;
    }
    if (categories.some((c) => c.id !== editingId && sameName(c.name, name))) {
      setTreeError('Категорія з такою назвою вже існує');
      return;
    }
    // TODO(бэк): отправить новое название на сервер
    setCategories((list) => list.map((c) => (c.id === editingId ? { ...c, name } : c)));
    setEditingId(null);
    setTreeError('');
  };

  /* ── Комиссии ── */
  const handleCommissionChange = (id: number, value: string) => {
    setCommissions((c) => ({ ...c, [id]: value }));
    setCommMsg('');
    setCommErr('');
  };

  const handleSaveCommissions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invalid = categories.some((c) => {
      const raw = commissions[c.id];
      const n = Number(raw);
      return raw === undefined || raw.trim() === '' || Number.isNaN(n) || n < 0 || n > 100;
    });
    if (invalid) {
      setCommMsg('');
      setCommErr('Комісія має бути числом від 0 до 100%');
      return;
    }
    // TODO(бэк): отправить commissions на сервер
    setCommErr('');
    setCommMsg('Зміни збережено');
  };

  return (
    <div className={styles.page}>
      <div className={styles.siteChrome}>
        <Header />
      </div>

      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Головна</Link> / <span>Адмінпанель</span> / <span>Категорії</span>
        </nav>

        <div className={styles.greenArea}>
          <AdminSidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Категорії каталогу</h1>

            <div className={styles.grid}>
              {/* ── Дерево категорій ── */}
              <section className={styles.col}>
                <h2 className={styles.sectionTitle}>Дерево категорій</h2>
                <div className={styles.card}>
                  <ul className={styles.list}>
                    {categories.map((c) => (
                      <li key={c.id} className={styles.row}>
                        {editingId === c.id ? (
                          <form className={styles.editForm} onSubmit={handleRename}>
                            <input
                              className={styles.textInput}
                              value={draftName}
                              onChange={(e) => setDraftName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
                              aria-label="Нова назва категорії"
                              autoFocus
                            />
                            <button type="submit" className={styles.primaryBtn}>
                              ОК
                            </button>
                            <button type="button" className={styles.ghostBtn} onClick={cancelEdit}>
                              Скасувати
                            </button>
                          </form>
                        ) : (
                          <>
                            <span className={styles.name}>{c.name}</span>
                            <span className={styles.count}>{productsLabel(c.productsCount)}</span>
                            <button
                              type="button"
                              className={styles.linkBtn}
                              onClick={() => startEdit(c)}
                              aria-label={`Змінити категорію ${c.name}`}
                            >
                              Змінити
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  <form className={styles.addForm} onSubmit={handleAdd}>
                    <input
                      className={styles.textInput}
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value);
                        setTreeError('');
                      }}
                      placeholder="Нова категорія"
                      aria-label="Нова категорія"
                    />
                    <button type="submit" className={styles.primaryBtn} disabled={!newName.trim()}>
                      Додати
                    </button>
                  </form>

                  {treeError && (
                    <p className={styles.msgErr} role="alert">
                      {treeError}
                    </p>
                  )}
                </div>
              </section>

              {/* ── Комісії за категоріями ── */}
              <section className={styles.col}>
                <h2 className={styles.sectionTitle}>Комісії за категоріями</h2>
                <form className={styles.card} onSubmit={handleSaveCommissions}>
                  <ul className={styles.list}>
                    {categories.map((c) => (
                      <li key={c.id} className={styles.row}>
                        <span className={styles.name}>{c.name}</span>
                        <span className={styles.percentWrap}>
                          <input
                            className={styles.percentInput}
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={100}
                            step="any"
                            value={commissions[c.id] ?? ''}
                            onChange={(e) => handleCommissionChange(c.id, e.target.value)}
                            aria-label={`Комісія для ${c.name}, %`}
                          />
                          <span className={styles.percentSign} aria-hidden="true">
                            %
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.saveRow}>
                    <button type="submit" className={styles.primaryBtn}>
                      Зберегти
                    </button>
                    {commMsg && (
                      <span className={styles.msgOk} role="status">
                        {commMsg}
                      </span>
                    )}
                    {commErr && (
                      <span className={styles.msgErr} role="alert">
                        {commErr}
                      </span>
                    )}
                  </div>
                </form>
              </section>
            </div>
          </main>
        </div>
      </div>

      <div className={styles.siteChrome}>
        <Footer />
      </div>
    </div>
  );
}