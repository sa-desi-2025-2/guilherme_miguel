const GEMINI_API_KEY = "AIzaSyDw9GC3kw5HDsKBYXv07XhlpJpG3T_futY";

export async function gerarRoteiroGemini(dadosRoteiro, listaLocais) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
Você é um gerador de roteiros de viagem profissional.

USAR SOMENTE OS LOCAIS DA LISTA ABAIXO:
${JSON.stringify(listaLocais)}

NÃO invente novos lugares.

Crie um roteiro usando APENAS a lista acima.

Formato obrigatório:

{
  "pais": "${dadosRoteiro.pais}",
  "cidade": "${dadosRoteiro.cidade}",
  "data_inicio": "${dadosRoteiro.inicio}",
  "data_fim": "${dadosRoteiro.fim}",
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

REGRAS IMPORTANTES:
- Escolha somente locais reais da lista.
- NÃO modifique nome, descrição ou coordenadas.
- Combine os locais conforme o estilo do viajante.
- 2 a 4 atividades por dia.
- O roteiro deve caber dentro das datas informadas.
- Responder SOMENTE com JSON VÁLIDO.
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
