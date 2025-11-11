import express from "express";
import dotenv from "dotenv";
import { novoLocalSchema } from "./NovoLocalSchema.js";
import { validateNovoLocal } from "./middlewre.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/novoLocal", validateNovoLocal(novoLocalSchema), (req, res) => {
  // 1. Imprimir re.body
  console.log("JSON recebido:", req.body);

  // 2. Acessando campos específicos
  console.log("Nome do local:", req.body.details.nomelocal);

  // 3. Responder com um JSON de confirmação

  res.json({
    status: "sucess",
    message: "Dados recebidos",
    dadosRecebidos: req.body,
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Olá, mundo");
});

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});
