import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../color/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Cari...'
}) => {
  const clearSearch = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <FontAwesome6 name="magnifying-glass" size={16} color={colors.textLight} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
          <FontAwesome6 name="times" size={14} color={colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    height: 50,
  },
  searchIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default SearchBar;