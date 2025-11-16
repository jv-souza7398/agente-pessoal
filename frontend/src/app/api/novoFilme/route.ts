import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[v0] API Route recebeu:", body);

    const response = await fetch(
      "https://agente-pessoal-ten.vercel.app/novoFilme",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("[v0] Resposta do servidor externo:", response.status);

    const data = await response.json();
    console.log("[v0] Dados recebidos:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[v0] Erro no proxy:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
