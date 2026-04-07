import { useState } from 'react';
import SearchBar from './components/SearchBar';
import PriceTable from './components/PriceTable';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterMultiple, setFilterMultiple] = useState(false);
  const [excludeQuery, setExcludeQuery] = useState("");

  const displayResults = results.filter(item => {
    // Filtro por supermercados múltiples
    if (filterMultiple) {
      let count = 0;
      if (item.vea?.inStock && item.vea?.price !== null) count++;
      if (item.chango?.inStock && item.chango?.price !== null) count++;
      if (item.coope?.inStock && item.coope?.price !== null) count++;
      if (count < 2) return false;
    }
    
    // Filtro por palabras excluidas
    if (excludeQuery.trim()) {
      const negativeWords = excludeQuery.toLowerCase().split(/[\s,]+/).filter(w => w.length > 0);
      const combinedNames = `
        ${item.brand || ''} 
        ${item.vea?.name || ''} 
        ${item.chango?.name || ''} 
        ${item.coope?.name || ''}
      `.toLowerCase();
      
      const hasExcluded = negativeWords.some(word => combinedNames.includes(word));
      if (hasExcluded) return false;
    }
    
    return true;
  });

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
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

      </header>

      <main className="glass-panel" style={{ padding: '2rem' }}>
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        
        {results.length > 0 && !loading && (
          <div className="filters-container">
            <div className="exclude-wrapper">
              <input 
                type="text" 
                className="exclude-input"
                placeholder="Omitir palabras (ej: chocolate, dulce)..."
                value={excludeQuery}
                onChange={(e) => setExcludeQuery(e.target.value)}
              />
            </div>
            <label className="filter-toggle">
              <input 
                type="checkbox" 
                checked={filterMultiple} 
                onChange={(e) => setFilterMultiple(e.target.checked)} 
              />
              <span className="toggle-label">Solo con competencia (2+ supers)</span>
            </label>
          </div>
        )}
        
        {loading ? (
          <div className="loading-state">Buscando los mejores precios... esto puede demorar unos segundos.</div>
        ) : hasSearched ? (
           <PriceTable data={displayResults} />
        ) : (
          <div className="empty-state">Ingresa un producto (ej. "leche", "fideos", "harina") para comparar precios.</div>
        )}
      </main>
    </div>
  );
}

export default App;
