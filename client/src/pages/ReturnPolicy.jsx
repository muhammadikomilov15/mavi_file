import React from 'react';
import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest font-bold text-mavi-accent">Kafolat & Xizmat</span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
            Qaytarish va Almashtirish Siyosati
          </h1>
        </div>

        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>14 Kunlik Beg‘araz Kafolat:</strong>
            <p className="mt-1 text-emerald-800">
              Siz xarid qilingan har qanday MAVI mahsulotini 14 kun ichida sababini tushuntirmasdan boshqa o‘lcham yoki modelga almashtirishingiz, yoxud to‘langan pulni to‘liq qaytarib olishingiz mumkin.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-mavi-text leading-relaxed border-t border-mavi-border pt-6">
          <h4 className="font-bold text-sm text-mavi-primary">Qaytarish Shartlari:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-mavi-muted">
            <li>Mahsulot kiyilmagan, yuvilmagan va birlamchi tovar holatida bo‘lishi lozim.</li>
            <li>Barcha asl yorliqlar (taglar) va brend qadoqlari butun saqlangan bo‘lishi talab etiladi.</li>
            <li>Buyurtma raqami yoki xarid kvitansiyasini taqdim etish kifoya.</li>
          </ul>

          <h4 className="font-bold text-sm text-mavi-primary pt-4">Pulni Qaytarish Tartibi:</h4>
          <p className="text-mavi-muted">
            Mahsulot butikimizga yetib kelib, holati ko‘rikdan o‘tgandan so‘ng 1–3 ish kuni ichida mablag‘ingiz to‘lov qilingan bank kartasiga yoki naqd shaklda qaytariladi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
