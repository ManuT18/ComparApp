import axios from 'axios';

const testLimit = async (limit) => {
    const url = `https://www.vea.com.ar/api/catalog_system/pub/products/search/leche?_from=0&_to=${limit-1}`;
    console.log(`Testing limit: ${limit} with URL: ${url}`);
    try {
        const start = Date.now();
        const res = await axios.get(url, { 
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000 
        });
        const end = Date.now();
        console.log(`Success! Fetched ${res.data.length} items in ${end - start}ms`);
    } catch (e) {
        console.error(`Failed! Error: ${e.message}`);
        if (e.response) {
            console.error(`Status: ${e.response.status}`);
            console.error(`Data: ${JSON.stringify(e.response.data)}`);
        }
    }
};

const run = async () => {
    await testLimit(50);
    await testLimit(100);
    await testLimit(150);
};

run();
