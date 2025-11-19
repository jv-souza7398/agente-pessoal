import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2025-09-03",
});

// ----------------------------------------
// FUNÇÃO PARA CRIAR PAGE LOCAL
// ----------------------------------------
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

// -------------------------
// FUNÇÃO PARA CRIAR PAGE FILMES
// -------------------------
export async function criarPaginaNovoFilme({
  nomeFilme,
  categoriaFilme,
  sinopseFilme,
  timestamp,
}) {
  try {
    console.log("📄 Criando página de filme no Notion...");

    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: process.env.NOTION_DATABASE_FILMES_ID,
      },
      properties: {
        "Nome do Filme": {
          title: [
            {
              text: { content: nomeFilme },
            },
          ],
        },
        Categoria: {
          rich_text: [
            {
              text: { content: categoriaFilme },
            },
          ],
        },
        Sinopse: {
          rich_text: [
            {
              text: { content: sinopseFilme },
            },
          ],
        },
        "Criado em": {
          date: { start: timestamp },
        },
      },
    });

    console.log("🎬 Página criada! ID:", response.id);

    return {
      pageId: response.id,
      url: response.url,
      title: nomeFilme,
    };
  } catch (erro) {
    console.error("❌ Erro ao criar página de filme:", erro.message);
    throw erro;
  }
}

// ----------------------------------------
// LISTAR LOCAIS DO NOTION (filtrando campos)
// ---------------------------------------

export async function listarLocaisFiltrados() {
  const DATABASE_ID = process.env.NOTION_DATABASE_LOCAIS_ID;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  try {
    console.log("🔍 Consultando Notion via HTTP RAW...");

    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro Notion ${response.status}: ${text}`);
    }

    const json = await response.json();

    const locais = json.results.map((page) => {
      const props = page.properties;

      return {
        id: page.id,
        nome: props["Nome do Local"]?.title?.[0]?.plain_text ?? "",
        categoria: props["Categoria"]?.rich_text?.[0]?.plain_text ?? "",
        endereco: props["Endereço"]?.rich_text?.[0]?.plain_text ?? "",
        sugestaoDeUso:
          props["Sugestões de Uso"]?.rich_text?.[0]?.plain_text ?? "",
      };
    });

    return locais;
  } catch (err) {
    console.error("❌ Erro listarLocaisFiltrados (HTTP RAW):", err);
    throw err;
  }
}
