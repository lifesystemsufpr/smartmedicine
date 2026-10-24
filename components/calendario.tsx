import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppColors, AppFonts } from "@/constants/theme";
import {
  DIAS_SEMANA,
  MONTH_NAMES,
  WEEKDAY_INITIALS,
  addDaysToDate,
  checkIsSameDay,
  formatarDias,
  getStartOfWeekDate,
} from "@/utils/calendarioHelpers";
import CalendarioMensalModal from "./calendarioMensal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_WIDTH = SCREEN_WIDTH - 32;

type WeekCalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export function WeekCalendar({
  selectedDate,
  onSelectDate,
}: WeekCalendarProps) {
  const { tratamentos } = useTratamentos();
  const { medicamentos } = useMedicamentos();

  const [calendarioExpandidoVisivel, setCalendarioExpandidoVisivel] =
    useState(false);

  // Mapeia as cores dos tratamentos por dia da semana (ex: "seg", "ter" -> ["#FF0000", "#00FF00"])
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

  const startOfWeek = getStartOfWeekDate(selectedDate);
  const diasDaSemana = Array.from({ length: 7 }, (_, index) =>
    addDaysToDate(startOfWeek, index),
  );

  const currentDate = new Date();

  const diaSelecionadoAbreviacao =
    DIAS_SEMANA[selectedDate.getDay()].abreviacao;
  const tratamentosDoDia = tratamentos.filter((t) =>
    t.dias.includes(diaSelecionadoAbreviacao),
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Mês */}
      <Pressable
        style={styles.monthHeaderRow}
        onPress={() => setCalendarioExpandidoVisivel(true)}
      >
        <Text style={styles.monthHeader}>
          {MONTH_NAMES[selectedDate.getMonth()]} de {selectedDate.getFullYear()}
        </Text>
        <MaterialIcons
          name="calendar-month"
          size={18}
          color={AppColors.primary}
        />
      </Pressable>

      {/* Visualização da Semana com as bolinhas/barras de tratamentos */}
      <View style={styles.weekRow}>
        {diasDaSemana.map((dayDate) => {
          const isToday = checkIsSameDay(dayDate, currentDate);
          const isSelected = checkIsSameDay(dayDate, selectedDate);

          const abreviacaoDia = DIAS_SEMANA[dayDate.getDay()].abreviacao;
          const coresDoDia = coresPorDiaSemana.get(abreviacaoDia) ?? [];
          const corUnica = coresDoDia.length === 1 ? coresDoDia[0] : undefined;
          const temVariasCores = coresDoDia.length > 1;

          return (
            <Pressable
              key={dayDate.toISOString()}
              style={styles.dayContainer}
              onPress={() => onSelectDate(dayDate)}
            >
              <Text
                style={[
                  styles.weekdayText,
                  isSelected && styles.weekdayTextSelected,
                ]}
              >
                {WEEKDAY_INITIALS[dayDate.getDay()]}
              </Text>
              <View
                style={[
                  styles.dayCircle,
                  isToday && styles.dayCircleToday,
                  isSelected && styles.dayCircleSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumberText,
                    isToday && styles.dayNumberTextToday,
                    isSelected && styles.dayNumberTextSelected,
                  ]}
                >
                  {dayDate.getDate()}
                </Text>
              </View>

              {/* Barra se houver apenas 1 tratamento no dia */}
              {corUnica && (
                <View
                  style={[
                    styles.barraTratamento,
                    { backgroundColor: corUnica },
                  ]}
                />
              )}

              {/* Múltiplas bolinhas se houver mais de 1 tratamento no dia */}
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

      {/* Lista de Tratamentos do Dia */}
      <Text style={styles.listTitle}>Tratamentos do dia</Text>
      <FlatList
        data={tratamentosDoDia}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const medicamento = medicamentos.find(
            (m) => m.id === item.medicamentoId,
          );
          return (
            <View style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <View
                  style={[styles.listItemCorDot, { backgroundColor: item.cor }]}
                />
                <Text style={styles.listItemNome}>{item.nome}</Text>
              </View>
              <Text style={styles.listItemInfo}>
                {medicamento?.nome ?? "Medicamento removido"} •{" "}
                {formatarDias(item.dias)} • {item.quantidadePorDia}x por dia
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            Nenhum tratamento para esse dia.
          </Text>
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      <CalendarioMensalModal
        visible={calendarioExpandidoVisivel}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onClose={() => setCalendarioExpandidoVisivel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CALENDAR_WIDTH,
    alignSelf: "center",
    gap: 12,
    marginVertical: 8,
  },
  monthHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  monthHeader: {
    fontFamily: AppFonts.semiBold,
    fontSize: 16,
    color: AppColors.title,
    textAlign: "center",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: AppColors.surface,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dayContainer: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  weekdayText: {
    fontFamily: AppFonts.medium,
    fontSize: 12,
    color: AppColors.muted,
  },
  weekdayTextSelected: {
    color: AppColors.primary,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  dayCircleSelected: {
    backgroundColor: AppColors.primary,
  },
  dayNumberText: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
    color: AppColors.label,
  },
  dayNumberTextToday: {
    color: AppColors.primary,
    fontFamily: AppFonts.semiBold,
  },
  dayNumberTextSelected: {
    color: "#FFFFFF",
    fontFamily: AppFonts.semiBold,
  },
  barraTratamento: {
    width: 14,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  dayDotsRow: {
    flexDirection: "row",
    gap: 2,
    height: 4,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  listTitle: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.title,
    marginTop: 8,
  },
  listContent: {
    gap: 8,
    paddingBottom: 16,
  },
  listItem: {
    backgroundColor: AppColors.surface,
    padding: 12,
    borderRadius: 8,
  },
  listItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listItemCorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listItemNome: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  listItemInfo: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginTop: 4,
  },
  emptyListText: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.muted,
  },
});
