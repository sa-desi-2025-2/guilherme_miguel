
const GEMINI_API_KEY = "AIzaSyAajiA7TAI-DUZ6kzteu6tC0a9-YPE321c"; // Chave de exemplo

export async function gerarRoteiroGemini(dadosRoteiro) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const prompt = `
            Você é um gerador de roteiros de viagem e DEVE usar exatamente os dados abaixo. 
NUNCA invente datas, cidades, países ou informações diferentes das fornecidas.

DADOS OBRIGATÓRIOS (use exatamente como enviados):
País: ${dadosRoteiro.pais}
Cidade: ${dadosRoteiro.cidade}
Início: ${dadosRoteiro.inicio}
Fim: ${dadosRoteiro.fim}
Interesses: ${dadosRoteiro.interesses}
Gastronomia: ${dadosRoteiro.gastronomia}
Orçamento: ${dadosRoteiro.orcamento}
Tipo de viajante: ${dadosRoteiro.viajante}

REGRAS IMPORTANTES — siga à risca:
1. Você deve responder APENAS em JSON válido. Não adicione texto fora do JSON.
2. Use exatamente as informações enviadas. NÃO modifique o país, cidade ou datas.
3. NÃO invente outros destinos.
4. NÃO gere textos longos. As descrições devem ter no máximo 2–3 frases.
5. O JSON deve seguir exatamente ESTE MODELO:

{
  "pais": "",
  "cidade": "",
  "data_inicio": "",
  "data_fim": "",
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
          "tipo": "museum | historic | architecture | natural | foods | interesting_places | other",
          "coordenadas": { "lat": null, "lon": null },
          "tempo_estimado_min": 0
        }
      ]
    }
  ]
}

6. "tipo" deve ser compatível com OpenTripMap (ex: museum, foods, natural, historic, architecture).
7. Coordenadas só devem ser adicionadas se forem conhecidas. Caso contrário, use null.
8. Gere atividades coerentes com:
    - clima atual
    - interesses do usuário
    - tipo de viajante (família)
    - duração da viagem (diferença entre data_inicio e data_fim)

AGORA GERE O ROTEIRO ESTRITAMENTE NO FORMATO ACIMA.
        `;

        const body = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        // O Gemini às vezes coloca o JSON dentro de ```json ... ```. Precisamos limpar.
        if (!data.candidates) {
            console.error("Erro Gemini:", data);
            return null;
        }
        
        const texto = data.candidates[0].content.parts[0].text;
        
        // Limpa a resposta para JSON válido
        const textoLimpo = texto
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();

        return textoLimpo;

    } catch (error) {
        console.error("Erro na chamada Gemini:", error);
        return null;
    }
}