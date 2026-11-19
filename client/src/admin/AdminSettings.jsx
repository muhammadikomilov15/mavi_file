import React, { useState, useEffect } from 'react';
import {
  Settings,
  Send,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: 'MAVI',
    contactPhone: '+998 71 200 00 00',
    contactEmail: 'concierge@mavi.uz',
    contactAddress: 'Amir Temur Avenue 107A, Tashkent, Uzbekistan',
    deliveryFee: 25000,
    freeDeliveryThreshold: 500000,
    telegramChatId: '-1004335804992',
    telegramBotToken: '',
    telegramBotTokenMasked: '****',
    telegramEnabled: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.data.success && res.data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...res.data.settings
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/admin/settings', settings);
      if (res.data.success) {
        toast.success('Sozlamalar muvaffaqiyatli saqlandi');
      }
    } catch (err) {
      toast.error('Sozlamalarni saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTestResult(null);

    try {
      const res = await api.post('/admin/test-telegram', {
        token: settings.telegramBotToken || undefined,
        chatId: settings.telegramChatId
      });

      if (res.data.success) {
        toast.success('Telegram test xabari muvaffaqiyatli yetkazildi!');
        setTestResult({
          success: true,
          message: 'Telegram kanaliga test xabarnomasi muvaffaqiyatli yuborildi!'
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Telegram API bilan aloqa o‘rnatilmadi';
      toast.error(msg);
      setTestResult({
        success: false,
        message: msg
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-mavi-primary">
          Do‘kon va Telegram Sozlamalari
        </h1>
        <p className="text-xs text-mavi-muted mt-0.5">
          Yetkazib berish narxlari, aloqa ma’lumotlari va Telegram bot integratsiyasi
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. TELEGRAM BOT INTEGRATION CRITICAL SECTION */}
        <div className="p-6 bg-white border border-mavi-border rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-mavi-border">
            <Send className="w-5 h-5 text-blue-600" />
            <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
              Telegram Bot Buyurtma Bildirishnomalari (Kritik Modul)
            </h3>
          </div>

          <p className="text-xs text-mavi-muted leading-relaxed">
            Har bir muvaffaqiyatli qabul qilingan yangi buyurtma avtomatik ravishda belgilangan Telegram kanaliga chiroyli formatlangan xabar ko‘rinishida yetkaziladi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Telegram Bot Token
              </label>
              <input
                type="text"
                placeholder={settings.telegramBotTokenMasked || 'BotFather dan olingan token'}
                value={settings.telegramBotToken}
                onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded font-mono text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
              <span className="text-[10px] text-mavi-muted block mt-1">
                Xavfsizlik talablariga binoan token serverdagi <code className="text-mavi-primary">.env</code> faylida saqlanadi.
              </span>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Telegram Kanal / Chat ID
              </label>
              <input
                type="text"
                required
                value={settings.telegramChatId}
                onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                placeholder="-1004335804992 yoki @kanal_nomi"
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded font-mono text-mavi-primary focus:outline-none focus:border-mavi-primary"
              />
              <span className="text-[10px] text-mavi-muted block mt-1">
                Standart kanal ID: <strong>-1004335804992</strong>
              </span>
            </div>
          </div>

          {/* Test Telegram Button */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTelegram}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testingTelegram ? 'Tekshirilmoqda...' : 'Telegram Ulanishini Sinovdan O‘tkazish'}</span>
            </button>
            <span className="text-xs text-mavi-muted">
              (Bot kanalga admin qilib qo‘shilgan bo‘lishi lozim)
            </span>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* 2. DELIVERY & LOGISTICS SETTINGS */}
        <div className="p-6 bg-white border border-mavi-border rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-mavi-border">
            <Truck className="w-5 h-5 text-mavi-accent" />
            <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
              Yetkazib Berish Narxlari
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Standart Yetkazish Narxi (UZS)
              </label>
              <input
                type="number"
                required
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Bepul Yetkazish Chegarasi (UZS)
              </label>
              <input
                type="number"
                required
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded"
              />
            </div>
          </div>
        </div>

        {/* 3. STORE DETAILS */}
        <div className="p-6 bg-white border border-mavi-border rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-mavi-border">
            <Settings className="w-5 h-5 text-mavi-accent" />
            <h3 className="text-xs uppercase tracking-luxury font-bold text-mavi-primary">
              Aloqa va Manzil Ma’lumotlari
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Do‘kon Nomi
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
                Aloqa Telefoni
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              Elektron Pochta
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase text-mavi-text block mb-1">
              Butik Manzili
            </label>
            <input
              type="text"
              value={settings.contactAddress}
              onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-mavi-border rounded"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-mavi-primary text-white text-xs uppercase tracking-widest font-semibold hover:bg-mavi-accent transition-colors rounded shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saqlanmoqda...' : 'Barcha Sozlamalarni Saqlash'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
