import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppColors, AppFonts } from "@/constants/theme";
import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import { formatarDias } from "@/utils/calendarioHelpers";
import {
    descreverMedicamentos,
    formatarData,
    tratamentoConcluido,
} from "@/utils/tratamentoHelpers";

export default function TratamentosScreen() {
  const { tratamentos } = useTratamentos();
  const { medicamentos } = useMedicamentos();

  function abrirEdicao(id: string) {
    router.push({ pathname: "/cadastro_tratamento", params: { id } });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Tratamentos</Text>
        <Text style={styles.subtitle}>Toque em um tratamento para editar</Text>
      </View>

      {tratamentos.length === 0 ? (
        <View style={styles.vazio}>
          <View style={styles.vazioIcone}>
            <MaterialIcons
              name="assignment"
              size={36}
              color={AppColors.primary}
            />
          </View>
          <Text style={styles.vazioTitulo}>Nenhum tratamento cadastrado</Text>
          <Text style={styles.vazioTexto}>
            Toque no + para criar seu primeiro tratamento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tratamentos}
          keyExtractor={(item) => item.id}
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
          renderItem={({ item }) => {
            const concluido = tratamentoConcluido(item);
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressionado,
                ]}
                onPress={() => abrirEdicao(item.id)}
              >
                <View style={styles.itemConteudo}>
                  <View style={styles.itemCabecalho}>
                    <View
                      style={[styles.corDot, { backgroundColor: item.cor }]}
                    />
                    <Text style={styles.itemNome}>{item.nome}</Text>
                    {concluido && <Text style={styles.selo}>Concluído</Text>}
                  </View>
                  <Text style={styles.itemInfo}>
                    {descreverMedicamentos(item, medicamentos)}
                  </Text>
                  <Text style={styles.itemInfo}>
                    {formatarDias(item.dias)} • início{" "}
                    {formatarData(item.dataInicio)}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={AppColors.muted}
                />
              </Pressable>
            );
          }}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressionado]}
        onPress={() => router.push("/cadastro_tratamento")}
      >
        <MaterialIcons name="add" size={28} color={AppColors.buttonText} />
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
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingBottom: 100, // espaço para o botão + não cobrir o último item
    gap: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.surface,
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  itemPressionado: {
    opacity: 0.7,
  },
  itemConteudo: {
    flex: 1,
    gap: 4,
  },
  itemCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  corDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  itemNome: {
    flex: 1,
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  selo: {
    fontFamily: AppFonts.medium,
    fontSize: 11,
    color: AppColors.secondaryText,
    backgroundColor: AppColors.surfaceAccent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemInfo: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
  },
  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  vazioIcone: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AppColors.surfaceAccent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  vazioTitulo: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  vazioTexto: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.muted,
    textAlign: "center",
    maxWidth: 260,
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
    elevation: 8,
  },
  fabPressionado: {
    backgroundColor: AppColors.title,
    transform: [{ scale: 0.96 }],
  },
});
