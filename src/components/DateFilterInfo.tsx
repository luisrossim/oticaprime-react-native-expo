import { useDateFilter } from "@/context/DateFilterContext";
import { colors } from "@/utils/constants/colors";
import { Feather } from "@expo/vector-icons";
import { View, Text } from "react-native"

export const DateFilterInfo = () => {
    const {dateFilter} = useDateFilter();
    
    return (
        <View style={{flexDirection: "row", gap: 6, marginBottom: 5}}>
            <Feather 
                name="calendar"
                size={16}
                color={colors.gray[600]} 
            />
            {dateFilter ? (
                    <Text style={{color: colors.gray[600]}}>
                        {String(dateFilter.dataInicial)} até {String(dateFilter.dataFinal)}
                    </Text>
                ) : (
                    <Text style={{color: colors.gray[600]}}>
                        Nenhum intervalo selecionado.
                    </Text>
                )
            }
        </View>
    )
}