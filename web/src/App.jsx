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

function PinnacleAIAutonomousBuilder({ showSnackbar }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [logs, setLogs] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setLogs('');
    try {
      const res = await fetch('http://localhost:8000/api/autobuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input }),
      });
      if (!res.ok) throw new Error('Build failed');
      const data = await res.json();
      setResult(data.message);
      setLogs(data.logs || '');
      showSnackbar('Autonomous build started!', 'success');
    } catch (err) {
      setResult('Build failed. Please try again.');
      setLogs('');
      showSnackbar('Autonomous build failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, background: 'rgba(230,255,230,0.95)', border: '2px solid #b0e0e6' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          Pinnacle Autonomous AI API & App Builder (100% Free, No Subscription)
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Instantly generate AI APIs, no-code apps, and e-commerce solutions with zero cost, no subscription, and full privacy. Powered by Pinnacle's autonomous AI builder engine.
        </Typography>
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <TextField
            label="Describe your app, API, or store (e.g. 'AI-powered blog API', 'No-code dropshipping store')"
            value={input}
            onChange={e => setInput(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <Button type="submit" variant="contained" color="success" disabled={loading || !input}>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </form>
        {result && <Typography sx={{ color: 'green', mt: 1 }}>{result}</Typography>}
        {logs && <Typography sx={{ color: 'gray', mt: 1, fontSize: 13 }}>Logs: {logs}</Typography>}
      </CardContent>
    </Card>
  );
}

function SkillsPanel({ showSnackbar }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', type: '', desc: '' });

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/skills')
      .then(r => r.ok ? r.json() : [])
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  const handleRunDaemon = async (name) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/daemons/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      showSnackbar(data.message, data.status === 'started' ? 'success' : 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/skills/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      if (res.ok) {
        showSnackbar('Skill registered!', 'success');
        setRegisterOpen(false);
        setNewSkill({ name: '', type: '', desc: '' });
        // Refresh skills
        fetch('http://localhost:8000/api/skills')
          .then(r => r.ok ? r.json() : [])
          .then(setSkills);
      } else {
        showSnackbar('Failed to register skill', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, background: 'rgba(240,250,255,0.95)', border: '2px solid #b0e0e6' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">Available AI/Agent/Daemon/App Skills</Typography>
          <Button variant="outlined" size="small" onClick={() => setRegisterOpen(true)}>Register Skill</Button>
        </Box>
        {loading ? <Typography>Loading...</Typography> : (
          <List>
            {skills.map((skill, i) => (
              <ListItem key={i} secondaryAction={
                skill.type === 'daemon' ? (
                  <Button size="small" variant="contained" onClick={() => handleRunDaemon(skill.name)}>Run</Button>
                ) : null
              }>
                <ListItemText primary={skill.name} secondary={`${skill.type.toUpperCase()} - ${skill.desc}`} />
              </ListItem>
            ))}
          </List>
        )}
        <Dialog open={registerOpen} onClose={() => setRegisterOpen(false)}>
          <DialogTitle>Register New Skill/Capability</DialogTitle>
          <form onSubmit={handleRegisterSkill}>
            <DialogContent>
              <TextField label="Name" fullWidth margin="dense" value={newSkill.name} onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))} />
              <TextField label="Type (ai, agent, daemon, app)" fullWidth margin="dense" value={newSkill.type} onChange={e => setNewSkill(s => ({ ...s, type: e.target.value }))} />
              <TextField label="Description" fullWidth margin="dense" value={newSkill.desc} onChange={e => setNewSkill(s => ({ ...s, desc: e.target.value }))} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRegisterOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Register</Button>
            </DialogActions>
          </form>
        </Dialog>
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
      <PinnacleAIAutonomousBuilder showSnackbar={showSnackbar} />
      <SkillsPanel showSnackbar={showSnackbar} />
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
