import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

const MoodKalender = ({ user, moodData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateMoodData, setSelectedDateMoodData] = useState([]);
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setIsDateTimePickerVisible(false);

    if (user) {
      // Filter mood data for the selected date
      const formattedDate = date.toISOString().slice(0, 10);
      const filteredMoodData = moodData.filter((item) => item.createdAt.slice(0, 10) === formattedDate);
      setSelectedDateMoodData(filteredMoodData);
    }
  };

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Calendar Date Picker */}
      <TouchableOpacity style={styles.dateTimePicker} onPress={showDateTimePicker}>
        <Text style={styles.datePickerText}>
          {selectedDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {isDateTimePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            hideDateTimePicker();
            if (date) {
              handleDateSelect(date);
            }
          }}
        />
      )}

      {/* Display mood data for selected date */}
      {selectedDateMoodData.length > 0 && (
        <View>
          <Text style={styles.selectedDateHeader}>Stimmungen für das ausgewählte Datum:</Text>
          {selectedDateMoodData.map((item) => (
            <View key={item.id} style={styles.selectedDateMoodContainer}>
              <Text style={styles.selectedDateMoodText}>{item.mood}</Text>
              <Text style={styles.selectedDateReasonText}>Grund: {item.reason}</Text>
              <Text style={styles.selectedDateTextInputText}>Text: {item.textInput}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 10,
  },
  dateTimePicker: {
    width: '100%',
    padding: 10,
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedDateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: colors.purple,
  },
  selectedDateMoodContainer: {
    backgroundColor: colors.lightGrey,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedDateMoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  selectedDateReasonText: {
    fontSize: 14,
    color: colors.black,
  },
  selectedDateTextInputText: {
    fontSize: 14,
    color: colors.black,
  },
});

export default MoodKalender;
