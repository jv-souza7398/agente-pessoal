import { listarLocaisFiltrados } from "./notionService.js";

(async () => {
  try {
    const locais = await listarLocaisFiltrados();
    console.log("Locais encontrados:", locais.length);
    console.log(locais);
  } catch (e) {
    console.error("Erro:", e);
  }
})();
