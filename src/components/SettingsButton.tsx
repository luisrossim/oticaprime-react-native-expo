import { colors } from "@/utils/constants/colors";
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

          <Text>{title}</Text>
        </View>

        <Feather name="chevron-right" size={20} color={colors.gray[500]} />
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      paddingVertical: 15,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.gray[300]
    }
});