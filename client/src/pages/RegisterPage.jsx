import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/boards');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create account</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text"     name="name"     placeholder="Name"     value={form.name}     onChange={handleChange} required />
          <input style={styles.input} type="email"    name="email"    placeholder="Email"    value={form.email}    onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={styles.link}>
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:  { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f5f5f5' },
  card:  { background:'#fff', padding:'2rem', borderRadius:'12px', width:'100%', maxWidth:'380px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  title: { margin:'0 0 1.5rem', fontSize:'22px', fontWeight:'500' },
  input: { display:'block', width:'100%', marginBottom:'12px', padding:'10px 12px', fontSize:'14px', border:'1px solid #ddd', borderRadius:'8px', boxSizing:'border-box' },
  btn:   { width:'100%', padding:'10px', background:'#7F77DD', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontWeight:'500' },
  link:  { marginTop:'1rem', fontSize:'13px', textAlign:'center', color:'#666' },
};