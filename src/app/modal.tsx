import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { useEmpresa } from "@/context/EmpresaContext";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { Company } from "@/models/company";
import { SettingsButton } from "@/components/SettingsButton";

export default function Modal() {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { selectedCompany, updateCompany } = useEmpresa();
    const snapPoints = useMemo(() => ['80%'], []);

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <FontAwesome5 name="building" size={40} />
          <View style={{gap: 2}}>
            <Text style={{fontSize: 20, fontWeight: 600}}>
              {selectedCompany?.nome || ""}
            </Text>
            <Text style={{fontSize: 14, fontWeight: 400, color: colors.gray[500]}}>
              {selectedCompany?.endereco || ""}
            </Text>
          </View>
        </View>

        <View 
          style={{flexDirection: 'column', gap: 2, backgroundColor: colors.gray[50], paddingHorizontal: 20, marginBottom: 20}}
        >
          <SettingsButton
            icon="check-circle"
            title="Selecionar empresa"
            iconColor={colors.sky[500]}
            onPress={handleChangeProfile} 
          />

          <SettingsButton 
            icon="edit" 
            title="Alterar informações" 
            iconColor={colors.orange[500]}
            onPress={() => {}} 
          />

          <SettingsButton 
            icon="plus-circle"
            title="Adicionar nova empresa" 
            iconColor={colors.green[500]}
            onPress={() => {}} 
          />  
        </View>

        <View 
          style={{flexDirection: 'column', gap: 2, backgroundColor: colors.gray[50], paddingHorizontal: 20}}
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
              <Text style={{fontSize: 20, fontWeight: "500", marginBottom: 15}}>
                Selecionar empresa:
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
    flexDirection: 'row',
    gap: 10,
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
      gap: 6,
      padding: 20,
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
      borderColor: colors.gray[400],
      marginRight: 10,
  },
  selectedRadioButton: {
      backgroundColor: colors.sky[100]
  },
  selectedInnerRadioButton: {
      backgroundColor: colors.sky[500]
  },
  radioButtonText: {
      fontSize: 16,
      color: colors.gray[700]
  },
  subcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10
  }
});
