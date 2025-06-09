import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Paper, Grid, Card, CardContent, Tabs, Tab, Button, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LuxuryLogo from './assets/react.svg';
import './App.css';
import PinnaclePlatform from './PinnaclePlatform';
import React, { createContext, useContext } from 'react';
import AnalyticsPanel from './components/AnalyticsPanel';
import NotificationCenter from './components/NotificationCenter';
import UserManagement from './components/UserManagement';
import SettingsPanel from './components/SettingsPanel';
import QuickActions from './components/QuickActions';

// --- Auth Context ---
const AuthContext = createContext();
function useAuth() { return useContext(AuthContext); }

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Fetch user info if token changes
  useEffect(() => {
    if (token) {
      fetch('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    setLoginError('');
    try {
      const res = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem('jwt', data.access_token);
      setLoginOpen(false);
    } catch {
      setLoginError('Login failed');
    }
  };
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('jwt');
  };
  return (
    <AuthContext.Provider value={{ token, user, login, logout, setLoginOpen }}>
      {children}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <DialogTitle>Login</DialogTitle>
        <LoginForm onLogin={login} error={loginError} />
      </Dialog>
    </AuthContext.Provider>
  );
}

function LoginForm({ onLogin, error, showSnackbar }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
    if (!error) showSnackbar('Login successful!', 'success');
  };
  return (
    <form onSubmit={handleSubmit}>
      <DialogContent>
        <TextField label="Username" fullWidth margin="dense" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="dense" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
      </DialogActions>
    </form>
  );
}

function RealTimePreview() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/real_time_status.txt');
        const text = await res.text();
        setStatus(text);
      } catch {
        setStatus('Unable to fetch real-time status.');
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card sx={{ background: 'rgba(255,255,255,0.8)', boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" color="primary">Real-Time System Status</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{status}</Typography>
      </CardContent>
    </Card>
  );
}

function AgentList({ agents, onRun, onViewLog }) {
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.85)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Agents
        </Typography>
        <List>
          {agents.map((agent) => (
            <ListItem key={agent.name} secondaryAction={
              <>
                <Button size="small" variant="outlined" onClick={() => onRun(agent)} sx={{ mr: 1 }}>Run</Button>
                <Button size="small" variant="text" onClick={() => onViewLog(agent)}>Logs</Button>
              </>
            }>
              <ListItemText primary={agent.name} secondary={agent.desc} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

function DaemonList({ daemons, onRun, onViewLog }) {
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.85)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Daemons
        </Typography>
        <List>
          {daemons.map((daemon) => (
            <ListItem key={daemon.name} secondaryAction={
              <>
                <Button size="small" variant="outlined" onClick={() => onRun(daemon)} sx={{ mr: 1 }}>Run</Button>
                <Button size="small" variant="text" onClick={() => onViewLog(daemon)}>Logs</Button>
              </>
            }>
              <ListItemText primary={daemon.name} secondary={daemon.desc} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

// --- Pinnacle Advanced Admin Dashboard Enhancements ---
// Removed inline component definitions to avoid duplicate identifier errors

// --- Agent API Integration Example ---
function AgentPanel({ showSnackbar }) {
  const { token, user, setLoginOpen, logout } = useAuth();
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState('');
  const [createError, setCreateError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/agents', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : [])
      .then(setAgents)
      .finally(() => setLoading(false));
  }, [token]);

  // Create agent (POST)
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (!newAgent) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ agent_name: newAgent }),
      });
      if (!res.ok) throw new Error('Failed to create agent');
      setNewAgent('');
      showSnackbar('Agent created!', 'success');
      // Refresh agent list
      fetch('http://localhost:8000/agents', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.ok ? r.json() : [])
        .then(setAgents);
    } catch {
      setCreateError('Could not create agent');
      showSnackbar('Could not create agent', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.85)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Agents (API)</Typography>
        {user ? (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>Logged in as: {user.username} <Button size="small" onClick={logout}>Logout</Button></Typography>
            <form onSubmit={handleCreateAgent} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <TextField size="small" label="New Agent Name" value={newAgent} onChange={e => setNewAgent(e.target.value)} />
              <Button type="submit" variant="contained" disabled={loading}>Create Agent</Button>
            </form>
            {createError && <Typography color="error">{createError}</Typography>}
            {loading ? <Typography>Loading...</Typography> : (
              <List>
                {agents.map(agent => (
                  <ListItem key={agent.agent_id}><ListItemText primary={agent.agent_name} /></ListItem>
                ))}
              </List>
            )}
          </>
        ) : (
          <Button variant="contained" onClick={() => setLoginOpen(true)}>Login to manage agents</Button>
        )}
      </CardContent>
    </Card>
  );
}

// --- Dashboard Layout ---
function Dashboard({ showSnackbar }) {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'Superuser' || user.role === 'admin');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <RealTimePreview />
          <AnalyticsPanel />
          {isAdmin && <QuickActions onRunAll={() => showSnackbar('Run all agents (stub)', 'info')} />}
        </Grid>
        <Grid item xs={12} md={6}>
          <NotificationCenter />
          {isAdmin ? <UserManagement /> : <Typography sx={{ mb: 2, color: 'orange' }}>Limited access: Not an admin</Typography>}
          {isAdmin && <SettingsPanel />}
        </Grid>
      </Grid>
      <AgentPanel showSnackbar={showSnackbar} />
    </Box>
  );
}

// --- Main App ---
function App() {
  // Global notification state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  // Provide a function to show notifications from anywhere
  const showSnackbar = (message, severity = 'info') => setSnackbar({ open: true, message, severity });

  // Wrap AuthProvider to pass showSnackbar to children via context
  return (
    <AuthProvider>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Box sx={{ p: 2 }}>
        <Dashboard showSnackbar={showSnackbar} />
        <PinnaclePlatform />
      </Box>
    </AuthProvider>
  );
}

export default App;
