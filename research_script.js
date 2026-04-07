import axios from 'axios';
import fs from 'fs';

const SUPERMARKETS = [
    { id: 'vea', name: 'Vea', url: 'https://www.vea.com.ar/api/catalog_system/pub/products/search/' },
    { id: 'chango', name: 'Chango Más', url: 'https://www.masonline.com.ar/api/catalog_system/pub/products/search/' }
];

async function pullData() {
    console.log("Fetching from supermarkets...");
    const queries = ['leche la serenisima', 'queso crema'];
    let results = { vea: [], chango: [] };

    for (const q of queries) {
        for (const sup of SUPERMARKETS) {
            try {
                const res = await axios.get(`${sup.url}${q}?_from=0&_to=15`, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
                });
                
                const mapped = res.data.map(p => ({
                    id: p.productId,
                    brand: p.brand ? p.brand.trim() : 'N/A',
                    name: p.productName,
                    ean: (p.items && p.items.length > 0) ? p.items[0].ean : null,
                    refId: (p.items && p.items.length > 0 && p.items[0].referenceId && p.items[0].referenceId.length > 0) 
                           ? p.items[0].referenceId.map(r => r.Value).join(', ') : null
                }));
                
                results[sup.id].push(...mapped);
            } catch (e) {
                console.error(`Failed ${sup.id} for ${q}`, e.message);
            }
        }
    }

    fs.writeFileSync('./research_data.json', JSON.stringify(results, null, 2));
    console.log("Wrote research_data.json");
}

pullData();
