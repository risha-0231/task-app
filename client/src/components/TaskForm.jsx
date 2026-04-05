import { useState } from 'react';
import api   from '../api/axios';
import toast from 'react-hot-toast';

export default function TaskForm({ boardId, columnId, onAdd, onClose }) {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    priority:    'medium',
    label:       '',
    dueDate:     '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/boards/${boardId}/tasks`, {
        ...form,
        columnId,
      });
      onAdd(data);
      toast.success('Task created!');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.heading}>New task</h3>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="title"
            placeholder="Task title *"
            value={form.title}
            onChange={handleChange}
            required
            autoFocus
          />
          <textarea
            style={{ ...styles.input, height: '70px', resize: 'vertical' }}
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
          />
          <select style={styles.input} name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <input
            style={styles.input}
            name="label"
            placeholder="Label (e.g. Design, Bug)"
            value={form.label}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
          <div style={styles.actions}>
            <button type="button" style={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit"  style={styles.submit} disabled={loading}>
              {loading ? 'Adding...' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal:    { background:'#fff', borderRadius:'12px', padding:'1.5rem', width:'100%', maxWidth:'400px' },
  heading:  { margin:'0 0 1rem', fontSize:'17px', fontWeight:'500' },
  input:    { display:'block', width:'100%', marginBottom:'10px', padding:'9px 12px', fontSize:'13px', border:'1px solid #ddd', borderRadius:'8px', boxSizing:'border-box' },
  actions:  { display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'4px' },
  cancel:   { padding:'8px 16px', background:'none', border:'1px solid #ddd', borderRadius:'8px', cursor:'pointer', fontSize:'13px' },
  submit:   { padding:'8px 18px', background:'#7F77DD', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'500' },
};