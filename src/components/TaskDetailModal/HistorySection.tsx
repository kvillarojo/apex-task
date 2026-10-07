import React from 'react';
import { PlusCircle, ArrowRightLeft, AlertCircle, History, ArrowRight } from 'lucide-react';
import type { TaskHistoryItem, TaskStatus, Priority } from '../../types/todo';
import { formatISODateTime } from '../../utils/dateUtils';
import { getPriorityLabel, getStatusLabel } from '../../constants/enums';

interface HistorySectionProps {
  history: TaskHistoryItem[];
}

export const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  // Sort history with newest entries first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedHistory.length === 0) {
    return (
      <div className="history-empty">
        <History size={20} className="history-empty-icon" />
        <p>No activity history recorded for this ticket yet.</p>
      </div>
    );
  }

  const renderHistoryIcon = (type: TaskHistoryItem['type']) => {
    switch (type) {
      case 'created':
        return <PlusCircle size={14} className="history-item-icon created" />;
      case 'status_change':
        return <ArrowRightLeft size={14} className="history-item-icon status" />;
      case 'priority_change':
        return <AlertCircle size={14} className="history-item-icon priority" />;
      default:
        return <History size={14} className="history-item-icon" />;
    }
  };

  return (
    <div className="history-section">
      <div className="history-timeline">
        {sortedHistory.map(item => {
          return (
            <div key={item.id} className={`history-timeline-item type-${item.type}`}>
              <div className="history-marker">{renderHistoryIcon(item.type)}</div>
              <div className="history-body">
                <div className="history-header">
                  <span className="history-action-title">
                    {item.type === 'created' && 'Ticket created'}
                    {item.type === 'status_change' && 'Status changed'}
                    {item.type === 'priority_change' && 'Priority changed'}
                  </span>
                  <span className="history-timestamp">{formatISODateTime(item.timestamp)}</span>
                </div>

                <div className="history-detail">
                  {item.type === 'created' && (
                    <div className="history-change-summary">
                      {item.description || 'Task ticket was created'}
                      {item.toValue && (
                        <span className="history-inline-badge status">
                          Initial status: {getStatusLabel(item.toValue as TaskStatus)}
                        </span>
                      )}
                    </div>
                  )}

                  {item.type === 'status_change' && (
                    <div className="history-change-flow">
                      <span className="history-val-badge status from">
                        {getStatusLabel(item.fromValue as TaskStatus)}
                      </span>
                      <ArrowRight size={12} className="history-flow-arrow" />
                      <span className="history-val-badge status to">
                        {getStatusLabel(item.toValue as TaskStatus)}
                      </span>
                    </div>
                  )}

                  {item.type === 'priority_change' && (
                    <div className="history-change-flow">
                      <span className={`history-val-badge priority ${item.fromValue as Priority}`}>
                        {getPriorityLabel(item.fromValue as Priority)}
                      </span>
                      <ArrowRight size={12} className="history-flow-arrow" />
                      <span className={`history-val-badge priority ${item.toValue as Priority}`}>
                        {getPriorityLabel(item.toValue as Priority)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
