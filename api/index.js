import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

const SUPERMARKETS = [
    { id: 'vea', name: 'Vea', url: 'https://www.vea.com.ar/api/catalog_system/pub/products/search/' },
    { id: 'chango', name: 'Chango Más', url: 'https://www.masonline.com.ar/api/catalog_system/pub/products/search/' }
    // { id: 'coope', name: 'Cooperativa Obrera', url: 'https://www.lacoopeencasa.coop/api/catalog_system/pub/products/search/' }
];

async function fetchFromSupermarket(supermarket, query) {
    try {
        const response = await axios.get(`${supermarket.url}${encodeURIComponent(query)}?_from=0&_to=49`, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://www.google.com/'
            }
        });
        
        const products = response.data.map(p => {
            // Find the price. VTEX puts it inside items[0].sellers[0].commertialOffer.Price
            let price = null;
            let stock = false;
            let ean = null;
            
            if (p.items && p.items.length > 0) {
                ean = p.items[0].ean || null;
                const seller = p.items[0].sellers.find(s => s.sellerDefault) || p.items[0].sellers[0];
                if (seller && seller.commertialOffer) {
                    price = seller.commertialOffer.Price;
                    stock = seller.commertialOffer.AvailableQuantity > 0;
                }
            }

            return {
                id: p.productId,
                name: p.productName,
                brand: p.brand ? p.brand.trim().toUpperCase() : 'DESCONOCIDA',
                price: price,
                inStock: stock,
                supermarket: supermarket.id,
                ean: ean
            };
        });
        
        return products;
    } catch (error) {
        console.error(`Error fetching from ${supermarket.name}:`, error.message);
        return [{
            id: 'error',
            name: `Error de conexión: ${error.message}`,
            brand: 'SISTEMA',
            price: 0,
            inStock: true,
            supermarket: supermarket.id
        }];
    }
}

app.get(['/api/search', '/search', '/'], async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    // Fetch from all 3 supermarkets concurrently
    const fetchPromises = SUPERMARKETS.map(sup => fetchFromSupermarket(sup, query));
    const resultsArray = await Promise.all(fetchPromises);
    
    // Flatten array
    const allProducts = resultsArray.flat();

    // Group by item
    const groupedProducts = {};

    const normalize = (text) => {
        if (!text) return '';
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
    };
    
    allProducts.forEach(product => {
        const eanKey = product.ean ? `EAN_${product.ean}` : null;
        const nameKey = `${normalize(product.brand)}_${normalize(product.name)}`;
        const groupKey = eanKey || nameKey;

        if (!groupedProducts[groupKey]) {
            groupedProducts[groupKey] = {
                id: groupKey,
                brand: product.brand,
                name: product.name,
                vea: { price: null, inStock: false, name: '' },
                chango: { price: null, inStock: false, name: '' },
                coope: { price: null, inStock: false, name: '' }
            };
        }
        
        // If we haven't assigned a product for this supermarket, or if this one is cheaper
        const currentProd = groupedProducts[groupKey][product.supermarket];
        if (product.price && product.inStock) {
            if (currentProd.price === null || product.price < currentProd.price) {
                groupedProducts[groupKey][product.supermarket] = {
                    price: product.price,
                    inStock: product.inStock,
                    name: product.name
                };
            }
        }
    });

    // Convert object to array and filter out products that don't have stock anywhere
    const sortedProducts = Object.values(groupedProducts).filter(item => 
        (item.vea.price !== null || item.chango.price !== null || item.coope.price !== null)
    ).sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));

    res.json(sortedProducts);
});

export default app;