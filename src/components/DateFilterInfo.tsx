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
                color={colors.gray[500]} 
            />
            {dateFilter ? (
                    <Text style={{color: colors.gray[500]}}>
                        {String(dateFilter.dataFinal)} - {String(dateFilter.dataInicial)}
                    </Text>
                ) : (
                    <Text style={{color: colors.gray[500]}}>
                        Nenhum intervalo selecionado.
                    </Text>
                )
            }
        </View>
    )
}