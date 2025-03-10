import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { colors } from "@/utils/constants/colors";

interface DatePickerContainerProps {
  dataInicial: Date;
  dataFinal: Date;
  onDateChange: (inicio: Date, fim: Date) => void;
}

export const DatePickerContainer: React.FC<DatePickerContainerProps> = ({
  dataInicial,
  dataFinal,
  onDateChange,
}) => {
  const [isDatePickerInicialVisible, setDatePickerInicialVisibility] = useState(false);
  const [isDatePickerFinalVisible, setDatePickerFinalVisibility] = useState(false);

  const showDatePickerInicial = () => setDatePickerInicialVisibility(true);
  const hideDatePickerInicial = () => setDatePickerInicialVisibility(false);
  const showDatePickerFinal = () => setDatePickerFinalVisibility(true);
  const hideDatePickerFinal = () => setDatePickerFinalVisibility(false);

  return (
    <View style={styles.datePickerContainer}>
        <Feather style={{ marginRight: 4 }} name="calendar" size={22} color={colors.gray[500]} />

        <TouchableOpacity onPress={showDatePickerInicial} style={styles.datePickerElement}>
            <Text style={styles.datePickerLabel}>{dataInicial.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
            isVisible={isDatePickerInicialVisible}
            mode="date"
            display="inline"
            date={dataInicial}
            locale="pt-BR"
            onConfirm={(date) => {
            onDateChange(date, dataFinal);
            hideDatePickerInicial();
            }}
            onCancel={hideDatePickerInicial}
        />

        <FontAwesome6 name="arrows-left-right" color={colors.gray[400]} />

        <TouchableOpacity onPress={showDatePickerFinal} style={styles.datePickerElement}>
            <Text style={styles.datePickerLabel}>{dataFinal.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
            isVisible={isDatePickerFinalVisible}
            mode="date"
            display="inline"
            locale="pt-BR"
            date={dataFinal}
            onConfirm={(date) => {
            onDateChange(dataInicial, date);
            hideDatePickerFinal();
            }}
            onCancel={hideDatePickerFinal}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    datePickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 20,
        marginBottom: 2,
    },
    datePickerElement: {
        padding: 6,
    },
    datePickerLabel: {
        fontSize: 15,
        borderWidth: 0.5,
        borderColor: colors.gray[400],
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#FFF",
        color: colors.gray[500],
        fontWeight: "500",
    },
});
