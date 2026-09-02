import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    type ViewToken,
} from "react-native";

// Calculamos a largura exata que os dias ocupam para que a barra de rolagem
// fique do tamanho exato do calendário e não vá até o final da tela.
const CALENDAR_WIDTH = 350;
const PAST_WEEKS_COUNT = 26;
const FUTURE_WEEKS_COUNT = 26;

const WEEKDAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
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

function getStartOfWeekDate(date: Date) {
  const resultDate = new Date(date);
  resultDate.setHours(0, 0, 0, 0);
  resultDate.setDate(resultDate.getDate() - resultDate.getDay());
  return resultDate;
}

function addDaysToDate(date: Date, daysToAdd: number) {
  const resultDate = new Date(date);
  resultDate.setDate(resultDate.getDate() + daysToAdd);
  return resultDate;
}

function checkIsSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

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
            </Pressable>
          );
        })}
      </View>
    ),
    [onSelectDate, selectedDate, currentDate],
  );

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.monthHeader}>{currentMonthLabel}</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    gap: 12,
  },
  monthHeader: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#1B5E20",
    paddingHorizontal: 24,
    textAlign: "center",
    marginBottom: 4,
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
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#999999",
  },
  weekdayTextSelected: {
    color: "#2E7D32",
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
    borderColor: "#2E7D32",
  },
  dayCircleSelected: {
    backgroundColor: "#2E7D32",
  },
  dayNumberText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#333333",
  },
  dayNumberTextToday: {
    color: "#2E7D32",
    fontFamily: "Poppins_600SemiBold",
  },
  dayNumberTextSelected: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
  },
});
