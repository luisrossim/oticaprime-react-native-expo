import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, ImageBackground } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { router } from "expo-router";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { UtilitiesService } from "@/utils/utilities-service";


export default function Settings() {
  const {selectedEmpresa, selectedCaixa, updateEmpresa, updateCaixa} = useEmpresaCaixa();
  const {logout, authData} = useAuth();
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [caixas, setCaixas] = useState<Caixa[]>([]);

  const snapPoints = useMemo(() => ['80%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetType, setBottomSheetType] = useState<'empresa' | 'caixa' | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function fetchEmpresasAtivas(){
    setLoading(true);
    setError(null);

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

  async function fetchCaixas(){
    if(!selectedEmpresa) {
      setError('Nenhuma empresa foi selecionada.');
      return;
    }

    setLoading(true);
    setError(null);
    
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

  const openBottomSheet = async (type: 'empresa' | 'caixa') => {
    setBottomSheetType(type);
  
    if (type === 'empresa') {
      await fetchEmpresasAtivas();
    } else {
      await fetchCaixas();
    }

    bottomSheetRef.current?.expand();
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

        {loading && (
          <LoadingIndicator />
        )}

        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 80}}>
          <ImageBackground source={require("@/assets/background-config.png")} style={styles.cardProfile}>
            <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
              <Image source={require("@/assets/company.png")} style={styles.companyIcon} />
              <Text style={{color: "#FFF", fontSize: 10, marginTop: 4, fontWeight: 300}}>ÓTICA PRIME</Text>
            </View>

            <View style={{marginBottom: 10, gap: 5}}>
              <Text style={styles.empText}>
                { selectedEmpresa
                  ? selectedEmpresa.RAZAO_EMP
                  : "Nenhuma empresa"
                }
              </Text>
              <Text style={styles.caixaText}>
                { selectedCaixa?.DESC_CAI 
                  ? UtilitiesService.handleCaixaName(selectedCaixa.DESC_CAI) 
                  : "Nenhum caixa"
                }
              </Text>
            </View>
          </ImageBackground>

          <View style={styles.actionsContainer}>
            <SettingsButton
              icon="briefcase"
              title="Selecionar empresa"
              onPress={() => openBottomSheet('empresa')}
            />

            <SettingsButton
              icon="box"
              title="Selecionar caixa"
              onPress={() => openBottomSheet('caixa')}
            />

            <SettingsButton
              icon="book"
              title="Manual do usuário"
              onPress={() => {router.navigate('/manual-usuario')}}
            />

            <SettingsButton 
              icon="log-out" 
              title="Sair" 
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
              <View>
                <Text style={styles.bottomTitle}>
                  Selecionar empresa
                </Text>
                <Text style={styles.bottomSubTitle}>
                  Os dados serão sincronizados e exibidos de acordo com a empresa selecionada.
                </Text>

                {loading ? (
                  <ActivityIndicator 
                    size="large" 
                    color={colors.blue[700]} 
                  />
                ) 
                : (
                  empresas.map((empresa) => (
                    <TouchableOpacity
                      key={empresa.COD_EMP}
                      onPress={() => handleSelectEmpresa(empresa)}
                      style={[
                        styles.optionButtonContainer,
                        selectedEmpresa?.COD_EMP === empresa.COD_EMP && styles.selectedOptionButton,
                      ]}
                    >
                      <Text style={
                        selectedEmpresa?.COD_EMP === empresa.COD_EMP 
                          ? styles.selectedOptionText
                          : styles.optionButtonText
                        }
                      >
                        {empresa.RAZAO_EMP}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            ) 
            : (
              <View>
                <Text style={styles.bottomTitle}>
                  Selecionar caixa
                </Text>
                <Text style={styles.bottomSubTitle}>
                  Os dados serão sincronizados e exibidos de acordo com o caixa selecionado.
                </Text>

                {error && ( <ErrorMessage error={error} /> )}

                {loading ? (
                  <ActivityIndicator 
                    size="large" 
                    color={colors.purple[700]} 
                  />
                ) 
                : (
                  caixas.map((caixa, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelectCaixa(caixa)}
                      style={[
                        styles.optionButtonContainer,
                        selectedCaixa?.DESC_CAI === caixa.DESC_CAI && styles.selectedOptionButton,
                      ]}
                    >
                      <Text style={
                        selectedCaixa?.DESC_CAI === caixa.DESC_CAI 
                          ? styles.selectedOptionText
                          : styles.optionButtonText
                        }
                      >
                        {caixa.DESC_CAI}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
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
    color: colors.slate[500],
    fontWeight: 300,
    marginBottom: 26
  },
  cardProfile: {
    flex: 1,
    padding: 25,
    gap: 60,
    marginHorizontal: 15,
    backgroundColor: colors.blue[700],
    borderRadius: 10
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
    padding: 20,
    borderRadius: 60,
    marginVertical: 5,
    backgroundColor: colors.slate[100]
  },
  selectedOptionButton: {
    backgroundColor: colors.blue[700]
  },
  selectedOptionText: {
    color: colors.cyan[100],
    fontSize: 12,
    fontWeight: 600
  },
  optionButtonText: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.slate[500]
  },
  actionsContainer: {
    marginTop: 20
  },
  companyIcon: {
    width: 20,
    height: 20
  },
  empText: {
    color: "#FFF",
    fontWeight: 600
  },
  caixaText: {
    color: "#FFF",
    fontSize: 12
  }
});
