import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
// Se estiver usando Expo, os ícones já vêm embutidos:
import { Feather } from "@expo/vector-icons";
import { WeekCalendar } from "../../components/calendario"; // Ajuste o caminho do seu calendário

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleOpenAddMedication = () => {
    // Aqui vamos colocar a navegação para a tela de cadastro de medicamentos.
    console.log("Navegar para tela de novo medicamento");
  };

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
        onPress={handleOpenAddMedication}
      >
        <Feather name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Uma cor de fundo bem suave para destacar o calendário branco
  },
  calendarSection: {
    paddingTop: 48, // Espaço para a barra de status do celular
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  medicationListSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "Poppins_400Regular",
    color: "#666666",
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24, // Fica no canto inferior direito
    width: 60,
    height: 60,
    borderRadius: 30, // Deixa perfeitamente redondo
    backgroundColor: "#2E7D32", // O mesmo verde do seu calendário
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
    backgroundColor: "#1B5E20", // Fica um verde mais escuro ao apertar
    transform: [{ scale: 0.96 }], // Dá um leve efeitinho de afundar
  },
});
