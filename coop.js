import axios from 'axios';

async function test(payload) {
    try {
        const res = await axios.post('https://api.lacoopeencasa.coop/api/articulos/pagina_busqueda', payload, {
             headers: {
                'User-Agent': 'Mozilla/5.0',
                'Content-Type': 'application/json'
             }
        });
        console.log("STATUS:", res.status);
        console.log("PAYLOAD:", payload);
        if (typeof res.data !== 'string') {
            console.log("DATA KEYS:", Object.keys(res.data));
            if (res.data.datos) {
                console.log("ARTICULOS:", JSON.stringify(res.data.datos).substring(0, 300));
            }
        }
    } catch (e) {
        console.log("ERROR for payload", payload, ":", e.message);
    }
}

test({"busqueda":"leche"});
test({"q":"leche"});
test({"texto":"leche"});
test({"descripcion":"leche"});
test({"query":"leche"});
