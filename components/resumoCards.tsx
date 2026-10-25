import { AppColors, AppFonts } from "@/constants/theme";
import { Medicamento } from "@/contexts/medicamentosContext";
import { Tratamento } from "@/contexts/tratamentosContext";
import {
  calcularConsumoNaSemana,
  calcularConsumoSemanal,
} from "@/utils/tratamentoHelpers";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

// dias que causam os alertas
const DIAS_ALERTA_ESTOQUE = 5;

const DIAS_ALERTA_VALIDADE = 30;

function getEstoqueEfetivo(
  medicamento: Medicamento,
  _tratamentos: Tratamento[],
): number {
  return medicamento.quantidadeEstoque;
}

function getConsumoSemanal(
  medicamento: Medicamento,
  tratamentos: Tratamento[],
): number {
  return calcularConsumoSemanal(medicamento.id, tratamentos);
}

// Quantos dias de consumo restam no estoque. null = sem tratamento (não dá p calcular).
function getDiasRestantesEstoque(
  medicamento: Medicamento,
  tratamentos: Tratamento[],
): number | null {
  const estoque = getEstoqueEfetivo(medicamento, tratamentos);
  if (estoque <= 0) return 0;
  const semanal = getConsumoSemanal(medicamento, tratamentos);
  if (semanal === 0) return null;
  const consumoDiario = semanal / 7;
  return estoque / consumoDiario;
}

// Converte a validade "DD/MM/AAAA" em dias restantes. null = sem validade.
function getDiasParaVencer(medicamento: Medicamento): number | null {
  if (!medicamento.validade) return null;
  const [dia, mes, ano] = medicamento.validade.split("/").map(Number);
  if (!dia || !mes || !ano) return null;
  const validade = new Date(ano, mes - 1, dia, 23, 59, 59);
  const hoje = new Date();
  return Math.ceil((validade.getTime() - hoje.getTime()) / 86400000);
}

function Card({
  icone,
  corIcone,
  titulo,
  children,
}: {
  icone: keyof typeof MaterialIcons.glyphMap;
  corIcone: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name={icone} size={17} color={corIcone} />
        <Text style={[styles.cardTitulo, { color: corIcone }]}>{titulo}</Text>
      </View>
      {children}
    </View>
  );
}

function LinhaItem({ texto }: { texto: string }) {
  return <Text style={styles.itemTexto}> {texto}</Text>;
}

export function ResumoCards({
  medicamentos,
  tratamentos,
}: {
  medicamentos: Medicamento[];
  tratamentos: Tratamento[];
}) {
  if (medicamentos.length === 0) {
    return (
      <Card icone="info" corIcone={AppColors.secondaryText} titulo="Resumo">
        <LinhaItem texto="Cadastre seus medicamentos em Meus Medicamentos para ver o resumo aqui" />
      </Card>
    );
  }

  const acabando = medicamentos
    .map((med) => ({ med, dias: getDiasRestantesEstoque(med, tratamentos) }))
    .filter(
      (item): item is { med: Medicamento; dias: number } =>
        item.dias !== null && item.dias <= DIAS_ALERTA_ESTOQUE,
    );

  const vencendo = medicamentos
    .map((med) => ({ med, dias: getDiasParaVencer(med) }))
    .filter(
      (item): item is { med: Medicamento; dias: number } =>
        item.dias !== null && item.dias <= DIAS_ALERTA_VALIDADE,
    );

  const resumoSemana = medicamentos
    .map((med) => ({
      med,
      semanal: calcularConsumoNaSemana(med.id, tratamentos),
    }))
    .filter((item) => item.semanal > 0);

  const tudoEmDia =
    acabando.length === 0 && vencendo.length === 0 && resumoSemana.length === 0;

  if (tudoEmDia) {
    return (
      <Card
        icone="check-circle"
        corIcone={AppColors.primary}
        titulo="Tudo em dia"
      >
        <LinhaItem texto="Estoque saudável e nenhum alerta para os próximos dias." />
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {acabando.length > 0 && (
        <Card
          icone="warning"
          corIcone={AppColors.danger}
          titulo="Estoque acabando"
        >
          {acabando.map(({ med, dias }) => (
            <LinhaItem
              key={med.id}
              texto={`${med.nome}: ${
                dias <= 0
                  ? "estoque zerado"
                  : `acaba em ${Math.max(1, Math.floor(dias))} dia${
                      Math.floor(dias) === 1 ? "" : "s"
                    }`
              }`}
            />
          ))}
        </Card>
      )}

      {resumoSemana.length > 0 && (
        <Card icone="bar-chart" corIcone={AppColors.label} titulo="Esta semana">
          {resumoSemana.map(({ med, semanal }) => (
            <LinhaItem
              key={med.id}
              texto={`${med.nome}: ${semanal} ${med.unidade}`}
            />
          ))}
        </Card>
      )}

      {vencendo.length > 0 && (
        <Card
          icone="event-busy"
          corIcone={AppColors.danger}
          titulo="Validade próxima"
        >
          {vencendo.map(({ med, dias }) => (
            <LinhaItem
              key={med.id}
              texto={`${med.nome}: ${
                dias < 0
                  ? "vencido"
                  : `vence em ${dias} dia${dias === 1 ? "" : "s"}`
              }`}
            />
          ))}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: AppColors.background,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitulo: {
    fontFamily: AppFonts.semiBold,
    fontSize: 14,
  },
  itemTexto: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
  },
});
