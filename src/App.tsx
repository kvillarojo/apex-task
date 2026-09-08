import React from 'react';
import { TodoProvider, useTodo } from './context/TodoContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ListView } from './components/ListView';
import { KanbanView } from './components/KanbanView';
import { EisenhowerView } from './components/EisenhowerView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { PeopleModal } from './components/PeopleModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { PomodoroWidget } from './components/PomodoroWidget';
import { ProjectModal } from './components/ProjectModal';
import { TagModal } from './components/TagModal/index';
import { NotesView } from './components/NotesView';
import { NoteDetailModal } from './components/NoteDetailModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ReminderToast } from './components/ReminderToast';

const MainContent: React.FC = () => {
  const { viewMode } = useTodo();

  const renderView = () => {
    switch (viewMode) {
      case 'kanban':
        return <KanbanView />;
      case 'eisenhower':
        return <EisenhowerView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'notes':
        return <NotesView />;
      case 'list':
      default:
        return <ListView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="page-container">{renderView()}</main>
      </div>
      <MobileBottomNav />

      {/* Global Modals & Widgets */}
      <TaskDetailModal />
      <NoteDetailModal />
      <ReminderToast />
      <PeopleModal />
      <CommandPaletteModal />
      <ProjectModal />
      <TagModal />
      <PomodoroWidget />
    </div>
  );
};

export default function App() {
  return (
    <TodoProvider>
      <MainContent />
    </TodoProvider>
  );
}
