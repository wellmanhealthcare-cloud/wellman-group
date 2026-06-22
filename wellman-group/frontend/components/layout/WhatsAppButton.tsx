'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919409428888?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20our%20products."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      title="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
      <span className="relative flex items-center justify-center w-13 h-13 w-[52px] h-[52px] bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl shadow-green-500/35 transition-all duration-200 hover:scale-105">
        <MessageCircle size={24} fill="currentColor" />
      </span>
    </a>
  );
}
