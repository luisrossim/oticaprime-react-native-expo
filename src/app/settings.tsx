import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useEmpresa } from "@/context/EmpresaContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
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
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 18, textAlign: "center", fontWeight: "600" }}>
              {selectedCompany?.RAZAO_EMP || ""}
            </Text>
            <Text
              style={{ fontSize: 12, fontWeight: "400", textAlign: "center", color: colors.gray[500] }}
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

          <SettingsButton icon="log-out" title="Sair" iconColor={colors.red[600]} onPress={() => {}} />
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
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 5 }}>Selecionar empresa</Text>
          <Text
            style={{ fontSize: 13, fontWeight: "300", color: colors.gray[500], marginBottom: 20 }}
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
  header: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 30
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
    borderRadius: 10
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.sky[700],
    marginRight: 10,
  },
  selectedRadioButton: {
    backgroundColor: colors.sky[100]
  },
  selectedText: {
    color: colors.sky[800],
    fontWeight: 600
  },
  selectedInnerRadioButton: {
    backgroundColor: colors.sky[700]
  },
  radioButtonText: {
    fontSize: 14,
    color: colors.slate[800]
  },
  subcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10
  },
  options: {
    flexDirection: 'column', 
    backgroundColor: colors.slate[100], 
    paddingHorizontal: 10,
    marginBottom: 20
  }
});
