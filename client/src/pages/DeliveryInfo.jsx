import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

const DeliveryInfo = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-widest font-bold text-mavi-accent">MAVI Logistics</span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-mavi-primary mt-1">
            Yetkazib Berish Shartlari
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-mavi-secondary rounded border border-mavi-border space-y-2">
            <Clock className="w-5 h-5 text-mavi-accent" />
            <h3 className="text-xs font-bold uppercase text-mavi-primary">Toshkent Shahri</h3>
            <p className="text-xs text-mavi-text leading-relaxed">
              Buyurtma berilgan vaqtdan boshlab 24 soat ichida kuryer orqali eshikkacha yetkazib beriladi.
            </p>
          </div>

          <div className="p-6 bg-mavi-secondary rounded border border-mavi-border space-y-2">
            <Truck className="w-5 h-5 text-mavi-accent" />
            <h3 className="text-xs font-bold uppercase text-mavi-primary">O‘zbekiston Viloyatlari</h3>
            <p className="text-xs text-mavi-text leading-relaxed">
              Barcha viloyat markazlari va tumanlarga 48–72 soat ichida ishonchli kuryerlik xizmati orqali yetkaziladi.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-mavi-text leading-relaxed border-t border-mavi-border pt-6">
          <h4 className="font-bold text-sm text-mavi-primary">Yetkazib Berish Narxi:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-mavi-muted">
            <li>500 000 so‘m va undan yuqori xaridlar uchun — <strong>BEPUL</strong>.</li>
            <li>500 000 so‘mdan kam xaridlar uchun — <strong>25 000 so‘m</strong> (butun O‘zbekiston bo‘ylab).</li>
          </ul>

          <h4 className="font-bold text-sm text-mavi-primary pt-4">Kiyimni Kiyib Ko‘rish Xizmati:</h4>
          <p className="text-mavi-muted">
            Toshkent shahrida kuryer yetkazib berganda 15 daqiqa davomida kiyimni kiyib ko‘rish va o‘lchamini tekshirish imkoniyati taqdim etiladi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
