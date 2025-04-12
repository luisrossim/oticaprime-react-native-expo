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
    <SafeAreaView style={{flex: 1, backgroundColor: "#FFF"}}>
      <View style={{flex: 1, paddingHorizontal: 20, backgroundColor: "#FFF"}}>
        <View style={{flex: 1, marginVertical: 40, justifyContent: "center", gap: 40}}>
          <View style={{alignItems: "center"}}>
            <Image source={require("@/assets/welcome.png")} style={styles.logo} />
          </View>

          <View style={{gap: 10}}>
            <Text style={{fontSize: 32, fontWeight: 600, color: colors.slate[800]}}>
              Controle total, onde você estiver.
            </Text>
            <Text style={{color: colors.slate[500]}}>
              Para acompanhar suas operações, selecione a sua empresa nas configurações. 
            </Text>
          </View>

          <CustomButton label="Ir para configurações" icon={true} onPress={() => {router.push('/settings')}} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});