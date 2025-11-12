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
        "Nome do Local": {
          title: [
            {
              text: { content: nomelocal },
            },
          ],
        },
        Endereço: {
          rich_text: [{ text: { content: endereçoLocal } }],
        },
        Categoria: {
          rich_text: [{ text: { content: categoriaLocal } }],
        },
        Descrição: {
          rich_text: [{ text: { content: descricaoLocal } }],
        },
        "Sugestões de Uso": {
          rich_text: [{ text: { content: sugestaoUsoLocal } }],
        },
        "Criado em": {
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
