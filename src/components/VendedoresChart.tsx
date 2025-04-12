import { colors } from '@/utils/constants/colors';
import { UtilitiesService } from '@/utils/utilities-service';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

interface Vendedor {
  COD_VEND: number;
  NOME_VEND: string;
  TOTAL_VENDAS: number;
  QUANTIDADE_VENDAS: number;
}

interface MonthVendedorData {
  month: string;
  vendedores: Vendedor[];
}

interface CustomBarChartVendedoresProps {
  data: MonthVendedorData[];
}

export function VendedoresChart({ data }: CustomBarChartVendedoresProps) {
  const [selected, setSelected] = useState<{ month: string; vendedor: Vendedor } | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const maxHeight = Math.max(
    ...data.flatMap(item => item.vendedores.map(v => v.TOTAL_VENDAS))
  );

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }, 300);
  }, []);

  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            {data.map((mes, i) => (
              <View key={i} style={{ marginHorizontal: 12, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  {mes.vendedores.map((vendedor, i) => {
                    const height = (vendedor.TOTAL_VENDAS / maxHeight) * 150;

                    return (
                      <View key={vendedor.COD_VEND} style={{ marginHorizontal: 2, alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 4, color: colors.slate[500] }}>
                          {vendedor.NOME_VEND.charAt(0)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setSelected({ month: mes.month, vendedor })}
                          activeOpacity={1}
                          style={styles.item}
                        >
                          <View
                            style={{
                              width: 20,
                              height,
                              backgroundColor: colors.purple[500],
                              opacity:
                                !selected ||
                                (selected.month === mes.month && selected.vendedor.COD_VEND === vendedor.COD_VEND)
                                  ? 1
                                  : 0.4,
                              borderRadius: 3
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.monthText}>{mes.month}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {selected && (
        <View style={{  margin: 10, alignItems: 'center', gap: 2, padding: 10 }}>
          <Text style={{ fontWeight: 700 }}>{selected.vendedor.NOME_VEND}</Text>
          <Text> {UtilitiesService.formatarValor(selected.vendedor.TOTAL_VENDAS)} em {selected.month}</Text>
          <Text style={{ fontSize: 13, color: colors.slate[500] }}>
            {selected.vendedor.QUANTIDADE_VENDAS} vendas
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
    marginBottom: 20
  },
  monthText: {
    width: 45,
    marginTop: 10,
    marginHorizontal: 2,
    textAlign: 'center',
    fontSize: 10,
    color: colors.slate[500],
  },
  item: {
    alignItems: 'center'
  }
});
