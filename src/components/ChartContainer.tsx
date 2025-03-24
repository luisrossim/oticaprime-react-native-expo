import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '@/utils/constants/colors';
import { Feather } from '@expo/vector-icons';

interface ChartHeaderProps {
  title: string;
  selectedRange: number;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  children: React.ReactNode;
}

export function ChartContainer({ title, selectedRange, icon, iconColor, backgroundColor, children }: ChartHeaderProps) {
  return (
    <View style={styles.chartContainer}>
        <View style={styles.chartAlign}>
            <View style={styles.chartHeader}>
                <Feather 
                    style={[styles.chartIcon, {backgroundColor: backgroundColor}]}
                    color={iconColor}
                    name={icon as keyof typeof Feather.glyphMap} 
                    size={16} 
                />
                <View>
                    <Text style={styles.title}>
                      {title}
                    </Text>
                    <Text style={styles.subTitle}>
                      {selectedRange} MESES
                    </Text>
                </View>
            </View>
            <Feather 
                style={styles.chartShareIcon}
                name="share-2" 
                size={17} 
            />
        </View>
        {children}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    borderWidth: 1, 
    borderColor: colors.slate[200], 
    borderRadius: 16, 
    margin: 15,
    overflow: "hidden"
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8
  },
  chartAlign: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    padding: 20
  },
  chartIcon: {
    borderRadius: 60, 
    padding: 7
  },
  chartShareIcon: {
    alignSelf: "flex-start",
    color: colors.slate[400]
  },
  title: {
    color: colors.slate[700],
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 2
  },
  subTitle: {
    fontSize: 11,
    color: colors.slate[500],
  }
});
