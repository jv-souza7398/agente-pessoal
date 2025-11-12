import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2025-09-03",
});

// ✅ ID da database (não use o parâmetro "v=" da URL)
const databaseId = "2a8c89ea900c80e88702ee4721b9cae2";

async function testar() {
  try {
    console.log("🔍 Tentando recuperar database:", databaseId);

    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log("✅ Database encontrada!");
    console.log("📚 Nome:", response.title?.[0]?.plain_text || "Sem título");
    console.log("🆔 ID:", response.id);
    console.log("📅 Criada em:", response.created_time);
    console.log("✏️ Última edição:", response.last_edited_time);

    console.log("\n📊 Propriedades:");
    for (const [key, value] of Object.entries(response.properties)) {
      console.log(`- ${key}: ${value.type}`);
    }
  } catch (err) {
    console.error("❌ ERRO:", err.message);
    console.error("Código:", err.code);
    console.error("Status:", err.status);
  }
}

testar();
