import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { colors } from "@/utils/constants/colors";
import { Company } from "@/models/company";
import { SettingsButton } from "@/components/SettingsButton";
import { EmpresaService } from "@/services/empresa-service";
import { Caixa } from "@/models/caixa";
import { CaixaService } from "@/services/caixa-service";
import { useAuth } from "@/context/AuthContext";
import { CustomHeader } from "@/components/CustomHeader";
import SectionTitle from "@/components/SectionTitle";
import { router } from "expo-router";


export default function Settings() {
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [caixas, setCaixas] = useState<Caixa[]>([]);

  const { logout, authData } = useAuth();
  const { selectedEmpresa, selectedCaixa, updateEmpresa, updateCaixa } = useEmpresaCaixa();

  const snapPoints = useMemo(() => ['75%'], []);
  const [bottomSheetType, setBottomSheetType] = useState<'empresa' | 'caixa' | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchEmpresasAtivas = async () => {
    setLoading(true);

    try {
      const empresaService = new EmpresaService(authData?.accessToken);
      const data = await empresaService.getAll();
      setEmpresas(data);

    } catch (err) {
      setError('Erro ao buscar empresas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaixas = async () => {
    if(!selectedEmpresa) {
      setError('Nenhuma empresa foi selecionada.');
      return;
    }

    setLoading(true);
    
    try {
      const caixaService = new CaixaService(authData?.accessToken);

      const params = {
        empId: selectedEmpresa.COD_EMP
      } 

      const data = await caixaService.getAllByParam(params);
      setCaixas(data);

    } catch (err) {
      setError('Erro ao buscar caixas.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da conta?",
      [
        { text: "Cancelar", onPress: () => {}},
        { text: "OK", onPress: () => {logout()}}
      ]
    );
  }

  const openBottomSheet = (type: 'empresa' | 'caixa') => {
    setBottomSheetType(type);
    bottomSheetRef.current?.expand();
  
    if (type === 'empresa') {
      fetchEmpresasAtivas();
    } else {
      fetchCaixas();
    }
  };

  const handleSelectEmpresa = async (empresa: Company) => {
    await updateEmpresa(empresa);
    bottomSheetRef.current?.close();
  };

  const handleSelectCaixa = async (caixa: Caixa) => {
    await updateCaixa(caixa);
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
        />
    ), []
  );

  
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFF"}}>
      <SafeAreaView style={{flex: 1}}>
        <CustomHeader title="Configurações" />

        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 80}}>
          <View style={styles.profile}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1589282741585-30ab896335cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
              style={styles.image}
            />

            <Text style={styles.selectedEmpresaTitle}>
              {selectedEmpresa?.RAZAO_EMP || "Nenhuma empresa selecionada"}
            </Text>

            <Text style={styles.selectedCaixaTitle}>
              {selectedCaixa?.DESC_CAI || "Nenhum caixa selecionado"}
            </Text>
          </View>

          <View>
            <SectionTitle title="INFORMAÇÕES" />
            <SettingsButton
              icon="home"
              title="Selecionar empresa"
              iconColor={colors.blue[600]}
              onPress={() => openBottomSheet('empresa')}
            />

            <SettingsButton
              icon="box"
              title="Selecionar caixa"
              iconColor={colors.purple[600]}
              onPress={() => openBottomSheet('caixa')}
            />

            <SettingsButton
              icon="book"
              title="Manual do usuário"
              iconColor={colors.slate[600]}
              onPress={() => {router.navigate('/manual-usuario')}}
            />
          </View>

          <View style={{marginTop: 50}}>
            <SectionTitle title={`CONTA: ${authData?.login || "null"}`} />
            <SettingsButton 
              icon="log-out" 
              title="Sair" 
              iconColor={colors.red[600]}
              onPress={handleLogout}
            />
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView style={styles.contentContainer}>
            {bottomSheetType === 'empresa' ? (
              <>
                <Text style={styles.bottomTitle}>
                  Selecionar empresa
                </Text>
                <Text style={styles.bottomSubTitle}>
                  Os dados serão sincronizados e exibidos de acordo com a empresa selecionada.
                </Text>

                {loading ? (
                  <ActivityIndicator size="large" color={colors.blue[700]} />
                ) : (
                  empresas.map((empresa) => (
                    <TouchableOpacity
                      key={empresa.COD_EMP}
                      onPress={() => handleSelectEmpresa(empresa)}
                      style={[
                        styles.optionButtonContainer,
                        selectedEmpresa?.COD_EMP === empresa.COD_EMP && styles.selectedOptionButtonEmpresa,
                      ]}
                    >
                      <Text style={
                        selectedEmpresa?.COD_EMP === empresa.COD_EMP 
                          ? styles.selectedOptionTextEmpresa 
                          : styles.optionButtonText
                        }
                      >
                        {empresa.RAZAO_EMP}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </>
            ) : (
              <>
                <Text style={styles.bottomTitle}>
                  Selecionar caixa
                </Text>
                <Text style={styles.bottomSubTitle}>
                  Os dados serão sincronizados e exibidos de acordo com o caixa selecionado.
                </Text>

                {loading ? (
                  <ActivityIndicator size="large" color={colors.purple[700]} />
                ) : (
                  caixas.map((caixa, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectCaixa(caixa)}
                      style={[
                        styles.optionButtonContainer,
                        selectedCaixa?.DESC_CAI === caixa.DESC_CAI && styles.selectedOptionButtonCaixa,
                      ]}
                    >
                      <Text style={
                        selectedCaixa?.DESC_CAI === caixa.DESC_CAI 
                          ? styles.selectedOptionTextCaixa 
                          : styles.optionButtonText
                        }
                      >
                        {caixa.DESC_CAI}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  bottomTitle: {
    fontSize: 24, 
    fontWeight: "600", 
    marginBottom: 5
  },
  bottomSubTitle: {
    fontSize: 14, 
    fontWeight: "300", 
    color: colors.gray[500], 
    marginBottom: 26
  },
  profile: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: 20,
    marginBottom: 25
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  optionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5
  },
  selectedOptionButtonEmpresa: {
    backgroundColor: colors.blue[700]
  },
  selectedOptionButtonCaixa: {
    backgroundColor: colors.purple[700]
  },
  selectedOptionTextEmpresa: {
    color: colors.cyan[100],
    fontWeight: 600
  },
  selectedOptionTextCaixa: {
    color: colors.fuchsia[100],
    fontWeight: 600
  },
  optionButtonText: {
    fontSize: 13,
    color: colors.gray[600]
  },
  selectedEmpresaTitle: {
    fontSize: 16, 
    fontWeight: 600, 
    textAlign: 'center',
    color: colors.gray[900]
  },
  selectedCaixaTitle: {
    textAlign: 'center',
    color: colors.gray[500]
  },
  image: { 
    width: 85, 
    height: 85, 
    borderRadius: 50,
    marginBottom: 10
  }
});
