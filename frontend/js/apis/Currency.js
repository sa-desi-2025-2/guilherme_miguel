/**
 * ⚠️ ATENÇÃO: Esta função AGORA REQUER uma chave API da APILayer/Currencylayer.
 * * Converte valor de uma moeda para outra usando a API do currencylayer/apilayer.
 * * @param {number} valor - valor a ser convertido
 * @param {string} de - moeda de origem (ex: "BRL")
 * @param {string} para - moeda destino (ex: "USD")
 * @returns {Promise<number | null>} valor convertido ou null em caso de erro
 */
export async function converterMoeda(valor, de = "BRL", para = "USD") {
    const API_KEY = "cMdEMz5jcYmqWlzt0V6io6KqdLv3ZJaX"; // Chave de exemplo do seu texto

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

/**
 * Retorna a moeda padrão de um país pelo código ISO2
 * (Mantida a função auxiliar, pois não depende da API)
 */
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