const PriceTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No encontramos ningún resultado para esa búsqueda.</p>
      </div>
    );
  }

  // Format the price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  const supermarkets = [
    { id: 'vea', name: 'VEA', badge: 'badge-vea' },
    { id: 'chango', name: 'Chango Más', badge: 'badge-chango' },
    { id: 'carrefour', name: 'Carrefour', badge: 'badge-carrefour' },
    { id: 'coope', name: 'Cooperativa', badge: 'badge-coope' },
  ];

  // Only show columns for supermarkets that have at least one product with price and stock
  const activeSupermarkets = supermarkets.filter(sup => 
    data.some(item => item[sup.id] && item[sup.id].price !== null && item[sup.id].inStock)
  );

  // Find minimum price for a row to highlight it
  const getMinPrice = (item) => {
    const prices = activeSupermarkets
      .map(sup => (item[sup.id].inStock ? item[sup.id].price : null))
      .filter(p => p !== null);
    
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  // Render a cell for the supermarket
  const renderCell = (supData, minPrice) => {
    if (!supData.inStock || supData.price === null) {
      return <span className="tag-out">No encontrado</span>;
    }
    
    const isBestPrice = supData.price === minPrice;
    
    return (
      <div className="price-value-container">
        <span className={`price-number ${isBestPrice ? 'best-price' : ''}`}>
          {formatPrice(supData.price)}
        </span>
        <span className="price-name" title={supData.name}>{supData.name}</span>
      </div>
    );
  };

  return (
    <div className="table-container" style={{ marginTop: '2rem', WebkitOverflowScrolling: 'touch' }}>
      <table className="price-table">
        <thead>
          <tr>
            <th style={{ minWidth: '200px' }}>Marca / Producto</th>
            {activeSupermarkets.map(sup => (
              <th key={sup.id} style={{ textAlign: 'center' }}>
                <div className={`sup-badge ${sup.badge}`}>{sup.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const minPrice = getMinPrice(item);
            
            return (
              <tr key={index}>
                <td className="brand-cell">
                  <div>{item.brand}</div>
                  <div style={{fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-muted)', marginTop: '0.2rem'}}>{item.name}</div>
                </td>
                {activeSupermarkets.map(sup => (
                  <td key={sup.id} className="price-cell">
                    {renderCell(item[sup.id], minPrice)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;
