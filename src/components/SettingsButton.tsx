import { colors } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

type SettingsButtonProps = {
  title: string;
  icon: string;
  iconColor?: string;
  onPress: () => void;
};

export const SettingsButton: React.FC<SettingsButtonProps> = ({ title, icon, iconColor, onPress }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={{alignItems: 'center', flexDirection: 'row', gap: 10}}>
          <Feather 
            name={icon as keyof typeof Feather.glyphMap} 
            size={15}
            color="#FFF"
            style={{padding: 6, backgroundColor: iconColor, borderRadius: 5}}
          />

          <Text style={styles.buttonText}>
            {title}
          </Text>
        </View>

        <Feather name="chevron-right" size={20} color={colors.gray[400]} />
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    buttonText: {
      color: colors.gray[700],
      fontSize: 15,
      fontWeight: 500,
    }
});