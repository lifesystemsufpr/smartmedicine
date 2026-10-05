import { StyleSheet } from "react-native";

import { AppColors, AppFonts } from "@/constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontFamily: AppFonts.bold,
    fontSize: 35,
    color: AppColors.title,
    marginBottom: 80,
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

  textItem: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
  },

  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  resumo: {
    fontFamily: AppFonts.regular,
    fontSize: 12,
    color: AppColors.secondaryText,
    marginBottom: 16,
  },
  quantidadeLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  quantidade: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: AppColors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  quantidadeSelecionada: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  quantidadeTexto: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  quantidadeTextoSelecionado: {
    color: AppColors.buttonText,
  },
  itemInfo: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginTop: 4,
  },
});

export { styles };
