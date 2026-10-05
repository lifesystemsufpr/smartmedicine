import { styles } from "@/styles/standart";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { SeletorDiasSemana } from "@/components/seletorDiasSemana";
import { AppColors, AppFonts, CORES_TRATAMENTO } from "@/constants/theme";
import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import { DIAS_SEMANA, formatarDias } from "@/utils/calendarioHelpers";

export default function CadastroTratamento() {
  const { medicamentos, baixarEstoque } = useMedicamentos();
  const { tratamentos, adicionarTratamento } = useTratamentos();

  const [nome, setNome] = useState("");
  const [medicamentoId, setMedicamentoId] = useState<string | null>(null);
  const [diasSelecionados, setDiasSelecionados] = useState<boolean[]>(
    Array(7).fill(false),
  );
  const [quantidadePorDia, setQuantidadePorDia] = useState(1);
  const [cor, setCor] = useState(CORES_TRATAMENTO[0]);
  const [erro, setErro] = useState<string | null>(null);

  function alternarDia(index: number) {
    setDiasSelecionados((atual) => {
      const copia = [...atual]; // cria uma copia do array anterior
      copia[index] = !copia[index]; // inverte de false para true o dia selecionado
      return copia;
    });
  }

  function montarResumoDias(): string {
    const abreviacoes = DIAS_SEMANA.filter(
      (_, index) => diasSelecionados[index],
    ).map((dia) => dia.abreviacao);

    return formatarDias(abreviacoes);
  }

  function handleAdicionar() {
    if (nome.trim() === "") {
      setErro("Dê um nome para o tratamento.");
      return;
    }

    if (!medicamentoId) {
      setErro("Selecione um medicamento do seu estoque.");
      return;
    }

    const diasEscolhidos = DIAS_SEMANA.filter(
      (_, i) => diasSelecionados[i],
    ).map((d) => d.abreviacao);

    if (diasEscolhidos.length === 0) {
      setErro("Selecione ao menos um dia da semana.");
      return;
    }

    const medicamento = medicamentos.find((item) => item.id === medicamentoId);
    const quantidadeNecessaria = quantidadePorDia * diasEscolhidos.length;

    if (!medicamento || medicamento.quantidadeEstoque < quantidadeNecessaria) {
      setErro(
        `Estoque insuficiente. Esse tratamento precisa de ${quantidadeNecessaria} unidades por semana.`,
      );
      return;
    }

    adicionarTratamento({
      nome: nome.trim(),
      medicamentoId,
      dias: diasEscolhidos,
      quantidadePorDia,
      cor,
    });
    baixarEstoque(medicamentoId, quantidadeNecessaria);

    setErro(null);
    setNome("");
    setMedicamentoId(null);
    setDiasSelecionados(Array(7).fill(false));
    setQuantidadePorDia(1);
    setCor(CORES_TRATAMENTO[0]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cadastro de Tratamento</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do tratamento</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Pressão alta, Pós-cirúrgico..."
            placeholderTextColor={AppColors.muted}
            value={nome}
            onChangeText={(value) => {
              setNome(value);
              if (erro) setErro(null);
            }}
          />

          <Text style={styles.label}>Cor do tratamento</Text>
          <View style={localStyles.corLinha}>
            {CORES_TRATAMENTO.map((corOpcao) => {
              const selecionada = corOpcao === cor;
              return (
                <Pressable
                  key={corOpcao}
                  style={[
                    localStyles.corSwatch,
                    { backgroundColor: corOpcao },
                  ]}
                  onPress={() => setCor(corOpcao)}
                >
                  {selecionada && (
                    <MaterialIcons
                      name="check"
                      size={16}
                      color={AppColors.buttonText}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Medicamento</Text>
          {medicamentos.length === 0 ? (
            <View>
              <Text style={localStyles.avisoTexto}>
                Você ainda não tem medicamentos no estoque.
              </Text>
              <Pressable
                style={localStyles.avisoLink}
                onPress={() => router.push("/(tabs)/medicamentos")}
              >
                <Text style={localStyles.avisoLinkTexto}>
                  Cadastrar em Meus Medicamentos
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={localStyles.medicamentoLinha}>
              {medicamentos.map((medicamento) => {
                const selecionado = medicamento.id === medicamentoId;
                return (
                  <Pressable
                    key={medicamento.id}
                    style={[
                      localStyles.medicamentoChip,
                      selecionado && localStyles.medicamentoChipSelecionado,
                    ]}
                    onPress={() => {
                      setMedicamentoId(medicamento.id);
                      if (erro) setErro(null);
                    }}
                  >
                    <Text
                      style={[
                        localStyles.medicamentoChipTexto,
                        selecionado &&
                          localStyles.medicamentoChipTextoSelecionado,
                      ]}
                    >
                      {medicamento.nome} ({medicamento.quantidadeEstoque}{" "}
                      {medicamento.unidade})
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.label}>Dias da semana</Text>
          <SeletorDiasSemana
            diasSelecionados={diasSelecionados}
            onToggleDia={(index) => {
              alternarDia(index);
              if (erro) setErro(null);
            }}
          />
          <Text style={styles.resumo}>{montarResumoDias()}</Text>

          <Text style={styles.label}>Quantidade por dia</Text>
          <View style={styles.quantidadeLinha}>
            {[1, 2, 3, 4, 5].map((qtd) => {
              const selecionado = qtd === quantidadePorDia;
              return (
                <Pressable
                  key={qtd}
                  style={[
                    styles.quantidade,
                    selecionado && styles.quantidadeSelecionada,
                  ]}
                  onPress={() => setQuantidadePorDia(qtd)}
                >
                  <Text
                    style={[
                      styles.quantidadeTexto,
                      selecionado && styles.quantidadeTextoSelecionado,
                    ]}
                  >
                    {qtd}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {erro && <Text style={localStyles.erroTexto}>{erro}</Text>}

          <Pressable style={styles.button} onPress={handleAdicionar}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </Pressable>

          <FlatList
            data={tratamentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const medicamento = medicamentos.find(
                (m) => m.id === item.medicamentoId,
              );
              return (
                <View style={styles.listItem}>
                  <View style={localStyles.itemHeader}>
                    <View
                      style={[localStyles.corDot, { backgroundColor: item.cor }]}
                    />
                    <Text style={localStyles.tratamentoNome}>{item.nome}</Text>
                  </View>
                  <Text style={styles.itemInfo}>
                    {medicamento?.nome ?? "Medicamento removido"} •{" "}
                    {formatarDias(item.dias)} • {item.quantidadePorDia}x por
                    dia
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  tratamentoNome: {
    fontFamily: AppFonts.semiBold,
    fontSize: 15,
    color: AppColors.label,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  corDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  corLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  corSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  medicamentoLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  medicamentoChip: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: AppColors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  medicamentoChipSelecionado: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  medicamentoChipTexto: {
    fontFamily: AppFonts.medium,
    fontSize: 13,
    color: AppColors.label,
  },
  medicamentoChipTextoSelecionado: {
    color: AppColors.buttonText,
  },
  avisoTexto: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginBottom: 8,
  },
  avisoLink: {
    alignSelf: "flex-start",
  },
  avisoLinkTexto: {
    fontFamily: AppFonts.semiBold,
    fontSize: 13,
    color: AppColors.primary,
  },
  erroTexto: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.danger,
    marginTop: -8,
    marginBottom: 8,
  },
});
