import React, { createContext, useContext, useState } from "react";

type Remedio = {
  id: string;
  nome: string;
  dias: string[];
  quantidade: number;
};

type RemediosContextType = {
  remedios: Remedio[];
  adicionarRemedio: (remedio: Remedio) => void;
};

const RemediosContext = createContext<RemediosContextType | undefined>(
  undefined,
);

export function RemediosProvider({ children }: { children: React.ReactNode }) {
  const [remedios, setRemedios] = useState<Remedio[]>([]);

  function adicionarRemedio(remedio: Remedio) {
    setRemedios((atual) => [...atual, remedio]);
  }

  return (
    <RemediosContext.Provider value={{ remedios, adicionarRemedio }}>
      {children}
    </RemediosContext.Provider>
  );
}

export function useRemedios() {
  const context = useContext(RemediosContext);
  if (!context) {
    throw new Error("useRemedios precisa estar dentro do RemediosProvider");
  }
  return context;
}
