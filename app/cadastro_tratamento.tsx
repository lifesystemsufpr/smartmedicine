import { ItemTratamento, useTratamentos } from "@/contexts/tratamentosContext";
import { styles } from "@/styles/standart";
import {
  calcularQuantidadeNecessaria,
  descreverMedicamentos,
  inicioDoDia,
} from "@/utils/tratamentoHelpers";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { SeletorDiasSemana } from "@/components/seletorDiasSemana";
import TimePicker from "@/components/time-picker";
import { AppColors, AppFonts, CORES_TRATAMENTO } from "@/constants/theme";
import { useMedicamentos } from "@/contexts/medicamentosContext";
import { DIAS_SEMANA, formatarDias } from "@/utils/calendarioHelpers";

export default function CadastroTratamento() {
  const { medicamentos, baixarEstoque, devolverEstoque } = useMedicamentos();
  const { tratamentos, adicionarTratamento, atualizarTratamento } =
    useTratamentos();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const tratamentoEditado = tratamentos.find((t) => t.id === id);
  const [nome, setNome] = useState(tratamentoEditado?.nome ?? "");

  const [diasSelecionados, setDiasSelecionados] = useState<boolean[]>(
    DIAS_SEMANA.map(
      (dia) => tratamentoEditado?.dias.includes(dia.abreviacao) ?? false,
    ),
  );

  const [itens, setItens] = useState<ItemTratamento[]>(
    tratamentoEditado?.medicamentos ?? [],
  );
  const [cor, setCor] = useState(tratamentoEditado?.cor ?? CORES_TRATAMENTO[0]);
  const [erro, setErro] = useState<string | null>(null);

  function alternarDia(index: number) {
    setDiasSelecionados((atual) => {
      const copia = [...atual];
      copia[index] = !copia[index];
      return copia;
    });
  }

  function alternarMedicamento(id: string) {
    setItens((atual) => {
      const jaSelecionado = atual.some((item) => item.medicamentoId === id);
      if (jaSelecionado) {
        return atual.filter((item) => item.medicamentoId !== id);
      }
      return [
        ...atual,
        { medicamentoId: id, quantidadePorDia: 1, duracaoDias: 7 },
      ];
    });
    if (erro) setErro(null);
  }

  function atualizarItem(id: string, mudancas: Partial<ItemTratamento>) {
    setItens((atual) =>
      atual.map((item) =>
        item.medicamentoId === id ? { ...item, ...mudancas } : item,
      ),
    );
    if (erro) setErro(null);
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

    if (itens.length === 0) {
      setErro("Selecione ao menos um medicamento do seu estoque.");
      return;
    }

    const diasEscolhidos = DIAS_SEMANA.filter(
      (_, i) => diasSelecionados[i],
    ).map((d) => d.abreviacao);

    if (diasEscolhidos.length === 0) {
      setErro("Selecione ao menos um dia da semana.");
      return;
    }

    // confere o estoque de TODOS antes de descontar qualquer um
    // confere TODOS antes de salvar ou descontar qualquer um
    for (const item of itens) {
      const medicamento = medicamentos.find((m) => m.id === item.medicamentoId);
      const nomeMedicamento = medicamento?.nome ?? "um medicamento";

      if (item.duracaoDias !== null && item.duracaoDias < 1) {
        setErro(
          `Informe a duração de ${nomeMedicamento} (mínimo 1 dia) ou marque uso contínuo.`,
        );
        return;
      }

      const necessaria = calcularQuantidadeNecessaria(
        item,
        diasEscolhidos.length,
      );
      const disponivel =
        (medicamento?.quantidadeEstoque ?? 0) +
        quantidadeReservada(item.medicamentoId);

      if (!medicamento || disponivel < necessaria) {
        setErro(
          `Estoque insuficiente de ${nomeMedicamento}. ` +
            (item.duracaoDias === null
              ? `São necessárias ${necessaria} unidades por semana.`
              : `O tratamento completo precisa de ${necessaria} unidades.`),
        );
        return;
      }
    }

    // salva e desconta
    const dados = {
      nome: nome.trim(),
      medicamentos: itens,
      dias: diasEscolhidos,
      cor,
    };

    if (tratamentoEditado) {
      atualizarTratamento(tratamentoEditado.id, {
        ...dados,
        dataInicio: tratamentoEditado.dataInicio,
      });

      // devolve o que a versão antiga tinha descontado
      tratamentoEditado.medicamentos.forEach((itemAntigo) => {
        devolverEstoque(
          itemAntigo.medicamentoId,
          calcularQuantidadeNecessaria(
            itemAntigo,
            tratamentoEditado.dias.length,
          ),
        );
      });
    } else {
      adicionarTratamento({ ...dados, dataInicio: inicioDoDia(new Date()) });
    }

    // desconta o que a versão nova precisa
    itens.forEach((item) => {
      baixarEstoque(
        item.medicamentoId,
        calcularQuantidadeNecessaria(item, diasEscolhidos.length),
      ); // a logica de baixar estoque precisa mudar posteriormente
    });

    if (tratamentoEditado) {
      router.back();
      return;
    }

    setErro(null);
    setNome("");
    setItens([]);
    setDiasSelecionados(Array(7).fill(false));
    setCor(CORES_TRATAMENTO[0]);
  }

  // Quanto esse tratamento já tinha descontado desse remédio (só na edição)
  function quantidadeReservada(medicamentoId: string): number {
    if (!tratamentoEditado) return 0;

    const itemAntigo = tratamentoEditado.medicamentos.find(
      (i) => i.medicamentoId === medicamentoId,
    );
    if (!itemAntigo) return 0;

    return calcularQuantidadeNecessaria(
      itemAntigo,
      tratamentoEditado.dias.length,
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={localStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {tratamentoEditado ? "Editar Tratamento" : "Cadastro de Tratamento"}
        </Text>

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
                  style={[localStyles.corSwatch, { backgroundColor: corOpcao }]}
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
                const selecionado = itens.some(
                  (i) => i.medicamentoId === medicamento.id,
                );
                return (
                  <Pressable
                    key={medicamento.id}
                    style={[
                      localStyles.medicamentoChip,
                      selecionado && localStyles.medicamentoChipSelecionado,
                    ]}
                    onPress={() => alternarMedicamento(medicamento.id)}
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

          <Text style={styles.label}>Horário de início</Text>
          <TimePicker />

          {itens.length > 0 && (
            <>
              <Text style={styles.label}>Quantidade por dia</Text>
              {itens.map((item) => {
                const medicamento = medicamentos.find(
                  (m) => m.id === item.medicamentoId,
                );
                return (
                  <View
                    key={item.medicamentoId}
                    style={localStyles.itemQuantidade}
                  >
                    <Text style={localStyles.itemQuantidadeNome}>
                      {medicamento?.nome}
                    </Text>
                    <View style={styles.quantidadeLinha}>
                      {[1, 2, 3, 4, 5].map((qtd) => {
                        const selecionado = qtd === item.quantidadePorDia;
                        return (
                          <Pressable
                            key={qtd}
                            style={[
                              styles.quantidade,
                              selecionado && styles.quantidadeSelecionada,
                            ]}
                            onPress={() =>
                              atualizarItem(item.medicamentoId, {
                                quantidadePorDia: qtd,
                              })
                            }
                          >
                            <Text
                              style={[
                                styles.quantidadeTexto,
                                selecionado &&
                                  styles.quantidadeTextoSelecionado,
                              ]}
                            >
                              {qtd}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    <View style={localStyles.duracaoLinha}>
                      <Text style={localStyles.duracaoTexto}>Uso contínuo</Text>
                      <Switch
                        value={item.duracaoDias === null}
                        onValueChange={(continuo) =>
                          atualizarItem(item.medicamentoId, {
                            duracaoDias: continuo ? null : 7,
                          })
                        }
                        trackColor={{
                          true: AppColors.primary,
                          false: AppColors.inputBorder,
                        }}
                      />
                    </View>

                    {item.duracaoDias !== null && (
                      <View style={localStyles.duracaoLinha}>
                        <Text style={localStyles.duracaoTexto}>
                          Duração (dias de uso)
                        </Text>
                        <TextInput
                          style={[styles.input, localStyles.duracaoInput]}
                          keyboardType="number-pad"
                          maxLength={3}
                          value={
                            item.duracaoDias === 0
                              ? ""
                              : String(item.duracaoDias)
                          }
                          onChangeText={(texto) =>
                            atualizarItem(item.medicamentoId, {
                              duracaoDias: Number(texto.replace(/\D/g, "")),
                            })
                          }
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}

          {erro && <Text style={localStyles.erroTexto}>{erro}</Text>}

          <Pressable style={styles.button} onPress={handleAdicionar}>
            <Text style={styles.buttonText}>
              {tratamentoEditado ? "Salvar alterações" : "Adicionar"}
            </Text>
          </Pressable>

          <View style={localStyles.listaContainer}>
            {tratamentos.map((item) => {
              return (
                <View key={item.id} style={styles.listItem}>
                  <View style={localStyles.itemHeader}>
                    <View
                      style={[
                        localStyles.corDot,
                        { backgroundColor: item.cor },
                      ]}
                    />
                    <Text style={localStyles.tratamentoNome}>{item.nome}</Text>
                  </View>
                  <Text style={styles.itemInfo}>
                    {descreverMedicamentos(item, medicamentos)} •{" "}
                    {formatarDias(item.dias)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  duracaoLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  duracaoTexto: {
    fontFamily: AppFonts.regular,
    fontSize: 13,
    color: AppColors.label,
  },
  duracaoInput: {
    width: 80,
    textAlign: "center",
    marginBottom: 0,
  },

  itemQuantidade: {
    marginBottom: 8,
  },
  itemQuantidadeNome: {
    fontFamily: AppFonts.medium,
    fontSize: 13,
    color: AppColors.secondaryText,
    marginBottom: 6,
  },
  scrollContent: {
    paddingBottom: 100, // Dá espaço extra no final para rolar confortavelmente
  },
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
  listaContainer: {
    marginTop: 16,
    gap: 8,
  },
});
