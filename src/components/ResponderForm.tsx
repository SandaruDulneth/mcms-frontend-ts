'use client';

import { useState } from 'react';
import { createResponder } from '@/lib/responderApi';
import type { CreateResponderInput, ResponseType } from '@/types/responder';
import { RESPONSE_TYPE_META } from '@/types/responder';

interface ResponderFormProps {
  reportId : string;
  onClose  : () => void;
  onSuccess: () => void;
}

const RESPONSE_TYPES = Object.entries(RESPONSE_TYPE_META) as [
  ResponseType,
  { label: string; emoji: string; colour: string },
][];

const EMPTY_FORM: CreateResponderInput = {
  name        : '',
  organization: '',
  responseType: 'other',
  message     : '',
  contactInfo : '',
};

export default function ResponderForm({
  reportId,
  onClose,
  onSuccess,
}: ResponderFormProps) {
  const [form,        setForm]        = useState<CreateResponderInput>(EMPTY_FORM);
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  function update(field: keyof CreateResponderInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.message.trim()) { setError('Message is required'); return; }
    setError(null);
    setSubmitting(true);
    try {
      await createResponder(reportId, {
        name        : form.name.trim(),
        organization: form.organization?.trim() || undefined,
        responseType: form.responseType,
        message     : form.message.trim(),
        contactInfo : form.contactInfo?.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            🤝 Offer Help
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <div className="space-y-4 px-5 py-4">

          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kamal Perera"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Organization <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Red Cross, Local Volunteer Group"
              value={form.organization}
              onChange={(e) => update('organization', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Response type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Type of Help <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {RESPONSE_TYPES.map(([type, meta]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update('responseType', type)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    form.responseType === type
                      ? meta.colour + ' border-current'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {meta.emoji} {meta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe what help you can offer..."
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          {/* Contact info */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Contact Info <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Phone number or email"
              value={form.contactInfo}
              onChange={(e) => update('contactInfo', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Response'}
          </button>
        </div>
      </div>
    </div>
  );
}
