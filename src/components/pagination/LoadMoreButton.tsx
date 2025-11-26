import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface LoadMoreButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  disabled?: boolean;
}

export function LoadMoreButton({
  onPress,
  isLoading = false,
  hasMore = true,
  disabled = false,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (<ActivityIndicator color={Colors.cardBackground} />) :
       (<Text style={styles.buttonText}>Load More</Text>)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.garden.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    minHeight: 44,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600',
  },
});