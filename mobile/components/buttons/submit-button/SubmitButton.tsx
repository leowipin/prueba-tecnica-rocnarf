import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '../../../constants/Colors';
import BaseButton from '../BaseButton';
import { SubmitButtonProps } from './submitButtonProps';

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  children, 
  isLoading = false, 
  loadingText = 'Cargando...',
  disabled,
  ...rest 
}) => {
  return (
    <BaseButton 
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={AppColors.fgInverted} 
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      ) : (
        children
      )}
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  loadingText: {
    color: AppColors.fgInverted,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SubmitButton;
