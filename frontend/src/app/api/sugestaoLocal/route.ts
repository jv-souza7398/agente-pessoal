import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parametros } = body;

    console.log("[v0] Enviando requisição para API externa de sugestão local");
    console.log("[v0] Parâmetros:", parametros);

    const response = await fetch(
      "https://agente-pessoal-ten.vercel.app/sugestaoLocal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "joao1234",
        },
        body: JSON.stringify({ preferencias: parametros }),
      }
    );

    console.log("[v0] Response status da API externa:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[v0] Erro na API externa:", errorText);
      throw new Error(
        `fetch to https://agente-pessoal-ten.vercel.app/sugestaoLocal failed with status ${response.status} and body: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("[v0] Resposta da API externa:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Erro no proxy sugestaoLocal:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
