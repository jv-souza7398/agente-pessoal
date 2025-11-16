import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

//const pageId = "2a8c89ea-900c-8006-a8f7-fa819170b21a";
const pageId = "2a8c89ea900c808fac3bd8f73fd0cf46";

async function testarNotionAPI() {
  try {
    console.log("🔍 Criando cliente Notion...");

    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
      notionVersion: "2025-09-03",
    });

    console.log("Cliente Notion criado!");
    console.log("Tentando recuperar página:", pageId);

    // ✅ Teste 1: Recuperar informações da página
    const page = await notion.pages.retrieve({
      page_id: pageId,
    });

    console.log("PÁGINA ENCONTRADA!");
    console.log("ID:", page.id);
    console.log(
      "🏷️ Título:",
      page.properties?.title?.title?.[0]?.plain_text || "Sem título"
    );
    console.log("Criada em:", page.created_time);
    console.log("Última edição:", page.last_edited_time);
    console.log("\nTESTE SUCESSO! A integração tem acesso ao Notion!");
  } catch (erro) {
    console.error("❌ ERRO:", erro.message);
    console.error("Status:", erro.status);
    console.error("Código:", erro.code);
  }
}

testarNotionAPI();
