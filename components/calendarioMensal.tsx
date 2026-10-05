import { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { AppColors, AppFonts } from "@/constants/theme";
import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import {
  DIAS_SEMANA,
  MONTH_NAMES,
  WEEKDAY_INITIALS,
  addDaysToDate,
  checkIsSameDay,
  formatarDias,
  getStartOfWeekDate,
} from "@/utils/calendarioHelpers";

type CalendarioMensalModalProps = {
  visible: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
};

// Monta as semanas (linhas de 7 dias) necessárias pra cobrir o mês inteiro,
// incluindo os dias de fora do mês que completam a primeira e a última semana.
function getMonthGridWeeks(monthDate: Date): Date[][] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDate = getStartOfWeekDate(new Date(year, month, 1));

  const weeks: Date[][] = [];
  let cursor = startDate;

  do {
    const week = Array.from({ length: 7 }, () => {
      const day = cursor;
      cursor = addDaysToDate(cursor, 1);
      return day;
    });
    weeks.push(week);
  } while (weeks[weeks.length - 1][6] < lastDayOfMonth);

  return weeks;
}

export function CalendarioMensalModal({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}: CalendarioMensalModalProps) {
  const { tratamentos } = useTratamentos();
  const { medicamentos } = useMedicamentos();

  const [mesExibido, setMesExibido] = useState(selectedDate);
  const [diaFocado, setDiaFocado] = useState(selectedDate);

  // Toda vez que o modal é reaberto, volta a mostrar o mês/dia que está
  // selecionado na tela de trás, em vez de manter o que ficou da última visita.
  useEffect(() => {
    if (visible) {
      setMesExibido(selectedDate);
      setDiaFocado(selectedDate);
    }
  }, [visible, selectedDate]);

  const semanasDoMes = useMemo(
    () => getMonthGridWeeks(mesExibido),
    [mesExibido],
  );
  const hoje = useMemo(() => new Date(), []);

  // Para cada dia da semana (dom, seg, ter...), as cores distintas dos
  // tratamentos que caem nele — usado pra colorir e marcar as células do mês.
  const coresPorDiaSemana = useMemo(() => {
    const mapa = new Map<string, string[]>();
    tratamentos.forEach((tratamento) => {
      tratamento.dias.forEach((diaAbreviado) => {
        const atual = mapa.get(diaAbreviado) ?? [];
        if (!atual.includes(tratamento.cor)) {
          mapa.set(diaAbreviado, [...atual, tratamento.cor]);
        }
      });
    });
    return mapa;
  }, [tratamentos]);

  const diaFocadoAbreviacao = DIAS_SEMANA[diaFocado.getDay()].abreviacao;
  const tratamentosDoDiaFocado = useMemo(
    () =>
      tratamentos.filter((tratamento) =>
        tratamento.dias.includes(diaFocadoAbreviacao),
      ),
    [tratamentos, diaFocadoAbreviacao],
  );

  function irParaMesAnterior() {
    setMesExibido(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() - 1, 1),
    );
  }

  function irParaProximoMes() {
    setMesExibido(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() + 1, 1),
    );
  }

  function handleTocarDia(dia: Date) {
    setDiaFocado(dia);
    onSelectDate(dia);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={AppColors.label} />
          </Pressable>

          <View style={styles.headerNav}>
            <Pressable hitSlop={12} onPress={irParaMesAnterior}>
              <MaterialIcons
                name="chevron-left"
                size={26}
                color={AppColors.primary}
              />
            </Pressable>
            <Text style={styles.headerTitle}>
              {MONTH_NAMES[mesExibido.getMonth()]} de {mesExibido.getFullYear()}
            </Text>
            <Pressable hitSlop={12} onPress={irParaProximoMes}>
              <MaterialIcons
                name="chevron-right"
                size={26}
                color={AppColors.primary}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.weekdaysRow}>
          {WEEKDAY_INITIALS.map((inicial, index) => (
            <Text key={`${inicial}-${index}`} style={styles.weekdayLabel}>
              {inicial}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {semanasDoMes.map((semana, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {semana.map((dia) => {
                const foraDoMes = dia.getMonth() !== mesExibido.getMonth();
                const isHoje = checkIsSameDay(dia, hoje);
                const isFocado = checkIsSameDay(dia, diaFocado);
                const coresDoDia =
                  coresPorDiaSemana.get(DIAS_SEMANA[dia.getDay()].abreviacao) ??
                  [];
                const corUnica =
                  coresDoDia.length === 1 ? coresDoDia[0] : undefined;
                const temVariasCores = coresDoDia.length > 1;

                return (
                  <Pressable
                    key={dia.toISOString()}
                    style={styles.dayCell}
                    onPress={() => handleTocarDia(dia)}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        isHoje && styles.dayCircleHoje,
                        isFocado && styles.dayCircleFocado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          isHoje && styles.dayNumberHoje,
                          foraDoMes && styles.dayNumberForaDoMes,
                          isFocado && styles.dayNumberFocado,
                        ]}
                      >
                        {dia.getDate()}
                      </Text>
                    </View>
                    {corUnica && (
                      <View
                        style={[
                          styles.barraTratamento,
                          { backgroundColor: corUnica },
                        ]}
                      />
                    )}
                    {temVariasCores && (
                      <View style={styles.dayDotsRow}>
                        {coresDoDia.slice(0, 3).map((cor, index) => (
                          <View
                            key={index}
                            style={[styles.dayDot, { backgroundColor: cor }]}
                          />
                        ))}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.painelDivisor} />

        <Text style={styles.painelTitulo}>
          Tratamentos de {diaFocado.getDate()} de{" "}
          {MONTH_NAMES[diaFocado.getMonth()].toLowerCase()}
        </Text>

        <FlatList
          data={tratamentosDoDiaFocado}
          keyExtractor={(item) => item.id}
          style={styles.painelLista}
          contentContainerStyle={styles.painelListaConteudo}
          renderItem={({ item }) => {
            const medicamento = medicamentos.find(
              (m) => m.id === item.medicamentoId,
            );
            return (
              <View style={styles.painelItem}>
                <View style={styles.painelItemHeader}>
                  <View
                    style={[
                      styles.painelItemCorDot,
                      { backgroundColor: item.cor },
                    ]}
                  />
                  <Text style={styles.painelItemNome}>{item.nome}</Text>
                </View>
                <Text style={styles.painelItemInfo}>
                  {medicamento?.nome ?? "Medicamento removido"} •{" "}
                  {formatarDias(item.dias)} • {item.quantidadePorDia}x por dia
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.painelVazio}>
              Nenhum tratamento para esse dia.
            </Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingHorizontal: 16,
  },
  header: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: AppFonts.semiBold,
    fontSize: 17,
    color: AppColors.title,
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontFamily: AppFonts.medium,
    fontSize: 12,
    color: AppColors.muted,
  },
  grid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleHoje: {
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  dayCircleFocado: {
    borderWidth: 2,
    borderColor: AppColors.label,
  },
  dayNumber: {
    fontFamily: AppFonts.medium,
    fontSize: 15,
    color: AppColors.label,
  },
  barraTratamento: {
    width: 18,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
  dayNumberForaDoMes: {
    color: AppColors.disabled,
  },
  dayNumberHoje: {
    color: AppColors.primary,
    fontFamily: AppFonts.semiBold,
  },
  dayNumberFocado: {
    fontFamily: AppFonts.semiBold,
  },
  dayDotsRow: {
    flexDirection: "row",
    gap: 3,
    height: 5,
    marginTop: 4,
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  painelDivisor: {
    borderTopWidth: 1,
    borderTopColor: AppColors.divider,
    marginTop: 16,
  },
  painelTitulo: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.title,
    marginTop: 16,
    marginBottom: 10,
  },
  painelLista: {
    flex: 1,
  },
  painelListaConteudo: {
    gap: 8,
    paddingBottom: 24,
  },
  painelItem: {
    backgroundColor: AppColors.surface,
    padding: 14,
    borderRadius: 8,
  },
  painelItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  painelItemCorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  painelItemNome: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  painelItemInfo: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginTop: 4,
  },
  painelVazio: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.muted,
  },
});
