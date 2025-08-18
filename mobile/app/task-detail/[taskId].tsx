import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { changeTaskStatus, createTaskComment, getTaskById, getTaskComments } from '../../services/tasks';
import { ApiError } from '../../types/errors';
import { TaskComment, TaskDetail, TaskStatus } from '../../types/tasks';
import { formatDateToLocal, formatTimeOnly } from '../../utils/dateUtils';

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const { user } = useAuth();
  
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const loadTaskDetail = async () => {
    if (!taskId) return;
    
    try {
      setError(null);
      const taskData = await getTaskById(taskId);
      setTask(taskData);
    } catch (err) {
      console.error('Error loading task detail:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error cargando el detalle de la tarea');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!taskId) return;
    
    try {
      const commentsData = await getTaskComments(taskId);
      setComments(commentsData);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadTaskDetail(), loadComments()]);
    setRefreshing(false);
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      loadTaskDetail();
      loadComments();
    } else {
      setError('ID de tarea no válido');
      setLoading(false);
    }
  }, [taskId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !taskId) return;

    setSubmittingComment(true);
    try {
      const createdComment = await createTaskComment(taskId, {
        content: newComment.trim(),
      });
      
      // Agregar el nuevo comentario a la lista
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
      Alert.alert(
        'Error',
        err instanceof ApiError ? err.message : 'Error al crear el comentario'
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!taskId || !task) return;

    Alert.alert(
      'Cambiar Estado',
      `¿Estás seguro de que quieres cambiar el estado a "${newStatus}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            setChangingStatus(true);
            try {
              await changeTaskStatus(taskId, newStatus);
              // Actualizar el estado local inmediatamente
              setTask(prev => prev ? { ...prev, status: newStatus } : null);
              Alert.alert('Éxito', 'Estado de la tarea actualizado correctamente');
              
              // Navegar de vuelta y forzar refresh del home
              router.back();
              // El home se refrescará automáticamente cuando vuelva al foco
            } catch (err) {
              console.error('Error changing task status:', err);
              Alert.alert(
                'Error',
                err instanceof ApiError ? err.message : 'Error al cambiar el estado de la tarea'
              );
            } finally {
              setChangingStatus(false);
            }
          },
        },
      ]
    );
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

  const getAvailableStatuses = (currentStatus: string): TaskStatus[] => {
    const all = [TaskStatus.PENDIENTE, TaskStatus.EN_PROGRESO, TaskStatus.COMPLETADA];
    return all.filter(status => status !== currentStatus);
  };

  const renderComment = ({ item }: { item: TaskComment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>@{item.user.username}</Text>
        <Text style={styles.commentTime}>
          {formatTimeOnly(item.createdAt)}
        </Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Cargando tarea...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tarea no encontrada</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Tarea</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[AppColors.primary]}
            />
          }
        >
          {/* Task Detail */}
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                <Text style={styles.statusText}>{task.status}</Text>
              </View>
            </View>

            <Text style={styles.taskDescription}>{task.description}</Text>

            <View style={styles.taskMeta}>
              <Text style={styles.metaItem}>
                📅 Vence: {formatDateToLocal(task.dueDate)}
              </Text>
              <Text style={styles.metaItem}>
                📝 Creada: {formatDateToLocal(task.createdAt)}
              </Text>
            </View>

            {/* Status Change Section */}
            <View style={styles.statusSection}>
              <Text style={styles.statusSectionTitle}>Cambiar Estado</Text>
              <View style={styles.statusButtons}>
                {getAvailableStatuses(task.status).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      { backgroundColor: getStatusColor(status) }
                    ]}
                    onPress={() => handleStatusChange(status)}
                    disabled={changingStatus}
                  >
                    {changingStatus ? (
                      <ActivityIndicator size="small" color={AppColors.fgInverted} />
                    ) : (
                      <Text style={styles.statusButtonText}>{status}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comentarios</Text>
            
            {loadingComments ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator size="small" color={AppColors.primary} />
                <Text style={styles.loadingText}>Cargando comentarios...</Text>
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.noComments}>
                <Text style={styles.noCommentsText}>No hay comentarios</Text>
              </View>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un comentario..."
            placeholderTextColor={AppColors.fgMuted}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: newComment.trim() && !submittingComment 
                  ? AppColors.primary 
                  : AppColors.fgMuted 
              }
            ]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || submittingComment}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color={AppColors.fgInverted} />
            ) : (
              <Text style={styles.submitButtonText}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.surface3,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.fg,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskCard: {
    backgroundColor: AppColors.surface2,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.surface3,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.fg,
    marginRight: 12,
    lineHeight: 26,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: {
    color: AppColors.fgInverted,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 16,
    color: AppColors.fg,
    lineHeight: 22,
    marginBottom: 16,
  },
  taskMeta: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.surface3,
  },
  metaItem: {
    fontSize: 14,
    color: AppColors.fgMuted,
    marginBottom: 8,
  },
  commentsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.fg,
    marginBottom: 16,
  },
  commentsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noCommentsText: {
    fontSize: 16,
    color: AppColors.fgMuted,
    textAlign: 'center',
  },
  commentItem: {
    backgroundColor: AppColors.surface2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AppColors.surface3,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
  commentTime: {
    fontSize: 12,
    color: AppColors.fgMuted,
  },
  commentContent: {
    fontSize: 14,
    color: AppColors.fg,
    lineHeight: 18,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.surface2,
    borderTopWidth: 1,
    borderTopColor: AppColors.surface3,
  },
  textInput: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: AppColors.fg,
    borderWidth: 1,
    borderColor: AppColors.surface3,
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: AppColors.fgInverted,
    fontSize: 14,
    fontWeight: '600',
  },
  statusSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: AppColors.surface3,
  },
  statusSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.fg,
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonText: {
    color: AppColors.fgInverted,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
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
});
