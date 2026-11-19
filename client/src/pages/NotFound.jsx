import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-white">
      <span className="font-serif text-7xl sm:text-9xl font-bold text-mavi-secondary tracking-widest block">
        404
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mavi-primary -mt-6 sm:-mt-10 mb-3">
        Sahifa topilmadi
      </h2>
      <p className="text-xs text-mavi-muted max-w-sm mb-8">
        Siz qidirayotgan sahifa mavjud emas, nomi o‘zgargan yoki vaqtincha ochilmayotgan bo‘lishi mumkin.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </Link>
    </div>
  );
};

export default NotFound;
