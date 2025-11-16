import { z } from "zod";

const formsSchema = z.object({
  timestamp: z.string(),
  adress: z.string(),
  deviceName: z.string(),
});

const detailsSchema = z.object({
  nomelocal: z.string(),
  categoria: z.string(),
});

const novoLocalSchema = z.object({
  forms: formsSchema,
  details: detailsSchema,
});

export { novoLocalSchema, formsSchema, detailsSchema };
