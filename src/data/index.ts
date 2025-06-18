

// Mock data to match the original structure
export const waterTanks = [
  { id: 'Tank A', level: 85, capacity: 5000, location: 'North District' },
  { id: 'Tank B', level: 62, capacity: 3500, location: 'Central District' },
  { id: 'Tank C', level: 94, capacity: 4200, location: 'South District' },
  { id: 'Tank D', level: 38, capacity: 2800, location: 'East District' },
];

export const dailyConsumption = [
  { date: 'Mon', liters: 3200, efficiency: 92 },
  { date: 'Tue', liters: 2900, efficiency: 88 },
  { date: 'Wed', liters: 3400, efficiency: 95 },
  { date: 'Thu', liters: 3100, efficiency: 89 },
  { date: 'Fri', liters: 3600, efficiency: 91 },
  { date: 'Sat', liters: 2800, efficiency: 94 },
  { date: 'Sun', liters: 2600, efficiency: 96 }
];

export const waterSources = [
  { source: 'Municipal', percentage: 45, color: '#3b82f6' },
  { source: 'Well Water', percentage: 30, color: '#06b6d4' },
  { source: 'Rainwater', percentage: 15, color: '#10b981' },
  { source: 'Recycled', percentage: 10, color: '#8b5cf6' }
];

export const leakAlerts = [
  { id: 1, time: new Date().toISOString(), type: 'Minor Leak', location: 'Pipeline A-3', status: 'Active', severity: 'medium' },
  { id: 2, time: new Date(Date.now() - 3600000).toISOString(), type: 'Pressure Drop', location: 'Tank B Outlet', status: 'Investigating', severity: 'high' },
  { id: 3, time: new Date(Date.now() - 7200000).toISOString(), type: 'Flow Anomaly', location: 'Main Distribution', status: 'Resolved', severity: 'low' },
  { id: 4, time: new Date(Date.now() - 10800000).toISOString(), type: 'Valve Malfunction', location: 'Sector 7', status: 'Resolved', severity: 'medium' }
];

export const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6'];



