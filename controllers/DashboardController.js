const token = localStorage.getItem('token');
const res = await fetch('/api/dashboard/metrics', { headers: { Authorization: `Bearer ${token}` }});
const data = await res.json();
