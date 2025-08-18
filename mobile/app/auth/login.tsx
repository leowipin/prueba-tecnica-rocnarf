import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginForm from '../../components/forms/LoginForm';
import { AppColors } from '../../constants/Colors';

const LoginPage: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            <LoginForm />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                ¿No tienes una cuenta?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('./register')}>
                <Text style={styles.link}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.surface3, // Fondo alternativo azul claro
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: AppColors.surface, // Fondo principal blanco
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.fg,
    textAlign: 'center',
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 14,
    color: AppColors.fgMuted2,
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
    color: AppColors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
