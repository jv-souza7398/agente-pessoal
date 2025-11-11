import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { outputOpenAiSchema } from "./OutputSchema";

const client = new OpenaAI({
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
          content: "Mensagem de envio. Retorne sempre em JSON",
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
            porperties: {
              returnForms: {
                type: "object",
                poperties: {
                  nomeLocal: { type: "string" },
                  endereçoLocal: { type: "string" },
                  categoriaLocal: { type: "string" },
                  descricaoLocal: { type: "string" },
                  sugestaoUsoLocal: { type: "string" },
                },
                required: [
                  "nomeLocal",
                  "endereçoLocal",
                  "categoriaLocal",
                  "descricaoLocal",
                  "sugestaoUsoLocal",
                ],
                additionalProperties: false,
              },
            },
            required: ["returForms"],
            additionalProperties: false,
          },
        },
      },
    });

    const resultOpenAI = JSON.parse(response.choices[0].message.content);

    return resultOpenAI;
  } catch (erro) {
    console.error("Erro ao chamar API OpenAI:", erro);
    throw erro;
  }
}
