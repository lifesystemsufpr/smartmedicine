import React, { createContext, useContext, useState } from "react";

export type ItemTratamento = {
  medicamentoId: string;
  quantidadePorDia: number;
  duracaoDias: number | null; // padrao = uso continuo
};

export type Tratamento = {
  id: string;
  nome: string;
  medicamentos: ItemTratamento[];
  dias: string[];
  cor: string;
  dataInicio: Date;
};

type TratamentosContextType = {
  tratamentos: Tratamento[];
  adicionarTratamento: (tratamento: Omit<Tratamento, "id">) => void;
  atualizarTratamento: (id: string, dados: Omit<Tratamento, "id">) => void;
};

const TratamentosContext = createContext<TratamentosContextType | undefined>(
  undefined,
);

export function TratamentosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tratamentos, setTratamentos] = useState<Tratamento[]>([]);

  function adicionarTratamento(tratamento: Omit<Tratamento, "id">) {
    setTratamentos((atual) => [
      ...atual,
      { ...tratamento, id: Date.now().toString() },
    ]);
  }

  function atualizarTratamento(id: string, dados: Omit<Tratamento, "id">) {
    setTratamentos((atual) =>
      atual.map((tratamento) =>
        tratamento.id === id ? { ...dados, id } : tratamento,
      ),
    );
  }

  return (
    <TratamentosContext.Provider
      value={{ tratamentos, adicionarTratamento, atualizarTratamento }}
    >
      {children}
    </TratamentosContext.Provider>
  );
}

export function useTratamentos() {
  const context = useContext(TratamentosContext);
  if (!context) {
    throw new Error(
      "useTratamentos precisa estar dentro do TratamentosProvider",
    );
  }
  return context;
}
