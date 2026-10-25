import { Medicamento } from "@/contexts/medicamentosContext";
import { ItemTratamento, Tratamento } from "@/contexts/tratamentosContext";
import {
  DIAS_SEMANA,
  addDaysToDate,
  getStartOfWeekDate,
} from "@/utils/calendarioHelpers";

// Remove as horas: 25/10 às 13:40 vira 25/10 às 00:00
export function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

// calcula o total de um medicamento sendo consumido em todos os tratamentos na semana
export function calcularConsumoSemanal(
  medicamentoId: string,
  tratamentos: Tratamento[],
  hoje: Date = new Date(),
): number {
  return tratamentos.reduce((total, tratamento) => {
    const item = tratamento.medicamentos.find(
      (i) => i.medicamentoId === medicamentoId,
    );
    if (!item || !itemEmAndamento(tratamento, item, hoje)) return total;
    return total + item.quantidadePorDia * tratamento.dias.length;
  }, 0);
}

// gera um texto com o nome dos medicamentos juntos e quantidade
export function descreverMedicamentos(
  tratamento: Tratamento,
  medicamentos: Medicamento[],
): string {
  return tratamento.medicamentos
    .map((item) => {
      const medicamento = medicamentos.find((m) => m.id === item.medicamentoId);
      const nome = medicamento?.nome ?? "Medicamento removido";
      const duracao =
        item.duracaoDias === null
          ? "contínuo"
          : `${item.duracaoDias} dia${item.duracaoDias === 1 ? "" : "s"}`;
      return `${nome} (${item.quantidadePorDia}x, ${duracao})`;
    })
    .join(", ");
}

// Último dia em que o item é tomado. null = uso contínuo (não termina).
export function calcularDataFim(
  tratamento: Tratamento,
  item: ItemTratamento,
): Date | null {
  // sem dias marcados não dá para calcular (o formulário já impede isso)
  if (item.duracaoDias === null || tratamento.dias.length === 0) return null;

  let data = inicioDoDia(tratamento.dataInicio);
  let ultimoDiaDeUso = data;
  let diasContados = 0;

  while (diasContados < item.duracaoDias) {
    const abreviacao = DIAS_SEMANA[data.getDay()].abreviacao;
    if (tratamento.dias.includes(abreviacao)) {
      diasContados++;
      ultimoDiaDeUso = data;
    }
    data = addDaysToDate(data, 1);
  }

  return ultimoDiaDeUso;
}

// O item está dentro do período dele nessa data? (não olha o dia da semana)
export function itemEmAndamento(
  tratamento: Tratamento,
  item: ItemTratamento,
  data: Date,
): boolean {
  const dia = inicioDoDia(data);
  if (dia < inicioDoDia(tratamento.dataInicio)) return false;

  const dataFim = calcularDataFim(tratamento, item);
  return dataFim === null || dia <= dataFim;
}

// Tratamentos com dose nessa data, cada um só com os remédios ainda valendo
export function getTratamentosDoDia(
  tratamentos: Tratamento[],
  data: Date,
): Tratamento[] {
  const abreviacao = DIAS_SEMANA[data.getDay()].abreviacao;

  return tratamentos
    .filter((tratamento) => tratamento.dias.includes(abreviacao))
    .map((tratamento) => ({
      ...tratamento,
      medicamentos: tratamento.medicamentos.filter((item) =>
        itemEmAndamento(tratamento, item, data),
      ),
    }))
    .filter((tratamento) => tratamento.medicamentos.length > 0);
}

// Cores (sem repetir) dos tratamentos que caem nessa data
export function getCoresDoDia(tratamentos: Tratamento[], data: Date): string[] {
  const cores = getTratamentosDoDia(tratamentos, data).map((t) => t.cor);
  return [...new Set(cores)];
}

// Quantas unidades o item precisa para ser cadastrado
export function calcularQuantidadeNecessaria(
  item: ItemTratamento,
  diasPorSemana: number,
): number {
  if (item.duracaoDias === null) {
    return item.quantidadePorDia * diasPorSemana; // contínuo: 1 semana
  }
  return item.quantidadePorDia * item.duracaoDias;
}

// Quantas unidades de um medicamento são tomadas de fato na semana
export function calcularConsumoNaSemana(
  medicamentoId: string,
  tratamentos: Tratamento[],
  dataReferencia: Date = new Date(),
): number {
  const domingo = getStartOfWeekDate(dataReferencia);
  let total = 0;

  for (let i = 0; i < 7; i++) {
    const dia = addDaysToDate(domingo, i);

    for (const tratamento of getTratamentosDoDia(tratamentos, dia)) {
      const item = tratamento.medicamentos.find(
        (m) => m.medicamentoId === medicamentoId,
      );
      if (item) total += item.quantidadePorDia;
    }
  }

  return total;
}

// true quando nenhum remédio do tratamento está mais valendo
export function tratamentoConcluido(
  tratamento: Tratamento,
  hoje: Date = new Date(),
): boolean {
  return tratamento.medicamentos.every(
    (item) => !itemEmAndamento(tratamento, item, hoje),
  );
}
export function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}
