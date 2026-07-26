'use client';

import { useState } from 'react';
import ResponderForm from '@/components/ResponderForm';
import ResponderList from '@/components/ResponderList';

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
      <div className="flex items-center gap-2">
        {/* Toggle responder list */}
        <button
          onClick={() => setShowList((v) => !v)}
          className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
        >
          {showList ? 'Hide responses' : 'View responses'}
        </button>

        {/* I Can Help button — only for active reports */}
        {isActive && (
          <button
            onClick={() => setShowForm(true)}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            🤝 I Can Help
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
