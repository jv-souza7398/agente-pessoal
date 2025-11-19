import OpenAI from "openai";
import { outputOpenAiSchema } from "./OutputSchema.js";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
});

// -------------------------
//  FUNÇÃO PARA LOCAIS
// -------------------------
export async function assistentePessoalNovoLocal(nomelocal, categoria, adress) {
  try {
    const userMessage = `
Nome do local: ${nomelocal}
Categoria: ${categoria}
Endereço: ${adress}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",

      input: [
        {
          role: "system",
          content:
            "Você é um assistente que descreve locais. Retorne SEMPRE em JSON no formato especificado com nomelocal (minúsculo).",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],

      text: {
        format: {
          name: "local_description_format", // obrigatório
          type: "json_schema",

          // obrigatório: agora é "schema" direto
          schema: {
            type: "object",
            properties: {
              returnForms: {
                type: "object",
                properties: {
                  nomelocal: { type: "string" },
                  endereçoLocal: { type: "string" },
                  categoriaLocal: { type: "string" },
                  descricaoLocal: { type: "string" },
                  sugestaoUsoLocal: { type: "string" },
                },
                required: [
                  "nomelocal",
                  "endereçoLocal",
                  "categoriaLocal",
                  "descricaoLocal",
                  "sugestaoUsoLocal",
                ],
                additionalProperties: false,
              },
            },
            required: ["returnForms"],
            additionalProperties: false,
          },
        },
      },
    });

    // Novo formato de saída no Responses API
    const jsonText = response.output[0].content[0].text;
    const resultOpenAI = JSON.parse(jsonText);

    console.log(
      "🔍 Resposta completa do ChatGPT:",
      JSON.stringify(resultOpenAI, null, 2)
    );

    return resultOpenAI;
  } catch (erro) {
    console.error("❌ Erro ao chamar API OpenAI:", erro.message);
    throw erro;
  }
}

// -------------------------
//  FUNÇÃO PARA FILMES
// -------------------------
export async function assistentePessoalNovoFilme(userInput) {
  try {
    const prompt = `
String recebida: "${userInput}"

Com base no nome do filme enviado,
retorne JSON com:
- nomeFilme
- categoriaFilme
- sinopseFilme

# Se atente à categoria, garanta que a categoria está de acordo com o filme

Siga este formato:

{
  "returnForms": {
    "nomeFilme": "",
    "categoriaFilme": "",
    "sinopseFilme": ""
  }
}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",

      input: [
        {
          role: "system",
          content:
            "Você é um assistente que analisa filmes e retorna JSON estruturado.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      // ✔️ AGORA NO FORMATO OFICIAL
      text: {
        format: {
          name: "filme_schema_format",
          type: "json_schema",

          // 👇 ESTE É O CAMPO OBRIGATÓRIO QUE ESTAVA FALTANDO
          schema: {
            type: "object",
            properties: {
              returnForms: {
                type: "object",
                properties: {
                  nomeFilme: { type: "string" },
                  categoriaFilme: { type: "string" },
                  sinopseFilme: { type: "string" },
                },
                required: ["nomeFilme", "categoriaFilme", "sinopseFilme"],
                additionalProperties: false,
              },
            },
            required: ["returnForms"],
            additionalProperties: false,
          },
        },
      },
    });

    const jsonText = response.output[0].content[0].text;
    const result = JSON.parse(jsonText);

    console.log("🎬 Resultado OpenAI (novoFilme):", result);

    return result;
  } catch (erro) {
    console.error("❌ Erro ao chamar OpenAI (novoFilme):", erro.message);
    throw erro;
  }
}

// -------------------------
//  FUNÇÃO PARA SUGESTÃO LOCAIS
// -------------------------
export async function escolherLocalChatGPT(preferencias, locais) {
  const prompt = `
Você é um assistente especializado em encontrar locais ideais para o usuário.

O usuário forneceu as seguintes preferências:
"${preferencias}"

E aqui está a lista de locais disponíveis (cada local contém nome, endereço, categoria e sugestão de uso):

${JSON.stringify(locais, null, 2)}

Com base nisso, escolha **apenas UM** local que mais combina com as preferências especificadas.

Responda APENAS em JSON no formato:

{
  "nomelocal": "...",
  "endereco": "...",
  "sugestaodeUso": "..."
}

Apenas um único local deve ser retornado.
Se nenhum local se encaixar perfeitamente, retorne o local mais próximo das preferências.
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um especialista em recomendar locais de acordo com preferências do usuário.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  // Parse do JSON retornado pelo GPT
  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error("Erro ao interpretar JSON retornado:", err);
    throw new Error("A resposta do ChatGPT não pôde ser convertida em JSON.");
  }
}
