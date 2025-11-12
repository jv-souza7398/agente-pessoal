import dotenv from "dotenv";
import express from "express";
import { novoLocalSchema } from "./NovoLocalSchema.js";
import { validateNovoLocal } from "./middleware.js";
import { assistentePessoalNovoLocal } from "./openaiservices.js";
import { criarPaginaNovoLocal } from "./notionService.js";

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

  next();
};

// ✅ Rota principal
app.post(
  "/novoLocal",
  authenticateAPI, // ✅ PRIMEIRO autentica
  validateNovoLocal(novoLocalSchema), // ✅ DEPOIS valida
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

app.get("/", (req, res) => {
  res.send("Olá, mundo");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
  });
}

export default app;
