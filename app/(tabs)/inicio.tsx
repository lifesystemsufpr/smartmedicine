import * as Notifications from "expo-notifications"
import { WeekCalendar } from "@/components/calendario";
import { ResumoCards } from "@/components/resumoCards";
import { AppColors } from "@/constants/theme";
import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

// Como a notificação se comporta
Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
})

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { medicamentos } = useMedicamentos();
  const { tratamentos } = useTratamentos();

  useEffect(() => {
    // Permissão para enviar notificação
    async function requestPermissions(): Promise<void> {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Permita as notificações para o alarme funcionar",
        )
      }
    }

    // Android precisa de criar canal para tocar som
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("alarm-channel", {
        name: "Alarme",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      })
    }
    requestPermissions()
  }, [])

  return (
    <View style={styles.container}>
      {/* O calendário */}
      <View style={styles.calendarSection}>
        <WeekCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </View>

      {/* Resumo geral: estoque acabando, consumo da semana e validade */}
      <ScrollView
        style={styles.resumoSection}
        contentContainerStyle={styles.resumoContent}
        showsVerticalScrollIndicator={false}
      >
        <ResumoCards medicamentos={medicamentos} tratamentos={tratamentos} />
      </ScrollView>

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
    backgroundColor: AppColors.backgroundAlt,
  },
  calendarSection: {
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: AppColors.background,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  resumoSection: {
    flex: 1,
  },
  resumoContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 96,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
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
