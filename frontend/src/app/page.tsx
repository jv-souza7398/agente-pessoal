"use client";

import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { ArrowRight } from "lucide-react";

type OptionType =
  | "sugestoes"
  | "novoLocal"
  | "novoFilme"
  | "novaReceita"
  | null;

const options = [
  { id: "sugestoes" as const, label: "Sugestões", route: "sugestaoAssistente" },
  { id: "novoLocal" as const, label: "Novo local", route: "novoLocal" },
  { id: "novoFilme" as const, label: "Novo filme", route: "novoFilme" },
  { id: "novaReceita" as const, label: "Nova receita", route: "novaReceita" },
];

export default function AssistentePage() {
  const [selectedOption, setSelectedOption] = useState<OptionType>(null);
  const [promptText, setPromptText] = useState("");
  const [showCustomToast, setShowCustomToast] = useState(false);

  const handleOptionClick = (optionId: OptionType) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast("Atenção: selecione uma opção antes de continuar.");
      return;
    }

    if (!promptText.trim()) {
      toast("Digite seu prompt antes de enviar.");
      return;
    }

    const selectedRoute = options.find(
      (opt) => opt.id === selectedOption
    )?.route;

    // Show browser popup
    alert("Mensagem de respostas");

    // Show custom toast at bottom
    setShowCustomToast(true);

    // Hide toast after 5 seconds
    setTimeout(() => {
      setShowCustomToast(false);
    }, 5000);

    console.log("Enviando para rota:", selectedRoute);
    console.log("Texto do prompt:", promptText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-[#1F1F1F] text-5xl font-bold mb-32">Olá, João</h1>

      {/* Container inferior */}
      <div className="w-full max-w-2xl relative">
        {/* Botões de opções - apenas mostrar os não selecionados */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {options.map(
            (option) =>
              selectedOption !== option.id && (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="px-4 py-2 rounded-full font-medium text-sm transition-all hover:bg-[#E0E0E0] bg-[#F2F2F2] text-[#333]"
                >
                  {option.label}
                </button>
              )
          )}
        </div>

        <div className="relative rounded-3xl p-6 flex flex-col gap-3 bg-[#F5F5F5] border border-[#DADADA]">
          {/* Selected chip inside prompt box */}
          {selectedOption && (
            <div className="flex">
              <button
                onClick={() => setSelectedOption(null)}
                className="px-4 py-2 rounded-full font-medium text-sm transition-all hover:bg-[#D0D0D0] bg-[#E0E0E0] border border-[#A8A8A8] text-[#111] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              >
                {options.find((opt) => opt.id === selectedOption)?.label}
              </button>
            </div>
          )}

          {/* Input and Send button row */}
          <div className="flex items-center gap-3">
            {/* Input */}
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite seu prompt"
              className="flex-1 bg-transparent border-none outline-none text-[#1F1F1F] placeholder-[#999] text-lg"
            />

            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F2F2F2] border border-[#DADADA] text-[#333] text-sm font-medium hover:bg-[#E8E8E8] transition-all flex-shrink-0"
            >
              Enviar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showCustomToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-[#EAEAEA] border border-[#D0D0D0] text-[#222] text-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-2 z-50">
          Mensagem de respostas temporária
        </div>
      )}
    </div>
  );
}
