import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from "react-native";

import { CalendarioMensalModal } from "./calendarioMensal";
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

// Calculamos a largura exata que os dias ocupam para que a barra de rolagem
// fique do tamanho exato do calendário e não vá até o final da tela.
const CALENDAR_WIDTH = 350;
const PAST_WEEKS_COUNT = 26;
const FUTURE_WEEKS_COUNT = 26;

function getFormattedMonthAndYear(date: Date) {
  return `${MONTH_NAMES[date.getMonth()]} de ${date.getFullYear()}`;
}

type WeekData = {
  weekId: string;
  daysInWeek: Date[];
};

type WeekCalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export function WeekCalendar({
  selectedDate,
  onSelectDate,
}: WeekCalendarProps) {
  const { tratamentos } = useTratamentos(); // lista compartilhada vem do Context
  const { medicamentos } = useMedicamentos();

  const diaSelecionadoAbreviacao = DIAS_SEMANA[selectedDate.getDay()].abreviacao;
  const tratamentosDoDia = useMemo(
    () =>
      tratamentos.filter((tratamento) =>
        tratamento.dias.includes(diaSelecionadoAbreviacao),
      ),
    [tratamentos, diaSelecionadoAbreviacao],
  );

  // Para cada dia da semana (dom, seg, ter...), as cores distintas dos
  // tratamentos que caem nele — vira uma bolinha colorida por tratamento.
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

  const currentDate = useMemo(() => new Date(), []);
  const currentWeekStartDate = useMemo(
    () => getStartOfWeekDate(currentDate),
    [currentDate],
  );

  // 2. GERAÇÃO DOS DADOS
  // Cria a lista gigante de semanas (passado, presente e futuro)
  const calendarWeeks = useMemo<WeekData[]>(() => {
    return Array.from(
      { length: PAST_WEEKS_COUNT + FUTURE_WEEKS_COUNT + 1 },
      (_, index) => {
        const weekOffset = index - PAST_WEEKS_COUNT;
        const weekStartDate = addDaysToDate(
          currentWeekStartDate,
          weekOffset * 7,
        );

        return {
          weekId: String(weekOffset),
          daysInWeek: Array.from({ length: 7 }, (_, dayIndex) =>
            addDaysToDate(weekStartDate, dayIndex),
          ),
        };
      },
    );
  }, [currentWeekStartDate]);

  const [currentMonthLabel, setCurrentMonthLabel] = useState(() =>
    getFormattedMonthAndYear(currentDate),
  );
  const [calendarioExpandidoVisivel, setCalendarioExpandidoVisivel] =
    useState(false);

  // Fica observando o scroll do usuário para saber qual semana ele está vendo agora
  const handleVisibleWeeksChange = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const currentlyVisibleWeek = viewableItems[0]?.item as
        | WeekData
        | undefined;

      if (currentlyVisibleWeek) {
        const middleDayOfWeek = currentlyVisibleWeek.daysInWeek[3];
        setCurrentMonthLabel(getFormattedMonthAndYear(middleDayOfWeek));
      }
    },
  ).current;

  const viewabilityConfiguration = useRef({
    itemVisiblePercentThreshold: 51,
  }).current;

  //Ajuda o FlatList a carregar super rápido, pois já dizemos o tamanho exato de cada semana
  const calculateItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: CALENDAR_WIDTH, // Usamos a largura do calendário aqui
      offset: CALENDAR_WIDTH * index,
      index,
    }),
    [],
  );

  // Como cada semana vai ser desenhada na tela
  const renderWeekRow = useCallback(
    ({ item }: { item: WeekData }) => (
      <View style={styles.weekRow}>
        {item.daysInWeek.map((dayDate) => {
          const isToday = checkIsSameDay(dayDate, currentDate);
          const isSelected = checkIsSameDay(dayDate, selectedDate);
          const coresDoDia =
            coresPorDiaSemana.get(DIAS_SEMANA[dayDate.getDay()].abreviacao) ??
            [];
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
    ),
    [onSelectDate, selectedDate, currentDate, coresPorDiaSemana],
  );

  return (
    <View style={styles.calendarContainer}>
      <Pressable
        style={styles.monthHeaderRow}
        onPress={() => setCalendarioExpandidoVisivel(true)}
        hitSlop={8}
      >
        <Text style={styles.monthHeader}>{currentMonthLabel}</Text>
        <MaterialIcons name="calendar-month" size={16} color={AppColors.primary} />
      </Pressable>

      <FlatList //
        data={calendarWeeks}
        keyExtractor={(item) => item.weekId}
        renderItem={renderWeekRow}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={CALENDAR_WIDTH} // O scroll agora "gruda" na largura certa
        snapToAlignment="center"
        showsHorizontalScrollIndicator={true}
        persistentScrollbar={true}
        indicatorStyle="black"
        initialScrollIndex={PAST_WEEKS_COUNT}
        getItemLayout={calculateItemLayout}
        onViewableItemsChanged={handleVisibleWeeksChange}
        viewabilityConfig={viewabilityConfiguration}
        removeClippedSubviews={true}
        style={styles.flatList} // Adicionamos estilo à própria FlatList
        contentContainerStyle={styles.flatListContent}
      />

      {/* TRATAMENTOS DO DIA SELECIONADO, vindos do Context */}
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
        style={styles.list}
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
  calendarContainer: {
    gap: 12,
    flex: 1, // agora o conteúdo ocupa a tela inteira para a lista rolar
  },
  monthHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 4,
  },
  monthHeader: {
    fontFamily: AppFonts.semiBold,
    fontSize: 16,
    color: AppColors.title,
    textAlign: "center",
  },
  flatList: {
    width: CALENDAR_WIDTH, // Limita a largura do scroll à largura do calendário
    alignSelf: "center", // Centraliza a lista na tela inteira
  },
  flatListContent: {
    paddingBottom: 12,
  },
  weekRow: {
    width: CALENDAR_WIDTH, // As semanas agora têm exatamente o mesmo tamanho da lista
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  dayContainer: {
    alignItems: "center",
    gap: 6,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  dayCircleSelected: {
    borderWidth: 2,
    borderColor: AppColors.label,
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
    fontFamily: AppFonts.semiBold,
  },
  barraTratamento: {
    width: 18,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
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
  listTitle: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.title,
    paddingHorizontal: 24,
  },
  list: {
    flex: 1, // pega o espaço restante da tela e rola verticalmente
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 8,
  },
  listItem: {
    backgroundColor: AppColors.surface,
    padding: 14,
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
    paddingHorizontal: 24,
  },
});
