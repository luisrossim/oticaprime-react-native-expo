import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { colors } from '@/utils/constants/colors';

interface CustomBarChartProps {
  data: {month: string, value: number}[]
}

export function CustomBarChart({data}: CustomBarChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;
  const scrollViewRef = useRef<ScrollView | null>(null);

  const maxHeight = Math.max(...data.map(item => item.value));

  useEffect(() => {
    Animated.stagger(100,
      animatedValues.map((anim, index) =>
        Animated.timing(anim, {
          toValue: data[index].value,
          duration: 800,
          useNativeDriver: false
        })
      )
    ).start();

    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.graphContainer}>
          <View style={styles.barContainer}>
            {data.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setSelectedIndex(index)} 
                activeOpacity={1} 
                style={styles.item}
              >
                <Animated.View 
                  style={[
                    styles.bar, 
                    { 
                      height: animatedValues[index].interpolate({
                        inputRange: [0, maxHeight],
                        outputRange: [0, 150], 
                      }),
                      backgroundColor: colors.blue[600],
                      opacity: selectedIndex === null || selectedIndex === index ? 1 : 0.4 
                    }
                  ]} 
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.labelContainer}>
            {data.map((item, index) => (
              <Text key={index} style={styles.monthText}>{item.month}</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {selectedIndex !== null && (
        <View style={styles.selectedContainer}>
          <View style={styles.selectedIcon} />
          <Text style={styles.selectedText}>
            {data[selectedIndex].value} VENDAS
          </Text>
          <Text style={[styles.selectedText, {color: colors.slate[500]}]}>
            ({data[selectedIndex].month})
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  graphContainer: {
    flexDirection: 'column', 
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
  },
  item: {
    alignItems: 'center',
  },
  bar: {
    width: 45,
    borderRadius: 4,
    marginHorizontal: 2
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  monthText: {
    width: 45,
    marginHorizontal: 2,
    textAlign: 'center',
    fontSize: 10,
    color: colors.slate[500],
  },
  selectedText: {
    fontSize: 12,
    color: colors.slate[500]
  },
  selectedContainer: {
    position: 'absolute',
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    top: -40,
    left: 20,
  },
  selectedIcon: {
    width: 7,
    height: 7,
    borderRadius: 60,
    backgroundColor: colors.blue[600]
  }
});
