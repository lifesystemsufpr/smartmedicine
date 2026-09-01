import { styles } from "@/styles/standart";
import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

export default function Cadastro_Remedios() {
  const [nome, setNome] = useState("");
  const [remedios, setRemedios] = useState<string[]>([]);

  function adicionarRemedio() {
    if (nome.trim() === "") return; // não adiciona se estiver vazio
    setRemedios([...remedios, nome.trim()]);
    setNome(""); // limpa o input depois de adicionar
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

          <Pressable style={styles.button} onPress={adicionarRemedio}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </Pressable>

          <FlatList
            data={remedios}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.textItem}>{item}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
