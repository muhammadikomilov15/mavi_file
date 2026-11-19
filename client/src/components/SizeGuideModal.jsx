import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SizeGuideModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white rounded-md shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-mavi-border">
          <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mavi-primary">
            {t('product.sizeGuide')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-mavi-muted hover:text-mavi-primary rounded-full hover:bg-mavi-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-mavi-muted mt-3 mb-6">
          Barcha o‘lchamlar santimetrda (cm) ko‘rsatilgan. Mukammal fason uchun tanangiz o‘lchamlarini o‘lchab solishtiring.
        </p>

        {/* Clothing Table */}
        <div className="overflow-x-auto">
          <h4 className="text-xs uppercase tracking-widest font-bold text-mavi-primary mb-3">
            Kiyimlar (Paltolar, Kurtkalar, Ko‘ylaklar, Futbolkalar)
          </h4>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-mavi-secondary text-mavi-primary font-semibold border-b border-mavi-border">
                <th className="p-2.5">O‘lcham</th>
                <th className="p-2.5">Yevropa (EU)</th>
                <th className="p-2.5">Ko‘krak (cm)</th>
                <th className="p-2.5">Bel (cm)</th>
                <th className="p-2.5">Bo‘ksa (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mavi-border">
              <tr>
                <td className="p-2.5 font-bold">XS</td>
                <td className="p-2.5">44 / 34</td>
                <td className="p-2.5">84 - 88</td>
                <td className="p-2.5">68 - 72</td>
                <td className="p-2.5">88 - 92</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">S</td>
                <td className="p-2.5">46 / 36</td>
                <td className="p-2.5">88 - 92</td>
                <td className="p-2.5">72 - 76</td>
                <td className="p-2.5">92 - 96</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">M</td>
                <td className="p-2.5">48 / 38</td>
                <td className="p-2.5">96 - 100</td>
                <td className="p-2.5">80 - 84</td>
                <td className="p-2.5">100 - 104</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">L</td>
                <td className="p-2.5">50 / 40</td>
                <td className="p-2.5">104 - 108</td>
                <td className="p-2.5">88 - 92</td>
                <td className="p-2.5">108 - 112</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">XL</td>
                <td className="p-2.5">52 / 42</td>
                <td className="p-2.5">112 - 116</td>
                <td className="p-2.5">96 - 100</td>
                <td className="p-2.5">116 - 120</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">XXL</td>
                <td className="p-2.5">54 / 44</td>
                <td className="p-2.5">120 - 124</td>
                <td className="p-2.5">104 - 108</td>
                <td className="p-2.5">124 - 128</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Shoes Table */}
        <div className="overflow-x-auto mt-6">
          <h4 className="text-xs uppercase tracking-widest font-bold text-mavi-primary mb-3">
            Poyabzallar (Loferlar, Botinkalar)
          </h4>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-mavi-secondary text-mavi-primary font-semibold border-b border-mavi-border">
                <th className="p-2.5">EU / UZ</th>
                <th className="p-2.5">UK</th>
                <th className="p-2.5">US</th>
                <th className="p-2.5">Oyoq uzunligi (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mavi-border">
              <tr>
                <td className="p-2.5 font-bold">39</td>
                <td className="p-2.5">5.5</td>
                <td className="p-2.5">6.5</td>
                <td className="p-2.5">25.0 cm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">40</td>
                <td className="p-2.5">6.5</td>
                <td className="p-2.5">7.5</td>
                <td className="p-2.5">25.5 cm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">41</td>
                <td className="p-2.5">7.5</td>
                <td className="p-2.5">8.5</td>
                <td className="p-2.5">26.5 cm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">42</td>
                <td className="p-2.5">8.0</td>
                <td className="p-2.5">9.0</td>
                <td className="p-2.5">27.0 cm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">43</td>
                <td className="p-2.5">9.0</td>
                <td className="p-2.5">10.0</td>
                <td className="p-2.5">28.0 cm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">44</td>
                <td className="p-2.5">10.0</td>
                <td className="p-2.5">11.0</td>
                <td className="p-2.5">28.5 cm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-mavi-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-mavi-accent transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
