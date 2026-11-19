import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Xabaringiz qabul qilindi! Konsyerjimiz tez orada bog‘lanadi.');
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-mavi-accent">
            MAVI Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
            {t('footer.contact')}
          </h1>
          <p className="text-xs text-mavi-muted mt-2">
            Savollaringiz, takliflaringiz yoki shaxsiy buyurtmalar bo‘yicha biz bilan bog‘laning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="p-8 bg-mavi-secondary rounded-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-mavi-primary">Bosh Ofis & Butik</h3>

            <div className="space-y-4 text-xs text-mavi-text">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-mavi-accent shrink-0 mt-0.5" />
                <span>Amir Temur shoh ko‘chasi, 107A, Toshkent shahri, O‘zbekiston</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-mavi-accent shrink-0" />
                <span>+998 71 200 00 00 / +998 90 123 45 67</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-mavi-accent shrink-0" />
                <span>concierge@mavi.uz</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-mavi-accent shrink-0" />
                <span>Har kuni: 10:00 — 22:00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-mavi-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-mavi-primary mb-2">
                Telegram orqali zudlik bilan yozish
              </h4>
              <a
                href="https://t.me/mavi_boutique"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>@mavi_boutique</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="p-8 border border-mavi-border rounded-sm bg-white space-y-4">
            <h3 className="font-serif text-xl font-bold text-mavi-primary">Xabar Yuborish</h3>

            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Ismingiz *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded focus:outline-none focus:border-mavi-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Telefon raqamingiz *
              </label>
              <input
                type="tel"
                required
                placeholder="+998 "
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded focus:outline-none focus:border-mavi-primary"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Xabaringiz *
              </label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Savol yoki istaklaringizni yozib qoldiring..."
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded focus:outline-none focus:border-mavi-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded-sm"
            >
              Yuborish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
