const axios = require('axios');

async function testVea() {
    try {
        const url = 'https://www.vea.com.ar/api/catalog_system/pub/products/search/leche?_from=0&_to=2';
        const res = await axios.get(url);
        console.log("VEA OK", res.data.length > 0 ? res.data[0].productName : "Empty");
    } catch (e) {
        console.log("VEA ERROR", e.message);
    }
}

async function testChango() {
    try {
        const url = 'https://www.masonline.com.ar/api/catalog_system/pub/products/search/leche?_from=0&_to=2';
        const res = await axios.get(url);
        console.log("CHANGO OK", res.data.length > 0 ? res.data[0].productName : "Empty");
    } catch (e) {
        console.log("CHANGO ERROR", e.message);
    }
}

async function testCoope() {
    try {
        const url = 'https://www.lacoopeencasa.coop/api/catalog_system/pub/products/search/leche?_from=0&_to=2';
        const res = await axios.get(url);
        console.log("COOPE OK", res.status);
    } catch (e) {
        console.log("COOPE ERROR", e.message);
    }
}

testVea();
testChango();
testCoope();
