import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function criarPaginaNovoLocal(dados) {
  try {
    // ✅ Desestruturar os dados
    const {
      nomeLocal,
      endereçoLocal,
      categoriaLocal,
      descricaoLocal,
      sugestaoUsoLocal,
      timestamp,
    } = dados;

    // ✅ Criar a página no Notion
    const response = await notion.pages.create({
      icon: {
        type: "emoji",
        emoji: "📍", // Ícone de localização
      },
      parent: {
        type: "database_id",
        database_id: "a8c89ea9-00c8-0681-bfc6-750bc531bf",
      },
      properties: {
        // Ajuste os nomes conforme suas colunas no Notion
        nomeLocal: {
          title: [
            {
              text: {
                content: nomeLocal,
              },
            },
          ],
        },
        endereçoLocal: {
          rich_text: [
            {
              text: {
                content: endereçoLocal,
              },
            },
          ],
        },
        categoriaLocal: {
          rich_text: [
            {
              text: {
                content: categoriaLocal,
              },
            },
          ],
        },
        descricaoLocal: {
          rich_text: [
            {
              text: {
                content: descricaoLocal,
              },
            },
          ],
        },
        sugestaoUsoLocal: {
          rich_text: [
            {
              text: {
                content: sugestaoUsoLocal,
              },
            },
          ],
        },
        timestamp: {
          date: {
            start: timestamp, // Já vem em ISO string
          },
        },
      },
    });

    // ✅ Retornar os dados da página criada
    console.log("✅ Página criada no Notion:", response.id);

    return {
      pageId: response.id,
      url: response.url,
      title: nomeLocal,
    };
  } catch (erro) {
    console.error("❌ Erro ao criar página no Notion:", erro.message);
    throw erro;
  }
}
