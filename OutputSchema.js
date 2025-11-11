import { z } from "zod";

const returnFormsSchema = z.object({
  nomelocal: z.string(),
  endereçoLocal: z.string(),
  categoriaLocal: z.string(),
  descricaoLocal: z.string(),
  sugestaoUsoLocal: z.string(),
});

const outputOpenAiSchema = z.object({
  returnForms: returnFormsSchema,
});

export { outputOpenAiSchema };
