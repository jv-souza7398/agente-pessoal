import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[v0] Recebido no proxy /api/novoLocal:", body);

    const response = await fetch(
      "https://agente-pessoal-ten.vercel.app/novoLocal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "joao1234",
        },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();
    console.log("[v0] Resposta do servidor externo (status):", response.status);
    console.log("[v0] Resposta do servidor externo (body):", responseText);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `fetch to https://agente-pessoal-ten.vercel.app/novoLocal failed with status ${response.status} and body: ${responseText}`,
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[v0] Erro no proxy /api/novoLocal:", error);
    return NextResponse.json(
      {
        error: "Erro ao processar requisição",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
