# PDR Danışmanlık Web Sitesi

Bu proje, bir PDR / psikolojik danışmanlık profesyoneli için hazırlanmış çok sayfalı, statik bir web sitesi iskeletidir. İçerik alanları bilinçli olarak placeholder bırakılmıştır; gerçek metinler, yasal bilgiler ve iletişim detayları daha sonra eklenecektir.

## Teknolojiler

- Semantic HTML5
- Bootstrap 5 CDN
- Custom CSS
- Vanilla JavaScript
- Netlify static hosting headers

## Klasör Yapısı

```text
.
├── assets/
├── css/
│   ├── responsive.css
│   └── style.css
├── images/
├── js/
│   └── main.js
├── about.html
├── contact.html
├── faq.html
├── index.html
├── privacy.html
├── services.html
├── README.md
└── _headers
```

## Sayfalar

- `index.html`: Ana sayfa
- `about.html`: Uzman ve yaklaşım bilgileri
- `services.html`: Hizmet alanları
- `faq.html`: Sık sorulan sorular
- `contact.html`: İletişim formu ve iletişim alanı
- `privacy.html`: Gizlilik politikası

## Deployment Target

Proje statik HTML, CSS ve JavaScript dosyalarından oluşur. Netlify üzerinde doğrudan proje kökünden yayınlanacak şekilde hazırlanmıştır.

## Güvenlik Yaklaşımı

Netlify `_headers` dosyası temel güvenlik başlıklarını içerir:

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

Harici kaynak kullanımı Bootstrap CDN ile sınırlandırılmıştır. Inline script kullanılmamıştır; özel JavaScript `js/main.js` dosyasından yüklenir.
