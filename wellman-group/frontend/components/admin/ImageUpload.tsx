'use client';

import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadApi } from '@/lib/api';

interface Props {
  value?: string;
  publicId?: string;
  onChange: (url: string, publicId: string) => void;
  onRemove?: () => void;
  label?: string;
}

export default function ImageUpload({
  value,
  publicId,
  onChange,
  onRemove,
  label = 'Image',
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { data } = await uploadApi.image(file);
      onChange(data.url, data.public_id);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove() {
    if (publicId) {
      try {
        await uploadApi.delete(publicId);
      } catch {}
    }
    onRemove?.();
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-40 h-32 rounded-lg overflow-hidden border border-slate-200 group">
          <img src={value} alt="uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {uploading ? (
            <span className="text-xs">Uploading…</span>
          ) : (
            <>
              <Upload size={20} className="mb-1.5" />
              <span className="text-xs">Click to upload</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
