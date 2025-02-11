import { colors } from "@/constants/colors";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const CustomButton = ({ title, onPress }: { title: string, onPress: () => void }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.sky[600],
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
});