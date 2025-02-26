import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useEmpresa } from "@/context/EmpresaContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/utils/constants/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { Company } from "@/models/company";
import { SettingsButton } from "@/components/SettingsButton";
import { EmpresaService } from "@/services/empresa-service";

export default function Settings() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [empresas, setEmpresas] = useState<Company[]>([]);
  const { selectedCompany, updateCompany } = useEmpresa();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const snapPoints = useMemo(() => ['80%'], []);

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

  const handleChangeProfile = () => {
    bottomSheetRef.current?.expand();
    fetchEmpresasAtivas();
  };

  const handleSelectProfile = async (profile: Company) => {
    await updateCompany(profile);
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
      <View style={styles.container}>
        <View style={styles.profile}>
          <FontAwesome6 name="store" size={40} />
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", textAlign: 'center' }}>
              {selectedCompany?.RAZAO_EMP || ""}
            </Text>
            <Text
              style={{ fontSize: 12, fontWeight: "400", color: colors.gray[500], textAlign: 'center' }}
            >
              luis_teste_app@gmail.com
            </Text>
          </View>
        </View>

        <View style={styles.options}>
          <SettingsButton
            icon="check-circle"
            title="Selecionar empresa"
            iconColor={colors.sky[700]}
            onPress={handleChangeProfile}
          />

          <SettingsButton 
            icon="help-circle" 
            title="Ajuda" 
            iconColor={colors.green[600]} 
            onPress={() => {}} 
          />

          <SettingsButton 
            icon="log-out" 
            title="Sair da conta" 
            iconColor={colors.red[600]} 
            onPress={() => {}} 
          />
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 5 }}>
            Selecionar empresa</Text>
          <Text
            style={{ fontSize: 14, fontWeight: "300", color: colors.slate[500], marginBottom: 20 }}
          >
            Os dados serão sincronizados e exibidos de acordo com a empresa selecionada.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={colors.sky[700]} />
          ) : (
            empresas.map((empresa) => (
              <TouchableOpacity
                key={empresa.COD_EMP}
                onPress={() => handleSelectProfile(empresa)}
                style={[
                  styles.radioButtonContainer,
                  selectedCompany?.COD_EMP === empresa.COD_EMP && styles.selectedRadioButton,
                ]}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedCompany?.COD_EMP === empresa.COD_EMP && styles.selectedInnerRadioButton,
                  ]}
                />
                <Text
                  style={[
                    styles.radioButtonText,
                    selectedCompany?.COD_EMP === empresa.COD_EMP && styles.selectedText,
                  ]}
                >
                  {empresa.RAZAO_EMP}
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
    borderTopColor: colors.slate[300] 
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
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.slate[100],
    backgroundColor: colors.slate[100],
    marginRight: 10,
  },
  selectedRadioButton: {
    backgroundColor: colors.sky[700]
  },
  selectedText: {
    color: colors.sky[100],
    fontWeight: 600
  },
  selectedInnerRadioButton: {
    borderColor: colors.sky[500],
    backgroundColor: colors.sky[500]
  },
  radioButtonText: {
    fontSize: 13,
    color: colors.slate[600]
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
  }
});
