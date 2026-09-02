import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Timer, Settings, Plus, Minus, Check, Edit3, Maximize2, Minimize2, X } from 'lucide-react';
import { useTodo } from '../context/TodoContext';

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

  const normalWidgetStyle = {
   position: 'fixed' as const,
   bottom: '24px',
   right: '24px',
   backgroundColor: 'var(--bg-modal)',
   border: '1px solid var(--border-color)',
   borderRadius: '16px',
   padding: '16px 20px',
   boxShadow: 'var(--shadow-lg)',
   zIndex: 50,
   display: 'flex',
   flexDirection: 'column' as const,
   gap: '10px',
   width: '300px'
  };

  const floatingIconStyle = {
   position: 'fixed' as const,
   bottom: '24px',
   right: '24px',
   backgroundColor: 'var(--primary)',
   color: 'white',
   border: 'none',
   borderRadius: '999px',
   boxShadow: 'var(--shadow-lg)',
   width: '56px',
   height: '56px',
   zIndex: 50,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   cursor: 'pointer'
  };

  const maxOverlayStyle = {
   position: 'fixed' as const,
   inset: '0',
   backgroundColor: 'rgba(0, 0, 0, 0.68)',
   backdropFilter: 'blur(2px)',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   zIndex: 60,
   animation: 'focusTimerOverlayIn 280ms ease-out forwards'
  };

  const maxPanelStyle = {
   width: 'min(560px, calc(100vw - 48px))',
   backgroundColor: 'var(--bg-modal)',
   border: '1px solid var(--border-color)',
   borderRadius: '22px',
   padding: '24px 28px',
   boxShadow: 'var(--shadow-lg)',
   display: 'flex',
   flexDirection: 'column' as const,
   gap: '12px',
   transform: 'scale(0.96)',
   opacity: 0,
   animation: 'focusTimerCardIn 320ms cubic-bezier(.2,.8,.2,1) forwards'
  };

  if (!isVisible) {
   return (
     <button
       type="button"
       onClick={() => {
         setPomodoroVisible(true);
         setPomodoroMaximized(true);
       }}
       style={floatingIconStyle}
       title="Open Focus Timer"
     >
       <Timer size={26} />
     </button>
   );
  }

  const widgetBody = (
   <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
          <Timer size={16} />
          <span>Focus Timer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            #{pomodoro.totalCompletedSessions + 1}
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title="Configure Timer Durations"
          >
            <Settings size={15} />
          </button>
          <button
            onClick={() => setPomodoroMaximized(!isMaximized)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title={isMaximized ? 'Minimize Focus Timer' : 'Maximize Focus Timer'}
          >
            {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={() => {
              setPomodoroVisible(false);
              setPomodoroMaximized(false);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            title="Close Focus Timer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div style={{ display: 'flex', backgroundColor: 'var(--bg-input)', padding: '2px', borderRadius: '8px' }}>
        <button
          onClick={() => setPomodoroMode('work')}
          style={{
            flex: 1,
            padding: '4px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.725rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: pomodoro.mode === 'work' ? 'var(--primary)' : 'transparent',
            color: pomodoro.mode === 'work' ? 'white' : 'var(--text-secondary)'
          }}
        >
          Work ({Math.round(pomodoro.workDuration / 60)}m)
        </button>
        <button
          onClick={() => setPomodoroMode('shortBreak')}
          style={{
            flex: 1,
            padding: '4px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.725rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: pomodoro.mode === 'shortBreak' ? '#10b981' : 'transparent',
            color: pomodoro.mode === 'shortBreak' ? 'white' : 'var(--text-secondary)'
          }}
        >
          Break ({Math.round(pomodoro.shortBreakDuration / 60)}m)
        </button>
        <button
          onClick={() => setPomodoroMode('longBreak')}
          style={{
            flex: 1,
            padding: '4px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.725rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: pomodoro.mode === 'longBreak' ? '#8b5cf6' : 'transparent',
            color: pomodoro.mode === 'longBreak' ? 'white' : 'var(--text-secondary)'
          }}
        >
          Long ({Math.round(pomodoro.longBreakDuration / 60)}m)
        </button>
      </div>

      {/* Mode Duration Settings Drawer */}
      {showSettings && (
        <div style={{ padding: '10px', backgroundColor: 'var(--bg-input)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>CUSTOM DURATION SETTINGS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Work Session (mins):</span>
            <input
              type="number"
              min={1}
              max={180}
              value={Math.round(pomodoro.workDuration / 60)}
              onChange={e => setModeDuration('work', parseInt(e.target.value, 10) || 25)}
              style={{ width: '50px', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Short Break (mins):</span>
            <input
              type="number"
              min={1}
              max={60}
              value={Math.round(pomodoro.shortBreakDuration / 60)}
              onChange={e => setModeDuration('shortBreak', parseInt(e.target.value, 10) || 5)}
              style={{ width: '50px', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Long Break (mins):</span>
            <input
              type="number"
              min={1}
              max={120}
              value={Math.round(pomodoro.longBreakDuration / 60)}
              onChange={e => setModeDuration('longBreak', parseInt(e.target.value, 10) || 15)}
              style={{ width: '50px', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      )}

      {/* Active Task Attachment */}
      {activeTask && (
        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Target: <strong>{activeTask.title}</strong>
        </div>
      )}

      {/* Countdown Timer Display with Manual Edit Mode */}
      <div style={{ textAlign: 'center', margin: '4px 0', position: 'relative' }}>
        {isEditingTime ? (
          <form onSubmit={handleSaveManualTime} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <input
              type="number"
              min={0}
              max={999}
              value={editMinutesInput}
              onChange={e => setEditMinutesInput(e.target.value)}
              style={{
                width: '90px',
                fontSize: '1.8rem',
                fontWeight: 800,
                textAlign: 'center',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--primary)',
                borderRadius: '8px',
                fontFamily: 'monospace'
              }}
              autoFocus
            />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>mins</span>
            <button type="submit" className="btn-primary" style={{ padding: '6px 8px' }}>
              <Check size={16} />
            </button>
          </form>
        ) : (
          <div
            onClick={handleStartEditingTime}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            className="timer-display-hover"
            title="Click to manually edit minutes"
          >
            <span style={{
              fontSize: isMaximized ? '4.4rem' : '2.2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontFamily: 'monospace'
            }}>
              {timeFormatted}
            </span>
            <Edit3 size={isMaximized ? 18 : 14} color="var(--text-muted)" style={{ opacity: 0.6 }} />
          </div>
        )}
      </div>

      {/* Quick Time Adjustment Pills (+5m, +1m, -1m, -5m) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
        <button
          className="btn-secondary"
          onClick={() => adjustTimeLeft(-300)}
          title="Subtract 5 minutes"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
        >
          <Minus size={10} /> 5m
        </button>
        <button
          className="btn-secondary"
          onClick={() => adjustTimeLeft(-60)}
          title="Subtract 1 minute"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
        >
          <Minus size={10} /> 1m
        </button>
        <button
          className="btn-secondary"
          onClick={() => adjustTimeLeft(60)}
          title="Add 1 minute"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
        >
          <Plus size={10} /> 1m
        </button>
        <button
          className="btn-secondary"
          onClick={() => adjustTimeLeft(300)}
          title="Add 5 minutes"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
        >
          <Plus size={10} /> 5m
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'var(--bg-input)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            backgroundColor: pomodoro.mode === 'work' ? 'var(--primary)' : '#10b981',
            transition: 'width 1s linear'
          }}
        />
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        {pomodoro.isRunning ? (
          <button className="btn-primary" onClick={pausePomodoro} style={{ flex: 1, justifyContent: 'center' }}>
            <Pause size={16} /> Pause
          </button>
        ) : (
          <button className="btn-primary" onClick={() => startPomodoro()} style={{ flex: 1, justifyContent: 'center' }}>
            <Play size={16} /> Start
          </button>
        )}
 
        <button className="btn-secondary" onClick={resetPomodoro} title="Reset Timer" style={{ padding: '8px' }}>
          <RotateCcw size={16} />
        </button>
      </div>
    </>
 );

 return isMaximized ? (
   <div style={maxOverlayStyle}>
     <div style={maxPanelStyle}>{widgetBody}</div>
   </div>
 ) : (
   <div style={{ ...normalWidgetStyle, animation: 'focusTimerWidgetIn 260ms ease-out forwards' }}>{widgetBody}</div>
 );
};
