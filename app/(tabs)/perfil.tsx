import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppColors, AppFonts } from "@/constants/theme";
import { useMedicamentos } from "@/contexts/medicamentosContext";
import { useTratamentos } from "@/contexts/tratamentosContext";
import { styles } from "@/styles/standart";

export default function PerfilScreen() {
  const { medicamentos } = useMedicamentos();
  const { tratamentos } = useTratamentos();

  const [nomeUsuario, setNomeUsuario] = useState("TESTE");
  const [emailUsuario, setEmailUsuario] = useState("gabriel.teste@ufpr.br");
  const [telefoneUsuario, setTelefoneUsuario] = useState("(41) 99999-8888");

  const [modalDadosVisivel, setModalDadosVisivel] = useState(false);
  const [modalNotificacoesVisivel, setModalNotificacoesVisivel] =
    useState(false);

  const [tempNome, setTempNome] = useState(nomeUsuario);
  const [tempEmail, setTempEmail] = useState(emailUsuario);
  const [tempTelefone, setTempTelefone] = useState(telefoneUsuario);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  function handleAbrirModalDados() {
    setTempNome(nomeUsuario);
    setTempEmail(emailUsuario);
    setTempTelefone(telefoneUsuario);
    setModalDadosVisivel(true);
  }

  function handleSalvarDados() {
    if (!tempNome.trim() || !tempEmail.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha o nome e o e-mail.",
      );
      return;
    }
    setNomeUsuario(tempNome.trim());
    setEmailUsuario(tempEmail.trim());
    setTelefoneUsuario(tempTelefone.trim());
    setModalDadosVisivel(false);
    Alert.alert("Sucesso", "Seus dados foram atualizados!");
  }

  function handleAbrirSuporte() {
    const emailSuporte = "suporte@lifesystems.ufpr.br";
    const assunto = encodeURIComponent("Suporte / Dúvida - LifeSystems App");
    const corpo = encodeURIComponent(
      `Olá equipe de suporte,\n\nEstou com uma dúvida/problema no aplicativo LifeSystems.\n\nUsuário: ${nomeUsuario}\nE-mail: ${emailUsuario}`,
    );

    Linking.openURL(
      `mailto:${emailSuporte}?subject=${assunto}&body=${corpo}`,
    ).catch(() => {
      Alert.alert(
        "Contato de Suporte",
        `Envie um e-mail diretamente para: ${emailSuporte}`,
      );
    });
  }

  function handleLogout() {
    Alert.alert(
      "Sair do app",
      "Tem certeza de que deseja encerrar sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => router.replace("/login"),
        },
      ],
    );
  }

  return (
    <ScrollView
      style={[styles.container, { flex: 1 }]}
      contentContainerStyle={{
        paddingHorizontal: 30,
        paddingTop: 5,
        paddingBottom: 50,
        justifyContent: "center",
        flexGrow: 1,
        gap: 30,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho do Perfil (Sem caixas/quadrados) */}
      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <View style={{ position: "relative", marginBottom: 10 }}>
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: AppColors.surface,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: AppColors.divider,
            }}
          >
            <MaterialIcons name="person" size={36} color={AppColors.primary} />
          </View>
          <Pressable
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: AppColors.primary,
              width: 22,
              height: 22,
              borderRadius: 11,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: AppColors.background,
            }}
            onPress={handleAbrirModalDados}
            hitSlop={8}
          >
            <MaterialIcons name="edit" size={12} color="#FFF" />
          </Pressable>
        </View>

        <Text
          style={{
            fontFamily: AppFonts.bold,
            fontSize: 17,
            color: AppColors.title,
          }}
        >
          {nomeUsuario}
        </Text>
        <Text
          style={{
            fontFamily: AppFonts.regular,
            fontSize: 12,
            color: AppColors.secondaryText,
            marginTop: 2,
          }}
        >
          {emailUsuario}
        </Text>

        {/* Estatísticas */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: 18,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: AppFonts.bold,
                fontSize: 16,
                color: AppColors.primary,
              }}
            >
              {medicamentos.length}
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.regular,
                fontSize: 11,
                color: AppColors.secondaryText,
                textAlign: "center",
                marginTop: 2,
              }}
            >
              Medicamentos no estoque
            </Text>
          </View>
          <View
            style={{
              width: 1,
              height: 24,
              backgroundColor: AppColors.divider,
              marginHorizontal: 12,
            }}
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: AppFonts.bold,
                fontSize: 16,
                color: AppColors.primary,
              }}
            >
              {tratamentos.length}
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.regular,
                fontSize: 11,
                color: AppColors.secondaryText,
                textAlign: "center",
                marginTop: 2,
              }}
            >
              Tratamentos ativos
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Opções */}
      <View style={{ gap: 4 }}>
        <Text
          style={{
            fontFamily: AppFonts.semiBold,
            fontSize: 11,
            color: AppColors.muted,
            marginBottom: 6,
            letterSpacing: 0.5,
          }}
        >
          CONFIGURAÇÕES
        </Text>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.divider,
          }}
          onPress={handleAbrirModalDados}
        >
          <MaterialIcons
            name="person-outline"
            size={20}
            color={AppColors.primary}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: AppFonts.medium,
                fontSize: 14,
                color: AppColors.label,
              }}
            >
              Meus dados
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.regular,
                fontSize: 11,
                color: AppColors.secondaryText,
                marginTop: 1,
              }}
            >
              Nome, e-mail e telefone
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={AppColors.disabled}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.divider,
          }}
          onPress={() => setModalNotificacoesVisivel(true)}
        >
          <MaterialIcons
            name="notifications-none"
            size={20}
            color={AppColors.primary}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: AppFonts.medium,
                fontSize: 14,
                color: AppColors.label,
              }}
            >
              Notificações e Alertas
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.regular,
                fontSize: 11,
                color: AppColors.secondaryText,
                marginTop: 1,
              }}
            >
              Ver lembretes programados
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={AppColors.disabled}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: AppColors.divider,
          }}
          onPress={handleAbrirSuporte}
        >
          <MaterialIcons
            name="help-outline"
            size={20}
            color={AppColors.primary}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: AppFonts.medium,
                fontSize: 14,
                color: AppColors.label,
              }}
            >
              Ajuda e suporte
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.regular,
                fontSize: 11,
                color: AppColors.secondaryText,
                marginTop: 1,
              }}
            >
              suporte@lifesystems.ufpr.br
            </Text>
          </View>
          <MaterialIcons
            name="open-in-new"
            size={16}
            color={AppColors.disabled}
          />
        </Pressable>
      </View>

      {/* Sair da Conta */}
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingVertical: 12,
          marginTop: 4,
        }}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={18} color={AppColors.danger} />
        <Text
          style={{
            fontFamily: AppFonts.medium,
            fontSize: 14,
            color: AppColors.danger,
          }}
        >
          Sair da conta
        </Text>
      </Pressable>

      {/* Modal de Meus Dados */}
      <Modal
        visible={modalDadosVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalDadosVisivel(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              maxHeight: "80%",
              backgroundColor: AppColors.background,
              borderRadius: 16,
              padding: 20,
              gap: 16,
              borderWidth: 1,
              borderColor: AppColors.divider,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: AppFonts.semiBold,
                  fontSize: 16,
                  color: AppColors.title,
                }}
              >
                Editar Meus Dados
              </Text>
              <Pressable
                onPress={() => setModalDadosVisivel(false)}
                hitSlop={12}
              >
                <MaterialIcons name="close" size={22} color={AppColors.label} />
              </Pressable>
            </View>

            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontFamily: AppFonts.medium,
                  fontSize: 12,
                  color: AppColors.label,
                }}
              >
                Nome Completo
              </Text>
              <TextInput
                style={{
                  backgroundColor: AppColors.surface,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  height: 42,
                  borderWidth: 1,
                  borderColor: AppColors.inputBorder,
                  fontFamily: AppFonts.regular,
                  fontSize: 14,
                  color: AppColors.label,
                }}
                value={tempNome}
                onChangeText={setTempNome}
                placeholder="Seu nome"
              />

              <Text
                style={{
                  fontFamily: AppFonts.medium,
                  fontSize: 12,
                  color: AppColors.label,
                }}
              >
                E-mail
              </Text>
              <TextInput
                style={{
                  backgroundColor: AppColors.surface,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  height: 42,
                  borderWidth: 1,
                  borderColor: AppColors.inputBorder,
                  fontFamily: AppFonts.regular,
                  fontSize: 14,
                  color: AppColors.label,
                }}
                value={tempEmail}
                onChangeText={setTempEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="seu.email@exemplo.com"
              />

              <Text
                style={{
                  fontFamily: AppFonts.medium,
                  fontSize: 12,
                  color: AppColors.label,
                }}
              >
                Telefone / Celular
              </Text>
              <TextInput
                style={{
                  backgroundColor: AppColors.surface,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  height: 42,
                  borderWidth: 1,
                  borderColor: AppColors.inputBorder,
                  fontFamily: AppFonts.regular,
                  fontSize: 14,
                  color: AppColors.label,
                }}
                value={tempTelefone}
                onChangeText={setTempTelefone}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
              <Pressable
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: AppColors.inputBorder,
                }}
                onPress={() => setModalDadosVisivel(false)}
              >
                <Text
                  style={{
                    fontFamily: AppFonts.medium,
                    fontSize: 13,
                    color: AppColors.secondaryText,
                  }}
                >
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 8,
                  backgroundColor: AppColors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleSalvarDados}
              >
                <Text
                  style={{
                    fontFamily: AppFonts.semiBold,
                    fontSize: 13,
                    color: AppColors.buttonText,
                  }}
                >
                  Salvar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Notificações */}
      <Modal
        visible={modalNotificacoesVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalNotificacoesVisivel(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              maxHeight: "80%",
              backgroundColor: AppColors.background,
              borderRadius: 16,
              padding: 20,
              gap: 16,
              borderWidth: 1,
              borderColor: AppColors.divider,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: AppFonts.semiBold,
                  fontSize: 16,
                  color: AppColors.title,
                }}
              >
                Alertas e Notificações
              </Text>
              <Pressable
                onPress={() => setModalNotificacoesVisivel(false)}
                hitSlop={12}
              >
                <MaterialIcons name="close" size={22} color={AppColors.label} />
              </Pressable>
            </View>

            <Text
              style={{
                fontFamily: AppFonts.regular,
                fontSize: 13,
                color: AppColors.secondaryText,
              }}
            >
              Tratamentos ativos que geram lembretes no aplicativo:
            </Text>

            <ScrollView style={{ maxHeight: 250 }}>
              {tratamentos.length === 0 ? (
                <Text
                  style={{
                    fontFamily: AppFonts.regular,
                    fontSize: 13,
                    color: AppColors.muted,
                    textAlign: "center",
                    paddingVertical: 20,
                  }}
                >
                  Nenhum tratamento cadastrado para gerar alertas.
                </Text>
              ) : (
                tratamentos.map((t) => (
                  <View
                    key={t.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: AppColors.surface,
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 8,
                      gap: 10,
                      borderWidth: 1,
                      borderColor: AppColors.divider,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: t.cor,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: AppFonts.semiBold,
                          fontSize: 13,
                          color: AppColors.label,
                        }}
                      >
                        {t.nome}
                      </Text>
                      <Text
                        style={{
                          fontFamily: AppFonts.regular,
                          fontSize: 11,
                          color: AppColors.secondaryText,
                        }}
                      >
                        Dias: {t.dias.join(", ")}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="notifications-active"
                      size={18}
                      color={AppColors.primary}
                    />
                  </View>
                ))
              )}
            </ScrollView>

            <Pressable
              style={{
                width: "100%",
                height: 42,
                borderRadius: 8,
                backgroundColor: AppColors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setModalNotificacoesVisivel(false)}
            >
              <Text
                style={{
                  fontFamily: AppFonts.semiBold,
                  fontSize: 13,
                  color: AppColors.buttonText,
                }}
              >
                Entendido
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
