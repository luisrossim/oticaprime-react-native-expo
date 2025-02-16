import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { useEmpresa } from "@/context/EmpresaContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Company } from "@/models/company";
import { SettingsButton } from "@/components/SettingsButton";

export default function Settings() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { selectedCompany, updateCompany } = useEmpresa();
    const snapPoints = useMemo(() => ['75%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ), []
    );

    const handleChangeProfile = () => {
        bottomSheetRef.current?.expand();
    };

    const handleSelectProfile = async (profile: Company) => {
        await updateCompany(profile);
        bottomSheetRef.current?.close();
    };

    const profiles: Company[] = [
        { id: 1, nome: 'Empresa Ótica 1', endereco: 'Nova Venécia (ES)' },
        { id: 2, nome: 'Empresa Ótica 2', endereco: 'Colatina (ES)' },
        { id: 3, nome: 'Empresa Ótica 3', endereco: 'Vila Velha (ES)' },
        { id: 4, nome: 'Empresa Ótica 4', endereco: 'Linhares (ES)' },
    ];

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.gray[100] }}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <MaterialCommunityIcons name="office-building-cog-outline" size={40} />
          <View style={{gap: 2}}>
            <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 600}}>
              {selectedCompany?.nome || ""}
            </Text>
            <Text style={{fontSize: 13, fontWeight: 400, textAlign: 'center', color: colors.gray[500]}}>
              {selectedCompany?.endereco || ""}
            </Text>
          </View>
        </View>

        <View 
          style={{flexDirection: 'column', backgroundColor: "#FFF", paddingHorizontal: 10, marginBottom: 20}}
        >
          <SettingsButton
            icon="check-circle"
            title="Selecionar empresa"
            iconColor={colors.blue[500]}
            onPress={handleChangeProfile} 
          />
        </View>

        <View 
          style={{flexDirection: 'column', backgroundColor: "#FFF", paddingHorizontal: 10}}
        >
          <SettingsButton
            icon="log-out"
            title="Sair"
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
              <Text style={{fontSize: 22, fontWeight: "600", marginBottom: 5}}>
                Selecionar empresa:
              </Text>
              <Text style={{fontSize: 13, fontWeight: "300", color: colors.gray[500], marginBottom: 20}}>
                Os dados serão sincronizados e exibidos de acordo com a empresa selecionada.
              </Text>

              {profiles.map((profile) => (
                  <TouchableOpacity
                      key={profile.id}
                      style={[
                          styles.radioButtonContainer,
                          selectedCompany?.id === profile.id && styles.selectedRadioButton
                      ]}
                      onPress={() => handleSelectProfile(profile)}
                  >
                      <View
                          style={[
                              styles.radioButton,
                              selectedCompany?.id === profile.id && styles.selectedInnerRadioButton
                          ]}
                      />
                      <Text style={styles.radioButtonText}>{profile.nome}</Text>
                  </TouchableOpacity>
              ))}
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
      gap: 10
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
      padding: 20,
      borderRadius: 5
  },
  radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.blue[500],
      marginRight: 10,
  },
  selectedRadioButton: {
      backgroundColor: colors.blue[50]
  },
  selectedInnerRadioButton: {
      backgroundColor: colors.blue[500]
  },
  radioButtonText: {
      fontSize: 13,
      color: colors.gray[800]
  },
  subcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10
  }
});
