import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryView from './components/SummaryView';
import FilterBar from './components/FilterBar';
import InspectionList from './components/InspectionList';
import NewInspectionModal from './components/NewInspectionModal';
import ResolveModal from './components/ResolveModal';
import SapWebhookPlayground from './components/SapWebhookPlayground';
import LoginModal from './components/LoginModal';

import {
  getOfflineQueue,
  addToOfflineQueue,
  syncOfflineQueue
} from './utils/offlineSync';

export default function App() {
  // Session User State (Auth relies 100% on HTTP-Only Session Cookies!)
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Online & Offline Queue state
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingQueueCount, setPendingQueueCount] = useState(() => getOfflineQueue().length);
  const [isSyncing, setIsSyncing] = useState(false);

  // Tab & Inspection Data State
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'summary'
  const [inspections, setInspections] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);
  const [resolveTargetItem, setResolveTargetItem] = useState(null);
  const [isSubmittingResolve, setIsSubmittingResolve] = useState(false);
  const [isSapModalOpen, setIsSapModalOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    severity: 'All',
    status: 'All',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Fetch Session User from Cookie on initial mount (/api/auth/me)
  const fetchSessionUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Session verify error:', err);
    }
  }, []);

  useEffect(() => {
    fetchSessionUser();
  }, [fetchSessionUser]);

  // Track network status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleSyncOffline();
    };
    const handleOffline = () => setIsOnline(false);
    const handleQueueUpdate = () => setPendingQueueCount(getOfflineQueue().length);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('offline-queue-updated', handleQueueUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-queue-updated', handleQueueUpdate);
    };
  }, []);

  // Fetch Inspections & Summary (Auth via Session Cookies)
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams({
        severity: filters.severity,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const [inspecRes, summaryRes] = await Promise.all([
        fetch(`/api/inspections?${queryParams.toString()}`, { credentials: 'include' }),
        fetch('/api/inspections/summary', { credentials: 'include' })
      ]);

      if (inspecRes.ok) {
        const inspecData = await inspecRes.json();
        let list = inspecData.inspections || [];

        const localQueue = getOfflineQueue();
        if (localQueue.length > 0) {
          list = [...localQueue, ...list];
        }

        setInspections(list);
      }

      if (summaryRes.ok) {
        const sumData = await summaryRes.json();
        setSummary(sumData);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Login Handler (Establishes Session Cookie)
  const handleLogin = async (username, password) => {
    try {
      setIsLoggingIn(true);
      setLoginError('');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed');
        return;
      }

      setUser(data.user);
      setIsLoginModalOpen(false);
      fetchData();
    } catch (err) {
      setLoginError('Server connection error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout Handler (Clears Session Cookie)
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setIsLoginModalOpen(true);
  };

  // Sync Offline Queue
  const handleSyncOffline = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    const result = await syncOfflineQueue();
    setPendingQueueCount(getOfflineQueue().length);
    setIsSyncing(false);
    if (result.synced > 0) {
      fetchData();
    }
  };

  // Submit New Inspection
  const handleCreateInspection = async (formData) => {
    try {
      setIsSubmittingLog(true);

      if (!isOnline) {
        addToOfflineQueue(formData);
        setPendingQueueCount(getOfflineQueue().length);
        setIsLogModalOpen(false);
        fetchData();
        return;
      }

      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsLogModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to log inspection');
      }
    } catch (err) {
      addToOfflineQueue(formData);
      setPendingQueueCount(getOfflineQueue().length);
      setIsLogModalOpen(false);
      fetchData();
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Resolve Inspection Handler
  const handleResolveInspection = async (id, resolutionNote) => {
    try {
      setIsSubmittingResolve(true);

      const res = await fetch(`/api/inspections/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resolution_note: resolutionNote })
      });

      if (res.ok) {
        setResolveTargetItem(null);
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.message || errData.error || 'Failed to mark inspection as resolved.');
      }
    } catch (err) {
      alert('Network error resolving inspection.');
    } finally {
      setIsSubmittingResolve(false);
    }
  };

  // CSV Export Handler
  const handleExportCsv = () => {
    window.location.href = '/api/inspections/export';
  };

  // Helper to filter from Summary Matrix click
  const handleSummaryClickFilter = (severity, status) => {
    setFilters((prev) => ({
      ...prev,
      severity,
      status
    }));
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Inter',sans-serif]">
      {/* Navbar & Navigation */}
      <Navbar
        isOnline={isOnline}
        pendingCount={pendingQueueCount}
        onSync={handleSyncOffline}
        isSyncing={isSyncing}
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        onOpenSapModal={() => setIsSapModalOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 space-y-4 pb-20">
        {activeTab === 'summary' && (
          <SummaryView
            summary={summary}
            onFilterBySeverityAndStatus={handleSummaryClickFilter}
          />
        )}

        {activeTab === 'list' && (
          <div className="space-y-3">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              onResetFilters={() =>
                setFilters({
                  severity: 'All',
                  status: 'All',
                  startDate: '',
                  endDate: '',
                  search: '',
                  sortBy: 'date',
                  sortOrder: 'desc'
                })
              }
            />

            <InspectionList
              inspections={inspections}
              isLoading={isLoading}
              onResolveClick={(item) => setResolveTargetItem(item)}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:hidden z-30">
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/40 text-2xl font-bold transition-transform active:scale-90"
          title="Log Defect"
        >
          +
        </button>
      </div>

      {/* Modals */}
      <NewInspectionModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleCreateInspection}
        isSubmitting={isSubmittingLog}
        userPlant={user?.plant}
      />

      <ResolveModal
        isOpen={!!resolveTargetItem}
        inspection={resolveTargetItem}
        onClose={() => setResolveTargetItem(null)}
        onConfirm={handleResolveInspection}
        isSubmitting={isSubmittingResolve}
      />

      <SapWebhookPlayground
        isOpen={isSapModalOpen}
        onClose={() => setIsSapModalOpen(false)}
        onSuccessRefresh={fetchData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onLogin={handleLogin}
        isLoggingIn={isLoggingIn}
        loginError={loginError}
      />
    </div>
  );
}
