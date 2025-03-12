import { CaixaFormasPagamento } from "@/models/caixa";
import { colors } from "@/utils/constants/colors";
import { UtilitiesService } from "@/utils/utilities-service";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface LineChartProps {
  total: number;
  values: CaixaFormasPagamento[];
}

export const LineChart: React.FC<LineChartProps> = ({ total, values }) => {
    return (
        <View style={styles.container}>

            {values.map((item, index) => {
                const percentagem = (item.VALOR_TOTAL / total) * 100;

                return (
                    <TouchableOpacity key={index} style={styles.lineContainer}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <View style={{flexDirection: "column", marginBottom: 7}}>
                                <Text style={styles.label}>{item.DESCRICAO}</Text>
                                <Text style={styles.percentagem}>
                                    {`${UtilitiesService.formatarValor(item.VALOR_TOTAL)} (${percentagem.toFixed(0)}%)`}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={colors.gray[500]} />
                        </View>

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
        paddingHorizontal: 20,
        paddingVertical: 14,
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    label: {
        fontWeight: 500,
        marginBottom: 4,
        color: colors.gray[600]
    },
    line: {
        height: 4
    },
    percentagem: {
        fontSize: 13,
        color: colors.gray[500],
        fontWeight: 400,
    },
});
