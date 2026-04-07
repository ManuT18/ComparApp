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

  // Find minimum price for a row to highlight it
  const getMinPrice = (item) => {
    const prices = [
      item.vea.inStock ? item.vea.price : null,
      item.chango.inStock ? item.chango.price : null,
      item.coope.inStock ? item.coope.price : null,
    ].filter(p => p !== null);
    
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
    <div className="table-container" style={{ marginTop: '2rem' }}>
      <table className="price-table">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Marca / Producto</th>
            <th style={{ width: '25%', textAlign: 'center' }}><div className="sup-badge badge-vea">VEA</div></th>
            <th style={{ width: '25%', textAlign: 'center' }}><div className="sup-badge badge-chango">Chango Más</div></th>
            <th style={{ width: '25%', textAlign: 'center' }}><div className="sup-badge badge-coope">Cooperativa</div></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const minPrice = getMinPrice(item);
            
            return (
              <tr key={index}>
                <td className="brand-cell">{item.brand}</td>
                <td className="price-cell">{renderCell(item.vea, minPrice)}</td>
                <td className="price-cell">{renderCell(item.chango, minPrice)}</td>
                <td className="price-cell">{renderCell(item.coope, minPrice)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;
