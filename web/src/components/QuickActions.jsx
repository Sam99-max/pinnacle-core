import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

export default function QuickActions({ onRunAll }) {
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.9)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Quick Actions</Typography>
        <Button variant="contained" color="primary" onClick={onRunAll} sx={{ mr: 2 }}>Run All Agents</Button>
        <Button variant="outlined" color="secondary">Restart Daemons</Button>
      </CardContent>
    </Card>
  );
}
