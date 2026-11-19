import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary">
          {t('footer.privacy')}
        </h1>
        <p className="text-xs text-mavi-muted">Oxirgi yangilanish: 2026-yil</p>

        <div className="space-y-4 text-xs text-mavi-text leading-relaxed border-t border-mavi-border pt-6">
          <p>
            MAVI Boutique LLC mijozlarining shaxsiy ma’lumotlarining xavfsizligini ta’minlashni eng ustuvor vazifa deb biladi. Ushbu maxfiylik siyosati buyurtma jarayonida taqdim etilgan ma’lumotlarni qanday to‘plashimiz va himoya qilishimizni belgilaydi.
          </p>

          <h3 className="font-bold text-sm text-mavi-primary pt-2">1. To‘planadigan Ma’lumotlar</h3>
          <p className="text-mavi-muted">
            Buyurtmani yetkazib berish uchun sizning ismingiz, telefon raqamingiz, elektron pochtangiz va yetkazish manzilingizdan foydalanamiz. Ushbu ma’lumotlar faqat kuryerlik yetkazib berish xizmati va do‘kon konsyerjlari tomonidan buyurtmani bajarish uchun ishlatiladi.
          </p>

          <h3 className="font-bold text-sm text-mavi-primary pt-2">2. To‘lov Ma’lumotlarining Himoyasi</h3>
          <p className="text-mavi-muted">
            Sizning to‘lov karta ma’lumotlaringiz bizning serverlarimizda aslo saqlanmaydi. Barcha onlayn to‘lovlar litsenziyalangan to‘lov tashkilotlari (Click va Payme) orqali xalqaro shifrlash protokollari bilan himoyalangan holda amalga oshiriladi.
          </p>

          <h3 className="font-bold text-sm text-mavi-primary pt-2">3. Uchinchi Shaxslarga Bermaslik</h3>
          <p className="text-mavi-muted">
            Biz mijozlarimiz ma’lumotlarini hech qanday uchinchi tomonlarga sotmaymiz va marketing maqsadlarida tarqatmaymiz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
