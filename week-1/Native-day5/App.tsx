import React from 'react';
import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.mainTitle}>Contoh Penggunaan Button</Text>

        <View style={styles.exampleContainer}>
          <Text style={styles.componentTitle}>1. Button </Text>
          <Button
            title="Tekan Tombol"
            onPress={() => Alert.alert('tombol Ditekan')}
            color="#007AFF"
          />
        </View>

        <View style={styles.exampleContainer}>
          <Text style={styles.componentTitle}>2. Pressable </Text>
          <Pressable
            onPress={() => Alert.alert('tombol Press Ditekan')}
            style={({ pressed }) => [
                styles.pressableButton,
              { backgroundColor: pressed ? '#b8b8b8ff' : '#616161ff' },
            ]}
          >
            <Text style={styles.buttonText}>Tekan Tombol Press</Text>
          </Pressable>
        </View>

        <View style={styles.exampleContainer}>
          <Text style={styles.componentTitle}>3. Touchable Opacity </Text>
          <TouchableOpacity
            onPress={() => Alert.alert('tombol Touchable Opacity Ditekan')}
            style={styles.touchableButton}
            activeOpacity={0.5}
          >
            <Text style={styles.buttonText}>Tekan Tombol Touchable dengan Opacity</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exampleContainer}>
          <Text style={styles.componentTitle}>4. Touchable Highlight </Text>
          <TouchableHighlight
            onPress={() => Alert.alert('tombol Touchable Highlight Ditekan')}
            underlayColor="#9b9b9bff"
            style={styles.highlightButton}
          >
            <Text style={styles.buttonText}>Tekan Tombol Touchable dengan Highlight</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.exampleContainer}>
          <Text style={styles.componentTitle}>5. LongPress </Text>
          <Pressable
            onPress={() => Alert.alert('tombol tekan normal')}
            onLongPress={() => Alert.alert('Kelamaan Ditekan')}
            style={({ pressed }) => [
                styles.longPressButton,
              { backgroundColor: pressed ? '#b8b8b8ff' : '#616161ff' },
            ]}
          >
            <Text style={styles.buttonText}>Tekan Tombol Lama</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  exampleContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  componentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  componentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  pressableButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  highlightButton: {
    backgroundColor: '#5856D6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  longPressButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
