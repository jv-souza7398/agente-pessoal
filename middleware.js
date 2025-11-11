import { z } from "zod";

const validateNovoLocal = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      console.log("Dados validados com sucesso");
      next();
    } else {
      const errorsFormated = result.error.flatten();
      console.log("Erro de validação:", errorsFormated);

      res.status(400).json({
        status: "error",
        message: "Dados inválidos",
        errors: errorsFormated.fieldErrors,
      });
    }
  };
};

export { validateNovoLocal };
