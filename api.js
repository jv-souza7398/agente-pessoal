import express from "express";
import { novoLocalSchema } from "./NovoLocalSchema.js";
import { validateNovoLocal } from "./middleware.js";
import { assistentePessoalNovoLocal } from "./openaiservices.js";
import { criarPaginaNovoLocal } from "./notionService.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/novoLocal", validateNovoLocal(novoLocalSchema), async (req, res) => {
  try {
    console.log("Dados validados", req.body);

    const { nomelocal, categoria } = req.body.details;
    const { adress } = req.body.forms;

    console.log(`Chamando ChatGPT com: ${nomelocal}, ${categoria}, ${adress}`);

    const resultOpenAI = await assistentePessoalNovoLocal(
      nomelocal,
      categoria,
      adress
    );

    console.log("Resposta do ChatGPT:", resultOpenAI);

    const dadosNotion = {
      nomeLocal:
        resultOpenAI.returnForms.nomelocal ||
        resultOpenAI.returnForms.nomeLocal,
      endereçoLocal: resultOpenAI.returnForms.endereçoLocal,
      categoriaLocal: resultOpenAI.returnForms.categoriaLocal,
      descricaoLocal: resultOpenAI.returnForms.descricaoLocal,
      sugestaoUsoLocal: resultOpenAI.returnForms.sugestaoUsoLocal,
      timestamp: new Date().toISOString(), // Adicionar timestamp
    };

    console.log("Dados preparados para Notion:", dadosNotion);

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
    console.log("Erro no processamento:", erro.message);

    res.status(500).json({
      status: "erro",
      message: "Erro ao processar a requisição",
      details: erro.message,
      timestamp: new Date().toISOString(),
    });
  }

  /* 1. Imprimir re.body
  console.log("JSON recebido:", req.body);

  // 2. Acessando campos específicos
  console.log("Nome do local:", req.body.details.nomelocal);

  // 3. Responder com um JSON de confirmação
  */
});

app.get("/", (req, res) => {
  res.send("Olá, mundo");
});

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});
