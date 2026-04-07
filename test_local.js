import axios from 'axios';

const SUPERMARKETS = [
    { id: 'vea', name: 'Vea', url: 'https://www.vea.com.ar/api/catalog_system/pub/products/search/' },
    { id: 'chango', name: 'Chango Más', url: 'https://www.masonline.com.ar/api/catalog_system/pub/products/search/' }
];

async function fetchFromSupermarket(supermarket, query) {
    try {
        const response = await axios.get(`${supermarket.url}${encodeURIComponent(query)}?_from=0&_to=15`, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/plain, */*'
            }
        });
        
        return response.data.map(p => {
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
                ean: ean,
                supermarket: supermarket.id
            };
        });
    } catch (error) { return []; }
}

async function run() {
    const vea = await fetchFromSupermarket(SUPERMARKETS[0], "leche");
    const chango = await fetchFromSupermarket(SUPERMARKETS[1], "leche");
    
    console.log("VEA ZeroLact:");
    const veaZL = vea.filter(p => p.name.toLowerCase().includes("zero"));
    console.log(veaZL);

    console.log("CHANGO ZeroLact:");
    const changoZL = chango.filter(p => p.name.toLowerCase().includes("zero"));
    console.log(changoZL);
}

run();
