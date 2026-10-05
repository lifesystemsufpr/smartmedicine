import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";

import { AppColors, AppFonts } from "@/constants/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  function handleSubmit() {
    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Digite um e-mail válido.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // TODO: substituir por chamada real ao backend quando disponível.
    setTimeout(() => {
      setIsSubmitting(false);
      router.replace("/(tabs)");
    }, 400);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoWrap}>
            <MaterialIcons name="medication" size={40} color={AppColors.primary} />
          </View>

          <Text style={styles.title}>Smart Medicine</Text>
          <Text style={styles.subtitle}>Entre para continuar cuidando da sua saúde</Text>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>E-mail</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor={AppColors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError(null);
                }}
              />
            </View>

            <View>
              <Text style={styles.label}>Senha</Text>

              <View style={styles.passwordWrap}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor={AppColors.muted}
                  secureTextEntry={!isPasswordVisible}
                  autoComplete="password"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    if (error) setError(null);
                  }}
                />

                <Pressable
                  hitSlop={8}
                  onPress={() => setIsPasswordVisible((visible) => !visible)}
                >
                  <MaterialIcons
                    name={isPasswordVisible ? "visibility-off" : "visibility"}
                    size={20}
                    color={AppColors.muted}
                  />
                </Pressable>
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </Pressable>

            <Pressable
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Ainda não possui uma conta?</Text>

            <Pressable>
              <Text style={styles.registerLink}>Criar conta</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppColors.surfaceAccent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontFamily: AppFonts.bold,
    fontSize: 30,
    color: AppColors.title,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: AppFonts.regular,
    fontSize: 14,
    color: AppColors.secondaryText,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },

  form: {
    width: "100%",
    maxWidth: 400,
    gap: 18,
  },

  label: {
    fontFamily: AppFonts.medium,
    fontSize: 14,
    color: AppColors.label,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontFamily: AppFonts.regular,
    fontSize: 14,
    color: AppColors.inputText,
    backgroundColor: AppColors.background,
  },

  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: AppColors.background,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontFamily: AppFonts.regular,
    fontSize: 14,
    color: AppColors.inputText,
  },

  errorText: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.danger,
    marginTop: -8,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -4,
  },

  forgotPasswordText: {
    fontFamily: AppFonts.medium,
    fontSize: 13,
    color: AppColors.primary,
  },

  button: {
    height: 50,
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.buttonText,
  },

  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    gap: 4,
  },

  registerText: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
  },

  registerLink: {
    fontFamily: AppFonts.semiBold,
    fontSize: 13,
    color: AppColors.primary,
  },
});
