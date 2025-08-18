import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppColors } from '../constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, user, token, logout } = useAuth();
  
  useEffect(() => {
    
    if (!isLoading) {
      if (isAuthenticated && user && token) {
        // Verificar si el usuario es admin
        if (user.role === 'admin') {
          return;
        }
        router.replace('/(tabs)');
      } else {
        router.replace('./auth/login');
      }
    }
  }, [isAuthenticated, isLoading, user, token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.surface,
  },
  blockedContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  blockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.destructive,
    marginBottom: 16,
    textAlign: 'center',
  },
  blockedMessage: {
    fontSize: 16,
    color: AppColors.fg,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  blockedSubmessage: {
    fontSize: 14,
    color: AppColors.fgMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: AppColors.fgInverted,
    fontSize: 16,
    fontWeight: '600',
  },
});
