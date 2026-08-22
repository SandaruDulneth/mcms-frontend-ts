'use client';

import { useState } from 'react';
import ResponderForm from '@/components/ResponderForm';
import ResponderList from '@/components/ResponderList';
import { HeartHandshake } from 'lucide-react';

interface ResponderButtonProps {
  reportId: string;
  status  : string;
}

export default function ResponderButton({ reportId, status }: ResponderButtonProps) {
  const [showForm,    setShowForm]    = useState(false);
  const [refreshKey,  setRefreshKey]  = useState(0);
  const [showList,    setShowList]    = useState(false);

  function handleSuccess() {
    setRefreshKey((k) => k + 1);
    setShowList(true);
  }

  const isActive = status === 'Active';

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between gap-2">
        {/* Toggle responder list */}
        <button
          onClick={() => setShowList((v) => !v)}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2"
        >
          {showList ? 'Hide responses' : 'View responses'}
        </button>

        {/* I Can Help button — clean secondary style for active reports */}
        {isActive && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/40 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-600 transition-colors shadow-sm"
          >
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-700" />
            I Can Help
          </button>
        )}
      </div>

      {/* Responder list */}
      {showList && (
        <ResponderList reportId={reportId} refreshKey={refreshKey} />
      )}

      {/* Responder form modal */}
      {showForm && (
        <ResponderForm
          reportId={reportId}
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
