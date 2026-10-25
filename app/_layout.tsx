import { MedicamentosProvider } from "@/contexts/medicamentosContext";
import { TratamentosProvider } from "@/contexts/tratamentosContext";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
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
    <SafeAreaProvider>
      <MedicamentosProvider>
        <TratamentosProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />

              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>

            <StatusBar style="dark" />
          </ThemeProvider>
        </TratamentosProvider>
      </MedicamentosProvider>
    </SafeAreaProvider>
  );
}
