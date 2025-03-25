import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

type SettingsButtonProps = {
  title: string;
  icon: string;
  iconColor: string;
  onPress: () => void;
};

export const SettingsButton: React.FC<SettingsButtonProps> = ({ title, icon, iconColor, onPress }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <View style={styles.buttonContainer}>
          <Feather 
            name={icon as keyof typeof Feather.glyphMap} 
            size={18}
            color="#FFF"
            style={[styles.buttonIcon, {backgroundColor: iconColor}]}
          />

          <Text style={styles.buttonLabel}>
            {title}
          </Text>
        </View>

        <Feather 
          name="chevron-right" 
          size={18} 
          color={colors.slate[400]} 
        />
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  buttonContainer: {
    alignItems: 'center', 
    flexDirection: 'row', 
    gap: 10
  },
  buttonIcon: {
    padding: 8,
    borderRadius: 60
  },
  buttonLabel: {
    fontWeight: 500,
    color: colors.slate[700]
  }
});