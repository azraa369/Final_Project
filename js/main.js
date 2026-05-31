(function () {
  "use strict";

  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var navLinks = document.querySelectorAll(".nav-link");
  var menuToggle = document.querySelector(".site-menu-toggle");
  var primaryNav = document.getElementById("primaryNav");
  var accordions = document.querySelectorAll("[data-accordion]");

  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (primaryNav.classList.contains("show")) {
          primaryNav.classList.remove("show");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Menüyü aç");
        }
      });
    });
  }

  accordions.forEach(function (accordion) {
    var buttons = accordion.querySelectorAll(".faq-question");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var panelId = button.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);
        var isOpen = button.getAttribute("aria-expanded") === "true";

        buttons.forEach(function (otherButton) {
          var otherPanelId = otherButton.getAttribute("aria-controls");
          var otherPanel = document.getElementById(otherPanelId);

          otherButton.setAttribute("aria-expanded", "false");

          if (otherPanel) {
            otherPanel.hidden = true;
          }
        });

        if (panel && !isOpen) {
          button.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });
  });
})();

(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var revealElements = document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) return;

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("revealed");
    });
  }
})();

(function () {
  "use strict";

  var form = document.querySelector(".contact-form");

  if (!form) return;

  var statusEl = form.querySelector(".form-status") || (function () {
    var el = document.createElement("div");
    el.className = "form-status";
    el.setAttribute("aria-live", "polite");
    form.querySelector(".form-grid").insertBefore(el, form.querySelector(".btn"));
    return el;
  })();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var accessKey = form.querySelector("[name=\"access_key\"]");
    var btn = form.querySelector("[type=\"submit\"]");
    var originalText = btn.textContent;

    if (accessKey && accessKey.value === "WEB3FORMS_ACCESS_KEY") {
      statusEl.className = "form-status form-status--info";
      statusEl.textContent = "Web3Forms access key hen\u00fcz ayarlanmam\u0131\u015f. L\u00fctfen WEB3FORMS_ACCESS_KEY de\u011ferini ger\u00e7ek anahtar\u0131n\u0131zla de\u011fi\u015ftirin.";
      console.warn("Web3Forms: ACCESS_KEY placeholder de\u011feri ile de\u011fi\u015ftirilmedi. Form g\u00f6nderimi engellendi.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "G\u00f6nderiliyor...";

    var formData = new FormData(form);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success) {
        statusEl.className = "form-status form-status--success";
        statusEl.textContent = "Mesaj\u0131n\u0131z ba\u015far\u0131yla g\u00f6nderildi. En k\u0131sa s\u00fcrede d\u00f6n\u00fc\u015f yap\u0131lacakt\u0131r.";
        form.reset();
      } else {
        statusEl.className = "form-status form-status--error";
        statusEl.textContent = "Mesaj g\u00f6nderilirken bir sorun olu\u015ftu. L\u00fctfen daha sonra tekrar deneyin.";
      }
    })
    .catch(function () {
      statusEl.className = "form-status form-status--error";
      statusEl.textContent = "Mesaj g\u00f6nderilirken bir sorun olu\u015ftu. L\u00fctfen daha sonra tekrar deneyin.";
    })
    .finally(function () {
      btn.disabled = false;
      btn.textContent = originalText;
    });
  });
})();

(function () {
  "use strict";

  var toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  var htmlEl = document.documentElement;
  var icon = toggle.querySelector(".theme-toggle__icon");
  var STORAGE_KEY = "site-theme";

  function getTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    if (isDark) {
      htmlEl.setAttribute("data-theme", "dark");
    } else {
      htmlEl.removeAttribute("data-theme");
    }
    if (icon) {
      icon.textContent = isDark ? "\u2600" : "\u263E";
    }
    toggle.setAttribute("aria-label", isDark ? "A\u00e7\u0131k modu a\u00e7" : "Koyu modu a\u00e7");
    toggle.setAttribute("aria-pressed", String(isDark));
  }

  applyTheme(getTheme());

  toggle.addEventListener("click", function () {
    var isDark = htmlEl.getAttribute("data-theme") === "dark";
    var next = isDark ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
})();

/* Language switcher with translations */
(function () {
  "use strict";

  var languageButtons = document.querySelectorAll("[data-lang-switch]");
  if (!languageButtons.length) return;

  var storageKey = "site-lang";
  var supportedLanguages = ["tr", "en"];

  var translations = {
    tr: {
      "nav.home": "Ana Sayfa",
      "nav.about": "Hakkında",
      "nav.services": "Hizmetler",
      "nav.faq": "SSS",
      "nav.contact": "İletişim",
      "footer.about": "Hakkında",
      "footer.services": "Hizmetler",
      "footer.privacy": "Gizlilik Politikası / KVKK",
      "footer.contact": "İletişim",
      "hero.kicker": "Psikolojik Danışman — İsmail Samet Kasap",
      "hero.title": "Güvenli bir alanda kendinizi anlamaya ve güçlenmeye başlayın.",
      "hero.description": "Online ve yüz yüze danışmanlık ile duygusal destek, farkındalık ve kişisel gelişim için profesyonel bir görüşme alanı.",
      "hero.primaryCta": "İletişime Geç",
      "hero.secondaryCta": "Hizmetleri İncele",
      "about.kicker": "Hakkında",
      "about.title": "İsmail Samet Kasap",
      "about.description": "Psikolojik danışman. Online ve yüz yüze görüşme ile bireysel danışmanlık, eğitim koçluğu, tercih danışmanlığı ve kişisel gelişim çalışmaları yürütmektedir.",
      "about.detailLink": "Detaylı bilgi",
      "services.kicker": "Hizmetler",
      "services.title": "Danışmanlık hizmetleri",
      "services.description": "Hizmet açıklamaları gerçek içerikler hazırlandığında detaylandırılacak.",
      "services.item1Title": "Bireysel Danışmanlık",
      "services.item1Desc": "Duygusal zorlanmalar, karar süreçleri ve farkındalık alanlarında destek.",
      "services.item2Title": "Eğitim Koçluğu",
      "services.item2Desc": "Hedef belirleme, çalışma düzeni ve akademik motivasyon desteği.",
      "services.item3Title": "Tercih Danışmanlığı",
      "services.item3Desc": "Bölüm ve kariyer seçimlerinde yönlendirme ve rehberlik.",
      "services.item4Title": "Online Danışmanlık",
      "services.item4Desc": "Uzaktan yürütülen, gizlilik esaslı görüşme desteği.",
      "quote.text": "Güvenli bir alanda paylaşmak, yalnız olmadığınızı hissettirir.",
      "process.kicker": "Süreç",
      "process.title": "Danışmanlık süreci nasıl ilerler?",
      "process.step1Title": "İlk İletişim",
      "process.step1Desc": "Randevu ve genel bilgilendirme için ilk temas alanı.",
      "process.step2Title": "Ön Görüşme",
      "process.step2Desc": "İhtiyaçların ve beklentilerin değerlendirildiği başlangıç adımı.",
      "process.step3Title": "Danışmanlık Süreci",
      "process.step3Desc": "Belirlenen hedefler doğrultusunda düzenli görüşme yapısı.",
      "process.step4Title": "Takip ve Destek",
      "process.step4Desc": "Süreç sonrası ihtiyaçlara göre takip ve yönlendirme alanı.",
      "why.kicker": "Neden danışmanlık?",
      "why.title": "Duygusal destek ve kişisel gelişim için yapılandırılmış bir alan",
      "why.description": "Danışmanlık; yaşam olaylarını, duygusal zorlanmaları ve karar süreçlerini daha açık biçimde ele almak için profesyonel bir destek alanı sağlar.",
      "cta.kicker": "İletişim",
      "cta.title": "Görüşme süreci hakkında bilgi alın",
      "cta.description": "Randevu, hizmet kapsamı ve uygun görüşme seçenekleri için iletişim sayfasını kullanabilirsiniz.",
      "cta.button": "İletişime Geç",
      "footer.title": "Psikolojik Danışman",
      "footer.tagline": "Online ve yüz yüze psikolojik danışmanlık hizmetleri.",
      "aboutHero.kicker": "Hakkında",
      "aboutHero.title": "İsmail Samet Kasap",
      "aboutHero.description": "Psikolojik danışman — bireysel danışmanlık, eğitim koçluğu ve kişisel gelişim odaklı çalışmalar yürütmektedir.",
      "aboutProfile.imagePlaceholder": "Profil Fotoğrafı",
      "aboutProfile.kicker": "Profil",
      "aboutProfile.title": "İsmail Samet Kasap",
      "aboutProfile.role": "Psikolojik Danışman",
      "aboutProfile.description": "Online ve yüz yüze danışmanlık hizmetleri sunan psikolojik danışman. Bireysel danışmanlık, eğitim koçluğu, tercih danışmanlığı ve kişisel gelişim odaklı çalışmalar yürütmektedir. Arifiye Mahallesi, Odunpazarı / Eskişehir merkezli hizmet vermektedir.",
      "aboutEdu.kicker": "Eğitim ve Deneyim",
      "aboutEdu.title": "Mesleki arka plan",
      "aboutEdu.description": "Psikolojik danışmanlık alanında eğitim, sertifika ve uygulama deneyimi.",
      "aboutEdu.card1Title": "Lisans eğitimi",
      "aboutEdu.card1Desc": "Placeholder içerik alanı.",
      "aboutEdu.card2Title": "Sertifikalar",
      "aboutEdu.card2Desc": "Placeholder içerik alanı.",
      "aboutEdu.card3Title": "Mesleki deneyim",
      "aboutEdu.card3Desc": "Placeholder içerik alanı.",
      "aboutEdu.card4Title": "Çalışma alanları",
      "aboutEdu.card4Desc": "Placeholder içerik alanı.",
      "aboutApproach.kicker": "Yaklaşım",
      "aboutApproach.title": "Danışmanlık yaklaşımı",
      "aboutApproach.description": "Danışmanlık süreci; güvenli alan, gizlilik ve bireysel ihtiyaçlara uygun ilerleyen bir görüşme yapısı üzerine kurulur. Amaç, kişinin yaşadığı süreci daha iyi anlamasına, farkındalık geliştirmesine ve kendi kaynaklarını güçlendirmesine destek olmaktır.",
      "aboutPrinciples.kicker": "İlkeler",
      "aboutPrinciples.title": "Mesleki çalışma ilkeleri",
      "aboutPrinciples.card1Title": "Gizlilik",
      "aboutPrinciples.card1Desc": "Danışan bilgilerinin korunmasına yönelik ilke ve sınırlar bu alanda açıklanacak.",
      "aboutPrinciples.card2Title": "Etik ilkelere bağlılık",
      "aboutPrinciples.card2Desc": "Mesleki etik çerçeveye bağlı çalışma yaklaşımı için placeholder içerik alanı.",
      "aboutPrinciples.card3Title": "Saygılı iletişim",
      "aboutPrinciples.card3Desc": "Yargılayıcı olmayan ve saygılı iletişim yaklaşımı için placeholder içerik alanı.",
      "aboutPrinciples.card4Title": "Danışan merkezli yaklaşım",
      "aboutPrinciples.card4Desc": "Danışanın ihtiyaç ve hedeflerini merkeze alan süreç için placeholder içerik alanı.",
      "aboutCta.kicker": "Randevu ve bilgi",
      "aboutCta.title": "Danışmanlık süreci hakkında iletişime geçin",
      "aboutCta.description": "Görüşme seçenekleri, hizmet kapsamı ve uygun randevu bilgileri için iletişim sayfasını kullanabilirsiniz.",
      "aboutCta.button1": "İletişime Geç",
      "aboutCta.button2": "Hizmetleri Gör",
      "servHero.kicker": "HİZMETLER",
      "servHero.title": "Danışmanlık Hizmetleri",
      "servHero.description": "Online ve yüz yüze danışmanlık, eğitim koçluğu, tercih danışmanlığı ve kişisel gelişim odaklı çalışmalar.",
      "servMain.kicker": "Destek Alanları",
      "servMain.title": "Hizmet kapsamı",
      "servMain.description": "Her danışmanlık süreci kişinin ihtiyaçları, hedefleri ve yaşam koşulları dikkate alınarak yapılandırılır.",
      "servMain.card1Title": "Online Danışmanlık",
      "servMain.card1Desc": "Gizlilik ve profesyonel sınırlar gözetilerek yürütülen uzaktan psikolojik danışmanlık hizmeti.",
      "servMain.card2Title": "Yüz Yüze Danışmanlık",
      "servMain.card2Desc": "Arifiye Mahallesi, Odunpazarı / Eskişehir merkezli bireysel görüşme desteği.",
      "servMain.card3Title": "Eğitim Koçluğu",
      "servMain.card3Desc": "Hedef belirleme, çalışma düzeni ve akademik motivasyon desteği.",
      "servMain.card4Title": "Tercih Danışmanlığı",
      "servMain.card4Desc": "Bölüm, kariyer ve okul seçimlerinde yönlendirme ve rehberlik.",
      "servMain.card5Title": "Kaygı, Depresyon ve Anksiyete Alanlarında Destek",
      "servMain.card5Desc": "Duygusal zorlanmaları anlamaya ve baş etme becerilerini güçlendirmeye yönelik psikolojik danışmanlık.",
      "servExtra.kicker": "Ek Çalışma Alanları",
      "servExtra.title": "Kişisel gelişim odaklı çalışmalar",
      "servExtra.description": "Danışmanlık sürecine destekleyici olarak sunulan, kişisel farkındalık ve enerji temelli tamamlayıcı yaklaşımlar.",
      "servExtra.card1Title": "Eğitim Kampları",
      "servExtra.card1Desc": "Yapılandırılmış grup çalışmaları ile hedef odaklı öğrenme ve gelişim programları.",
      "servExtra.card2Title": "Access Bars",
      "servExtra.card2Desc": "Bilinçaltı kalıpların farkına varmaya ve zihinsel berraklık kazanmaya yönelik dokunuş temelli bir çalışma.",
      "servExtra.card3Title": "ThetaHealing",
      "servExtra.card3Desc": "Meditasyon ve farkındalık yoluyla inanç kalıplarını dönüştürmeye odaklanan kişisel gelişim yöntemi.",
      "servExtra.card4Title": "JAAS",
      "servExtra.card4Desc": "Farkındalık temelli, bireyin içsel kaynaklarına ulaşmasını destekleyen tamamlayıcı bir çalışma alanı.",
      "servProcess.kicker": "Süreç",
      "servProcess.title": "Danışmanlık süreci nasıl ilerler?",
      "servProcess.step1Title": "İlk İletişim",
      "servProcess.step1Desc": "Randevu ve genel bilgi almak için ilk temas kurulur.",
      "servProcess.step2Title": "Ön Görüşme",
      "servProcess.step2Desc": "İhtiyaçlar, beklentiler ve uygun hizmet alanı birlikte değerlendirilir.",
      "servProcess.step3Title": "Danışmanlık Süreci",
      "servProcess.step3Desc": "Görüşmeler belirlenen hedefler ve etik sınırlar doğrultusunda yürütülür.",
      "servProcess.step4Title": "Takip ve Destek",
      "servProcess.step4Desc": "Süreç ilerledikçe ihtiyaçlara göre takip ve değerlendirme yapılır.",
      "servFaq.kicker": "Sık Sorulanlar",
      "servFaq.title": "Hizmetler hakkında merak edilenler",
      "servFaq.description": "Danışmanlık süreci, görüşme biçimi ve randevu planlamasıyla ilgili kısa yanıtlar SSS sayfasında yer alır.",
      "servFaq.button": "SSS Sayfasına Git",
      "servFaq.q1Title": "Hangi hizmet benim için uygun?",
      "servFaq.q1Desc": "İlk görüşmede ihtiyaçlar değerlendirilerek uygun hizmet alanı birlikte netleştirilebilir.",
      "servFaq.q2Title": "Online danışmanlık yapılabilir mi?",
      "servFaq.q2Desc": "Uygun koşullar ve mesleki sınırlar çerçevesinde online görüşme seçeneği değerlendirilebilir.",
      "servFaq.q3Title": "Görüşme sıklığı nasıl belirlenir?",
      "servFaq.q3Desc": "Görüşme sıklığı ihtiyaçlara, hedeflere ve danışmanlık planına göre belirlenir.",
      "servCta.kicker": "İletişim",
      "servCta.title": "Size uygun danışmanlık desteğini birlikte değerlendirin",
      "servCta.description": "Hizmetler, randevu seçenekleri ve görüşme süreci hakkında bilgi almak için iletişime geçebilirsiniz.",
      "servCta.button1": "İletişime Geç",
      "servCta.button2": "Randevu Bilgisi Al",
      "faqHero.kicker": "SSS",
      "faqHero.title": "Sık Sorulan Sorular",
      "faqHero.description": "Danışmanlık süreci, randevu planlama ve görüşme koşulları hakkında sık sorulan soruların kısa yanıtlarını burada bulabilirsiniz.",
      "faqSection.kicker": "Yanıtlar",
      "faqSection.title": "Merak edilen konular",
      "faqSection.q1Question": "İlk görüşmede ne yapılır?",
      "faqSection.q1Answer": "İlk görüşmede danışanın ihtiyaçları, beklentileri ve danışmanlık sürecine dair temel bilgiler değerlendirilir.",
      "faqSection.q2Question": "Seans süresi ne kadardır?",
      "faqSection.q2Answer": "Görüşme süresi hizmet türüne ve çalışma planına göre değişebilir. Net süre bilgisi randevu öncesinde paylaşılır.",
      "faqSection.q3Question": "Online danışmanlık yapılabilir mi?",
      "faqSection.q3Answer": "Uygun koşullar ve mesleki sınırlar çerçevesinde online danışmanlık seçeneği değerlendirilebilir.",
      "faqSection.q4Question": "Görüşmeler gizli midir?",
      "faqSection.q4Answer": "Görüşmeler gizlilik ilkesiyle yürütülür. Gizlilik sınırları ve yasal çerçeve danışmanlık sürecinde açık biçimde paylaşılır.",
      "faqSection.q5Question": "Randevu nasıl alınır?",
      "faqSection.q5Answer": "Randevu ve ön bilgilendirme için iletişim sayfasındaki form veya belirtilen iletişim kanalları kullanılabilir.",
      "faqSection.q6Question": "Danışmanlık süreci ne kadar sürer?",
      "faqSection.q6Answer": "Süreç, danışanın ihtiyaçları, hedefleri ve görüşme planına göre değişir. Değerlendirme danışmanlık süreci içinde yapılır.",
      "faqSupport.kicker": "Önemli Not",
      "faqSupport.title": "Acil destek hakkında",
      "faqSupport.description": "Bu web sitesi acil destek için tasarlanmamıştır. Acil durumlarda bulunduğunuz yerdeki uygun acil yardım ve sağlık hizmetleriyle iletişime geçmeniz gerekir.",
      "faqCta.kicker": "İletişim",
      "faqCta.title": "Sorularınız için iletişime geçin",
      "faqCta.description": "Danışmanlık hizmetleri ve randevu seçenekleri hakkında bilgi almak için iletişim sayfasını kullanabilirsiniz.",
      "faqCta.button1": "İletişime Geç",
      "faqCta.button2": "Hizmetleri İncele",
      "contactHero.kicker": "İLETİŞİM",
      "contactHero.title": "İletişime Geçin",
      "contactHero.description": "Randevu, hizmet kapsamı ve görüşme seçenekleri hakkında bilgi almak için iletişim bilgilerini kullanabilirsiniz.",
      "contactInfo.kicker": "Bilgiler",
      "contactInfo.title": "İletişim bilgileri",
      "contactInfo.description": "Size uygun görüşme seçeneğini birlikte değerlendirmek için iletişime geçebilirsiniz.",
      "contactInfo.card1Title": "Telefon",
      "contactInfo.card2Title": "E-posta",
      "contactInfo.card3Title": "Adres",
      "contactInfo.card3Desc": "Arifiye Mahallesi, Belediye Sokak No:2/C\nOdunpazarı / Eskişehir",
      "contactInfo.card4Title": "Hizmet Türü",
      "contactInfo.card4Desc": "Online danışmanlık\nYüz yüze danışmanlık",
      "contactInfo.card5Title": "Çalışma saatleri",
      "contactInfo.card5Desc": "Randevu ile — esnek görüşme planlaması için iletişime geçebilirsiniz.",
      "contactInfo.card6Title": "Sosyal medya",
      "contactForm.kicker": "Form",
      "contactForm.title": "Mesaj gönderin",
      "contactForm.description": "Form üzerinden yalnızca randevu ve genel bilgilendirme taleplerinizi paylaşmanız önerilir.",
      "contactForm.privacyNote": "Lütfen bu form üzerinden özel nitelikli sağlık bilgisi paylaşmayınız.",
      "contactForm.nameLabel": "Ad Soyad *",
      "contactForm.namePlaceholder": "Adınız ve soyadınız",
      "contactForm.emailLabel": "E-posta *",
      "contactForm.emailPlaceholder": "ornek@eposta.com",
      "contactForm.phoneLabel": "Telefon",
      "contactForm.phonePlaceholder": "Telefon numaranız",
      "contactForm.serviceLabel": "Hizmet Türü *",
      "contactForm.servicePlaceholder": "Online veya yüz yüze",
      "contactForm.messageLabel": "Mesaj *",
      "contactForm.messagePlaceholder": "Kısa mesajınızı yazınız",
      "contactForm.consentLabel": "KVKK ve gizlilik bilgilendirmesini okudum, iletişim amacıyla tarafıma dönüş yapılmasını kabul ediyorum.",
      "contactForm.submitButton": "Mesaj Gönder",
      "contactMap.kicker": "Konum",
      "contactMap.title": "Adres",
      "contactMap.description": "Arifiye Mahallesi, Belediye Sokak No:2/C, Odunpazarı / Eskişehir",
      "contactCta.kicker": "Destek",
      "contactCta.title": "İlk adım için sade bir iletişim yeterli",
      "contactCta.description": "Danışmanlık süreciyle ilgili sorularınızı paylaşabilir, uygun görüşme seçeneği hakkında bilgi alabilirsiniz.",
      "contactCta.button": "Hizmetleri İncele",
      "privHero.kicker": "GİZLİLİK",
      "privHero.title": "Gizlilik ve KVKK Bilgilendirmesi",
      "privHero.description": "Bu sayfa, iletişim formu üzerinden paylaşılabilecek kişisel veriler ve bu verilerin kullanım amacı hakkında genel bilgilendirme sunar.",
      "privHero.draftNote": "Bu metin bilgilendirme amaçlı bir taslaktır. Yayınlanmadan önce site sahibi tarafından gözden geçirilmeli ve gerekli durumlarda hukuki danışmanlık alınmalıdır.",
      "privContent.kicker": "Bilgilendirme",
      "privContent.title": "Kişisel veri işleme taslağı",
      "privContent.description": "Aşağıdaki açıklamalar, statik web sitesi ve iletişim formu yapısı dikkate alınarak hazırlanmış genel bir taslak niteliğindedir.",
      "privContent.card1Title": "Toplanabilecek veriler",
      "privContent.card1Desc1": "İletişim formu kullanıldığında aşağıdaki bilgiler ziyaretçi tarafından gönüllü olarak paylaşılabilir:",
      "privContent.card1Item1": "Ad Soyad",
      "privContent.card1Item2": "E-posta",
      "privContent.card1Item3": "Telefon",
      "privContent.card1Item4": "Konu",
      "privContent.card1Item5": "Mesaj",
      "privContent.card1Desc2": "Ziyaretçilerin iletişim formu üzerinden özel sağlık bilgileri veya hassas kişisel veriler paylaşmaması önerilir.",
      "privContent.card2Title": "Kullanım amaçları",
      "privContent.card2Desc": "Paylaşılan bilgiler aşağıdaki amaçlarla kullanılabilir:",
      "privContent.card2Item1": "İletişim taleplerine dönüş yapmak",
      "privContent.card2Item2": "Ön görüşme veya randevu iletişimini planlamak",
      "privContent.card2Item3": "Danışmanlık hizmetleri hakkında genel bilgi sağlamak",
      "privContent.card3Title": "Veri saklama ve güvenlik",
      "privContent.card3Desc1": "Bu web sitesi statik yapıda hazırlanmıştır ve kendi içinde bir veritabanında veri saklamaz. Form gönderimleri ileride Web3Forms, Formspree veya benzeri bir form sağlayıcı üzerinden danışmanın e-posta adresine iletilebilir.",
      "privContent.card3Desc2": "Yayın ortamında HTTPS kullanılması ve iletişim kanallarına erişimin yalnızca site sahibiyle sınırlı tutulması önerilir.",
      "privContent.card4Title": "Üçüncü taraf hizmetler",
      "privContent.card4Desc": "Site yayına alındığında veya ileride geliştirildiğinde aşağıdaki üçüncü taraf hizmetler kullanılabilir:",
      "privContent.card4Item1": "Form gönderim sağlayıcısı",
      "privContent.card4Item2": "Hosting sağlayıcısı",
      "privContent.card4Item3": "İleride eklenirse analiz aracı",
      "privContent.card4Desc2": "Kullanılan her hizmetin gizlilik koşulları site sahibi tarafından ayrıca değerlendirilmelidir.",
      "privContent.card5Title": "Ziyaretçi hakları",
      "privContent.card5Desc": "Ziyaretçiler, geçerli mevzuat kapsamında aşağıdaki konularda talepte bulunabilir:",
      "privContent.card5Item1": "Kişisel verileri hakkında bilgi alma",
      "privContent.card5Item2": "Yanlış veya eksik bilgilerin düzeltilmesini isteme",
      "privContent.card5Item3": "Verilerinin silinmesini talep etme",
      "privContent.card5Item4": "Uygulanabilir olduğu durumlarda onayı geri çekme",
      "privContent.card6Title": "İletişim",
      "privContent.card6Desc": "Gizlilik ve KVKK kapsamındaki talepler için aşağıdaki iletişim bilgileri kullanılabilir:",
      "privCta.kicker": "Devam",
      "privCta.title": "Gizlilikle ilgili sorularınızı iletebilirsiniz",
      "privCta.description": "Kişisel veri ve iletişim süreci hakkında bilgi almak için iletişim sayfasını kullanabilirsiniz.",
      "privCta.button1": "İletişime Geç",
      "privCta.button2": "Ana Sayfaya Dön"
    },
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.faq": "FAQ",
      "nav.contact": "Contact",
      "footer.about": "About",
      "footer.services": "Services",
      "footer.privacy": "Privacy & KVKK",
      "footer.contact": "Contact",
      "hero.kicker": "Psychological Counselor — İsmail Samet Kasap",
      "hero.title": "Start understanding yourself and growing in a safe space.",
      "hero.description": "Professional counseling space for emotional support, self-awareness, and personal growth through online and in-person sessions.",
      "hero.primaryCta": "Get in Touch",
      "hero.secondaryCta": "Explore Services",
      "about.kicker": "About",
      "about.title": "İsmail Samet Kasap",
      "about.description": "Psychological counselor offering individual counseling, educational coaching, preference guidance, and personal development work through online and in-person sessions.",
      "about.detailLink": "Learn more",
      "services.kicker": "Services",
      "services.title": "Counseling Services",
      "services.description": "Service descriptions will be detailed when actual content is prepared.",
      "services.item1Title": "Individual Counseling",
      "services.item1Desc": "Support for emotional challenges, decision-making processes, and self-awareness.",
      "services.item2Title": "Educational Coaching",
      "services.item2Desc": "Goal setting, study routine, and academic motivation support.",
      "services.item3Title": "Preference Counseling",
      "services.item3Desc": "Guidance for department and career choices.",
      "services.item4Title": "Online Counseling",
      "services.item4Desc": "Remote sessions conducted with confidentiality.",
      "quote.text": "Sharing in a safe space reminds you that you are not alone.",
      "process.kicker": "Process",
      "process.title": "How does the counseling process work?",
      "process.step1Title": "First Contact",
      "process.step1Desc": "Initial contact for appointments and general information.",
      "process.step2Title": "Initial Meeting",
      "process.step2Desc": "Assessment of needs and expectations as a starting step.",
      "process.step3Title": "Counseling Process",
      "process.step3Desc": "Regular sessions structured around agreed goals.",
      "process.step4Title": "Follow-up and Support",
      "process.step4Desc": "Ongoing support and guidance based on post-process needs.",
      "why.kicker": "Why Counseling?",
      "why.title": "A structured space for emotional support and personal growth",
      "why.description": "Counseling provides a professional support space to address life events, emotional challenges, and decision-making processes with greater clarity.",
      "cta.kicker": "Contact",
      "cta.title": "Learn About the Counseling Process",
      "cta.description": "Use the contact page for appointment inquiries, service scope, and suitable session options.",
      "cta.button": "Get in Touch",
      "footer.title": "Psychological Counselor",
      "footer.tagline": "Online and in-person psychological counseling services.",
      "aboutHero.kicker": "About",
      "aboutHero.title": "İsmail Samet Kasap",
      "aboutHero.description": "Psychological counselor offering individual counseling, educational coaching, and personal development focused work.",
      "aboutProfile.imagePlaceholder": "Profile Photo",
      "aboutProfile.kicker": "Profile",
      "aboutProfile.title": "İsmail Samet Kasap",
      "aboutProfile.role": "Psychological Counselor",
      "aboutProfile.description": "Psychological counselor providing online and in-person counseling services. Offers individual counseling, educational coaching, preference guidance, and personal development focused work. Based in Arifiye Mahallesi, Odunpazarı / Eskişehir.",
      "aboutEdu.kicker": "Education & Experience",
      "aboutEdu.title": "Professional background",
      "aboutEdu.description": "Education, certifications, and practical experience in psychological counseling.",
      "aboutEdu.card1Title": "Undergraduate Education",
      "aboutEdu.card1Desc": "Placeholder content area.",
      "aboutEdu.card2Title": "Certifications",
      "aboutEdu.card2Desc": "Placeholder content area.",
      "aboutEdu.card3Title": "Professional Experience",
      "aboutEdu.card3Desc": "Placeholder content area.",
      "aboutEdu.card4Title": "Areas of Practice",
      "aboutEdu.card4Desc": "Placeholder content area.",
      "aboutApproach.kicker": "Approach",
      "aboutApproach.title": "Counseling approach",
      "aboutApproach.description": "The counseling process is built on a safe space, confidentiality, and a session structure tailored to individual needs. The aim is to help the person better understand their experience, develop awareness, and strengthen their own resources.",
      "aboutPrinciples.kicker": "Principles",
      "aboutPrinciples.title": "Professional working principles",
      "aboutPrinciples.card1Title": "Confidentiality",
      "aboutPrinciples.card1Desc": "Principles and boundaries regarding the protection of client information will be explained in this area.",
      "aboutPrinciples.card2Title": "Commitment to Ethics",
      "aboutPrinciples.card2Desc": "Placeholder content for professional ethical framework approach.",
      "aboutPrinciples.card3Title": "Respectful Communication",
      "aboutPrinciples.card3Desc": "Placeholder content for non-judgmental and respectful communication approach.",
      "aboutPrinciples.card4Title": "Client-Centered Approach",
      "aboutPrinciples.card4Desc": "Placeholder content for a process centered on the client's needs and goals.",
      "aboutCta.kicker": "Appointment & Info",
      "aboutCta.title": "Get in touch about the counseling process",
      "aboutCta.description": "Use the contact page for session options, service scope, and appointment information.",
      "aboutCta.button1": "Get in Touch",
      "aboutCta.button2": "View Services",
      "servHero.kicker": "SERVICES",
      "servHero.title": "Counseling Services",
      "servHero.description": "Online and in-person counseling, educational coaching, preference guidance, and personal development focused work.",
      "servMain.kicker": "Support Areas",
      "servMain.title": "Service scope",
      "servMain.description": "Each counseling process is structured taking into account the person's needs, goals, and life circumstances.",
      "servMain.card1Title": "Online Counseling",
      "servMain.card1Desc": "Remote psychological counseling service conducted with confidentiality and professional boundaries.",
      "servMain.card2Title": "In-Person Counseling",
      "servMain.card2Desc": "Individual session support based in Arifiye Mahallesi, Odunpazarı / Eskişehir.",
      "servMain.card3Title": "Educational Coaching",
      "servMain.card3Desc": "Goal setting, study routine, and academic motivation support.",
      "servMain.card4Title": "Preference Counseling",
      "servMain.card4Desc": "Guidance for department, career, and school choices.",
      "servMain.card5Title": "Support for Anxiety, Depression, and Distress",
      "servMain.card5Desc": "Psychological counseling to understand emotional difficulties and strengthen coping skills.",
      "servExtra.kicker": "Additional Work Areas",
      "servExtra.title": "Personal development focused work",
      "servExtra.description": "Complementary approaches based on personal awareness and energy, offered as support to the counseling process.",
      "servExtra.card1Title": "Educational Camps",
      "servExtra.card1Desc": "Goal-oriented learning and development programs through structured group work.",
      "servExtra.card2Title": "Access Bars",
      "servExtra.card2Desc": "A touch-based practice for recognizing subconscious patterns and gaining mental clarity.",
      "servExtra.card3Title": "ThetaHealing",
      "servExtra.card3Desc": "A personal development method focused on transforming belief patterns through meditation and awareness.",
      "servExtra.card4Title": "JAAS",
      "servExtra.card4Desc": "An awareness-based complementary practice that supports accessing inner resources.",
      "servProcess.kicker": "Process",
      "servProcess.title": "How does the counseling process work?",
      "servProcess.step1Title": "First Contact",
      "servProcess.step1Desc": "Initial contact is made to schedule an appointment and receive general information.",
      "servProcess.step2Title": "Initial Meeting",
      "servProcess.step2Desc": "Needs, expectations, and the appropriate service area are evaluated together.",
      "servProcess.step3Title": "Counseling Process",
      "servProcess.step3Desc": "Sessions are conducted according to agreed goals and ethical boundaries.",
      "servProcess.step4Title": "Follow-up and Support",
      "servProcess.step4Desc": "As the process progresses, follow-up and evaluation are conducted based on needs.",
      "servFaq.kicker": "FAQ",
      "servFaq.title": "Questions about services",
      "servFaq.description": "Brief answers about the counseling process, session format, and appointment scheduling are available on the FAQ page.",
      "servFaq.button": "Go to FAQ Page",
      "servFaq.q1Title": "Which service is right for me?",
      "servFaq.q1Desc": "During the first session, needs are assessed and the appropriate service area can be clarified together.",
      "servFaq.q2Title": "Is online counseling available?",
      "servFaq.q2Desc": "Online session options can be evaluated within appropriate conditions and professional boundaries.",
      "servFaq.q3Title": "How is session frequency determined?",
      "servFaq.q3Desc": "Session frequency is determined according to needs, goals, and the counseling plan.",
      "servCta.kicker": "Contact",
      "servCta.title": "Let's evaluate the right support for you",
      "servCta.description": "You can get in touch to learn about services, appointment options, and the counseling process.",
      "servCta.button1": "Get in Touch",
      "servCta.button2": "Get Appointment Info",
      "faqHero.kicker": "FAQ",
      "faqHero.title": "Frequently Asked Questions",
      "faqHero.description": "You can find brief answers to frequently asked questions about the counseling process, appointment scheduling, and session conditions here.",
      "faqSection.kicker": "Answers",
      "faqSection.title": "Topics of interest",
      "faqSection.q1Question": "What happens in the first session?",
      "faqSection.q1Answer": "In the first session, the client's needs, expectations, and basic information about the counseling process are assessed.",
      "faqSection.q2Question": "How long is a session?",
      "faqSection.q2Answer": "Session duration may vary depending on the type of service and work plan. Clear duration information is shared before the appointment.",
      "faqSection.q3Question": "Is online counseling available?",
      "faqSection.q3Answer": "Online counseling options can be evaluated within appropriate conditions and professional boundaries.",
      "faqSection.q4Question": "Are sessions confidential?",
      "faqSection.q4Answer": "Sessions are conducted under the principle of confidentiality. The limits of confidentiality and the legal framework are clearly shared during the counseling process.",
      "faqSection.q5Question": "How do I schedule an appointment?",
      "faqSection.q5Answer": "The form on the contact page or the specified communication channels can be used for appointments and preliminary information.",
      "faqSection.q6Question": "How long does the counseling process take?",
      "faqSection.q6Answer": "The duration varies according to the client's needs, goals, and session plan. Evaluation is made during the counseling process.",
      "faqSupport.kicker": "Important Note",
      "faqSupport.title": "About emergency support",
      "faqSupport.description": "This website is not designed for emergency support. In emergencies, you need to contact appropriate emergency and health services in your location.",
      "faqCta.kicker": "Contact",
      "faqCta.title": "Get in touch with your questions",
      "faqCta.description": "You can use the contact page to learn about counseling services and appointment options.",
      "faqCta.button1": "Get in Touch",
      "faqCta.button2": "View Services",
      "contactHero.kicker": "CONTACT",
      "contactHero.title": "Get in Touch",
      "contactHero.description": "Use the contact information to learn about appointments, service scope, and session options.",
      "contactInfo.kicker": "Info",
      "contactInfo.title": "Contact information",
      "contactInfo.description": "You can get in touch to evaluate the right session option for you.",
      "contactInfo.card1Title": "Phone",
      "contactInfo.card2Title": "Email",
      "contactInfo.card3Title": "Address",
      "contactInfo.card3Desc": "Arifiye Mahallesi, Belediye Sokak No:2/C\nOdunpazarı / Eskişehir",
      "contactInfo.card4Title": "Service Type",
      "contactInfo.card4Desc": "Online counseling\nIn-person counseling",
      "contactInfo.card5Title": "Working Hours",
      "contactInfo.card5Desc": "By appointment — contact us for flexible session scheduling.",
      "contactInfo.card6Title": "Social Media",
      "contactForm.kicker": "Form",
      "contactForm.title": "Send a Message",
      "contactForm.description": "It is recommended to share only appointment requests and general inquiries through the form.",
      "contactForm.privacyNote": "Please do not share sensitive health information through this form.",
      "contactForm.nameLabel": "Full Name *",
      "contactForm.namePlaceholder": "Your full name",
      "contactForm.emailLabel": "Email *",
      "contactForm.emailPlaceholder": "example@email.com",
      "contactForm.phoneLabel": "Phone",
      "contactForm.phonePlaceholder": "Your phone number",
      "contactForm.serviceLabel": "Service Type *",
      "contactForm.servicePlaceholder": "Online or in-person",
      "contactForm.messageLabel": "Message *",
      "contactForm.messagePlaceholder": "Write your short message",
      "contactForm.consentLabel": "I have read the KVKK and privacy notice and agree to be contacted for communication purposes.",
      "contactForm.submitButton": "Send Message",
      "contactMap.kicker": "Location",
      "contactMap.title": "Address",
      "contactMap.description": "Arifiye Mahallesi, Belediye Sokak No:2/C, Odunpazarı / Eskişehir",
      "contactCta.kicker": "Support",
      "contactCta.title": "A simple message is all it takes for the first step",
      "contactCta.description": "Share your questions about the counseling process and learn about suitable session options.",
      "contactCta.button": "View Services",
      "privHero.kicker": "PRIVACY",
      "privHero.title": "Privacy and KVKK Notice",
      "privHero.description": "This page provides general information about personal data that may be shared through the contact form and the purpose of its use.",
      "privHero.draftNote": "This text is a draft for informational purposes. It should be reviewed by the site owner before publication and legal advice should be sought where necessary.",
      "privContent.kicker": "Information",
      "privContent.title": "Personal data processing draft",
      "privContent.description": "The following explanations are a general draft prepared considering the static website and contact form structure.",
      "privContent.card1Title": "Data Collected",
      "privContent.card1Desc1": "When the contact form is used, the following information may be voluntarily shared by the visitor:",
      "privContent.card1Item1": "Full Name",
      "privContent.card1Item2": "Email",
      "privContent.card1Item3": "Phone",
      "privContent.card1Item4": "Subject",
      "privContent.card1Item5": "Message",
      "privContent.card1Desc2": "Visitors are advised not to share sensitive health information or special categories of personal data through the contact form.",
      "privContent.card2Title": "Purposes of Use",
      "privContent.card2Desc": "The shared information may be used for the following purposes:",
      "privContent.card2Item1": "Responding to communication requests",
      "privContent.card2Item2": "Scheduling initial meetings or appointments",
      "privContent.card2Item3": "Providing general information about counseling services",
      "privContent.card3Title": "Data Storage and Security",
      "privContent.card3Desc1": "This website is built as a static site and does not store data in its own database. Form submissions may be forwarded to the counselor's email address via Web3Forms, Formspree, or a similar form provider.",
      "privContent.card3Desc2": "It is recommended to use HTTPS on the publishing platform and to limit access to communication channels to the site owner only.",
      "privContent.card4Title": "Third-Party Services",
      "privContent.card4Desc": "When the site is published or further developed, the following third-party services may be used:",
      "privContent.card4Item1": "Form submission provider",
      "privContent.card4Item2": "Hosting provider",
      "privContent.card4Item3": "Analytics tool (if added later)",
      "privContent.card4Desc2": "The privacy conditions of each service used should be separately evaluated by the site owner.",
      "privContent.card5Title": "Visitor Rights",
      "privContent.card5Desc": "Visitors may request the following within the scope of applicable legislation:",
      "privContent.card5Item1": "To obtain information about their personal data",
      "privContent.card5Item2": "To request correction of incorrect or incomplete data",
      "privContent.card5Item3": "To request deletion of their data",
      "privContent.card5Item4": "To withdraw consent where applicable",
      "privContent.card6Title": "Contact",
      "privContent.card6Desc": "The following contact information can be used for privacy and KVKK-related requests:",
      "privCta.kicker": "Continue",
      "privCta.title": "Share your privacy-related questions",
      "privCta.description": "Use the contact page for information about personal data and the communication process.",
      "privCta.button1": "Get in Touch",
      "privCta.button2": "Back to Home"
    }
  };

  function getStoredLanguage() {
    var stored = localStorage.getItem(storageKey);
    return supportedLanguages.indexOf(stored) !== -1 ? stored : "tr";
  }

  function applyLanguage(language) {
    var safeLanguage = supportedLanguages.indexOf(language) !== -1 ? language : "tr";

    document.documentElement.lang = safeLanguage;

    languageButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-lang-switch") === safeLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    var langDict = translations[safeLanguage];
    if (langDict) {
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        if (langDict[key]) {
          el.textContent = langDict[key];
        }
      });
      document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
        var key = el.getAttribute("data-i18n-placeholder");
        if (langDict[key]) {
          el.placeholder = langDict[key];
        }
      });
    }
  }

  applyLanguage(getStoredLanguage());

  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedLanguage = button.getAttribute("data-lang-switch");
      if (supportedLanguages.indexOf(selectedLanguage) === -1) return;

      localStorage.setItem(storageKey, selectedLanguage);
      applyLanguage(selectedLanguage);
    });
  });
})();
