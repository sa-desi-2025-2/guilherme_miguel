const GEMINI_API_KEY = "AIzaSyCG7QR5iXYb44UJIesn7sS8S9W9OXCb8XE";

export async function gerarRoteiroGemini(dadosRoteiro, listaLocais) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

 const prompt = `
Você é um planejador profissional de viagens altamente especializado.

Você receberá:
1. Dados do viajante (hobbies, gastronomia e tipo de viagem)
2. O destino (cidade, país, datas)
3. Uma lista REAL de locais (50 pontos turísticos)
4. Você deve criar um roteiro PERSONALIZADO somente com esses locais.

=============== DADOS DO VIAJANTE ===============
HOBBIES: ${dadosRoteiro.hobbies || "não informado"}
GASTRONOMIA: ${dadosRoteiro.gastronomia || "não informado"}
TIPO DE VIAGEM: ${dadosRoteiro.tipo || "não informado"}

=============== DESTINO ===============
Cidade: ${dadosRoteiro.destino}
País: ${dadosRoteiro.pais}
Data de início: ${dadosRoteiro.dataInicio}
Data de fim: ${dadosRoteiro.dataFim}

=============== LOCAIS DISPONÍVEIS ===============
USE EXCLUSIVAMENTE OS LOCAIS ABAIXO:
${JSON.stringify(listaLocais, null, 2)}

=============== REGRAS CRÍTICAS ===============
1. NÃO invente lugares.  
2. NÃO altere nome, coordenadas nem categorias dos locais.  
3. PRIORIZE LOCAIS DE ACORDO COM OS INTERESSES DO VIAJANTE:
   - Se o viajante gosta de PRAIA → priorize praias, mirantes costeiros, parques à beira-mar.
   - Se gosta de NATUREZA → priorize parques, reservas naturais, viewpoints.
   - Se gosta de GASTRONOMIA → priorize locais com "amenity=restaurant", mercados, feiras.
   - Se gosta de CULTURA → priorize museus, teatros, centros culturais.
   - Se gosta de VIDA NOTURNA → priorize bares, baladas, áreas movimentadas.
   - Se é viagem ROMÂNTICA → priorize vistas, parques, experiências tranquilas.
   - Se é viagem em FAMÍLIA → zoológicos, parques temáticos, museus infantis.
   - Se é viagem de AVENTURA → trilhas, viewpoints, natureza, caminhada.

4. Escolha de 2 a 4 atividades por dia.
5. Preencha TODAS as datas corretamente entre o início e o fim.
6. Responda SOMENTE com JSON VÁLIDO.
7. Cada atividade obrigatoriamente deve usar UM dos locais reais da lista.

=============== FORMATO FINAL OBRIGATÓRIO ===============

{
  "pais": "${dadosRoteiro.pais}",
  "cidade": "${dadosRoteiro.destino}",
  "data_inicio": "${dadosRoteiro.dataInicio}",
  "data_fim": "${dadosRoteiro.dataFim}",
  "resumo_viagem": "",
  "clima_resumo": "",
  "dias": [
    {
      "dia": 1,
      "data": "",
      "atividades": [
        {
          "periodo": "manha | tarde | noite",
          "titulo": "",
          "descricao": "",
          "tipo": "",
          "coordenadas": { "lat": null, "lon": null },
          "tempo_estimado_min": 0
        }
      ]
    }
  ]
}

=============== IMPORTANTE ===============
Sua prioridade nº1 é garantir que as atividades combinam com o perfil do viajante.
A prioridade nº2 é escolher apenas locais da lista REAL enviada acima.
`;

    const body = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!data.candidates) {
        console.error("Erro Gemini:", data);
        return null;
    }

    let texto = data.candidates[0].content.parts[0].text;

    // Limpa markdown
    texto = texto.replace(/^```json/, "").replace(/```$/, "").trim();

    return JSON.parse(texto);
}
