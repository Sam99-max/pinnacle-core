import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function SettingsPanel() {
  return (
    <Card sx={{ mb: 3, background: 'rgba(255,255,255,0.9)' }}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>System Settings</Typography>
        <Typography variant="body2">Advanced configuration coming soon.</Typography>
      </CardContent>
    </Card>
  );
}
