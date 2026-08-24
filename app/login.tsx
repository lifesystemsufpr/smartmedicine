import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";

export default function LoginScreen() {
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
      <View style={styles.content}>
        <Text style={styles.title}>Smart Medicine</Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>E-mail</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={styles.label}>Senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Ainda não possui uma conta?</Text>

          <Pressable>
            <Text style={styles.registerLink}>Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 35,
    color: "#1B5E20",
    marginBottom: 80,
  },

  form: {
    width: "100%",
    maxWidth: 400,
    gap: 18,
  },

  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: "#333333",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -4,
  },

  forgotPasswordText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#2E7D32",
  },

  button: {
    height: 50,
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    gap: 4,
  },

  registerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#666666",
  },

  registerLink: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#2E7D32",
  },
});
