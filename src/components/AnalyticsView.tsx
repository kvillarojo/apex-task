import React from 'react';
import { CheckCircle2, Flame, AlertCircle, BarChart2, Layers } from 'lucide-react';
import { useTodo } from '../context/TodoContext';

export const AnalyticsView: React.FC = () => {
  const { tasks, projects, stats } = useTodo();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Productivity & Performance Analytics</h2>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.completedToday}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Today</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.completionRate}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Completion Rate</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.streakDays} Days</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Streak</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.p1Count}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Urgent P1/P2 Active</div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Project Breakdown */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Task Breakdown by Project</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map(proj => {
              const projTasks = tasks.filter(t => t.projectId === proj.id);
              const projCompleted = projTasks.filter(t => t.completed).length;
              const pct = projTasks.length > 0 ? Math.round((projCompleted / projTasks.length) * 100) : 0;

              return (
                <div key={proj.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: proj.color }} />
                      <span>{proj.name}</span>
                    </div>
                    <span>
                      {projCompleted}/{projTasks.length} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-input)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: proj.color,
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Task Breakdown by Priority</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { level: 'p1', label: 'P1 - Urgent', color: '#ef4444' },
              { level: 'p2', label: 'P2 - High', color: '#f59e0b' },
              { level: 'p3', label: 'P3 - Medium', color: '#3b82f6' },
              { level: 'p4', label: 'P4 - Low', color: '#64748b' }
            ].map(p => {
              const pTasks = tasks.filter(t => t.priority === p.level);
              const pCompleted = pTasks.filter(t => t.completed).length;
              const pct = pTasks.length > 0 ? Math.round((pCompleted / pTasks.length) * 100) : 0;

              return (
                <div key={p.level} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600 }}>
                    <span style={{ color: p.color }}>{p.label}</span>
                    <span>
                      {pCompleted}/{pTasks.length} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-input)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: p.color,
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Pending Tasks: <strong style={{ color: 'var(--text-primary)' }}>{pendingTasks}</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>Completed Tasks: <strong style={{ color: '#10b981' }}>{completedTasks}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
