import { FormasPagamentoTotal } from "@/models/caixa";
import { colors } from "@/utils/constants/colors";
import { UtilitiesService } from "@/utils/utilities-service";
import React from "react";
import { View, Text, StyleSheet } from "react-native";


interface LineChartProps {
  total: number;
  values: FormasPagamentoTotal[];
}

export const LineChart: React.FC<LineChartProps> = ({ total, values }) => {
    return (
      <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: colors.slate[100] }}>
        <View style={styles.segmentedBarContainer}>
            <View style={styles.segmentedBar}>
            {values.map((item, index) => {
                const percentage = (item.VALOR_TOTAL / total) * 100;
                const color = getColor(index);

                return (
                <View
                    key={index}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    {percentage > 8 && (
                    <Text style={styles.segmentText}>
                        {`${percentage.toFixed(0)}%`}
                    </Text>
                    )}
                </View>
                );
            })}
            </View>
        </View>
  
        <View style={styles.legendContainer}>
          {values.map((item, index) => {
            return (
                <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: getColor(index) }]} />

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1}}>
                        <Text style={styles.legendText}>
                        {`${item.DESCRICAO} (${item.QUANTIDADE})`}
                        </Text>

                        <Text style={styles.legendValue}>
                        {`${UtilitiesService.formatarValor(item.VALOR_TOTAL)}`}
                        </Text>
                    </View>
                </View>
            );
          })}
        </View>
      </View>
    );
};
  


const getColor = (index: number) => {
    const cores = [colors.blue[500], colors.green[500], colors.pink[500], colors.red[500], colors.orange[500], colors.slate[500]];
    return cores[index % cores.length];
};


const styles = StyleSheet.create({
    segmentedBarContainer: {
      marginBottom: 10,
    },
    segmentedBar: {
      flexDirection: 'row',
      height: 20,
      borderRadius: 12,
      overflow: 'hidden',
    },
    legendContainer: {
      marginTop: 10,
      gap: 10,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    legendColor: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      fontWeight: 600,
      color: colors.slate[700],
    },
    legendValue: {
        fontSize: 14,
        fontWeight: 300,
        color: colors.slate[600],
    },
    segmentText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "bold",
    },
});
  
