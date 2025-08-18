import type { Comment } from '../../interfaces/task.type';

interface CommentsListProps {
  comments: Comment[];
  isLoading?: boolean;
}

const CommentsList = ({ comments, isLoading = false }: CommentsListProps) => {
  const formatDate = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-4 w-1/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-6 w-full rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-fg-muted">
        <p>No hay comentarios para esta tarea</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-surface-2 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium text-fg">
              {comment.user.username}
            </span>
            <span className="text-xs text-fg-muted">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-fg leading-relaxed">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
