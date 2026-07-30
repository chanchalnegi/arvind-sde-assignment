const QUEUE_KEY = 'arvind_offline_inspections_queue';

export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading offline queue:', e);
    return [];
  }
}

export function saveOfflineQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new Event('offline-queue-updated'));
  } catch (e) {
    console.error('Error writing offline queue:', e);
  }
}

export function addToOfflineQueue(inspectionData) {
  const queue = getOfflineQueue();
  const newItem = {
    ...inspectionData,
    _tempId: 'OFFLINE_' + Date.now(),
    source: 'OFFLINE_SYNC',
    created_at: new Date().toISOString()
  };
  queue.push(newItem);
  saveOfflineQueue(queue);
  return newItem;
}

export async function syncOfflineQueue(token) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining = [];

  for (const item of queue) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          date: item.date,
          machine_id: item.machine_id,
          defect_type: item.defect_type,
          severity: item.severity,
          remarks: item.remarks,
          plant_location: item.plant_location,
          source: 'OFFLINE_SYNC'
        })
      });

      if (res.ok) {
        synced++;
      } else {
        failed++;
        remaining.push(item);
      }
    } catch (err) {
      console.error('Failed to sync offline item:', err);
      failed++;
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);
  return { synced, failed };
}
