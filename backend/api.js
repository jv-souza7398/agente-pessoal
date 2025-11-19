import dotenv from "dotenv";
import express from "express";
import { novoLocalSchema } from "./NovoLocalSchema.js";
import { validateNovoLocal } from "./middleware.js";
import {
  assistentePessoalNovoLocal,
  assistentePessoalNovoFilme,
  escolherLocalChatGPT,
} from "./openaiservices.js";

import {
  criarPaginaNovoLocal,
  criarPaginaNovoFilme,
  listarLocaisFiltrados,
} from "./notionService.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ Middleware de autenticação
const authenticateAPI = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const expectedKey = process.env.API_SECRET_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      status: "erro",
      message: "Não autorizado. X-API-Key header é obrigatório.",
    });
  }

  next(); // ✅ CHAMA NEXT() PARA CONTINUAR
}; // ✅ FECHA A FUNÇÃO

// ✅ AGORA SIM DEFINE A ROTA
app.post(
  "/novoLocal",
  authenticateAPI,
  validateNovoLocal(novoLocalSchema),
  async (req, res) => {
    try {
      console.log("✅ Dados validados:", req.body);

      const { nomelocal, categoria } = req.body.details;
      const { adress } = req.body.forms;

      console.log(
        `Chamando ChatGPT com: ${nomelocal}, ${categoria}, ${adress}`
      );

      const resultOpenAI = await assistentePessoalNovoLocal(
        nomelocal,
        categoria,
        adress
      );

      console.log("Resposta do ChatGPT:", resultOpenAI);

      const dadosNotion = {
        nomelocal: resultOpenAI.returnForms.nomelocal,
        endereçoLocal: resultOpenAI.returnForms.endereçoLocal,
        categoriaLocal: resultOpenAI.returnForms.categoriaLocal,
        descricaoLocal: resultOpenAI.returnForms.descricaoLocal,
        sugestaoUsoLocal: resultOpenAI.returnForms.sugestaoUsoLocal,
        timestamp: new Date().toISOString(),
      };

      console.log("📝 Dados preparados para Notion:", dadosNotion);

      const pageNotion = await criarPaginaNovoLocal(dadosNotion);

      console.log("✅ Página criada no Notion:", pageNotion);

      res.status(200).json({
        status: "success",
        message: "Dados processados com sucesso e página criada no Notion",
        resultOpenAi: resultOpenAI,
        pageCreated: {
          id: pageNotion.pageId,
          url: pageNotion.url,
          title: pageNotion.title,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (erro) {
      console.error("❌ Erro no processamento:", erro.message);

      res.status(500).json({
        status: "erro",
        message: "Erro ao processar a requisição",
        details: erro.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
);

app.post("/novoFilme", async (req, res) => {
  try {
    console.log("📩 Requisição recebida em /novoFilme:", req.body);

    // Espera-se um body assim:
    // { "input": "Transforme: Lado Oculto da Lua" }
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        status: "erro",
        message: "O campo 'input' é obrigatório.",
      });
    }

    // 1️⃣ Chama OpenAI para estruturar o filme
    const respostaOpenAI = await assistentePessoalNovoFilme(input);

    console.log("🎬 Retorno OpenAI (novoFilme):", respostaOpenAI);

    const { nomeFilme, categoriaFilme, sinopseFilme } =
      respostaOpenAI.returnForms;

    // 2️⃣ Criar página no Notion
    const paginaNotion = await criarPaginaNovoFilme({
      nomeFilme,
      categoriaFilme,
      sinopseFilme,
      timestamp: new Date().toISOString(),
    });

    console.log("📄 Página criada no Notion:", paginaNotion);

    // 3️⃣ Retorno final ao cliente
    res.status(200).json({
      status: "success",
      message: "Filme processado e página criada",
      resultOpenAi: respostaOpenAI,
      pageCreated: paginaNotion,
      timestamp: new Date().toISOString(),
    });
  } catch (erro) {
    console.error("❌ Erro no /novoFilme:", erro.message);

    res.status(500).json({
      status: "erro",
      message: "Erro ao processar a requisição",
      details: erro.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.post("/sugestaoLocal", authenticateAPI, async (req, res) => {
  try {
    const { preferencias } = req.body;

    if (!preferencias) {
      return res.status(400).json({
        status: "erro",
        message:
          "O campo 'preferencias' é obrigatório. Exemplo: 'Restaurante; Casal; Italiana'",
      });
    }

    console.log("📍 Preferências recebidas:", preferencias);

    // 1️⃣ Buscar locais no Notion
    const locais = await listarLocaisFiltrados();
    console.log("📄 Locais retornados:", locais.length);

    // 2️⃣ Enviar para o ChatGPT escolher
    const localEscolhido = await escolherLocalChatGPT(preferencias, locais);

    // 3️⃣ Retornar para o cliente
    return res.status(200).json({
      status: "success",
      localEscolhido,
      timestamp: new Date().toISOString(),
    });
  } catch (erro) {
    console.error("❌ Erro no /sugestaoLocal:", erro);

    return res.status(500).json({
      status: "erro",
      message: "Erro ao escolher sugestão de local",
      details: erro.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Olá, mundo");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
  });
}

export default app;
