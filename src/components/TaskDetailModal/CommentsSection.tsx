import React, { useState } from 'react';
import { Trash2, Pencil, Reply, Check, X, MessageSquare } from 'lucide-react';
import type { Comment } from '../../types/todo';
import { formatISODateTime } from '../../utils/dateUtils';

interface CommentsSectionProps {
  taskId: string;
  comments: Comment[];
  onAdd: (taskId: string, content: string, parentId?: string) => void;
  onUpdate: (taskId: string, commentId: string, content: string) => void;
  onDelete: (taskId: string, commentId: string) => void;
}

// ─── Single comment bubble ───────────────────────────────────────────────────

interface CommentBubbleProps {
  taskId: string;
  comment: Comment;
  replies: Comment[];
  onAdd: CommentsSectionProps['onAdd'];
  onUpdate: CommentsSectionProps['onUpdate'];
  onDelete: CommentsSectionProps['onDelete'];
  depth?: number;
}

const CommentBubble: React.FC<CommentBubbleProps> = ({
  taskId,
  comment,
  replies,
  onAdd,
  onUpdate,
  onDelete,
  depth = 0,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [replyMode, setReplyMode] = useState(false);
  const [replyValue, setReplyValue] = useState('');

  const isEdited = comment.updatedAt !== comment.createdAt;

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onUpdate(taskId, comment.id, editValue.trim());
    }
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditValue(comment.content);
    setEditMode(false);
  };

  const handleSaveReply = () => {
    if (replyValue.trim()) {
      onAdd(taskId, replyValue.trim(), comment.id);
      setReplyValue('');
      setReplyMode(false);
    }
  };

  const handleCancelReply = () => {
    setReplyValue('');
    setReplyMode(false);
  };

  return (
    <div className={`comment-bubble-wrapper${depth > 0 ? ' comment-reply' : ''}`}>
      <div className="comment-bubble">
        {/* Header */}
        <div className="comment-header">
          <span className="comment-avatar">
            <MessageSquare size={12} />
          </span>
          <span className="comment-timestamp">
            {formatISODateTime(comment.createdAt)}
            {isEdited && <span className="comment-edited"> (edited)</span>}
          </span>
          <div className="comment-actions">
            {depth === 0 && (
              <button
                type="button"
                className="comment-action-btn"
                title="Reply"
                onClick={() => setReplyMode(v => !v)}
              >
                <Reply size={13} />
              </button>
            )}
            <button
              type="button"
              className="comment-action-btn"
              title="Edit"
              onClick={() => { setEditMode(true); setEditValue(comment.content); }}
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              className="comment-action-btn comment-action-delete"
              title="Delete"
              onClick={() => onDelete(taskId, comment.id)}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Body */}
        {editMode ? (
          <div className="comment-edit-area">
            <textarea
              className="comment-textarea"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              autoFocus
              rows={2}
            />
            <div className="comment-edit-actions">
              <button type="button" className="comment-confirm-btn" onClick={handleSaveEdit} title="Save (Ctrl+Enter)">
                <Check size={13} /> Save
              </button>
              <button type="button" className="comment-cancel-btn" onClick={handleCancelEdit} title="Cancel (Esc)">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-content">{comment.content}</p>
        )}
      </div>

      {/* Inline reply form */}
      {replyMode && (
        <div className="comment-reply-form">
          <textarea
            className="comment-textarea"
            placeholder="Write a reply… (Ctrl+Enter to submit)"
            value={replyValue}
            onChange={e => setReplyValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSaveReply();
              if (e.key === 'Escape') handleCancelReply();
            }}
            autoFocus
            rows={2}
          />
          <div className="comment-edit-actions">
            <button type="button" className="comment-confirm-btn" onClick={handleSaveReply} title="Reply (Ctrl+Enter)">
              <Check size={13} /> Reply
            </button>
            <button type="button" className="comment-cancel-btn" onClick={handleCancelReply}>
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="comment-replies">
          {replies.map(reply => (
            <CommentBubble
              key={reply.id}
              taskId={taskId}
              comment={reply}
              replies={[]}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Section root ─────────────────────────────────────────────────────────────

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  taskId,
  comments,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newComment, setNewComment] = useState('');

  const topLevel = comments.filter(c => !c.parentId);
  const repliesFor = (id: string) => comments.filter(c => c.parentId === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAdd(taskId, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-section-header">
        <label className="comments-label">COMMENTS</label>
        {comments.length > 0 && (
          <span className="subtasks-count-pill">{comments.length}</span>
        )}
      </div>

      {/* Existing comments */}
      {topLevel.length > 0 ? (
        <div className="comments-list">
          {topLevel.map(c => (
            <CommentBubble
              key={c.id}
              taskId={taskId}
              comment={c}
              replies={repliesFor(c.id)}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="comments-empty">No comments yet. Be the first to add one.</p>
      )}

      {/* New comment form */}
      <form className="comment-new-form" onSubmit={handleSubmit}>
        <textarea
          className="comment-textarea"
          placeholder="Add a comment… (Ctrl+Enter to submit)"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          rows={2}
        />
        <div className="comment-new-form-footer">
          <button
            type="submit"
            className="btn-primary comment-submit-btn"
            disabled={!newComment.trim()}
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
};
