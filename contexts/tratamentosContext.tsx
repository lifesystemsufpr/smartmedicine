import React, { createContext, useContext, useState } from "react";

export type Tratamento = {
  id: string;
  nome: string;
  medicamentoId: string;
  dias: string[];
  quantidadePorDia: number;
  cor: string;
};

type TratamentosContextType = {
  tratamentos: Tratamento[];
  adicionarTratamento: (tratamento: Omit<Tratamento, "id">) => void;
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

  return (
    <TratamentosContext.Provider value={{ tratamentos, adicionarTratamento }}>
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
