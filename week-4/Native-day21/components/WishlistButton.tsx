import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { colors } from '../color/colors';
import { useWishlist } from '../utils/useWishlist';
import { Product } from '../navigation/types';

interface WishlistButtonProps {
  product: Product;
  size?: number;
  showText?: boolean;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  size = 24,
  showText = false 
}) => {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handlePress = () => {
    if (!isLoading) {
      toggleWishlist(product);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      disabled={isLoading}
    >
      <FontAwesome6 
        name={isWishlisted ? 'heart' : 'heart-circle-plus'}
        size={size}
        color={isWishlisted ? colors.error : colors.textLight}
        solid={isWishlisted}
      />
      {showText && (
        <Text style={[
          styles.text,
          { color: isWishlisted ? colors.error : colors.textLight }
        ]}>
          {isWishlisted ? 'Favorit' : 'Tambah Favorit'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  text: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default WishlistButton;