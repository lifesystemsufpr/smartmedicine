import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppColors, AppFonts } from "@/constants/theme";

const MENU_ITEMS: { icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
  { icon: "person-outline", label: "Meus dados" },
  { icon: "notifications-none", label: "Notificações" },
  { icon: "help-outline", label: "Ajuda e suporte" },
];

export default function PerfilScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={32} color={AppColors.primary} />
        </View>
        <View>
          <Text style={styles.name}>Usuário</Text>
          <Text style={styles.email}>usuario@email.com</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.label} style={styles.menuItem}>
            <MaterialIcons
              name={item.icon}
              size={22}
              color={AppColors.secondaryText}
            />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={AppColors.disabled}
            />
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={() => router.replace("/login")}
      >
        <MaterialIcons name="logout" size={20} color={AppColors.danger} />
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.surfaceAccent,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: AppFonts.bold,
    fontSize: 18,
    color: AppColors.title,
  },
  email: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginTop: 2,
  },
  menu: {
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  menuItemText: {
    flex: 1,
    fontFamily: AppFonts.medium,
    fontSize: 14,
    color: AppColors.label,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.dangerLight,
    marginTop: "auto",
    marginBottom: 24,
  },
  logoutText: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.danger,
  },
});
