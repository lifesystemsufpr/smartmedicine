import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppColors, AppFonts } from "../constants/theme";

export const DIAS_SEMANA = [
  { inicial: "D", abreviacao: "dom" },
  { inicial: "S", abreviacao: "seg" },
  { inicial: "T", abreviacao: "ter" },
  { inicial: "Q", abreviacao: "qua" },
  { inicial: "Q", abreviacao: "qui" },
  { inicial: "S", abreviacao: "sex" },
  { inicial: "S", abreviacao: "sáb" },
];

type Props = {
  diasSelecionados: boolean[]; // 7 posições, true = dia marcado
  onToggleDia: (index: number) => void;
};

export function SeletorDiasSemana({ diasSelecionados, onToggleDia }: Props) {
  return (
    <View style={styles.linha}>
      {DIAS_SEMANA.map((dia, index) => {
        const selecionado = diasSelecionados[index];

        return (
          <Pressable
            key={dia.abreviacao}
            style={[styles.dia, selecionado && styles.diaSelecionado]}
            onPress={() => onToggleDia(index)}
          >
            <Text
              style={[
                styles.diaTexto,
                selecionado && styles.diaTextoSelecionado,
              ]}
            >
              {dia.inicial}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dia: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: AppColors.inputBorder,
  },
  diaSelecionado: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  diaTexto: {
    fontFamily: AppFonts.semiBold,
    fontSize: 14,
    color: "#333333",
  },
  diaTextoSelecionado: {
    color: "#FFFFFF",
  },
});
