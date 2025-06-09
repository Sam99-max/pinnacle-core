import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

export default function UserManagement() {
  // Example users, replace with real data
  const users = [
    { name: 'Admin', role: 'Superuser' },
    { name: 'Operator', role: 'Manager' },
  ];
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.9)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>User Management</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.name}>
              <ListItemText primary={user.name} secondary={user.role} />
              <Button size="small" variant="outlined">Edit</Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
