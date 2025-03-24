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
        <View style={{flex: 1}}>
            {values.map((item, index) => {
                const percentagem = (item.VALOR_TOTAL / total) * 100;

                return (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.lineContainer}
                        onPress={() => router.push(type === 'recebimentos' ? '/recebimentos' : '/vendas')}
                    >
                        <View style={styles.rowContainer}>
                            <View style={[styles.colorIndicator, { backgroundColor: getColor(index) }]} />
                            <View style={styles.textContainer}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.label}>
                                        {`${item.DESCRICAO} (${item.QUANTIDADE})`}
                                    </Text>
                                    <Feather name="chevron-right" size={20} color={colors.slate[400]} />
                                </View>
                                <Text style={styles.subItemText}>
                                    {`${UtilitiesService.formatarValor(item.VALOR_TOTAL)} (${percentagem.toFixed(1)}%)`}
                                </Text>
                                <View style={[styles.line, { width: `${percentagem}%`, backgroundColor: getColor(index) }]} />
                            </View>
                        </View>
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
    lineContainer: {
        padding: 20
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    colorIndicator: {
        width: 15,
        height: 15,
        borderRadius: 60,
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontWeight: 600,
        color: colors.slate[700],
    },
    subItemText: {
        fontSize: 13,
        color: colors.slate[500],
    },
    line: {
        height: 4,
        borderRadius: 2,
        marginTop: 5,
    },
});
