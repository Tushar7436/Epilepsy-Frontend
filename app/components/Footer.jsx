'use client';

export default function Footer() {
  return (
    <footer className="w-full py-3 text-center text-sm text-gray-500 bg-white border-t">
      <p>© {new Date().getFullYear()} Epilepsy Management System. All rights reserved.</p>
    </footer>
  );
} 