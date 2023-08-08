import React from 'react';
import { Text } from 'react-native';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';


const screenWidth = Dimensions.get('window').width;

export const ContributionChart = ({ data }) => {
  const labels = data.map((item) => {
    const date = new Date(item.createdAt);
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  });

  const moodData = data.map((item) => {
    switch (item.mood) {
      case 'good':
        return 5;
      case 'happy':
        return 4;
      case 'neutral':
        return 3;
      case 'sad':
        return 2;
      case 'bad':
        return 1;
      case 'awful':
        return 0;
      default:
        return 0;
    }
  });

  const customLabels = {
    5: 'good: 5',
    4: 'happy: 4',
    3: 'neutral: 3',
    2: 'sad: 2',
    1: 'bad: 1',
    0: 'awful: 0',
  };

  const axesSvg = { fontSize: 10, fill: 'gray' };
  const verticalContentInset = { top: 10, bottom: 10 };
  const formatYLabel = (value) => customLabels[value];

  return (
    <ScrollView horizontal>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: moodData,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // black color for mood data
                strokeWidth: 5,
              },
            ],
          }}
          width={screenWidth + data.length * 30} // Increase the width to accommodate all data points
          height={380}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chartStyle}
          yLabelsOffset={0} // Offset the y-axis labels to prevent overlapping with the line
          formatYLabel={formatYLabel} // Use the custom formatYLabel function
          fromZero // Start the y-axis from zero
          showXAxisLabels={false} // Hide default x-axis labels
          verticalLabelRotation={270}
          xLabelsOffset={40}
        
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 16,
    borderRadius: 25,

  }, 
});



