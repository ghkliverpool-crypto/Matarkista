import { useState, useEffect, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Settu inn þínar Supabase upplýsingar hér:
const SUPABASE_URL = "https://hmorgmxjcxyeawbiucyw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jEH66k44WA5ONh2TrEhejQ_3DahiTU5";

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
async function supabase(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${options.token || SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error_description || res.statusText);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function authRequest(endpoint, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Villa");
  return data;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F5F0E8;
    --warm-white: #FBF8F3;
    --sand: #E8DFD0;
    --tan: #C9B89A;
    --brown: #8B6F47;
    --dark-brown: #4A3728;
    --forest: #5C7A5A;
    --rust: #A85C3A;
    --text: #2C1F14;
    --text-muted: #7A6555;
    --border: rgba(139,111,71,0.2);
    --shadow: 0 2px 20px rgba(74,55,40,0.08);
    --shadow-lg: 0 8px 40px rgba(74,55,40,0.15);
  }

  body { font-family: 'Jost', sans-serif; background: var(--cream); color: var(--text); }

  h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 600; }

  .app { min-height: 100vh; }

  /* NAV */
  nav {
    background: var(--warm-white);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 64px; position: sticky; top: 0; z-index: 100;
    box-shadow: var(--shadow);
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-style: italic;
    color: var(--dark-brown); text-decoration: none;
    letter-spacing: 0.02em;
  }
  .nav-logo span { color: var(--rust); }
  .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
  .btn {
    padding: 0.5rem 1.25rem; border-radius: 2px; border: none;
    cursor: pointer; font-family: 'Jost', sans-serif;
    font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.2s; font-weight: 500;
  }
  .btn-primary { background: var(--dark-brown); color: var(--cream); }
  .btn-primary:hover { background: var(--brown); }
  .btn-ghost {
    background: transparent; color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--brown); color: var(--brown); }
  .btn-sm { padding: 0.35rem 0.9rem; font-size: 0.78rem; }
  .btn-danger { background: var(--rust); color: white; }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, var(--dark-brown) 0%, #6B4C38 100%);
    color: var(--cream); padding: 5rem 2rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hero h1 { font-size: 3.5rem; font-style: italic; margin-bottom: 1rem; }
  .hero p { font-size: 1.1rem; opacity: 0.8; font-weight: 300; }

  /* MAIN */
  .main { max-width: 1200px; margin: 0 auto; padding: 2rem; }

  /* FILTERS */
  .filters {
    display: flex; gap: 0.75rem; flex-wrap: wrap;
    margin-bottom: 2rem; align-items: center;
  }
  .filter-btn {
    padding: 0.4rem 1rem; border-radius: 20px;
    border: 1px solid var(--border); background: var(--warm-white);
    cursor: pointer; font-size: 0.82rem; color: var(--text-muted);
    transition: all 0.2s; font-family: 'Jost', sans-serif;
    letter-spacing: 0.05em;
  }
  .filter-btn.active, .filter-btn:hover {
    background: var(--dark-brown); color: var(--cream); border-color: transparent;
  }
  .search-wrap { margin-left: auto; }
  .search-input {
    padding: 0.4rem 1rem; border: 1px solid var(--border);
    border-radius: 20px; background: var(--warm-white);
    font-family: 'Jost', sans-serif; font-size: 0.85rem;
    color: var(--text); width: 220px;
  }
  .search-input:focus { outline: none; border-color: var(--brown); }

  /* GRID */
  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* CARD */
  .recipe-card {
    background: var(--warm-white); border-radius: 4px;
    overflow: hidden; box-shadow: var(--shadow);
    transition: transform 0.25s, box-shadow 0.25s; cursor: pointer;
    border: 1px solid var(--border);
  }
  .recipe-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .card-img {
    width: 100%; height: 200px; object-fit: cover;
    background: var(--sand); display: flex; align-items: center;
    justify-content: center; color: var(--tan); font-size: 3rem;
  }
  .card-img img { width: 100%; height: 100%; object-fit: cover; }
  .card-body { padding: 1.25rem; }
  .card-cat {
    font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--rust); font-weight: 500; margin-bottom: 0.4rem;
  }
  .card-title { font-size: 1.35rem; margin-bottom: 0.5rem; line-height: 1.3; }
  .card-meta {
    display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted);
    margin-bottom: 0.75rem;
  }
  .card-meta span { display: flex; align-items: center; gap: 0.3rem; }
  .stars { color: var(--brown); letter-spacing: -2px; font-size: 0.9rem; }
  .rating-info { font-size: 0.78rem; color: var(--text-muted); }

  /* MODAL OVERLAY */
  .overlay {
    position: fixed; inset: 0; background: rgba(44,31,20,0.6);
    z-index: 200; display: flex; align-items: flex-start;
    justify-content: center; padding: 2rem 1rem; overflow-y: auto;
    backdrop-filter: blur(3px);
  }
  .modal {
    background: var(--warm-white); width: 100%; max-width: 720px;
    border-radius: 4px; overflow: hidden; position: relative;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .modal-close {
    position: absolute; top: 1rem; right: 1rem; z-index: 10;
    background: rgba(255,255,255,0.9); border: none; cursor: pointer;
    width: 36px; height: 36px; border-radius: 50%; font-size: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted); transition: all 0.2s;
  }
  .modal-close:hover { background: white; color: var(--text); }
  .modal-hero-img {
    width: 100%; height: 300px; object-fit: cover;
    background: var(--sand); display: flex; align-items: center;
    justify-content: center; color: var(--tan); font-size: 4rem;
  }
  .modal-hero-img img { width: 100%; height: 100%; object-fit: cover; }
  .modal-body { padding: 2rem; }
  .modal-cat {
    font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--rust); font-weight: 500; margin-bottom: 0.5rem;
  }
  .modal-title { font-size: 2.2rem; margin-bottom: 0.75rem; }
  .modal-meta {
    display: flex; gap: 1.5rem; flex-wrap: wrap;
    font-size: 0.85rem; color: var(--text-muted);
    padding: 1rem 0; border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border); margin: 1rem 0;
  }
  .modal-meta span { display: flex; align-items: center; gap: 0.4rem; }
  .modal-desc { color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.7; }
  .section-title {
    font-size: 1.3rem; font-style: italic; margin-bottom: 0.75rem;
    color: var(--dark-brown);
  }
  .ingredients-list {
    list-style: none; margin-bottom: 1.5rem;
  }
  .ingredients-list li {
    padding: 0.45rem 0; border-bottom: 1px solid var(--border);
    font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .ingredients-list li::before {
    content: '·'; color: var(--rust); font-size: 1.2rem; line-height: 1;
  }
  .steps-list { list-style: none; margin-bottom: 1.5rem; }
  .steps-list li {
    padding: 0.75rem 0 0.75rem 2.5rem; border-bottom: 1px solid var(--border);
    position: relative; font-size: 0.9rem; line-height: 1.6;
  }
  .steps-list li::before {
    content: attr(data-n); position: absolute; left: 0; top: 0.75rem;
    font-family: 'Cormorant Garamond', serif; font-size: 1.3rem;
    color: var(--tan); font-weight: 600;
  }

  /* REVIEWS */
  .reviews-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
  .review-form { background: var(--cream); padding: 1.25rem; border-radius: 4px; margin-bottom: 1.5rem; }
  .star-picker { display: flex; gap: 0.25rem; margin-bottom: 0.75rem; }
  .star-btn {
    background: none; border: none; font-size: 1.5rem; cursor: pointer;
    color: var(--tan); transition: color 0.1s; padding: 0;
  }
  .star-btn.active { color: var(--brown); }
  .review-textarea {
    width: 100%; padding: 0.75rem; border: 1px solid var(--border);
    border-radius: 2px; background: var(--warm-white);
    font-family: 'Jost', sans-serif; font-size: 0.9rem; resize: vertical;
    min-height: 80px; color: var(--text);
  }
  .review-textarea:focus { outline: none; border-color: var(--brown); }
  .review-item {
    padding: 1rem 0; border-bottom: 1px solid var(--border);
  }
  .review-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0.4rem;
  }
  .reviewer-name { font-weight: 500; font-size: 0.9rem; }
  .review-date { font-size: 0.75rem; color: var(--text-muted); }
  .review-text { font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; }

  /* AUTH MODAL */
  .auth-modal { max-width: 420px; padding: 2.5rem; }
  .auth-title { font-size: 2rem; font-style: italic; margin-bottom: 0.5rem; text-align: center; }
  .auth-sub { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 2rem; }
  .form-group { margin-bottom: 1rem; }
  .form-label {
    display: block; font-size: 0.78rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem;
  }
  .form-input {
    width: 100%; padding: 0.65rem 1rem; border: 1px solid var(--border);
    border-radius: 2px; background: var(--cream);
    font-family: 'Jost', sans-serif; font-size: 0.9rem; color: var(--text);
  }
  .form-input:focus { outline: none; border-color: var(--brown); }
  .form-select {
    width: 100%; padding: 0.65rem 1rem; border: 1px solid var(--border);
    border-radius: 2px; background: var(--cream);
    font-family: 'Jost', sans-serif; font-size: 0.9rem; color: var(--text);
  }
  .form-textarea {
    width: 100%; padding: 0.65rem 1rem; border: 1px solid var(--border);
    border-radius: 2px; background: var(--cream);
    font-family: 'Jost', sans-serif; font-size: 0.9rem; color: var(--text);
    resize: vertical; min-height: 80px;
  }
  .form-textarea:focus, .form-select:focus { outline: none; border-color: var(--brown); }
  .auth-switch {
    text-align: center; margin-top: 1.25rem;
    font-size: 0.85rem; color: var(--text-muted);
  }
  .auth-switch button {
    background: none; border: none; color: var(--rust); cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 0.85rem; text-decoration: underline;
  }
  .error-msg {
    background: #FDF0EC; border: 1px solid #E8B4A0; color: var(--rust);
    padding: 0.65rem 1rem; border-radius: 2px; font-size: 0.85rem; margin-bottom: 1rem;
  }
  .success-msg {
    background: #EEF4EE; border: 1px solid #A8C4A8; color: var(--forest);
    padding: 0.65rem 1rem; border-radius: 2px; font-size: 0.85rem; margin-bottom: 1rem;
  }

  /* ADD RECIPE */
  .add-recipe-modal { max-width: 680px; padding: 2.5rem; }
  .add-title { font-size: 2rem; font-style: italic; margin-bottom: 2rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .ingredient-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
  .ingredient-row .form-input { flex: 1; }
  .add-row-btn {
    background: none; border: 1px dashed var(--border); border-radius: 2px;
    padding: 0.5rem; cursor: pointer; color: var(--text-muted); font-size: 0.85rem;
    width: 100%; margin-top: 0.5rem; font-family: 'Jost', sans-serif;
    transition: all 0.2s;
  }
  .add-row-btn:hover { border-color: var(--brown); color: var(--brown); }
  .remove-btn {
    background: none; border: none; cursor: pointer; color: var(--tan);
    font-size: 1.1rem; padding: 0 0.25rem; transition: color 0.2s;
  }
  .remove-btn:hover { color: var(--rust); }

  /* UPLOAD / JSON */
  .json-paste-area {
    width: 100%; padding: 0.75rem; border: 1px dashed var(--border);
    border-radius: 2px; background: var(--cream); min-height: 120px;
    font-family: 'Jost', sans-serif; font-size: 0.82rem; resize: vertical;
    color: var(--text);
  }

  /* TOAST */
  .toast {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
    background: var(--dark-brown); color: var(--cream);
    padding: 0.75rem 1.5rem; border-radius: 2px; font-size: 0.88rem;
    animation: fadeIn 0.3s ease;
    box-shadow: var(--shadow-lg);
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

  .loading { text-align: center; padding: 4rem; color: var(--text-muted); font-style: italic; }
  .empty { text-align: center; padding: 4rem; color: var(--text-muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .gap-1 { gap: 0.5rem; }
  .user-badge {
    font-size: 0.82rem; color: var(--text-muted);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .user-badge strong { color: var(--dark-brown); }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Stars({ rating, max = 5 }) {
  return (
    <span className="stars">
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

function Toast({ msg }) {
  return <div className="toast">{msg}</div>;
}

const CATEGORIES = ["Allt", "Forréttur", "Aðalréttur", "Meðlæti", "Súpa", "Eftirrétt", "Bakkelsi", "Drykkur"];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home"); // home | auth | add | recipe
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("Allt");
  const [search, setSearch] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Load session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("uppskriftir_session");
    if (saved) {
      const { user: u, access_token } = JSON.parse(saved);
      setUser(u); setToken(access_token);
    }
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    try {
      const data = await supabase("/recipes?select=*&order=created_at.desc");
      setRecipes(data || []);
    } catch (e) {
      // Demo mode - show sample data
      setRecipes(DEMO_RECIPES);
    }
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("uppskriftir_session");
    setUser(null); setToken(null);
    showToast("Útskráðu þig!");
  }

  const filtered = recipes.filter(r => {
    const matchCat = filter === "Allt" || r.category === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav>
          <span className="nav-logo" onClick={() => setView("home")} style={{ cursor: "pointer" }}>
            eldhús<span>·</span>mín
          </span>
          <div className="nav-actions">
            {user ? (
              <>
                <span className="user-badge">Innskráð(ur) sem <strong>{user.email?.split("@")[0]}</strong></span>
                <button className="btn btn-primary btn-sm" onClick={() => setView("add")}>+ Uppskrift</button>
                <button className="btn btn-ghost btn-sm" onClick={logout}>Útskrá</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setView("auth")}>Innskrá</button>
                <button className="btn btn-primary btn-sm" onClick={() => setView("auth")}>Nýskrá</button>
              </>
            )}
          </div>
        </nav>

        {view === "home" && (
          <>
            <div className="hero">
              <h1>Uppskriftasafn fjölskyldunnar</h1>
              <p>Góðar uppskriftir, geymdar á einum stað — deilt með þeim sem skipta máli.</p>
            </div>
            <div className="main">
              <div className="filters">
                {CATEGORIES.map(c => (
                  <button key={c} className={`filter-btn ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
                ))}
                <div className="search-wrap">
                  <input className="search-input" placeholder="🔍 Leita..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              {loading ? (
                <div className="loading">Hleð uppskriftum...</div>
              ) : filtered.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🍽️</div>
                  <p>Engar uppskriftir fundust.</p>
                  {user && <button className="btn btn-primary mt-2" onClick={() => setView("add")}>Bæta við fyrstu uppskrift</button>}
                </div>
              ) : (
                <div className="recipe-grid">
                  {filtered.map(r => (
                    <RecipeCard key={r.id} recipe={r} onClick={() => { setSelectedRecipe(r); setView("recipe"); }} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {view === "auth" && (
          <div className="overlay" onClick={() => setView("home")}>
            <div className="modal auth-modal" onClick={e => e.stopPropagation()}>
              <AuthForm onSuccess={(u, t) => {
                setUser(u); setToken(t);
                localStorage.setItem("uppskriftir_session", JSON.stringify({ user: u, access_token: t }));
                setView("home"); showToast("Velkomin(n)!");
              }} />
            </div>
          </div>
        )}

        {view === "add" && user && (
          <div className="overlay" onClick={() => setView("home")}>
            <div className="modal add-recipe-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setView("home")}>✕</button>
              <AddRecipeForm token={token} userId={user.id} onSuccess={() => {
                setView("home"); fetchRecipes(); showToast("Uppskrift bætt við!");
              }} />
            </div>
          </div>
        )}

        {view === "recipe" && selectedRecipe && (
          <div className="overlay" onClick={() => setView("home")}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setView("home")}>✕</button>
              <RecipeDetail
                recipe={selectedRecipe} token={token} user={user}
                onUpdate={fetchRecipes}
                showToast={showToast}
              />
            </div>
          </div>
        )}

        {toast && <Toast msg={toast} />}
      </div>
    </>
  );
}

// ─── RECIPE CARD ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onClick }) {
  const avg = recipe.avg_rating || 0;
  const count = recipe.review_count || 0;
  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="card-img">
        {recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} /> : "🍴"}
      </div>
      <div className="card-body">
        <div className="card-cat">{recipe.category}</div>
        <h3 className="card-title">{recipe.title}</h3>
        <div className="card-meta">
          {recipe.prep_time && <span>⏱ {recipe.prep_time} mín</span>}
          {recipe.servings && <span>👥 {recipe.servings} skammtar</span>}
        </div>
        {count > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Stars rating={avg} />
            <span className="rating-info">{avg.toFixed(1)} ({count} umsagnir)</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RECIPE DETAIL ────────────────────────────────────────────────────────────
function RecipeDetail({ recipe, token, user, onUpdate, showToast }) {
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadReviews(); }, [recipe.id]);

  async function loadReviews() {
    try {
      const data = await supabase(`/reviews?recipe_id=eq.${recipe.id}&select=*&order=created_at.desc`);
      setReviews(data || []);
    } catch { setReviews([]); }
  }

  async function submitReview() {
    if (!myRating) return;
    setSubmitting(true);
    try {
      await supabase("/reviews", {
        method: "POST", token,
        body: JSON.stringify({
          recipe_id: recipe.id, user_id: user.id,
          rating: myRating, comment: myReview,
          reviewer_name: user.email?.split("@")[0]
        })
      });
      setMyRating(0); setMyReview("");
      loadReviews(); onUpdate();
      showToast("Umsögn send!");
    } catch (e) { showToast("Villa: " + e.message); }
    setSubmitting(false);
  }

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : (recipe.ingredients || "").split("\n").filter(Boolean);
  const steps = Array.isArray(recipe.steps) ? recipe.steps : (recipe.steps || "").split("\n").filter(Boolean);

  return (
    <>
      <div className="modal-hero-img">
        {recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} /> : "🍴"}
      </div>
      <div className="modal-body">
        <div className="modal-cat">{recipe.category}</div>
        <h2 className="modal-title">{recipe.title}</h2>
        <div className="modal-meta">
          {recipe.prep_time && <span>⏱ Undirbúningstími: <strong>{recipe.prep_time} mín</strong></span>}
          {recipe.cook_time && <span>🔥 Eldunartími: <strong>{recipe.cook_time} mín</strong></span>}
          {recipe.servings && <span>👥 Skammtar: <strong>{recipe.servings}</strong></span>}
          {recipe.difficulty && <span>📊 Erfiðleiki: <strong>{recipe.difficulty}</strong></span>}
        </div>
        {recipe.description && <p className="modal-desc">{recipe.description}</p>}

        <h3 className="section-title">Hráefni</h3>
        <ul className="ingredients-list">
          {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>

        <h3 className="section-title">Leiðbeiningar</h3>
        <ol className="steps-list">
          {steps.map((step, i) => <li key={i} data-n={i + 1}>{step}</li>)}
        </ol>

        {recipe.notes && (
          <>
            <h3 className="section-title">Athugasemdir</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{recipe.notes}</p>
          </>
        )}

        <div className="reviews-section">
          <h3 className="section-title">Umsagnir ({reviews.length})</h3>

          {user ? (
            <div className="review-form">
              <p style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Gefðu einkunn</p>
              <div className="star-picker">
                {[1,2,3,4,5].map(n => (
                  <button key={n} className={`star-btn ${n <= (hover || myRating) ? "active" : ""}`}
                    onClick={() => setMyRating(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}>★</button>
                ))}
              </div>
              <textarea className="review-textarea" placeholder="Skrifaðu umsögn (valkvæmt)..."
                value={myReview} onChange={e => setMyReview(e.target.value)} />
              <button className="btn btn-primary btn-sm mt-1" onClick={submitReview} disabled={!myRating || submitting}>
                {submitting ? "Sendi..." : "Senda umsögn"}
              </button>
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              <em>Innskráðir notendur geta gefið uppskriftum einkunn.</em>
            </p>
          )}

          {reviews.map(r => (
            <div key={r.id} className="review-item">
              <div className="review-header">
                <span className="reviewer-name">{r.reviewer_name || "Nafnlaus"}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Stars rating={r.rating} />
                  <span className="review-date">{new Date(r.created_at).toLocaleDateString("is-IS")}</span>
                </div>
              </div>
              {r.comment && <p className="review-text">{r.comment}</p>}
            </div>
          ))}

          {reviews.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Engar umsagnir enn.</p>}
        </div>
      </div>
    </>
  );
}

// ─── AUTH FORM ────────────────────────────────────────────────────────────────
function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const data = await authRequest("token?grant_type=password", { email, password });
        onSuccess(data.user, data.access_token);
      } else {
        await authRequest("signup", { email, password, data: { full_name: name } });
        setMode("login");
        setError(""); // Show success
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  return (
    <>
      <h2 className="auth-title">{mode === "login" ? "Innskrá" : "Nýskrá"}</h2>
      <p className="auth-sub">{mode === "login" ? "Skráðu þig inn í uppskriftasafnið" : "Búðu til aðgang"}</p>
      {error && <div className="error-msg">{error}</div>}
      {mode === "register" && (
        <div className="form-group">
          <label className="form-label">Nafn</label>
          <input className="form-input" placeholder="Jón Jónsson" value={name} onChange={e => setName(e.target.value)} />
        </div>
      )}
      <div className="form-group">
        <label className="form-label">Netfang</label>
        <input className="form-input" type="email" placeholder="jon@example.is" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Lykilorð</label>
        <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()} />
      </div>
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit} disabled={loading}>
        {loading ? "Augnablik..." : mode === "login" ? "Innskrá" : "Stofna aðgang"}
      </button>
      <div className="auth-switch">
        {mode === "login" ? (
          <>Ertu ekki með aðgang? <button onClick={() => setMode("register")}>Nýskrá</button></>
        ) : (
          <>Ertu nú þegar með aðgang? <button onClick={() => setMode("login")}>Innskrá</button></>
        )}
      </div>
    </>
  );
}

// ─── ADD RECIPE FORM ──────────────────────────────────────────────────────────
function AddRecipeForm({ token, userId, onSuccess }) {
  const [tab, setTab] = useState("manual"); // manual | json
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "", category: "Aðalréttur", description: "",
    prep_time: "", cook_time: "", servings: "", difficulty: "Miðlungs",
    image_url: "", notes: "",
    ingredients: [""],
    steps: [""],
  });

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function setIng(i, v) { setForm(f => { const a = [...f.ingredients]; a[i] = v; return { ...f, ingredients: a }; }); }
  function addIng() { setForm(f => ({ ...f, ingredients: [...f.ingredients, ""] })); }
  function removeIng(i) { setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, j) => j !== i) })); }
  function setStep(i, v) { setForm(f => { const a = [...f.steps]; a[i] = v; return { ...f, steps: a }; }); }
  function addStep() { setForm(f => ({ ...f, steps: [...f.steps, ""] })); }
  function removeStep(i) { setForm(f => ({ ...f, steps: f.steps.filter((_, j) => j !== i) })); }

  async function submit(data) {
    setLoading(true);
    try {
      await supabase("/recipes", {
        method: "POST", token,
        body: JSON.stringify({ ...data, user_id: userId })
      });
      onSuccess();
    } catch (e) { alert("Villa: " + e.message); }
    setLoading(false);
  }

  function submitManual() {
    const data = {
      ...form,
      ingredients: form.ingredients.filter(Boolean),
      steps: form.steps.filter(Boolean),
      prep_time: form.prep_time ? parseInt(form.prep_time) : null,
      cook_time: form.cook_time ? parseInt(form.cook_time) : null,
      servings: form.servings ? parseInt(form.servings) : null,
    };
    submit(data);
  }

  function submitJson() {
    setJsonError("");
    try {
      const data = JSON.parse(jsonText);
      submit(data);
    } catch (e) { setJsonError("Ógilt JSON: " + e.message); }
  }

  const CLAUDE_PROMPT = `Búðu til uppskrift á JSON sniði með þessum reitunum:
{
  "title": "...",
  "category": "Aðalréttur",
  "description": "Stutt lýsing",
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4,
  "difficulty": "Miðlungs",
  "image_url": "",
  "ingredients": ["200g hveiti", "2 egg", "..."],
  "steps": ["Blandaðu hráefnin", "Steiktu í 10 mínútur", "..."],
  "notes": "Ráð og athugasemdir"
}`;

  return (
    <>
      <h2 className="add-title">Bæta við uppskrift</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button className={`filter-btn ${tab === "manual" ? "active" : ""}`} onClick={() => setTab("manual")}>Handvirkt</button>
        <button className={`filter-btn ${tab === "json" ? "active" : ""}`} onClick={() => setTab("json")}>Frá Claude (JSON)</button>
      </div>

      {tab === "json" && (
        <div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
            Biddu Claude um uppskrift með þessum fyrirmælum og límdu JSON niðurstöðuna hér:
          </p>
          <code style={{ display: "block", background: "var(--sand)", padding: "0.75rem", borderRadius: "2px", fontSize: "0.78rem", marginBottom: "1rem", whiteSpace: "pre-wrap" }}>{CLAUDE_PROMPT}</code>
          {jsonError && <div className="error-msg">{jsonError}</div>}
          <textarea className="json-paste-area" placeholder="Límdu JSON uppskrift hér..." value={jsonText} onChange={e => setJsonText(e.target.value)} />
          <button className="btn btn-primary mt-2" onClick={submitJson} disabled={loading || !jsonText.trim()}>
            {loading ? "Hleð inn..." : "Vista uppskrift"}
          </button>
        </div>
      )}

      {tab === "manual" && (
        <div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Heiti uppskriftar *</label>
              <input className="form-input" value={form.title} onChange={e => setField("title", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Flokkur</label>
              <select className="form-select" value={form.category} onChange={e => setField("category", e.target.value)}>
                {CATEGORIES.filter(c => c !== "Allt").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Lýsing</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setField("description", e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Undirbúningstími (mín)</label>
              <input className="form-input" type="number" value={form.prep_time} onChange={e => setField("prep_time", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Eldunartími (mín)</label>
              <input className="form-input" type="number" value={form.cook_time} onChange={e => setField("cook_time", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Skammtar</label>
              <input className="form-input" type="number" value={form.servings} onChange={e => setField("servings", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Erfiðleiki</label>
              <select className="form-select" value={form.difficulty} onChange={e => setField("difficulty", e.target.value)}>
                <option>Auðvelt</option><option>Miðlungs</option><option>Erfitt</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Myndarslóð (URL)</label>
            <input className="form-input" placeholder="https://..." value={form.image_url} onChange={e => setField("image_url", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hráefni</label>
            {form.ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row">
                <input className="form-input" placeholder={`Hráefni ${i + 1}`} value={ing} onChange={e => setIng(i, e.target.value)} />
                {form.ingredients.length > 1 && <button className="remove-btn" onClick={() => removeIng(i)}>✕</button>}
              </div>
            ))}
            <button className="add-row-btn" onClick={addIng}>+ Bæta við hráefni</button>
          </div>
          <div className="form-group">
            <label className="form-label">Leiðbeiningar</label>
            {form.steps.map((step, i) => (
              <div key={i} className="ingredient-row">
                <input className="form-input" placeholder={`Skref ${i + 1}`} value={step} onChange={e => setStep(i, e.target.value)} />
                {form.steps.length > 1 && <button className="remove-btn" onClick={() => removeStep(i)}>✕</button>}
              </div>
            ))}
            <button className="add-row-btn" onClick={addStep}>+ Bæta við skrefi</button>
          </div>
          <div className="form-group">
            <label className="form-label">Athugasemdir / Ráð</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => setField("notes", e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={submitManual} disabled={loading || !form.title}>
            {loading ? "Vista..." : "Vista uppskrift"}
          </button>
        </div>
      )}
    </>
  );
}

// ─── DEMO DATA (used if Supabase not configured) ───────────────────────────────
const DEMO_RECIPES = [
  {
    id: 1, title: "Lambakjöt í ofni", category: "Aðalréttur",
    description: "Klassískt íslenskt lambakjöt, meyrt og ilmandi.",
    prep_time: 20, cook_time: 120, servings: 6, difficulty: "Auðvelt",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    ingredients: ["1,5 kg lambakjöt", "4 hvítlauksrif", "2 msk rósmarín", "Salt og pipar", "3 msk ólífuolía"],
    steps: ["Hitaðu ofn í 180°C.", "Kryddaðu kjötið vel með salti, pipar og rósmarín.", "Settu hvítlauk í gat á kjötinu.", "Steiktu í 2 klukkustundir."],
    notes: "Berið fram með kartöflum og rauðkáli.",
    avg_rating: 4.8, review_count: 12
  },
  {
    id: 2, title: "Skyr með berjaleggi", category: "Eftirrétt",
    description: "Einfaldur og hollur eftirrétt.",
    prep_time: 10, cook_time: 0, servings: 4, difficulty: "Auðvelt",
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
    ingredients: ["500g skyr", "200g bláberjum", "4 msk hunang", "Vanilludropar"],
    steps: ["Settu skyr í skál.", "Bættu við berjaleggi og hunangi.", "Skreyttu með ferskum berjum."],
    avg_rating: 4.5, review_count: 8
  },
  {
    id: 3, title: "Humarsúpa", category: "Súpa",
    description: "Rík og kremósa humarsúpa.",
    prep_time: 15, cook_time: 30, servings: 4, difficulty: "Miðlungs",
    image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    ingredients: ["400g humar", "2 dl rjómi", "1 laukur", "2 hvítlauksrif", "Koníak"],
    steps: ["Steiktu lauk og hvítlauk.", "Bættu við humar og koníak.", "Helltu rjóma út í og sjóðið í 20 mínútur.", "Blandaðu og kryddaðu."],
    avg_rating: 4.9, review_count: 15
  },
];
