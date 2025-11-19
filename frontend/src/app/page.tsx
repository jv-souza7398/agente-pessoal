"use client";

import { useState } from "react";
import { toast } from "sonner";
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

interface NovoLocalFormData {
  nomeLocal: string;
  categoria: string;
}

interface SugestaoResult {
  status: string;
  localEscolhido: {
    nomelocal: string;
    endereco: string;
    sugestaodeUso: string;
  };
  timestamp: string;
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

  const [novoLocalData, setNovoLocalData] = useState<NovoLocalFormData>({
    nomeLocal: "",
    categoria: "",
  });
  const [showCategoriaOther, setShowCategoriaOther] = useState(false);
  const [customCategoria, setCustomCategoria] = useState("");

  const [sugestaoResult, setSugestaoResult] = useState<SugestaoResult | null>(
    null
  );
  const [isLoadingSugestao, setIsLoadingSugestao] = useState(false);

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
    if (optionId === "novoLocal") {
      setNovoLocalData({
        nomeLocal: "",
        categoria: "",
      });
      setShowCategoriaOther(false);
      setCustomCategoria("");
    }
  };

  const handleSuggestionTypeSelect = (type: string) => {
    setSelectedSuggestionType(type);
    setFormData({ ...formData, tipoSugestao: type });

    console.log("[v0] Tipo de sugestão selecionado:", type);

    if (type === "Local") {
      setFormStep(2);
    } else {
      // For other types, just log and close modal
      console.log("[v0] Resultado final:", type);
      setSelectedOption(null);
      toast.success("Sugestão registrada", {
        description: `Você selecionou: ${type}`,
      });
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
      toast.error("Por favor, digite o tipo de local.");
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

  const handleFoodTypeSelect = async (type: string) => {
    if (type === "Outro") {
      setShowFoodOther(true);
      setCustomFood("");
      return;
    }

    const updatedFormData = { ...formData, preferenciaComida: type };
    setFormData(updatedFormData);

    await fetchSugestaoLocal(updatedFormData);

    setShowFoodOther(false);
  };

  const handleCustomFoodSubmit = async () => {
    if (!customFood.trim()) {
      toast.error("Por favor, digite a preferência de comida.");
      return;
    }

    const updatedFormData = { ...formData, preferenciaComida: customFood };
    setFormData(updatedFormData);

    await fetchSugestaoLocal(updatedFormData);

    setShowFoodOther(false);
  };

  const fetchSugestaoLocal = async (data: FormData) => {
    const parametros = `${data.tipoLocal}; ${data.tipoSaida}; ${data.preferenciaComida}`;
    console.log("[v0] Buscando sugestão de local com parâmetros:", parametros);

    setIsLoadingSugestao(true);

    try {
      const response = await fetch("/api/sugestaoLocal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parametros }),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const result = await response.json();
      console.log("[v0] Resultado da sugestão:", result);

      setSugestaoResult(result);
      setSelectedOption(null); // Close the form modal
    } catch (error) {
      console.error("[v0] Erro ao buscar sugestão:", error);
      toast.error("Não foi possível buscar a sugestão. Tente novamente.");
    } finally {
      setIsLoadingSugestao(false);
    }
  };

  const handleNovaSugestao = async () => {
    if (
      !formData.tipoLocal ||
      !formData.tipoSaida ||
      !formData.preferenciaComida
    ) {
      toast.error("Dados do formulário não encontrados.");
      return;
    }

    await fetchSugestaoLocal(formData);
  };

  const handleCloseSugestaoResult = () => {
    console.log("[v0] Fechando card de resultado");
    setSugestaoResult(null);
    setFormData({
      tipoSugestao: "",
      tipoLocal: "",
      tipoSaida: "",
      preferenciaComida: "",
    });
  };

  const handleNovoLocalSubmit = async () => {
    console.log("[v0] Iniciando submissão de Novo Local");

    // Validate form
    if (!novoLocalData.nomeLocal.trim()) {
      toast.error("Por favor, digite o nome do local.");
      return;
    }

    const categoria = showCategoriaOther
      ? customCategoria
      : novoLocalData.categoria;
    if (!categoria.trim()) {
      toast.error("Por favor, selecione uma categoria.");
      return;
    }

    // Get device location
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo navegador.");
      return;
    }

    try {
      console.log("[v0] Capturando localização do dispositivo...");

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const { latitude, longitude } = position.coords;

      console.log("[v0] Coordenadas capturadas:", latitude, longitude);

      console.log("[v0] Convertendo coordenadas em endereço...");

      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "PersonalAssistantApp/1.0",
          },
        }
      );

      if (!geocodeResponse.ok) {
        throw new Error("Erro ao obter endereço da localização");
      }

      const geocodeData = await geocodeResponse.json();

      // Format address
      const address = geocodeData.address;
      let formattedAddress = "";

      if (address.road) {
        formattedAddress = address.road;
        if (address.house_number) {
          formattedAddress += `, ${address.house_number}`;
        }
      } else if (address.suburb) {
        formattedAddress = address.suburb;
      } else if (address.city) {
        formattedAddress = address.city;
      } else {
        formattedAddress = geocodeData.display_name
          .split(",")
          .slice(0, 2)
          .join(",");
      }

      console.log("[v0] Endereço formatado:", formattedAddress);

      // Get current timestamp
      const now = new Date();
      const timestamp = now.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const payload = {
        forms: {
          timestamp,
          adress: formattedAddress,
          deviceName: "iPhone de João",
        },
        details: {
          nomelocal: novoLocalData.nomeLocal,
          categoria: categoria,
        },
      };

      console.log("[v0] Enviando payload:", payload);

      const response = await fetch("/api/novoLocal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("[v0] Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Erro na requisição: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("[v0] Resposta da API:", data);

      toast.success("Local cadastrado com sucesso!");

      // Close modal and reset form
      setSelectedOption(null);
      setNovoLocalData({
        nomeLocal: "",
        categoria: "",
      });
      setShowCategoriaOther(false);
      setCustomCategoria("");
    } catch (error) {
      console.error("[v0] Erro ao enviar requisição:", error);
      if (error instanceof GeolocationPositionError) {
        toast.error(
          "Não foi possível obter sua localização. Verifique as permissões."
        );
      } else {
        toast.error(
          `Erro ao cadastrar local: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error("Selecione uma opção antes de continuar.");
      return;
    }

    if (!promptText.trim()) {
      toast.error("Digite seu prompt antes de enviar.");
      return;
    }

    const selectedRoute = options.find(
      (opt) => opt.id === selectedOption
    )?.route;

    if (selectedOption === "novoFilme") {
      try {
        console.log("[v0] Enviando requisição para /api/novoFilme");
        console.log("[v0] Prompt:", promptText);

        const response = await fetch("/api/novoFilme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: promptText }),
        });

        console.log("[v0] Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log("[v0] Resposta da API:", data);

        setPromptText("");
        setShowCustomToast(true);

        setTimeout(() => {
          setShowCustomToast(false);
        }, 5000);
      } catch (error) {
        console.error("[v0] Erro ao enviar requisição:", error);
        toast.error(
          `Não foi possível enviar a requisição: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`
        );
      }
    } else if (selectedOption === "novoLocal") {
      handleNovoLocalSubmit();
    } else {
      alert("Mensagem de respostas");
      setShowCustomToast(true);

      setTimeout(() => {
        setShowCustomToast(false);
      }, 5000);

      console.log("Enviando para rota:", selectedRoute);
      console.log("Texto do prompt:", promptText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleModalBackdropClick = () => {
    console.log("[v0] Backdrop clicado - fechando modal");
    setSelectedOption(null);
    setFormStep(1);
    setShowLocationOther(false);
    setShowFoodOther(false);
    setCustomLocation("");
    setCustomFood("");
    setNovoLocalData({
      nomeLocal: "",
      categoria: "",
    });
    setShowCategoriaOther(false);
    setCustomCategoria("");
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    console.log("[v0] Conteúdo do modal clicado - prevenindo fechamento");
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <h1 className="text-[#1F1F1F] text-5xl font-bold mb-12">Olá, João</h1>

      {sugestaoResult && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 cursor-pointer"
            onClick={handleCloseSugestaoResult}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div
              className="w-full max-w-md p-8 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <h2 className="text-[#1F1F1F] text-3xl font-bold mb-6">
                  Sugestão de Local
                </h2>

                <div className="space-y-5">
                  <div>
                    <p className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      Nome do Local
                    </p>
                    <p className="text-[#1F1F1F] text-2xl font-semibold leading-tight">
                      {sugestaoResult.localEscolhido.nomelocal}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      Endereço
                    </p>
                    <p className="text-[#444] text-base leading-relaxed">
                      {sugestaoResult.localEscolhido.endereco}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                      Sugestão de Uso
                    </p>
                    <p className="text-[#444] text-base leading-relaxed">
                      {sugestaoResult.localEscolhido.sugestaodeUso}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNovaSugestao}
                  disabled={isLoadingSugestao}
                  className="w-full px-6 py-4 rounded-lg font-medium text-base transition-all bg-[#F2F2F2] hover:bg-[#E8E8E8] text-[#333] border border-[#DADADA] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingSugestao ? "Buscando..." : "Nova sugestão"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedOption === "novoLocal" && (
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
              <div className="space-y-6">
                {/* Question 1: Nome do local */}
                <div className="space-y-3">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Digite o nome do local
                  </h2>
                  <input
                    type="text"
                    value={novoLocalData.nomeLocal}
                    onChange={(e) =>
                      setNovoLocalData({
                        ...novoLocalData,
                        nomeLocal: e.target.value,
                      })
                    }
                    placeholder="Ex: Restaurante da Praça"
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#D0D0D0] text-[#333]"
                  />
                </div>

                {/* Question 2: Categoria */}
                <div className="space-y-3">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Qual a categoria do local?
                  </h2>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setNovoLocalData({
                          ...novoLocalData,
                          categoria: "Restaurante",
                        });
                        setShowCategoriaOther(false);
                      }}
                      className={`w-full px-6 py-4 rounded-lg font-medium text-base transition-all border text-left ${
                        novoLocalData.categoria === "Restaurante" &&
                        !showCategoriaOther
                          ? "bg-[#E8E8E8] border-[#B0B0B0] text-[#111]"
                          : "hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border-[#E5E5E5]"
                      }`}
                    >
                      Restaurante
                    </button>

                    <button
                      onClick={() => {
                        setNovoLocalData({
                          ...novoLocalData,
                          categoria: "Bar",
                        });
                        setShowCategoriaOther(false);
                      }}
                      className={`w-full px-6 py-4 rounded-lg font-medium text-base transition-all border text-left ${
                        novoLocalData.categoria === "Bar" && !showCategoriaOther
                          ? "bg-[#E8E8E8] border-[#B0B0B0] text-[#111]"
                          : "hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border-[#E5E5E5]"
                      }`}
                    >
                      Bar
                    </button>

                    <button
                      onClick={() => {
                        setShowCategoriaOther(true);
                        setNovoLocalData({ ...novoLocalData, categoria: "" });
                        setCustomCategoria("");
                      }}
                      className={`w-full px-6 py-4 rounded-lg font-medium text-base transition-all border text-left ${
                        showCategoriaOther
                          ? "bg-[#E8E8E8] border-[#B0B0B0] text-[#111]"
                          : "hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border-[#E5E5E5]"
                      }`}
                    >
                      Outro
                    </button>

                    {showCategoriaOther && (
                      <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-[#E5E5E5]">
                        <input
                          type="text"
                          value={customCategoria}
                          onChange={(e) => setCustomCategoria(e.target.value)}
                          placeholder="Digite a categoria"
                          className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#D0D0D0] text-[#333]"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleNovoLocalSubmit}
                  className="w-full px-6 py-4 rounded-lg font-medium text-base transition-all bg-[#F2F2F2] hover:bg-[#E8E8E8] text-[#333] border border-[#DADADA]"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
              {/* Step 1 - Initial question */}
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
                        className="w-full px-6 py-4 rounded-lg font-medium text-base transition-all hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border border-[#E5E5E5] text-left"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 - Question 1 (For Local) */}
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
                        className="w-full px-6 py-4 rounded-lg font-medium text-base transition-all hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border border-[#E5E5E5] text-left"
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
                          className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#D0D0D0] text-[#333]"
                          autoFocus
                        />
                        <button
                          onClick={handleCustomLocationSubmit}
                          className={`w-full px-6 py-4 rounded-lg font-medium text-base transition-all border ${
                            customLocation.trim()
                              ? "bg-[#E8F5E9] hover:bg-[#DFF0E0] text-[#2E7D32] border-[#C8E6C9]"
                              : "bg-[#F2F2F2] hover:bg-[#E0E0E0] text-[#333] border-[#DADADA]"
                          }`}
                        >
                          Prosseguir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 - Question 2 */}
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
                        className="w-full px-6 py-4 rounded-lg font-medium text-base transition-all hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border border-[#E5E5E5] text-left"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 - Question 3 */}
              {formStep === 4 && !isLoadingSugestao && (
                <div className="space-y-6">
                  <h2 className="text-[#1F1F1F] text-xl font-semibold">
                    Alguma preferência de comida?
                  </h2>
                  <div className="flex flex-col gap-3">
                    {foodTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleFoodTypeSelect(type.label)}
                        className="w-full px-6 py-4 rounded-lg font-medium text-base transition-all hover:bg-[#F5F5F5] bg-[#FAFAFA] text-[#333] border border-[#E5E5E5] text-left"
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
                          className="w-full px-4 py-3 rounded-lg border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#D0D0D0] text-[#333]"
                          autoFocus
                        />
                        <button
                          onClick={handleCustomFoodSubmit}
                          className={`w-full px-6 py-4 rounded-lg font-medium text-base transition-all border ${
                            customFood.trim()
                              ? "bg-[#E8F5E9] hover:bg-[#DFF0E0] text-[#2E7D32] border-[#C8E6C9]"
                              : "bg-[#F2F2F2] hover:bg-[#E0E0E0] text-[#333] border-[#DADADA]"
                          }`}
                        >
                          Prosseguir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4 - Loading state */}
              {formStep === 4 && isLoadingSugestao && (
                <div className="text-center py-8">
                  <p className="text-[#666] text-lg">Buscando sugestão...</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
