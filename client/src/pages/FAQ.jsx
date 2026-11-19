import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Yetkazib berish qancha vaqt oladi va narxi qancha?',
    a: 'Toshkent shahri bo‘ylab yetkazib berish 24 soat ichida, O‘zbekiston viloyatlari bo‘ylab esa 48–72 soat ichida amalga oshiriladi. 500 000 so‘mdan yuqori bo‘lgan barcha buyurtmalar mutlaqo bepul yetkaziladi. Undan kam xaridlar uchun yetkazish narxi 25 000 so‘mni tashkil etadi.'
  },
  {
    q: 'Qanday to‘lov usullari mavjud?',
    a: 'Siz to‘lovni buyurtmani qabul qilganda naqd pul yoki bank kartasi (UzCard, Humo, Visa, Mastercard) orqali kuryerga amalga oshirishingiz mumkin. Shuningdek, Click va Payme to‘lov tizimlari orqali xavfsiz onlayn to‘lov imkoniyati mavjud.'
  },
  {
    q: 'Agar kiyim o‘lchami mos kelmasa, almashtirish yoki qaytarish mumkinmi?',
    a: 'Albatta! Siz tovar qabul qilingan kundan boshlab 14 kun ichida kiyimni boshqa o‘lchamga bepul almashtirishingiz yoki pulingizni to‘liq qaytarib olishingiz mumkin. Tovarning birlamchi yorliqlari va tovar ko‘rinishi saqlangan bo‘lishi lozim.'
  },
  {
    q: 'MAVI kiyimlarining sifati va matolari qanday kafolatlanadi?',
    a: 'Biz barcha kiyimlarimizda faqat 100% tabiiy ipak, Italiya jun matolari, og‘ir vaznli organik paxta va xomashyo sertifikatiga ega premium materiallardan foydalanamiz. Har bir buyum qat’iy sifat nazoratidan o‘tadi.'
  },
  {
    q: 'Telegram orqali buyurtma qilsa ham bo‘ladimi?',
    a: 'Saytimiz orqali rasmiylashtirilgan har bir buyurtma avtomatik ravishda bizning Telegram do‘kon kanalimizga yuboriladi va konsyerjlarimiz darhol buyurtmani qayta ishlashga kirishadi.'
  }
];

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-mavi-accent">
            Yordam & Ma’lumot
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
            {t('footer.faq')}
          </h1>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-mavi-border rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between bg-white hover:bg-mavi-secondary/40 transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-mavi-primary">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-mavi-muted transition-transform duration-200 ${
                    openIndex === idx ? 'rotate-180 text-mavi-primary' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="p-4 bg-mavi-secondary/30 border-t border-mavi-border text-xs text-mavi-text leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
