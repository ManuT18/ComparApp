import axios from 'axios';

async function research() {
    const changoUrl = 'https://www.masonline.com.ar/api/catalog_system/pub/products/search/larga%20vida%20zero%20lact';

    try {
        const resChango = await axios.get(changoUrl, { headers: { 'Accept': 'application/json' } });
        console.log("\n=== CHANGO ===");
        if (resChango.data && resChango.data.length > 0) {
            const p = resChango.data[0]
            if (p) {
                console.log("Name:", p.productName);
                console.log("EANs:", p.items.map(i => i.ean));
            }
        }
    } catch(e) { console.error(e.message); }
}

research();
