import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function NotificationCenter() {
  // Example notifications, replace with real data
  const notifications = [
    { message: 'Agent Executor completed a task.', time: '2 min ago' },
    { message: 'System update available.', time: '10 min ago' },
  ];
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.9)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Notifications</Typography>
        <List>
          {notifications.map((n, i) => (
            <ListItem key={i}>
              <ListItemText primary={n.message} secondary={n.time} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
