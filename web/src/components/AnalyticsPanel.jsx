import React from 'react';
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material';

export default function AnalyticsPanel() {
  // Example stats, replace with real data
  const stats = [
    { label: 'Active Agents', value: 3 },
    { label: 'Active Daemons', value: 2 },
    { label: 'Total Tasks', value: 128 },
    { label: 'System Uptime', value: '99.99%' },
  ];
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.9)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>System Analytics</Typography>
        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: 'rgba(44,83,100,0.1)' }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                <Typography variant="body2">{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
