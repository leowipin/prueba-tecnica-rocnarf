import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppColors } from '../../constants/Colors';
import { BaseButtonProps } from './baseButtonProps';

const BaseButton: React.FC<BaseButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled,
  style,
  ...rest 
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[size]];
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    } else {
      baseStyle.push(styles[variant]);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle: any[] = [styles.text, styles[`text_${size}`]];
    
    if (disabled) {
      baseTextStyle.push(styles.textDisabled);
    } else {
      baseTextStyle.push(styles[`text_${variant}`]);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]}
      disabled={disabled}
      activeOpacity={0.8}
      {...rest}
    >
      {typeof children === 'string' ? (
        <Text style={getTextStyle()}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  // Variants
  primary: {
    backgroundColor: AppColors.primary,
  },
  secondary: {
    backgroundColor: AppColors.surface2,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  destructive: {
    backgroundColor: AppColors.destructive,
  },
  disabled: {
    backgroundColor: AppColors.fgMuted2,
    opacity: 0.6,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  text_primary: {
    color: AppColors.fgInverted,
  },
  text_secondary: {
    color: AppColors.primary,
  },
  text_destructive: {
    color: AppColors.fgInverted,
  },
  textDisabled: {
    color: AppColors.fgMuted,
  },
});

export default BaseButton;
