import CustomButton from "@/components/CustomButton";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import { colors } from "@/utils/constants/colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";

export default function Welcome(){
  const { selectedEmpresa } = useEmpresaCaixa();
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(true);

  useEffect(() => {
    if(selectedEmpresa && isFirstAccess == true) {
      setIsFirstAccess(false);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 400);
    }
  }, [selectedEmpresa, isFirstAccess]);

  return (
    <View style={{flex: 1, paddingHorizontal: 20, backgroundColor: "#FFF"}}>
      <SafeAreaView style={{flex: 1, marginVertical: 120, alignItems: "center", justifyContent: "space-between"}}>
        <View style={{alignItems: "center", gap: 10}}>
          <Text style={{fontSize: 38, fontWeight: 500, color: colors.slate[800]}}>
            Bem vindo
          </Text>
          <Text style={{color: colors.slate[700], fontWeight: 300, textAlign: "center"}}>
            Para acompanhar suas atividades, selecione uma empresa nas configurações.
          </Text>
        </View>
        <Image source={require("@/assets/welcome.png")} style={styles.logo} />
        <CustomButton label="Ir para configurações" icon={true} onPress={() => {router.push('/settings')}} />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
});