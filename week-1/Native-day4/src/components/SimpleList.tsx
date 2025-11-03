import React, { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SimpleList = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([
    'item 1',
    'item 2',
    'item 3',
    'item 4',
    'item 5',
    'item 6',
    'item 7',
    'item 8',
    'item 9',
    'item 10',
  ]);
  const [itemCounter, setItemCounter] = useState(11);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const newItems = Array.from(
        { length: 10 },
        (_, i) => `Item ${itemCounter + i}`,
      );

      setData(prevData => [...prevData, ...newItems]);

      setItemCounter(prevCounter => prevCounter + 10);

      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.content}
    >
      {data.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Total Items: {data.length}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
});

export default SimpleList;
