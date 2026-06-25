'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];

function validateFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_TYPES.includes(file.type) && !['pdf', 'docx'].includes(ext ?? '')) {
    return `Invalid file type. Only PDF and DOCX are accepted.`;
  }
  if (file.size > 10 * 1024 * 1024) {
    return 'File size exceeds 10 MB limit.';
  }
  return null;
}

function simulateUpload(onProgress, onComplete) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 7;
    if (progress >= 100) {
      clearInterval(interval);
      onProgress(100);
      setTimeout(onComplete, 300);
    } else {
      onProgress(Math.min(progress, 99));
    }
  }, 120);
}

export function FileUploader({ onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState({
    status: 'idle',
    fileName: null,
    progress: 0,
    errorMessage: null,
  });

  function handleFile(file) {
    console.log('[FileUploader] File selected:', file.name, file.type, file.size);

    const error = validateFile(file);
    if (error) {
      console.warn('[FileUploader] Validation failed:', error);
      setState({ status: 'error', fileName: file.name, progress: 0, errorMessage: error });
      return;
    }

    setState({ status: 'uploading', fileName: file.name, progress: 0, errorMessage: null });
    console.log('[FileUploader] Starting simulated upload for:', file.name);

    simulateUpload(
      (p) => {
        console.log(`[FileUploader] Upload progress: ${Math.round(p)}%`);
        setState((prev) => ({ ...prev, progress: p }));
      },
      () => {
        console.log('[FileUploader] Upload complete:', file.name);
        setState((prev) => ({ ...prev, status: 'success', progress: 100 }));
        if (onFile) onFile(file);
      }
    );
  }

  function onInputChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      console.log('[FileUploader] File dropped:', file.name);
      handleFile(file);
    }
  }

  function reset() {
    console.log('[FileUploader] Reset');
    setState({ status: 'idle', fileName: null, progress: 0, errorMessage: null });
    if (inputRef.current) inputRef.current.value = '';
  }

  const { status, fileName, progress, errorMessage } = state;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => status === 'idle' || status === 'error' ? inputRef.current?.click() : undefined}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200',
          'cursor-pointer select-none',
          dragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : status === 'error'
            ? 'border-red-300 bg-red-50'
            : status === 'success'
            ? 'border-emerald-400 bg-emerald-50 cursor-default'
            : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={onInputChange}
        />

        <AnimatePresence mode="wait">
          {/* Idle */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <UploadCloud size={30} className="text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-lg">
                  Drop your CV here or{' '}
                  <span className="text-blue-600 underline underline-offset-2">browse</span>
                </p>
                <p className="text-slate-400 text-sm mt-1">PDF and DOCX supported · Max 10 MB</p>
              </div>
            </motion.div>
          )}

          {/* Uploading */}
          {status === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText size={26} className="text-blue-500" />
              </div>
              <p className="font-medium text-slate-700 text-sm truncate max-w-xs">{fileName}</p>
              <div className="w-full max-w-sm">
                <ProgressBar value={progress} showValue size="md" />
              </div>
              <p className="text-xs text-slate-400">Uploading…</p>
            </motion.div>
          )}

          {/* Success */}
          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"
              >
                <CheckCircle2 size={30} className="text-emerald-500" />
              </motion.div>
              <div>
                <p className="font-semibold text-emerald-700 text-lg">Upload successful!</p>
                <p className="text-slate-500 text-sm mt-0.5 truncate max-w-xs">{fileName}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); reset(); }}>
                Upload a different file
              </Button>
            </motion.div>
          )}

          {/* Error */}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle size={28} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-red-700">Upload failed</p>
                <p className="text-sm text-red-500 mt-0.5">{errorMessage}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); reset(); }}>
                Try again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset button overlay for uploading */}
        {status === 'uploading' && (
          <button
            onClick={(e) => { e.stopPropagation(); reset(); }}
            className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Accepted formats note */}
      <p className="text-center text-xs text-slate-400 mt-3">
        Accepted formats: PDF, DOCX &nbsp;·&nbsp; Maximum file size: 10 MB
      </p>
    </div>
  );
}
