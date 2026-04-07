import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

const SUPERMARKETS = [
    { id: 'vea', name: 'Vea', url: 'https://www.vea.com.ar/api/catalog_system/pub/products/search/' },
    { id: 'chango', name: 'Chango Más', url: 'https://www.masonline.com.ar/api/catalog_system/pub/products/search/' },
    { id: 'carrefour', name: 'Carrefour', url: 'https://www.carrefour.com.ar/api/catalog_system/pub/products/search/' },
    { id: 'coope', name: 'Cooperativa', url: 'https://lacoopeencasa.coop/api/catalog_system/pub/products/search/' }
];

async function fetchFromSupermarket(supermarket, query) {
    try {
        const response = await axios.get(`${supermarket.url}${encodeURIComponent(query)}?_from=0&_to=49`, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        });

        const products = response.data.map(p => {
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
        console.error(`Error fetching from ${supermarket.id}:`, error.message);
        return [];
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

    // Group by Hybrid Math (EAN + Fuzzy Jaccard)
    const groupedGroups = [];

    const normalize = (text) => {
        if (!text) return '';
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
    };

    const calculateSimilarity = (name1, name2) => {
        const set1 = new Set(normalize(name1).split(' ').filter(w => w.length > 1));
        const set2 = new Set(normalize(name2).split(' ').filter(w => w.length > 1));
        
        if (set1.size === 0 && set2.size === 0) return 1;
        if (set1.size === 0 || set2.size === 0) return 0;

        let intersection = 0;
        for (let word of set1) {
            if (set2.has(word)) intersection++;
        }
        
        const union = set1.size + set2.size - intersection;
        return intersection / union;
    };
    
    allProducts.forEach(product => {
        // 1. Try to find an existing group that matches
        let targetGroup = null;

        for (let group of groupedGroups) {
            // Check EAN if both have it
            if (product.ean && group.ean && product.ean === group.ean) {
                targetGroup = group;
                break;
            }
            
            // If no exact EAN match, check if Brands match AND Fuzzy Name similarity > 0.70
            if (normalize(product.brand) === normalize(group.brand)) {
                if (calculateSimilarity(product.name, group.name) > 0.70) {
                    targetGroup = group;
                    break;
                }
            }
        }

        // 2. If no group found, create a new one
        if (!targetGroup) {
            targetGroup = {
                id: product.id,
                brand: product.brand,
                name: product.name,
                ean: product.ean,
                vea: { price: null, inStock: false, name: '' },
                chango: { price: null, inStock: false, name: '' },
                carrefour: { price: null, inStock: false, name: '' },
                coope: { price: null, inStock: false, name: '' }
            };
            groupedGroups.push(targetGroup);
        }
        
        // 3. Assign or overwrite to targeted Group if cheaper
        const currentProd = targetGroup[product.supermarket];
        if (product.price && product.inStock) {
            if (currentProd.price === null || product.price < currentProd.price) {
                targetGroup[product.supermarket] = {
                    price: product.price,
                    inStock: product.inStock,
                    name: product.name
                };
            }
        }
    });

    // Filter out products that don't have stock anywhere
    const sortedProducts = groupedGroups.filter(item => 
        (item.vea.price !== null || item.chango.price !== null || item.carrefour.price !== null || item.coope.price !== null)
    ).sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));

    res.json(sortedProducts);
});

export default app;