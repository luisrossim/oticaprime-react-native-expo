import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useEmpresaCaixa } from "@/context/EmpresaCaixaContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Company } from "@/models/company";
import { SettingsButton } from "@/components/SettingsButton";
import { EmpresaService } from "@/services/empresa-service";
import { Caixa } from "@/models/caixa";
import { CaixaService } from "@/services/caixa-service";

export default function Settings() {
  const bottomSheetRefEmpresa = useRef<BottomSheet>(null);
  const bottomSheetRefCaixa = useRef<BottomSheet>(null);

  const [empresas, setEmpresas] = useState<Company[]>([]);
  const [caixas, setCaixas] = useState<Caixa[]>([]);

  const { selectedEmpresa, selectedCaixa, updateEmpresa, updateCaixa } = useEmpresaCaixa();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const snapPoints = useMemo(() => ['88%'], []);


  const fetchEmpresasAtivas = async () => {
    setLoading(true);

    try {
      const empresaService = new EmpresaService();
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
      const caixaService = new CaixaService();

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

  const handleChangeEmpresa = () => {
    bottomSheetRefEmpresa.current?.expand();
    fetchEmpresasAtivas();
  };

  const handleChangeCaixa = () => {
    bottomSheetRefCaixa.current?.expand();
    fetchCaixas();
  };

  const handleSelectEmpresa = async (empresa: Company) => {
    await updateEmpresa(empresa);
    bottomSheetRefEmpresa.current?.close();
  };

  const handleSelectCaixa = async (caixa: Caixa) => {
    await updateCaixa(caixa);
    bottomSheetRefCaixa.current?.close();
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
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image
              source={{ uri: 'https://github.com/luisrossim.png' }}
              style={styles.image}
          />

          <View style={{ gap: 5 }}>
            <Text style={styles.selectedEmpresaTitle}>
              {selectedEmpresa?.RAZAO_EMP || "Nenhuma empresa selecionada"}
            </Text>

            <Text
              style={{ fontSize: 12, fontWeight: "400", color: colors.gray[500], textAlign: 'center', marginBottom: 25 }}
            >
              {selectedCaixa?.DESC_CAI || "Nenhum caixa selecionado"}
            </Text>

            <View style={styles.account}>
              <Feather name="user" color={colors.gray[500]} />
              <Text
                style={{ fontSize: 12, fontWeight: "300", color: colors.gray[500], textAlign: 'center' }}
              >
                luisrossim12@gmail.com
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.options}>
          <SettingsButton
            icon="home"
            title="Selecionar empresa"
            iconColor={colors.blue[700]}
            onPress={handleChangeEmpresa}
          />

          <SettingsButton
            icon="box"
            title="Selecionar caixa"
            iconColor={colors.fuchsia[700]}
            onPress={handleChangeCaixa}
          />

          <SettingsButton 
            icon="help-circle" 
            title="Ajuda" 
            iconColor={colors.gray[700]} 
            onPress={() => {}} 
          />

          <SettingsButton 
            icon="log-out" 
            title="Sair" 
            iconColor={colors.red[700]} 
            onPress={() => {}} 
          />
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRefEmpresa}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 5 }}>
            Selecionar empresa</Text>
          <Text
            style={{ fontSize: 14, fontWeight: "300", color: colors.gray[500], marginBottom: 26 }}
          >
            Os dados serão sincronizados e exibidos de acordo com a empresa selecionada.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.sky[700]} />
          ) : (
            empresas.map((empresa) => (
              <TouchableOpacity
                key={empresa.COD_EMP}
                onPress={() => handleSelectEmpresa(empresa)}
                style={[
                  styles.radioButtonContainer,
                  selectedEmpresa?.COD_EMP === empresa.COD_EMP && styles.selectedRadioButtonEmpresa,
                ]}
              >
                <View
                  style={[
                    styles.radioButtonEmpresa,
                    selectedEmpresa?.COD_EMP === empresa.COD_EMP && styles.selectedInnerRadioButtonEmpresa,
                  ]}
                />
                <Text
                  style={[
                    styles.radioButtonText,
                    selectedEmpresa?.COD_EMP === empresa.COD_EMP && styles.selectedText,
                  ]}
                >
                  {empresa.RAZAO_EMP}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet
        ref={bottomSheetRefCaixa}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 5 }}>
            Selecionar caixa</Text>
          <Text
            style={{ fontSize: 14, fontWeight: "300", color: colors.gray[500], marginBottom: 26 }}
          >
            Os dados serão sincronizados e exibidos de acordo com o caixa selecionado.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.sky[700]} />
          ) : (
            caixas.map((caixa, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectCaixa(caixa)}
                style={[
                  styles.radioButtonContainer,
                  selectedCaixa?.DESC_CAI === caixa.DESC_CAI && styles.selectedRadioButtonCaixa,
                ]}
              >
                <View
                  style={[
                    styles.radioButtonCaixa,
                    selectedCaixa?.DESC_CAI === caixa.DESC_CAI && styles.selectedInnerRadioButtonCaixa,
                  ]}
                />
                <Text
                  style={[
                    styles.radioButtonText,
                    selectedCaixa?.DESC_CAI === caixa.DESC_CAI && styles.selectedText,
                  ]}
                >
                  {caixa.DESC_CAI}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    gap: 10,
    borderTopWidth: 0.5, 
    borderTopColor: colors.gray[300] 
  },
  profile: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  selectedProfileText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  profileTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '500',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5
  },
  radioButtonEmpresa: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[200],
    marginRight: 10,
  },
  selectedRadioButtonEmpresa: {
    backgroundColor: colors.blue[700]
  },
  selectedInnerRadioButtonEmpresa: {
    borderColor: colors.blue[500],
    backgroundColor: colors.blue[500]
  },
  radioButtonCaixa: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[200],
    marginRight: 10,
  },
  selectedRadioButtonCaixa: {
    backgroundColor: colors.fuchsia[700]
  },
  selectedInnerRadioButtonCaixa: {
    borderColor: colors.fuchsia[500],
    backgroundColor: colors.fuchsia[500]
  },
  selectedText: {
    color: "#FFF",
    fontWeight: 600
  },
  radioButtonText: {
    fontSize: 13,
    color: colors.gray[600]
  },
  subcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10
  },
  options: {
    paddingHorizontal: 20
  },
  selectedEmpresaTitle: {
    fontSize: 16, 
    fontWeight: "600", 
    textAlign: 'center',
    color: colors.gray[700]
  },
  account: {
    alignItems: "center", 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 5,
    borderWidth: 0.5, 
    borderRadius: 50,
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: colors.gray[400]
  },
  image: { 
    width: 70, 
    height: 70, 
    borderRadius: 50
}
});
