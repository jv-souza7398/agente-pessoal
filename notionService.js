import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2025-09-03",
});

export async function criarPaginaNovoLocal(dados) {
  try {
    const {
      nomelocal,
      endereçoLocal,
      categoriaLocal,
      descricaoLocal,
      sugestaoUsoLocal,
      timestamp,
    } = dados;

    console.log("📝 Tentando criar página com dados:", { nomelocal });

    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: process.env.NOTION_DATABASE_LOCAIS_ID, // ✅ CORRETO
      },
      properties: {
        nomelocal: {
          title: [
            {
              text: { content: nomelocal },
            },
          ],
        },
        endereçoLocal: {
          rich_text: [{ text: { content: endereçoLocal } }],
        },
        categoriaLocal: {
          rich_text: [{ text: { content: categoriaLocal } }],
        },
        descricaoLocal: {
          rich_text: [{ text: { content: descricaoLocal } }],
        },
        sugestaoUsoLocal: {
          rich_text: [{ text: { content: sugestaoUsoLocal } }],
        },
        timestamp: {
          date: { start: timestamp },
        },
      },
    });

    console.log("✅ Página criada com sucesso:", response.url);

    return {
      pageId: response.id,
      url: response.url,
      title: nomelocal,
    };
  } catch (erro) {
    console.error("❌ ERRO ao criar página:", erro.message);
    throw erro;
  }
}
