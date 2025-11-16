import OpenAI from "openai";
import { outputOpenAiSchema } from "./OutputSchema.js";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
});

export async function assistentePessoalNovoLocal(nomelocal, categoria, adress) {
  try {
    const userMessage = `
Nome do local: ${nomelocal}
Categoria: ${categoria}
Endereço: ${adress}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
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
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "local_description",
          strict: true,
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

    const resultOpenAI = JSON.parse(response.choices[0].message.content);

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
// NOVA FUNÇÃO PARA FILMES
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

# Se atente a categoria, garanta que a categoria está de acordo com o filme

Siga este formato:

{
  "returnForms": {
    "nomeFilme": "",
    "categoriaFilme": "",
    "sinopseFilme": ""
  }
}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
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
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "filme_schema",
          strict: true,
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

    const result = JSON.parse(response.choices[0].message.content);

    console.log("🎬 Resultado OpenAI (novoFilme):", result);

    return result;
  } catch (erro) {
    console.error("❌ Erro ao chamar OpenAI (novoFilme):", erro.message);
    throw erro;
  }
}
