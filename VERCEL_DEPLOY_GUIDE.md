# 🚀 MAVI Loyihasini Vercel'ga Deploy Qilish (Free Tarif uchun Maxsus Qo‘llanma)

Loyihangiz **Vercel Free (Hobby)** tarifiga to‘liq moslashtirildi. Endi siz **hech qanday qo‘shimcha ma'lumotlar bazasi (MongoDB Atlas) ochmasdan va sozlamasdan ham** loyihani Vercel'ga yuklab, **bittada ishlatishingiz mumkin!**

---

## ⚡ Eng Asosiy Qulayliklar:

1. **Zero-Config (Nol Konfiguratsiya)**:
   - Hech qanday tashqi baza shart emas. Backend ichida tayyor yuqori tezlikdagi xotira bazasi (In-Memory Store) o‘rnatildi.
   - 10 ta tayyor premium kiyim mahsulotlari, 13 ta kategoriya, kuponlar va admin profili avtomatik ishlaydi.
2. **Telegram Bot Avtomatik Ishlaydi**:
   - Saytda xaridor buyurtma berishi bilan Telegram kanalingizga (`-1004335804992`) darhol to‘liq xabarnoma yetib boradi.
3. **Admin Panel**:
   - Kirish manzili: `/admin/login`
   - Login: `admin@mavi.uz`
   - Parol: `AdminPassword2026!`
4. **Ixtiyoriy MongoDB**:
   - Agar kelajakda MongoDB Atlas ulamoqchi bo‘lsangiz, shunchaki Vercel'da `MONGODB_URI` ni qo‘shasiz — backend o‘zi avtomatik tarzda unga ulanadi!

---

## 🛠 Vercel'ga Yuklash (2 daqiqalik qadamlar):

### 1-USUL: GitHub orqali (Tavsiya etiladi)

1. **Loyihani GitHub'ga yuklang**:
   ```bash
   git init
   git add .
   git commit -m "MAVI Vercel Free tier ready"
   git branch -M main
   git remote add origin https://github.com/USERNAME/mavi-boutique.git
   git push -u origin main
   ```

2. **Vercel'ga kiring**:
   - [vercel.com](https://vercel.com) saytiga kiring.
   - **Add New...** -> **Project** tugmasini bosing.
   - GitHub repozitoriyangizni tanlang va **Import** ni bosing.

3. **Deploy tugmasini bosing**:
   - **Hech qanday qo‘shimcha sozlama o‘zgartirish shart emas!**
   - **Deploy** tugmasini bosing. 1 daqiqada tayyor havola olasiz:
     `https://mavi-boutique-xxxx.vercel.app`

---

### 2-USUL: Vercel CLI orqali (Terminaldan to‘g‘ridan-to‘g‘ri)

```bash
# 1. Vercel CLI o'rnatish (agar yo'q bo'lsa)
npm install -g vercel

# 2. Deploy qilish
vercel --prod
```

---

## 🔑 Ixtiyoriy Muhit O‘zgaruvchilari (Environment Variables)

Agar o‘z shaxsiy botingiz yoki kanalingizni ulamoqchi bo‘lsangiz, Vercel Dashboard'da **Settings -> Environment Variables** ga kiritishingiz mumkin:

| Kalit (Key) | Standart qiymat | Vazifasi |
| :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | `9141572210:AAFnPv0T--m2cHy9tIZK8iUnIfq8Z4nHvZU` | Telegram bot tokeni |
| `TELEGRAM_CHAT_ID` | `-1004335804992` | Buyurtmalar tushadigan kanal/guruh ID |
| `MONGODB_URI` | *(ixtiyoriy)* | Doimiy MongoDB Atlas bazasi havolasi |

---

## ✅ Natijani Tekshirish:
1. Vercel bergan havola orqali saytni oching — barcha kiyimlar, rasmlar, filtrlar va tillar bir zumda ishlaydi.
2. Istalgan mahsulotni tanlab, savatga qo‘shing va checkout qilib buyurtma bering.
3. Telegram kanalingizga yangi buyurtma yetib borganini ko‘rasiz!
