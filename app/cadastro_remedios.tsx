import { styles } from "@/styles/standart";
import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useRemedios } from "./contexts/remediosContext";

const DIAS_SEMANA = [
  { inicial: "D", abreviacao: "dom" },
  { inicial: "S", abreviacao: "seg" },
  { inicial: "T", abreviacao: "ter" },
  { inicial: "Q", abreviacao: "qua" },
  { inicial: "Q", abreviacao: "qui" },
  { inicial: "S", abreviacao: "sex" },
  { inicial: "S", abreviacao: "sáb" },
];

// funcao que formata os dias texto
function formatarDias(dias: string[]): string {
  if (dias.length === 0) return "Nenhum dia selecionado";
  if (dias.length === DIAS_SEMANA.length) return "Todos os dias";

  const primeiroDia = dias[0];
  const artigo =
    primeiroDia === "dom" || primeiroDia === "sáb" ? "Todo" : "Toda";

  if (dias.length === 1) return `${artigo} ${dias[0]}`;
  return `${artigo} ${dias.slice(0, -1).join(", ")} e ${dias[dias.length - 1]}`;
}

type Remedio = {
  id: string;
  nome: string;
  dias: string[];
  quantidade: number;
};

export default function Cadastro_Remedios() {
  const { remedios, adicionarRemedio } = useRemedios();

  const [nome, setNome] = useState("");
  const [diasSelecionados, setDiasSelecionados] = useState<boolean[]>(
    Array(7).fill(false),
  );
  const [quantidade, setQuantidade] = useState(1);

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
    if (nome.trim() === "") return;

    const novo: Remedio = {
      id: Date.now().toString(),
      nome: nome.trim(),
      dias: DIAS_SEMANA.filter((_, i) => diasSelecionados[i]).map(
        (d) => d.abreviacao,
      ),
      quantidade,
    };

    adicionarRemedio(novo); // salva no Context compartilhado
    setNome("");
    setDiasSelecionados(Array(7).fill(false));
    setQuantidade(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cadastro de Remédios</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do remédio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Paracetamol"
            placeholderTextColor={"#a79e9e"}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Dias da semana</Text>
          <View style={styles.diasLinha}>
            {DIAS_SEMANA.map((dia, index) => {
              const selecionado = diasSelecionados[index];
              return (
                <Pressable
                  key={dia.abreviacao}
                  style={[styles.dia, selecionado && styles.diaSelecionado]}
                  onPress={() => alternarDia(index)}
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
          <Text style={styles.resumo}>{montarResumoDias()}</Text>

          <Text style={styles.label}>Quantidade por dia</Text>
          <View style={styles.quantidadeLinha}>
            {[1, 2, 3, 4, 5].map((qtd) => {
              const selecionado = qtd === quantidade;
              return (
                <Pressable
                  key={qtd}
                  style={[
                    styles.quantidade,
                    selecionado && styles.quantidadeSelecionada,
                  ]}
                  onPress={() => setQuantidade(qtd)}
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

          <Pressable style={styles.button} onPress={handleAdicionar}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </Pressable>

          <FlatList
            data={remedios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.textItem}>{item.nome}</Text>
                <Text style={styles.itemInfo}>
                  {formatarDias(item.dias)} • {item.quantidade}x por dia
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
