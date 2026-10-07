import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Settings, Plus, Minus, Check, Edit3, Maximize2, Minimize2, X, Volume2, Volume1, VolumeX } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { mergeThemeStyles } from '../../theme';
import { soundEffects } from '../../utils/audio';
import styles from './PomodoroWidget.module.css';

export const PomodoroWidget: React.FC = () => {
  const {
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroMode,
    setPomodoroMaximized,
    setPomodoroVisible,
    setCustomTimeLeft,
    adjustTimeLeft,
    setModeDuration,
    setPomodoroSoundEnabled,
    setPomodoroSoundVolume,
    tasks
  } = useTodo();

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutesInput, setEditMinutesInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const activeTask = tasks.find(t => t.id === pomodoro.activeTaskId);

  const minutes = Math.floor(pomodoro.timeLeft / 60);
  const seconds = pomodoro.timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isMaximized = pomodoro.isMaximized;
  const isVisible = pomodoro.isVisible;

  const currentMaxDuration =
    pomodoro.mode === 'work'
      ? pomodoro.workDuration
      : pomodoro.mode === 'shortBreak'
      ? pomodoro.shortBreakDuration
      : pomodoro.longBreakDuration;

  const progressPct = currentMaxDuration > 0
    ? Math.min(100, Math.max(0, ((currentMaxDuration - pomodoro.timeLeft) / currentMaxDuration) * 100))
    : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible && isMaximized) {
        setPomodoroMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isMaximized, setPomodoroMaximized]);

  const handleStartEditingTime = () => {
    setEditMinutesInput(String(minutes));
    setIsEditingTime(true);
  };

  const handleSaveManualTime = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMins = parseInt(editMinutesInput, 10);
    if (!isNaN(parsedMins) && parsedMins >= 0) {
      setCustomTimeLeft(parsedMins * 60);
    }
    setIsEditingTime(false);
  };

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => {
          setPomodoroVisible(true);
          setPomodoroMaximized(false);
        }}
        data-theme-component={ThemeComponent.PomodoroWidget}
        className={styles.floatingBtn}
        style={mergeThemeStyles(ThemeComponent.PomodoroWidget, {})}
        title={pomodoro.isRunning ? `Focus Timer (${timeFormatted})` : 'Open Focus Timer'}
      >
        <Timer size={24} />
      </button>
    );
  }

  const widgetBody = (
    <>
      {/* Header */}
      <div className={styles.widgetHeader}>
        <div className={styles.headerTitle}>
          <Timer size={isMaximized ? 20 : 16} />
          <span>Focus Timer</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.sessionBadge}>
            #{pomodoro.totalCompletedSessions + 1}
          </span>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setShowSettings(!showSettings)}
            title="Configure Timer Durations & Audio"
          >
            <Settings size={isMaximized ? 17 : 15} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setPomodoroMaximized(!isMaximized)}
            title={isMaximized ? 'Minimize Focus Timer' : 'Maximize Focus Timer'}
          >
            {isMaximized ? <Minimize2 size={isMaximized ? 17 : 15} /> : <Maximize2 size={15} />}
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              setPomodoroVisible(false);
              setPomodoroMaximized(false);
            }}
            title="Close Focus Timer"
          >
            <X size={isMaximized ? 17 : 15} />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className={styles.modeSelector}>
        <button
          type="button"
          onClick={() => setPomodoroMode('work')}
          className={`${styles.modeBtn} ${pomodoro.mode === 'work' ? styles.activeWork : ''}`}
        >
          Work ({Math.round(pomodoro.workDuration / 60)}m)
        </button>
        <button
          type="button"
          onClick={() => setPomodoroMode('shortBreak')}
          className={`${styles.modeBtn} ${pomodoro.mode === 'shortBreak' ? styles.activeShortBreak : ''}`}
        >
          Break ({Math.round(pomodoro.shortBreakDuration / 60)}m)
        </button>
        <button
          type="button"
          onClick={() => setPomodoroMode('longBreak')}
          className={`${styles.modeBtn} ${pomodoro.mode === 'longBreak' ? styles.activeLongBreak : ''}`}
        >
          Long ({Math.round(pomodoro.longBreakDuration / 60)}m)
        </button>
      </div>

      {/* Mode Duration & Sound Settings Drawer */}
      {showSettings && (
        <div className={styles.settingsDrawer}>
          <div className={styles.settingsHeading}>CUSTOM DURATION SETTINGS</div>
          <div className={styles.settingsRow}>
            <span>Work Session (mins):</span>
            <input
              type="number"
              min={1}
              max={180}
              className={styles.settingsInput}
              value={Math.round(pomodoro.workDuration / 60)}
              onChange={e => setModeDuration('work', parseInt(e.target.value, 10) || 25)}
            />
          </div>
          <div className={styles.settingsRow}>
            <span>Short Break (mins):</span>
            <input
              type="number"
              min={1}
              max={60}
              className={styles.settingsInput}
              value={Math.round(pomodoro.shortBreakDuration / 60)}
              onChange={e => setModeDuration('shortBreak', parseInt(e.target.value, 10) || 5)}
            />
          </div>
          <div className={styles.settingsRow}>
            <span>Long Break (mins):</span>
            <input
              type="number"
              min={1}
              max={120}
              className={styles.settingsInput}
              value={Math.round(pomodoro.longBreakDuration / 60)}
              onChange={e => setModeDuration('longBreak', parseInt(e.target.value, 10) || 15)}
            />
          </div>

          <div className={styles.settingsDivider} />

          <div className={styles.settingsHeading}>SOUND & TICKING SETTINGS</div>
          <div className={styles.settingsRow}>
            <span>Ticking Sound:</span>
            <button
              type="button"
              className={`${styles.settingsToggleBtn} ${pomodoro.soundEnabled ? styles.toggleActive : ''}`}
              onClick={() => {
                const next = !pomodoro.soundEnabled;
                setPomodoroSoundEnabled(next);
                if (next) {
                  soundEffects.playTickSound((pomodoro.soundVolume ?? 50) / 100);
                }
              }}
              title={pomodoro.soundEnabled ? 'Disable Ticking Sound' : 'Enable Ticking Sound'}
            >
              {pomodoro.soundEnabled ? (
                <>
                  <Volume2 size={13} color="var(--primary)" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} color="var(--text-muted)" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.settingsRow} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Ticking Volume:</span>
              <span className={styles.volumeBadge}>{pomodoro.soundVolume}%</span>
            </div>
            <div className={styles.volumeControlWrapper}>
              {pomodoro.soundVolume === 0 ? (
                <VolumeX size={15} color="var(--text-muted)" />
              ) : pomodoro.soundVolume < 50 ? (
                <Volume1 size={15} color="var(--text-secondary)" />
              ) : (
                <Volume2 size={15} color="var(--primary)" />
              )}
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                className={styles.volumeSlider}
                value={pomodoro.soundVolume}
                disabled={!pomodoro.soundEnabled}
                onChange={e => {
                  const newVol = parseInt(e.target.value, 10) || 0;
                  setPomodoroSoundVolume(newVol);
                }}
                onMouseUp={() => {
                  if (pomodoro.soundEnabled) {
                    soundEffects.playTickSound(pomodoro.soundVolume / 100);
                  }
                }}
                onTouchEnd={() => {
                  if (pomodoro.soundEnabled) {
                    soundEffects.playTickSound(pomodoro.soundVolume / 100);
                  }
                }}
                title="Adjust Ticking Volume"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Task Attachment */}
      {activeTask && (
        <div className={styles.taskTarget}>
          <span style={{ color: 'var(--text-muted)' }}>Focus:</span>
          <strong>{activeTask.title}</strong>
        </div>
      )}

      {/* Countdown Timer Display with Manual Edit Mode */}
      <div className={styles.timerWrapper}>
        {isEditingTime ? (
          <form onSubmit={handleSaveManualTime} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <input
              type="number"
              min={0}
              max={999}
              value={editMinutesInput}
              onChange={e => setEditMinutesInput(e.target.value)}
              style={{
                width: isMaximized ? '130px' : '90px',
                fontSize: isMaximized ? '2.8rem' : '1.8rem',
                fontWeight: 800,
                textAlign: 'center',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--primary)',
                borderRadius: '10px',
                fontFamily: 'monospace'
              }}
              autoFocus
            />
            <span style={{ fontSize: isMaximized ? '1.2rem' : '1rem', fontWeight: 700 }}>mins</span>
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
              <Check size={18} />
            </button>
          </form>
        ) : (
          <div
            onClick={handleStartEditingTime}
            className={styles.timerDisplayHover}
            title="Click to manually edit minutes"
          >
            <span className={styles.timerDigit}>
              {timeFormatted}
            </span>
            <Edit3 size={isMaximized ? 20 : 14} color="var(--text-muted)" style={{ opacity: 0.6 }} />
          </div>
        )}
      </div>

      {/* Quick Time Adjustment Pills (+5m, +1m, -1m, -5m) */}
      <div className={styles.adjustPills}>
        <button
          type="button"
          className={styles.pillBtn}
          onClick={() => adjustTimeLeft(-300)}
          title="Subtract 5 minutes"
        >
          <Minus size={10} /> 5m
        </button>
        <button
          type="button"
          className={styles.pillBtn}
          onClick={() => adjustTimeLeft(-60)}
          title="Subtract 1 minute"
        >
          <Minus size={10} /> 1m
        </button>
        <button
          type="button"
          className={styles.pillBtn}
          onClick={() => adjustTimeLeft(60)}
          title="Add 1 minute"
        >
          <Plus size={10} /> 1m
        </button>
        <button
          type="button"
          className={styles.pillBtn}
          onClick={() => adjustTimeLeft(300)}
          title="Add 5 minutes"
        >
          <Plus size={10} /> 5m
        </button>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${progressPct}%`,
            backgroundColor:
              pomodoro.mode === 'work'
                ? 'var(--primary)'
                : pomodoro.mode === 'shortBreak'
                ? '#10b981'
                : '#8b5cf6'
          }}
        />
      </div>

      {/* Control Buttons */}
      <div className={styles.controlsRow}>
        {pomodoro.isRunning ? (
          <button
            type="button"
            className={`${styles.mainActionBtn} ${styles.isPause}`}
            onClick={pausePomodoro}
          >
            <Pause size={isMaximized ? 20 : 16} /> Pause
          </button>
        ) : (
          <button
            type="button"
            className={styles.mainActionBtn}
            onClick={() => startPomodoro()}
          >
            <Play size={isMaximized ? 20 : 16} /> Start
          </button>
        )}

        <button
          type="button"
          className={styles.resetBtn}
          onClick={resetPomodoro}
          title="Reset Timer"
        >
          <RotateCcw size={isMaximized ? 20 : 16} />
        </button>
      </div>
    </>
  );

  return isMaximized ? (
    <div
      data-theme-component={ThemeComponent.PomodoroWidget}
      className={styles.maxOverlay}
      onClick={e => {
        if (e.target === e.currentTarget) {
          setPomodoroMaximized(false);
        }
      }}
      style={mergeThemeStyles(ThemeComponent.PomodoroWidget, {})}
    >
      <div className={styles.maxPanel}>{widgetBody}</div>
    </div>
  ) : (
    <div
      data-theme-component={ThemeComponent.PomodoroWidget}
      className={styles.widgetContainer}
      style={mergeThemeStyles(ThemeComponent.PomodoroWidget, {})}
    >
      {widgetBody}
    </div>
  );
};
