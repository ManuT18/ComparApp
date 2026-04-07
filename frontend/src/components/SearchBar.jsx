import { useState } from 'react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Ej. Leche Las Tres Niñas..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <button 
        type="submit" 
        className="search-button" 
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? 'Buscando...' : 'Comparar'}
      </button>
    </form>
  );
};

export default SearchBar;
