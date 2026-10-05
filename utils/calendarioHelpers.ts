export const WEEKDAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const DIAS_SEMANA = [
  { inicial: "D", abreviacao: "dom" },
  { inicial: "S", abreviacao: "seg" },
  { inicial: "T", abreviacao: "ter" },
  { inicial: "Q", abreviacao: "qua" },
  { inicial: "Q", abreviacao: "qui" },
  { inicial: "S", abreviacao: "sex" },
  { inicial: "S", abreviacao: "sáb" },
];

export function getStartOfWeekDate(date: Date) {
  const resultDate = new Date(date);
  resultDate.setHours(0, 0, 0, 0);
  resultDate.setDate(resultDate.getDate() - resultDate.getDay());
  return resultDate;
}

export function addDaysToDate(date: Date, daysToAdd: number) {
  const resultDate = new Date(date);
  resultDate.setDate(resultDate.getDate() + daysToAdd);
  return resultDate;
}

export function checkIsSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

// Transforma ["seg", "qua", "sex"] em "Toda seg, qua e sex" — usado no
// cadastro de tratamento e na lista do calendário.
export function formatarDias(dias: string[]): string {
  if (dias.length === 0) return "Nenhum dia selecionado";
  if (dias.length === DIAS_SEMANA.length) return "Todos os dias";

  const primeiroDia = dias[0];
  const artigo =
    primeiroDia === "dom" || primeiroDia === "sáb" ? "Todo" : "Toda";

  if (dias.length === 1) return `${artigo} ${dias[0]}`;
  return `${artigo} ${dias.slice(0, -1).join(", ")} e ${dias[dias.length - 1]}`;
}
