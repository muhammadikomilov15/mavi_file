import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Shield, HeartHandshake, Award } from 'lucide-react';

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative py-24 bg-mavi-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-mavi-accent">
            MAVI Maison
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider my-3">
            {t('footer.aboutUs')}
          </h1>
          <p className="text-xs sm:text-sm text-[#CCCCCC] font-light max-w-xl mx-auto leading-relaxed">
            Zamonaviy nafosat, arxitekturaviy siluetlar va murosasiz sifat uyg‘unligi.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-4xl space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/5] rounded overflow-hidden bg-mavi-secondary">
            <img
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80"
              alt="MAVI Atelier"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-mavi-accent font-bold">Bizning falsafamiz</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-mavi-primary">
              Vaqt sinovidan o‘tgan go‘zallik
            </h2>
            <p className="text-xs text-mavi-text leading-relaxed">
              MAVI 2026-yilda zamonaviy, didli va o‘ziga ishongan insonlar uchun yaratilgan premium kiyim-kechak brendidir. Biz mavsumiy tez o‘tuvchi modadan ko‘ra, garderobingizda uzoq yillar o‘z qadr-qimmatini yo‘qotmaydigan mukammal kiyimlarni yaratishga intilamiz.
            </p>
            <p className="text-xs text-mavi-muted leading-relaxed">
              Bizning kolleksiyalarimizda Italiya jun matolari, tabiiy ipak, Yaponiyaning yuqori zichlikdagi selvedge denimi va organik paxta kabi eng oliy navli xomashyolardan foydalaniladi.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-mavi-border">
          <div className="p-6 bg-mavi-secondary/50 rounded text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto text-mavi-accent shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mavi-primary">Minimalist Estetika</h3>
            <p className="text-[11px] text-mavi-muted leading-relaxed">
              Har bir ortiqcha detaldan xoli, qat’iy va qulay bichimlar.
            </p>
          </div>

          <div className="p-6 bg-mavi-secondary/50 rounded text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto text-mavi-accent shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mavi-primary">Premium Sifat</h3>
            <p className="text-[11px] text-mavi-muted leading-relaxed">
              Faqat sertifikatlangan tabiiy matolar va qo‘l mehnati bilan ishlov berilgan tikuvlar.
            </p>
          </div>

          <div className="p-6 bg-mavi-secondary/50 rounded text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto text-mavi-accent shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mavi-primary">Mijozga Ehtirom</h3>
            <p className="text-[11px] text-mavi-muted leading-relaxed">
              Shaxsiy konsyerj xizmati, tezkor bepul yetkazish va 14 kunlik kafolatli almashtirish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
