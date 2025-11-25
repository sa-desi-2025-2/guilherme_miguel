
export async function converterMoeda(valor, de = "BRL", para = "USD") {
    const API_KEY = "Qm8v1fI5a2qnpVrBflojOC4MAIbCNVy9"; 

    const valorNumerico = Number(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) return null;

    de = de?.toUpperCase() || "BRL";
    para = para?.toUpperCase() || "USD";

    try {
        
        const url = `https://api.apilayer.com/currency_data/convert?to=${para}&from=${de}&amount=${valorNumerico}`;
        
        const headers = new Headers();
        headers.append("apikey", API_KEY);

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: headers
        };

        const res = await fetch(url, requestOptions);
        
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro na API: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        
        if (data?.success !== true || data?.result == null) {
            console.warn(`Cotação não encontrada ou erro na resposta da API: de=${de} para=${para}`, data);
            return null;
        }

        return data.result;
    } catch (err) {
        console.error("Erro ao converter moeda:", err);
        return null;
    }
}

export function getMoedaPorPais(iso2) {
    const map = {
        BR: "BRL",
        US: "USD",
        GB: "GBP",
        FR: "EUR",
        JP: "JPY",
        IN: "INR",
        CA: "CAD",
        AU: "AUD",
        DE: "EUR",
        IT: "EUR",
        ES: "EUR",
        CN: "CNY",
        RU: "RUB",
        MX: "MXN",
        ZA: "ZAR",
        AR: "ARS",
        CO: "COP",
        CL: "CLP",
    };
    return map[iso2?.toUpperCase()] ?? "USD";
}