import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const PRIORITY_COLOR = { low: '#639922', medium: '#BA7517', high: '#e24b4a' };

export default function Column({ column, tasks, onAddClick, onDeleteTask, onMoveTask }) {
  // Make the column itself a drop target (for dropping into empty columns)
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div style={styles.column}>
      <div style={styles.header}>
        <span style={styles.title}>{column.title}</span>
        <span style={styles.count}>{tasks.length}</span>
      </div>

      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={onDeleteTask} onMove={onMoveTask} />
          ))}
          {tasks.length === 0 && (
            <div style={styles.empty}>Drop tasks here</div>
          )}
        </div>
      </SortableContext>

      <button style={styles.addBtn} onClick={onAddClick}>
        + Add task
      </button>
    </div>
  );
}

const styles = {
  column:   { background: '#e8e8e8', borderRadius: '10px', padding: '12px', width: '270px', flexShrink: 0 },
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  title:    { fontWeight: '500', fontSize: '14px', color: '#333' },
  count:    { background: '#ccc', borderRadius: '99px', fontSize: '11px', padding: '1px 7px', color: '#444' },
  taskList: { minHeight: '40px' },
  empty:    { textAlign: 'center', color: '#aaa', fontSize: '12px', padding: '16px 0' },
  addBtn:   { marginTop: '10px', width: '100%', padding: '8px', background: 'none', border: '1px dashed #bbb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#666' },
};