import React, { useState } from 'react';
import { MessageSquare, History } from 'lucide-react';
import type { Comment, TaskHistoryItem } from '../../types/todo';
import { CommentsSection } from './CommentsSection';
import { HistorySection } from './HistorySection';

interface TaskActivitySectionProps {
  taskId: string;
  comments: Comment[];
  history: TaskHistoryItem[];
  onAddComment: (taskId: string, content: string, parentId?: string) => void;
  onUpdateComment: (taskId: string, commentId: string, content: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
}

export const TaskActivitySection: React.FC<TaskActivitySectionProps> = ({
  taskId,
  comments,
  history,
  onAddComment,
  onUpdateComment,
  onDeleteComment
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');

  return (
    <div className="task-activity-section">
      <div className="task-activity-tab-bar">
        <div className="task-activity-tabs">
          <button
            type="button"
            className={`task-activity-tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <MessageSquare size={13} className="tab-icon" />
            <span>Comments</span>
            {comments.length > 0 && (
              <span className="task-activity-badge">{comments.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`task-activity-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={13} className="tab-icon" />
            <span>History</span>
            {history.length > 0 && (
              <span className="task-activity-badge">{history.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="task-activity-content">
        {activeTab === 'comments' ? (
          <CommentsSection
            taskId={taskId}
            comments={comments}
            onAdd={onAddComment}
            onUpdate={onUpdateComment}
            onDelete={onDeleteComment}
            hideHeader={true}
          />
        ) : (
          <HistorySection history={history} />
        )}
      </div>
    </div>
  );
};
