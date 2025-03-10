import { CaixaFormasPagamento } from "@/models/caixa";
import { colors } from "@/utils/constants/colors";
import { UtilitiesService } from "@/utils/utilities-service";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
                    <View key={index} style={styles.lineContainer}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 7}}>
                            <Text style={styles.label}>{item.DESCRICAO}</Text>
                            <Text style={styles.percentagem}>
                                {`${UtilitiesService.formatarValor(item.VALOR_TOTAL)} (${percentagem.toFixed(0)}%)`}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.line,
                                { width: `${percentagem}%`, backgroundColor: getColor(index) },
                            ]}
                        />
                    </View>
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
        width: "100%",
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[300]
    },
    label: {
        fontSize: 13
    },
    line: {
        height: 4
    },
    percentagem: {
        color: colors.gray[500],
        fontWeight: 400,
    },
});
