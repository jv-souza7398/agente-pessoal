import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const databaseId = "2a8c89ea900c80e88702ee4721b9cae2";

async function testarNotionDatabase() {
  try {
    console.log("🔍 Criando cliente Notion...");

    const notion = new Client({
      auth: process.env.NOTION_API_KEY,
      notionVersion: "2025-09-03",
    });

    console.log("✅ Cliente Notion criado!");
    console.log("🔍 Tentando recuperar database:", databaseId);

    // ✅ Teste 1: Recuperar informações do database
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log("✅ DATABASE ENCONTRADO!");
    console.log("📚 ID:", database.id);
    console.log("📚 Data Source ID:", database.data_source_id);
    console.log("🏷️ Título:", database.title?.[0]?.plain_text || "Sem título");
    console.log("📅 Criada em:", database.created_time);
    console.log("✏️ Última edição:", database.last_edited_time);

    console.log("\n📊 Colunas do Database:");
    Object.entries(database.properties).forEach(([key, prop]) => {
      console.log(`  - ${key}: ${prop.type}`);
    });

    console.log("\n✅ TESTE SUCESSO! A integração tem acesso ao Database!");
    console.log("✅ Data Source ID:", database.data_source_id);
  } catch (erro) {
    console.error("❌ ERRO:", erro.message);
    console.error("Status:", erro.status);
    console.error("Código:", erro.code);
  }
}

testarNotionDatabase();
