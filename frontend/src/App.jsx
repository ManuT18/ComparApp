import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import PriceTable from './components/PriceTable';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Apply theme on load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      // Connects to local express backend on port 3001
      const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="brand">
          <h1>Analizador de Precios</h1>
          <p>Supermercados en Bahía Blanca: Cooperativa Obrera, Vea y Chango Más</p>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </header>

      <main className="glass-panel" style={{ padding: '2rem' }}>
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        
        {loading ? (
          <div className="loading-state">Buscando los mejores precios... esto puede demorar unos segundos.</div>
        ) : hasSearched ? (
           <PriceTable data={results} />
        ) : (
          <div className="empty-state">Ingresa un producto (ej. "leche", "fideos", "harina") para comparar precios.</div>
        )}
      </main>
    </div>
  );
}

export default App;
