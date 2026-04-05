import { useSortable } from '@dnd-kit/sortable';
import { CSS }         from '@dnd-kit/utilities';
import { format }      from 'date-fns';
import api             from '../api/axios';
import toast           from 'react-hot-toast';

const PRIORITY_COLOR = { low: '#639922', medium: '#BA7517', high: '#e24b4a' };
const PRIORITY_BG    = { low: '#EAF3DE', medium: '#FAEEDA', high: '#FCEBEB' };

export default function TaskCard({ task, onDelete, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.5 : 1,
  };

  const isDone = task.columnId === 'done';

  const handleCheck = async (e) => {
    // Stop drag from triggering when clicking the checkbox
    e.stopPropagation();
    const newColumnId = isDone ? 'todo' : 'done';
    try {
      const { data } = await api.patch(`/tasks/${task._id}/move`, {
        columnId: newColumnId,
        order: 0,
      });
      onMove(data);
    } catch {
      toast.error('Failed to update task');
    }
  };

  return (
    <div ref={setNodeRef} style={{ ...styles.card, ...style }} {...attributes} {...listeners}>
      <div style={styles.top}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Checkbox — clicking it won't trigger drag */}
          <input
            type="checkbox"
            checked={isDone}
            onChange={handleCheck}
            onClick={(e) => e.stopPropagation()}
            style={styles.checkbox}
          />
          <span
            style={{
              ...styles.priority,
              color:      PRIORITY_COLOR[task.priority],
              background: PRIORITY_BG[task.priority],
            }}
          >
            {task.priority}
          </span>
        </div>
        <button
          style={styles.del}
          onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
        >
          ×
        </button>
      </div>

      <p style={{ ...styles.title, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? '#aaa' : '#222' }}>
        {task.title}
      </p>

      {task.description && (
        <p style={styles.desc}>{task.description}</p>
      )}

      {task.dueDate && (
        <p style={styles.due}>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</p>
      )}

      {task.label && (
        <span style={styles.label}>{task.label}</span>
      )}
    </div>
  );
}

const styles = {
  card:     { background: '#fff', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', border: '1px solid #eee', cursor: 'grab', userSelect: 'none' },
  top:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  checkbox: { width: '15px', height: '15px', cursor: 'pointer', accentColor: '#7F77DD' },
  priority: { fontSize: '10px', fontWeight: '500', padding: '2px 7px', borderRadius: '99px' },
  del:      { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#aaa', lineHeight: 1 },
  title:    { margin: '0 0 4px', fontSize: '13px', fontWeight: '500' },
  desc:     { margin: '0 0 4px', fontSize: '12px', color: '#777', lineHeight: '1.4' },
  due:      { margin: '4px 0 0', fontSize: '11px', color: '#999' },
  label:    { display: 'inline-block', marginTop: '6px', fontSize: '11px', background: '#EEEDFE', color: '#534AB7', padding: '2px 8px', borderRadius: '99px' },
};