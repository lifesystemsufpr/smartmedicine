import { StyleSheet } from "react-native";

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

  textItem: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#666666",
  },

  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});

export { styles };

