import axios from 'axios';
axios.get('https://www.carrefour.com.ar/api/catalog_system/pub/products/search/leche?_from=0&_to=5')
    .then(res => console.log('Found:', res.data.length, 'items'))
    .catch(e => console.log('Error:', e.message));
