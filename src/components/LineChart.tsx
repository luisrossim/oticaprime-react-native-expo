import { FormasPagamentoTotal } from "@/models/caixa";
import { colors } from "@/utils/constants/colors";
import { UtilitiesService } from "@/utils/utilities-service";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


interface LineChartProps {
  total: number;
  values: FormasPagamentoTotal[];
  type: 'recebimentos' | 'vendas';
}

export const LineChart: React.FC<LineChartProps> = ({ total, values, type }) => {
    return (
        <View style={styles.container}>

            {values.map((item, index) => {
                const percentagem = (item.VALOR_TOTAL / total) * 100;

                return (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.lineContainer}
                        onPress={() => {router.push(`${type == 'recebimentos' ? '/recebimentos' : '/vendas'}`)}}
                    >
                        <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Text style={styles.label}>
                                {`${item.DESCRICAO} (${item.QUANTIDADE})`}
                            </Text>
                            <Feather name="chevron-right" size={20} color={colors.gray[500]} />
                        </View>

                        <Text style={styles.subItemText}>
                            {`${UtilitiesService.formatarValor(item.DESCONTO_TOTAL || 0)} DE DESCONTO`}
                        </Text>
                        
                        <Text style={styles.subItemText}>
                            {`${UtilitiesService.formatarValor(item.VALOR_TOTAL)} (${percentagem.toFixed(1)}%)`}
                        </Text>

                        <View
                            style={[
                                styles.line,
                                { width: `${percentagem}%`, backgroundColor: getColor(index) },
                            ]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};


const getColor = (index: number) => {
    const cores = [colors.blue[500], colors.green[500], colors.pink[500], colors.red[500], colors.orange[500], colors.gray[500]];
    return cores[index % cores.length];
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    lineContainer: {
        flexDirection: "column",
        padding: 20,
        gap: 5,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    label: {
        fontWeight: 500,
        color: colors.gray[900]
    },
    line: {
        height: 4,
        marginTop: 5
    },
    subItemText: {
        fontSize: 13,
        color: colors.gray[500]
    },
});
