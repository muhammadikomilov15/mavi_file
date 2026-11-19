import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsConditions = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary">
          {t('footer.terms')}
        </h1>
        <p className="text-xs text-mavi-muted">Amal qilish muddati: 2026-yil</p>

        <div className="space-y-4 text-xs text-mavi-text leading-relaxed border-t border-mavi-border pt-6">
          <p>
            MAVI onlayn butikiga xush kelibsiz. Ushbu veb-saytdan foydalanish va buyurtma berish orqali siz quyidagi shartlarga rozilik bildirasiz.
          </p>

          <h3 className="font-bold text-sm text-mavi-primary pt-2">1. Buyurtma Shartnomasi</h3>
          <p className="text-mavi-muted">
            Saytda buyurtmani rasmiylashtirish va tasdiqlash xaridor bilan MAVI Boutique o‘rtasida mahsulotni sotib olish bo‘yicha ommaviy oferta hisoblanadi. Buyurtma qabul qilingandan so‘ng mijozga uning raqami taqdim etiladi.
          </p>

          <h3 className="font-bold text-sm text-mavi-primary pt-2">2. Narxlar va To‘lovlar</h3>
          <p className="text-mavi-muted">
            Barcha narxlar O‘zbekiston so‘mida (UZS) ko‘rsatilgan va qo‘shilgan qiymat solig‘ini o‘z ichiga oladi. Do‘kon narxlarni oldindan ogohlantirmasdan o‘zgartirish huquqini saqlab qoladi, ammo rasmiylashtirilgan buyurtmalar uchun narx o‘zgarmaydi.
          </p>

          <h3 className="font-bold text-sm text-mavi-primary pt-2">3. Intellektual Mulk</h3>
          <p className="text-mavi-muted">
            MAVI savdo belgisi, logotipi, saytdagi barcha fotosuratlar, dizayn elementlari va matnlar qonun bilan himoyalangan intellektual mulk obyekti hisoblanadi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
