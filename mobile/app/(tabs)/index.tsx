import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { getAssignedTasks } from '../../services/tasks';
import { ApiError } from '../../types/errors';
import { Task, TaskStatus } from '../../types/tasks';
import { formatDateOnly } from '../../utils/dateUtils';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setError(null);
      const tasksData = await getAssignedTasks();
      setTasks(tasksData);
    } catch (err) {
      console.error('Error loading tasks:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error cargando las tareas');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  // Refrescar cuando la pantalla vuelve al foco (después de regresar del detalle)
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/task-detail/${taskId}` as any);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case TaskStatus.COMPLETADA:
        return AppColors.success;
      case TaskStatus.EN_PROGRESO:
        return AppColors.primary;
      case TaskStatus.PENDIENTE:
      default:
        return AppColors.destructive;
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={styles.taskItem} 
      onPress={() => handleTaskPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.taskMeta}>
        <Text style={styles.metaText}>
          📅 {formatDateOnly(item.dueDate)}
        </Text>
        <Text style={styles.metaText}>
          👤 {item.createdBy.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          {user && (
            <Text style={styles.usernameText}>@{user.username}</Text>
          )}
        </View>
        {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Mis Tareas</Text>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadTasks} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={[AppColors.primary]}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tienes tareas asignadas</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tasks.length === 0 ? styles.emptyList : undefined}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.surface3,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: AppColors.fgMuted,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.fg,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: AppColors.destructive,
    borderRadius: 6,
  },
  logoutText: {
    color: AppColors.fgInverted,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.fg,
    marginBottom: 16,
  },
  taskItem: {
    backgroundColor: AppColors.surface2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.surface3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.fg,
    marginRight: 12,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: AppColors.fgInverted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: AppColors.fgMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AppColors.fgMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: AppColors.destructive,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: AppColors.fgInverted,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.fgMuted,
    textAlign: 'center',
  },
  emptyList: {
    flex: 1,
  },
});