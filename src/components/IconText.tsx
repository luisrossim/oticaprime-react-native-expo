import { colors } from "@/utils/constants/colors"
import { FontAwesome6 } from "@expo/vector-icons"
import { View, StyleSheet, Text } from "react-native"

interface IconTextProps {
  icon: string
  text: string
}

export const IconText = (props: IconTextProps) => {
  return (
      <View style={styles.container}>
          <FontAwesome6
            name={props.icon}
            size={16}
            color={colors.indigo[900]}
          />
          <Text style={styles.text}>
              {props.text}
          </Text>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  text: {
    fontSize: 13
  }
})