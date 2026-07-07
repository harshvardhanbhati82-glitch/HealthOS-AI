export const patientData = [
  { name: 'Mon', patients: 145 },
  { name: 'Tue', patients: 168 },
  { name: 'Wed', patients: 152 },
  { name: 'Thu', patients: 189 },
  { name: 'Fri', patients: 195 },
  { name: 'Sat', patients: 125 },
  { name: 'Sun', patients: 110 },
];

export const resourceData = [
  { name: 'PHC North', medicine: 85, beds: 65 },
  { name: 'PHC South', medicine: 45, beds: 80 },
  { name: 'PHC East', medicine: 90, beds: 40 },
  { name: 'PHC West', medicine: 30, beds: 95 },
  { name: 'Central', medicine: 75, beds: 85 },
];

export const alerts = [
  {
    id: 1,
    title: 'Low Oxygen Supply',
    location: 'PHC West',
    time: '10 mins ago',
    severity: 'critical',
  },
  {
    id: 2,
    title: 'High Dengue Cases',
    location: 'PHC South',
    time: '1 hour ago',
    severity: 'warning',
  },
  {
    id: 3,
    title: 'Staff Shortage',
    location: 'PHC East',
    time: '2 hours ago',
    severity: 'warning',
  },
];
