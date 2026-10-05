import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";

import { AppColors, AppFonts } from "@/constants/theme";
import { Medicamento, useMedicamentos } from "@/contexts/medicamentosContext";
import { Tratamento, useTratamentos } from "@/contexts/tratamentosContext";

const UNIDADES = ["comprimidos", "ml", "gotas", "cápsulas"];

// Estoque é considerado "acabando" quando resta menos que esse tanto de dias,
// calculado a partir do consumo dos tratamentos que usam esse medicamento.
const DIAS_ALERTA_ESTOQUE = 5;
// Quando o medicamento não está em nenhum tratamento, não dá pra calcular consumo:
// nesse caso avisamos por uma quantidade mínima simples.
const QUANTIDADE_MINIMA_SEM_TRATAMENTO = 5;

function getAvisoEstoque(
  medicamento: Medicamento,
  tratamentos: Tratamento[],
): string | null {
  if (medicamento.quantidadeEstoque <= 0) {
    return "Estoque zerado";
  }

  const consumoSemanal = tratamentos
    .filter((tratamento) => tratamento.medicamentoId === medicamento.id)
    .reduce(
      (total, tratamento) =>
        total + tratamento.quantidadePorDia * tratamento.dias.length,
      0,
    );

  if (consumoSemanal > 0) {
    const consumoDiario = consumoSemanal / 7;
    const diasRestantes = medicamento.quantidadeEstoque / consumoDiario;

    if (diasRestantes <= DIAS_ALERTA_ESTOQUE) {
      const dias = Math.max(1, Math.floor(diasRestantes));
      return `Acaba em ~${dias} dia${dias === 1 ? "" : "s"}`;
    }

    return null;
  }

  if (medicamento.quantidadeEstoque <= QUANTIDADE_MINIMA_SEM_TRATAMENTO) {
    return "Estoque baixo";
  }

  return null;
}

export default function MedicamentosScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { medicamentos, adicionarMedicamento } = useMedicamentos();
  const { tratamentos } = useTratamentos();

  const [formularioVisivel, setFormularioVisivel] = useState(false);
  const [nome, setNome] = useState("");
  const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
  const [unidade, setUnidade] = useState(UNIDADES[0]);
  const [validade, setValidade] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!fontsLoaded) {
    return null;
  }

  function fecharFormulario() {
    setFormularioVisivel(false);
    setError(null);
    setNome("");
    setQuantidadeEstoque("");
    setUnidade(UNIDADES[0]);
    setValidade("");
  }

  function handleAdicionar() {
    const quantidade = Number(quantidadeEstoque);

    if (nome.trim() === "") {
      setError("Informe o nome do medicamento.");
      return;
    }

    if (!quantidadeEstoque.trim() || Number.isNaN(quantidade) || quantidade <= 0) {
      setError("Informe uma quantidade em estoque válida.");
      return;
    }

    adicionarMedicamento({
      nome: nome.trim(),
      quantidadeEstoque: quantidade,
      unidade,
      validade: validade.trim() || undefined,
    });

    fecharFormulario();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Medicamentos</Text>
        <Text style={styles.subtitle}>Cadastre e acompanhe seu estoque</Text>
      </View>

      {medicamentos.length === 0 ? (
        <View style={styles.content}>
          <View style={styles.emptyIconWrap}>
            <MaterialIcons name="medication" size={36} color={AppColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum medicamento cadastrado</Text>
          <Text style={styles.emptyText}>
            Toque no + para adicionar um medicamento e começar seu estoque.
          </Text>
        </View>
      ) : (
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const aviso = getAvisoEstoque(item, tratamentos);
            return (
              <View style={styles.listItem}>
                <Text style={styles.listItemNome}>{item.nome}</Text>
                <Text style={styles.listItemInfo}>
                  {item.quantidadeEstoque} {item.unidade} em estoque
                  {item.validade ? ` • validade ${item.validade}` : ""}
                </Text>
                {aviso && (
                  <Text style={styles.avisoEstoque}>⚠ {aviso}</Text>
                )}
              </View>
            );
          }}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setFormularioVisivel(true)}
      >
        <MaterialIcons name="add" size={28} color={AppColors.buttonText} />
      </Pressable>

      <Modal
        visible={formularioVisivel}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={fecharFormulario}
      >
        <SafeAreaView style={styles.modalContainer} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <Pressable hitSlop={12} onPress={fecharFormulario}>
              <MaterialIcons name="close" size={24} color={AppColors.label} />
            </Pressable>
            <Text style={styles.modalTitle}>Novo medicamento</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome do medicamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Paracetamol"
              placeholderTextColor={AppColors.muted}
              value={nome}
              onChangeText={(value) => {
                setNome(value);
                if (error) setError(null);
              }}
            />

            <View style={styles.row}>
              <View style={styles.quantidadeField}>
                <Text style={styles.label}>Quantidade em estoque</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={AppColors.muted}
                  keyboardType="numeric"
                  value={quantidadeEstoque}
                  onChangeText={(value) => {
                    setQuantidadeEstoque(value);
                    if (error) setError(null);
                  }}
                />
              </View>
            </View>

            <Text style={styles.label}>Unidade</Text>
            <View style={styles.unidadeLinha}>
              {UNIDADES.map((opcao) => {
                const selecionada = opcao === unidade;
                return (
                  <Pressable
                    key={opcao}
                    style={[
                      styles.unidade,
                      selecionada && styles.unidadeSelecionada,
                    ]}
                    onPress={() => setUnidade(opcao)}
                  >
                    <Text
                      style={[
                        styles.unidadeTexto,
                        selecionada && styles.unidadeTextoSelecionada,
                      ]}
                    >
                      {opcao}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Validade (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={AppColors.muted}
              value={validade}
              onChangeText={setValidade}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Pressable style={styles.addButton} onPress={handleAdicionar}>
              <MaterialIcons name="add" size={22} color={AppColors.buttonText} />
              <Text style={styles.addButtonText}>Adicionar medicamento</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
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
    marginBottom: 20,
  },
  title: {
    fontFamily: AppFonts.bold,
    fontSize: 24,
    color: AppColors.title,
  },
  subtitle: {
    fontFamily: AppFonts.regular,
    fontSize: 14,
    color: AppColors.secondaryText,
    marginTop: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabPressed: {
    backgroundColor: AppColors.title,
    transform: [{ scale: 0.96 }],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 16,
  },
  modalTitle: {
    fontFamily: AppFonts.semiBold,
    fontSize: 17,
    color: AppColors.title,
  },
  modalHeaderSpacer: {
    width: 24,
  },
  form: {
    gap: 6,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  quantidadeField: {
    flex: 1,
  },
  label: {
    fontFamily: AppFonts.semiBold,
    fontSize: 13,
    color: AppColors.label,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 46,
    borderWidth: 1,
    borderColor: AppColors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontFamily: AppFonts.regular,
    fontSize: 14,
    color: AppColors.inputText,
    backgroundColor: AppColors.background,
  },
  unidadeLinha: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  unidade: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: AppColors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  unidadeSelecionada: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  unidadeTexto: {
    fontFamily: AppFonts.medium,
    fontSize: 13,
    color: AppColors.label,
  },
  unidadeTextoSelecionada: {
    color: AppColors.buttonText,
  },
  errorText: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.danger,
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.buttonText,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppColors.surfaceAccent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  emptyText: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.muted,
    textAlign: "center",
    maxWidth: 260,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    gap: 8,
  },
  listItem: {
    backgroundColor: AppColors.surface,
    padding: 14,
    borderRadius: 8,
  },
  listItemNome: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  listItemInfo: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginTop: 4,
  },
  avisoEstoque: {
    fontFamily: AppFonts.semiBold,
    fontSize: 12,
    color: AppColors.danger,
    marginTop: 6,
  },
});
