import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../context/AuthContext';
import api                     from '../api/axios';
import toast                   from 'react-hot-toast';

export default function Dashboard() {
  const [boards, setBoards]   = useState([]);
  const [title, setTitle]     = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout }      = useAuth();
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/boards')
      .then(({ data }) => setBoards(data))
      .catch(() => toast.error('Failed to load boards'))
      .finally(() => setLoading(false));
  }, []);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { data } = await api.post('/boards', { title });
      setBoards([data, ...boards]);
      setTitle('');
    } catch {
      toast.error('Failed to create board');
    }
  };

  const deleteBoard = async (id) => {
    if (!window.confirm('Delete this board and all its tasks?')) return;
    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter((b) => b._id !== id));
    } catch {
      toast.error('Failed to delete board');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>My Boards</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={styles.username}>Hi, {user.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </div>

      <form onSubmit={createBoard} style={styles.form}>
        <input
          style={styles.input}
          placeholder="New board name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button style={styles.btn} type="submit">Create board</button>
      </form>

      {loading ? (
        <p style={{ color: '#888' }}>Loading...</p>
      ) : boards.length === 0 ? (
        <p style={{ color: '#888' }}>No boards yet. Create one above!</p>
      ) : (
        <div style={styles.grid}>
          {boards.map((board) => (
            <div key={board._id} style={styles.card}>
              <div
                style={styles.cardTitle}
                onClick={() => navigate(`/boards/${board._id}`)}
              >
                {board.title}
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteBoard(board._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page:      { maxWidth:'900px', margin:'0 auto', padding:'2rem 1rem' },
  header:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  heading:   { margin:0, fontSize:'22px', fontWeight:'500' },
  username:  { fontSize:'14px', color:'#666' },
  logoutBtn: { padding:'6px 14px', border:'1px solid #ddd', borderRadius:'8px', background:'#fff', cursor:'pointer', fontSize:'13px' },
  form:      { display:'flex', gap:'10px', marginBottom:'2rem' },
  input:     { flex:1, padding:'10px 12px', fontSize:'14px', border:'1px solid #ddd', borderRadius:'8px' },
  btn:       { padding:'10px 18px', background:'#7F77DD', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:'500' },
  grid:      { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'14px' },
  card:      { background:'#fff', border:'1px solid #eee', borderRadius:'10px', padding:'1.2rem', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' },
  cardTitle: { fontWeight:'500', fontSize:'15px', marginBottom:'12px', color:'#222' },
  deleteBtn: { fontSize:'12px', color:'#e24b4a', background:'none', border:'none', cursor:'pointer', padding:0 },
};