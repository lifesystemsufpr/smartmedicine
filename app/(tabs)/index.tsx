import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
// Se estiver usando Expo, os ícones já vêm embutidos:
import { Feather } from "@expo/vector-icons";
import { WeekCalendar } from "@/components/calendario";
import { AppColors, AppFonts } from "@/constants/theme";

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      {/* O calendário */}
      <View style={styles.calendarSection}>
        <WeekCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </View>

      {/*
        Aqui fica a FlatList com os medicamentos
        do dia selecionado (selectedDate).
      */}
      <View style={styles.medicationListSection}>
        <Text style={styles.emptyText}>
          Nenhum medicamento para {selectedDate.toLocaleDateString("pt-BR")}
        </Text>
      </View>

      {/* Botão Flutuante (FAB) */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push("/cadastro_tratamento")}
      >
        <Feather name="plus" size={28} color={AppColors.buttonText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundAlt, // fundo bem suave para destacar o calendário branco
  },
  calendarSection: {
    paddingTop: 48, // Espaço para a barra de status do celular
    paddingBottom: 16,
    backgroundColor: AppColors.background,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  medicationListSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: AppFonts.regular,
    color: AppColors.secondaryText,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24, // Fica no canto inferior direito
    width: 60,
    height: 60,
    borderRadius: 30, // Deixa perfeitamente redondo
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Sombra para Android
    elevation: 8,
  },
  fabPressed: {
    backgroundColor: AppColors.title, // verde mais escuro ao apertar
    transform: [{ scale: 0.96 }], // Dá um leve efeitinho de afundar
  },
});
