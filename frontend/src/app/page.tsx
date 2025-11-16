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

type FormStep = 1 | 2 | 3 | 4;

interface FormData {
  tipoSugestao: string;
  tipoLocal: string;
  tipoSaida: string;
  preferenciaComida: string;
}

const options = [
  { id: "sugestoes" as const, label: "Sugestões", route: "sugestaoAssistente" },
  { id: "novoLocal" as const, label: "Novo local", route: "novoLocal" },
  { id: "novoFilme" as const, label: "Novo filme", route: "novoFilme" },
  { id: "novaReceita" as const, label: "Nova receita", route: "novaReceita" },
];

const suggestionTypes = [
  { id: "musica", label: "Música" },
  { id: "filme", label: "Filme" },
  { id: "local", label: "Local" },
  { id: "receita", label: "Receita" },
];

const locationTypes = [
  { id: "bar", label: "Bar" },
  { id: "restaurante", label: "Restaurante" },
  { id: "cafe", label: "Café" },
  { id: "outro", label: "Outro" },
];

const outingTypes = [
  { id: "sozinho", label: "Sozinho" },
  { id: "casal", label: "Casal" },
  { id: "amigos", label: "Amigos" },
  { id: "familia", label: "Família" },
];

const foodTypes = [
  { id: "japonesa", label: "Japonesa" },
  { id: "italiana", label: "Italiana" },
  { id: "sem-preferencia", label: "Sem preferência" },
  { id: "outro", label: "Outro" },
];

export default function AssistentePage() {
  const [selectedOption, setSelectedOption] = useState<OptionType>(null);
  const [promptText, setPromptText] = useState("");
  const [showCustomToast, setShowCustomToast] = useState(false);

  const [formStep, setFormStep] = useState<FormStep>(1);
  const [selectedSuggestionType, setSelectedSuggestionType] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<FormData>({
    tipoSugestao: "",
    tipoLocal: "",
    tipoSaida: "",
    preferenciaComida: "",
  });

  const [showLocationOther, setShowLocationOther] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [showFoodOther, setShowFoodOther] = useState(false);
  const [customFood, setCustomFood] = useState("");

  const handleOptionClick = (optionId: OptionType) => {
    setSelectedOption(optionId);

    if (optionId === "sugestoes") {
      setFormStep(1);
      setSelectedSuggestionType(null);
      setFormData({
        tipoSugestao: "",
        tipoLocal: "",
        tipoSaida: "",
        preferenciaComida: "",
      });
    }
  };

  const handleSuggestionTypeSelect = (type: string) => {
    setSelectedSuggestionType(type);
    setFormData({ ...formData, tipoSugestao: type });

    console.log("[v0] Tipo de sugestão selecionado:", type);

    if (type === "Local") {
      setFormStep(2);
    } else {
      console.log("[v0] Resultado final:", type);
      setSelectedOption(null);
      toast(`Sugestão registrada: ${type}`);
    }
  };

  const handleLocationTypeSelect = (type: string) => {
    if (type === "Outro") {
      setShowLocationOther(true);
      setCustomLocation("");
      return;
    }

    setFormData({ ...formData, tipoLocal: type });
    console.log("[v0] Tipo de local selecionado:", type);
    setFormStep(3);
  };

  const handleCustomLocationSubmit = () => {
    if (!customLocation.trim()) {
      toast("Por favor, digite o tipo de local.");
      return;
    }

    setFormData({ ...formData, tipoLocal: customLocation });
    console.log(
      "[v0] Tipo de local selecionado (customizado):",
      customLocation
    );

    setShowLocationOther(false);
    setFormStep(3);
  };

  const handleOutingTypeSelect = (type: string) => {
    setFormData({ ...formData, tipoSaida: type });
    console.log("[v0] Tipo de saída selecionado:", type);
    setFormStep(4);
  };

  const handleFoodTypeSelect = (type: string) => {
    if (type === "Outro") {
      setShowFoodOther(true);
      setCustomFood("");
      return;
    }

    const updatedFormData = { ...formData, preferenciaComida: type };
    setFormData(updatedFormData);

    const finalResult = `${updatedFormData.tipoLocal}; ${updatedFormData.tipoSaida}; ${updatedFormData.preferenciaComida}`;
    console.log("[v0] Resultado final:", finalResult);
    alert(finalResult);

    setSelectedOption(null);
  };

  const handleCustomFoodSubmit = () => {
    if (!customFood.trim()) {
      toast("Por favor, digite a preferência de comida.");
      return;
    }

    const updatedFormData = { ...formData, preferenciaComida: customFood };
    setFormData(updatedFormData);

    const finalResult = `${updatedFormData.tipoLocal}; ${updatedFormData.tipoSaida}; ${updatedFormData.preferenciaComida}`;
    console.log("[v0] Resultado final:", finalResult);
    alert(finalResult);

    setShowFoodOther(false);
    setSelectedOption(null);
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

    alert("Mensagem de respostas");
    setShowCustomToast(true);

    setTimeout(() => {
      setShowCustomToast(false);
    }, 5000);

    console.log("Enviando para rota:", selectedRoute);
    console.log("Texto do prompt:", promptText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleModalBackdropClick = () => {
    console.log("[v0] Backdrop clicado - fechando modal");
    setSelectedOption(null);
    setFormStep(1);
    setShowLocationOther(false);
    setShowFoodOther(false);
    setCustomLocation("");
    setCustomFood("");
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-[#1F1F1F] text-5xl font-bold mb-12">Olá, João</h1>

      {/** FORMULÁRIO SUGESTÕES */}
      {selectedOption === "sugestoes" && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 cursor-pointer"
            onClick={handleModalBackdropClick}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div
              className="w-full max-w-md p-8 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] pointer-events-auto"
              onClick={handleModalContentClick}
            >
              {/* Step 1 */}
              {formStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Selecione o que deseja:
                  </h2>
                  <div className="flex flex-col gap-3">
                    {suggestionTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleSuggestionTypeSelect(type.label)}
                        className="w-full px-6 py-4 rounded-lg font-medium text-base bg-[#FAFAFA] hover:bg-[#F5F5F5] text-[#333] border border-[#E5E5E5] text-left"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {formStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Qual tipo de local gostaria?
                  </h2>
                  <div className="flex flex-col gap-3">
                    {locationTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleLocationTypeSelect(type.label)}
                        className="w-full px-6 py-4 rounded-lg font-medium text-base bg-[#FAFAFA] hover:bg-[#F5F5F5] text-[#333] border border-[#E5E5E5] text-left"
                      >
                        {type.label}
                      </button>
                    ))}

                    {showLocationOther && (
                      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#E5E5E5]">
                        <input
                          type="text"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder="Digite o tipo de local"
                          className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:ring-2 focus:ring-[#D0D0D0]"
                          autoFocus
                        />
                        <button
                          onClick={handleCustomLocationSubmit}
                          className={`w-full px-6 py-4 rounded-lg font-medium text-base border transition-all ${
                            customLocation.trim()
                              ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#DFF0E0]"
                              : "bg-[#F2F2F2] text-[#333] border-[#DADADA]"
                          }`}
                        >
                          Prosseguir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {formStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Que tipo de saída planeja?
                  </h2>
                  <div className="flex flex-col gap-3">
                    {outingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleOutingTypeSelect(type.label)}
                        className="w-full px-6 py-4 rounded-lg font-medium text-base bg-[#FAFAFA] hover:bg-[#F5F5F5] text-[#333] border border-[#E5E5E5] text-left"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {formStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Alguma preferência de comida?
                  </h2>
                  <div className="flex flex-col gap-3">
                    {foodTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleFoodTypeSelect(type.label)}
                        className="w-full px-6 py-4 rounded-lg font-medium text-base bg-[#FAFAFA] hover:bg-[#F5F5F5] text-[#333] border border-[#E5E5E5] text-left"
                      >
                        {type.label}
                      </button>
                    ))}

                    {showFoodOther && (
                      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#E5E5E5]">
                        <input
                          type="text"
                          value={customFood}
                          onChange={(e) => setCustomFood(e.target.value)}
                          placeholder="Digite a preferência de comida"
                          className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:ring-2 focus:ring-[#D0D0D0]"
                          autoFocus
                        />
                        <button
                          onClick={handleCustomFoodSubmit}
                          className={`w-full px-6 py-4 rounded-lg font-medium text-base border transition-all ${
                            customFood.trim()
                              ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#DFF0E0]"
                              : "bg-[#F2F2F2] text-[#333] border-[#DADADA]"
                          }`}
                        >
                          Prosseguir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Container inferior */}
      <div className="w-full max-w-2xl relative mt-12">
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {options.map(
            (option) =>
              selectedOption !== option.id && (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="px-4 py-2 rounded-full font-medium text-sm bg-[#F2F2F2] border border-[#DADADA] hover:bg-[#E0E0E0] transition"
                >
                  {option.label}
                </button>
              )
          )}
        </div>

        <div className="relative rounded-3xl p-6 flex flex-col gap-3 bg-[#F5F5F5] border border-[#DADADA]">
          {selectedOption && (
            <div className="flex mb-1">
              <button
                onClick={() => setSelectedOption(null)}
                className="px-4 py-2 rounded-full font-medium text-sm bg-[#E0E0E0] border border-[#A8A8A8] text-[#111] shadow-sm hover:bg-[#D0D0D0]"
              >
                {options.find((opt) => opt.id === selectedOption)?.label}
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite seu prompt"
              className="flex-1 bg-transparent border-none outline-none text-lg text-[#1F1F1F] placeholder-[#999]"
            />

            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F2F2F2] border border-[#DADADA] hover:bg-[#E8E8E8] text-[#333] transition"
            >
              Enviar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showCustomToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-[#EAEAEA] border border-[#D0D0D0] text-[#222] shadow-md animate-in fade-in slide-in-from-bottom-2">
          Mensagem de respostas temporária
        </div>
      )}
    </div>
  );
}
