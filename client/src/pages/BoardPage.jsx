import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import api   from '../api/axios';
import toast from 'react-hot-toast';
import Column   from '../components/Column';
import TaskForm from '../components/TaskForm';

export default function BoardPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [board, setBoard]           = useState(null);
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(null); // columnId or null

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: boardData }, { data: tasksData }] = await Promise.all([
          api.get(`/boards/${id}`),
          api.get(`/boards/${id}/tasks`),
        ]);
        setBoard(boardData);
        setTasks(tasksData);
      } catch {
        toast.error('Failed to load board');
        navigate('/boards');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Group tasks by columnId for easy rendering
  const tasksByColumn = (board?.columns || []).reduce((acc, col) => {
    acc[col.id] = tasks
      .filter((t) => t.columnId === col.id)
      .sort((a, b) => a.order - b.order);
    return acc;
  }, {});

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const draggedTask  = tasks.find((t) => t._id === active.id);
    const overTask     = tasks.find((t) => t._id === over.id);
    // If dropping on a task, use that task's column; if dropping on empty column, over.id is the columnId
    const newColumnId  = overTask ? overTask.columnId : over.id;
    const newOrder     = overTask ? overTask.order : 0;

    // Optimistic update — update UI immediately
    setTasks((prev) =>
      prev.map((t) =>
        t._id === active.id ? { ...t, columnId: newColumnId, order: newOrder } : t
      )
    );

    // Persist to server
    try {
      await api.patch(`/tasks/${active.id}/move`, {
        columnId: newColumnId,
        order:    newOrder,
      });
    } catch {
      toast.error('Failed to move task');
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t._id === active.id
            ? { ...t, columnId: draggedTask.columnId, order: draggedTask.order }
            : t
        )
      );
    }
  };

  const addTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    setShowForm(null);
  };

  const deleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const moveTask = (updatedTask) => {
  setTasks((prev) =>
    prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
  );
};

  if (loading) return <p style={{ padding: '2rem' }}>Loading board...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.back} onClick={() => navigate('/boards')}>← Back</button>
        <h1 style={styles.title}>{board.title}</h1>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={styles.board}>
          {board.columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id] || []}
              onAddClick={() => setShowForm(col.id)}
              onDeleteTask={deleteTask}
              onMoveTask={moveTask} 
            />
          ))}
        </div>
      </DndContext>

      {showForm && (
        <TaskForm
          boardId={id}
          columnId={showForm}
          onAdd={addTask}
          onClose={() => setShowForm(null)}
        />
      )}
    </div>
  );
}

const styles = {
  page:   { padding: '1.5rem', minHeight: '100vh', background: '#f0f0f0' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  back:   { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#555' },
  title:  { margin: 0, fontSize: '22px', fontWeight: '500' },
  board:  { display: 'flex', gap: '16px', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '1rem' },
};