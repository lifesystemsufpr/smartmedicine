import React, { createContext, useContext, useState } from "react";

export type Medicamento = {
  id: string;
  nome: string;
  quantidadeEstoque: number;
  unidade: string;
  validade?: string;
};

type MedicamentosContextType = {
  medicamentos: Medicamento[];
  adicionarMedicamento: (medicamento: Omit<Medicamento, "id">) => void;
  baixarEstoque: (medicamentoId: string, quantidade: number) => void;
};

const MedicamentosContext = createContext<MedicamentosContextType | undefined>(
  undefined,
);

export function MedicamentosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  function adicionarMedicamento(medicamento: Omit<Medicamento, "id">) {
    setMedicamentos((atual) => [
      ...atual,
      { ...medicamento, id: Date.now().toString() },
    ]);
  }

  function baixarEstoque(medicamentoId: string, quantidade: number) {
    setMedicamentos((atual) =>
      atual.map((medicamento) =>
        medicamento.id === medicamentoId
          ? {
              ...medicamento,
              quantidadeEstoque: Math.max(
                0,
                medicamento.quantidadeEstoque - quantidade,
              ),
            }
          : medicamento,
      ),
    );
  }

  return (
    <MedicamentosContext.Provider
      value={{ medicamentos, adicionarMedicamento, baixarEstoque }}
    >
      {children}
    </MedicamentosContext.Provider>
  );
}

export function useMedicamentos() {
  const context = useContext(MedicamentosContext);
  if (!context) {
    throw new Error(
      "useMedicamentos precisa estar dentro do MedicamentosProvider",
    );
  }
  return context;
}
