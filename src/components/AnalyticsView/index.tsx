import React from 'react';
import { CheckCircle2, Flame, AlertCircle, BarChart2, Layers } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import styles from './AnalyticsView.module.css';

export const AnalyticsView: React.FC = () => {
  const { tasks, projects, stats } = useTodo();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div {...getThemeComponentProps(ThemeComponent.AnalyticsView)} className={styles.view}>
      <h2 className={styles.title}>Productivity & Performance Analytics</h2>

      {/* KPI Cards Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.completedIcon}`}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className={styles.kpiValue}>{stats.completedToday}</div>
            <div className={styles.kpiLabel}>Completed Today</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.rateIcon}`}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div className={styles.kpiValue}>{stats.completionRate}%</div>
            <div className={styles.kpiLabel}>Total Completion Rate</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.streakIcon}`}>
            <Flame size={24} />
          </div>
          <div>
            <div className={styles.kpiValue}>{stats.streakDays} Days</div>
            <div className={styles.kpiLabel}>Active Streak</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIcon} ${styles.urgentIcon}`}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div className={styles.kpiValue}>{stats.p1Count}</div>
            <div className={styles.kpiLabel}>Urgent P1/P2 Active</div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className={styles.breakdownGrid}>
        {/* Project Breakdown */}
        <div className={styles.breakdownCard}>
          <div className={styles.cardHeading}>
            <Layers size={18} color="var(--primary)" />
            <h3 className={styles.cardTitle}>Task Breakdown by Project</h3>
          </div>

          <div className={styles.breakdownList}>
            {projects.map(proj => {
              const projTasks = tasks.filter(t => t.projectId === proj.id);
              const projCompleted = projTasks.filter(t => t.completed).length;
              const pct = projTasks.length > 0 ? Math.round((projCompleted / projTasks.length) * 100) : 0;

              return (
                <div key={proj.id} className={styles.breakdownRow}>
                  <div className={styles.breakdownRowHeader}>
                    <div className={styles.breakdownName}>
                      <span className={styles.colorDot} style={{ backgroundColor: proj.color }} />
                      <span>{proj.name}</span>
                    </div>
                    <span>
                      {projCompleted}/{projTasks.length} ({pct}%)
                    </span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className={styles.breakdownCard}>
          <div className={styles.cardHeading}>
            <BarChart2 size={18} color="var(--primary)" />
            <h3 className={styles.cardTitle}>Task Breakdown by Priority</h3>
          </div>

          <div className={styles.breakdownList}>
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
                <div key={p.level} className={styles.breakdownRow}>
                  <div className={styles.breakdownRowHeader}>
                    <span style={{ color: p.color }}>{p.label}</span>
                    <span>
                      {pCompleted}/{pTasks.length} ({pct}%)
                    </span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <span>Pending Tasks: <strong className={styles.pendingValue}>{pendingTasks}</strong></span>
            <span>Completed Tasks: <strong className={styles.completedValue}>{completedTasks}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
