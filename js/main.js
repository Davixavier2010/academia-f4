/**
 * ACADEMIA F4 NATAÇÃO & FITNESS - URBANNOVA / SÃO JOSÉ DOS CAMPOS
 * Scripts Interativos & Lógica Front-end (Sem preços e sem seletor de tarifas)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLiveStatus();
  initGallery();
  initBmiCalculator();
  initFaqAccordion();
  initForms();
  initCounters();
});

/* ==========================================================================
   1. NAVBAR & MENU MOBILE
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('mainHeader');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-[#0B0E14]/95', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-[#0B0E14]/95', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl');
      header.classList.add('bg-transparent');
    }
  });

  // Mobile Menu Toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileBtn.innerHTML = '<i class="fa-solid fa-xmark text-2xl text-[#FF6600]"></i>';
      } else {
        mobileMenu.classList.add('hidden');
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars text-2xl text-[#FF6600]"></i>';
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (mobileBtn) {
          mobileBtn.innerHTML = '<i class="fa-solid fa-bars text-2xl text-[#FF6600]"></i>';
        }
      });
    });
  }
}

/* ==========================================================================
   2. HORÁRIOS & STATUS DINÂMICO DA ACADEMIA F4
   Horários reais (Google Maps):
   Seg-Sex: 06:00 - 21:00
   Sáb: 09:00 - 12:00
   Dom: Fechado
   ========================================================================== */
function initLiveStatus() {
  const statusBadge = document.getElementById('liveStatusBadge');
  const statusDetail = document.getElementById('liveStatusDetail');
  const footerStatus = document.getElementById('footerStatusBadge');

  function checkStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentMins = hour * 60 + minute;

    let isOpen = false;
    let message = '';

    if (day >= 1 && day <= 5) {
      // Segunda a Sexta: 06:00 (360) a 21:00 (1260)
      if (currentMins >= 360 && currentMins < 1260) {
        isOpen = true;
        message = 'Aberto agora • Fecha às 21:00';
      } else if (currentMins < 360) {
        message = 'Fechado • Abre hoje às 06:00';
      } else {
        message = day === 5 ? 'Fechado • Abre amanhã às 09:00' : 'Fechado • Abre amanhã às 06:00';
      }
    } else if (day === 6) {
      // Sábado: 09:00 (540) a 12:00 (720)
      if (currentMins >= 540 && currentMins < 720) {
        isOpen = true;
        message = 'Aberto agora • Fecha às 12:00';
      } else if (currentMins < 540) {
        message = 'Fechado • Abre hoje às 09:00';
      } else {
        message = 'Fechado • Abre Segunda às 06:00';
      }
    } else {
      // Domingo: Fechado
      message = 'Fechado aos Domingos • Abre Segunda às 06:00';
    }

    const htmlContent = isOpen
      ? `<span class="status-dot-active"></span> <span class="text-green-400 font-bold">${message}</span>`
      : `<span class="status-dot-closed"></span> <span class="text-slate-300 font-medium">${message}</span>`;

    if (statusBadge) statusBadge.innerHTML = htmlContent;
    if (statusDetail) statusDetail.innerHTML = htmlContent;
    if (footerStatus) footerStatus.innerHTML = htmlContent;
  }

  checkStatus();
  setInterval(checkStatus, 60000);
}

/* ==========================================================================
   3. GALERIA COM FILTROS & LIGHTBOX MODAL
   ========================================================================== */
let currentGalleryIndex = 0;
let filteredGalleryItems = [];

function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightbox');
  const prevBtn = document.getElementById('prevLightbox');
  const nextBtn = document.getElementById('nextLightbox');

  if (!items.length) return;

  function refreshFilteredItems(filter) {
    filteredGalleryItems = [];
    items.forEach(item => {
      const cat = item.dataset.category;
      if (filter === 'todos' || cat === filter) {
        item.classList.remove('hidden');
        filteredGalleryItems.push(item);
      } else {
        item.classList.add('hidden');
      }
    });
  }

  refreshFilteredItems('todos');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#FF6600]', 'text-white');
        b.classList.add('bg-white/5', 'text-slate-400');
      });
      btn.classList.add('bg-[#FF6600]', 'text-white');
      btn.classList.remove('bg-white/5', 'text-slate-400');

      const filter = btn.dataset.filter;
      refreshFilteredItems(filter);
    });
  });

  // Open Lightbox on Image Click
  items.forEach(item => {
    item.addEventListener('click', () => {
      currentGalleryIndex = filteredGalleryItems.indexOf(item);
      openLightbox();
    });
  });

  function openLightbox() {
    if (!filteredGalleryItems[currentGalleryIndex]) return;
    const targetItem = filteredGalleryItems[currentGalleryIndex];
    const img = targetItem.querySelector('img');
    const caption = targetItem.dataset.caption || img.alt;

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;

    lightbox.classList.remove('hidden-lightbox');
    lightbox.classList.add('visible-lightbox');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden-lightbox');
    lightbox.classList.remove('visible-lightbox');
    document.body.style.overflow = '';
  }

  function nextImage() {
    if (filteredGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % filteredGalleryItems.length;
    openLightbox();
  }

  function prevImage() {
    if (filteredGalleryItems.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + filteredGalleryItems.length) % filteredGalleryItems.length;
    openLightbox();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible-lightbox')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
}

/* ==========================================================================
   4. CALCULADORA DE IMC INTEGRADA À PRESCRIÇÃO F4
   ========================================================================== */
function initBmiCalculator() {
  const form = document.getElementById('bmiForm');
  if (!form) return;

  const resultContainer = document.getElementById('bmiResultContainer');
  const bmiValueEl = document.getElementById('bmiValue');
  const bmiCategoryEl = document.getElementById('bmiCategory');
  const bmiGaugeEl = document.getElementById('bmiGauge');
  const bmiAdviceEl = document.getElementById('bmiAdvice');
  const bmiPlanCta = document.getElementById('bmiPlanCta');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // to meters

    if (!weight || !height || height <= 0 || weight <= 0) {
      showToast('Por favor, informe peso e altura válidos.', 'error');
      return;
    }

    const bmi = weight / (height * height);
    const roundedBmi = bmi.toFixed(1);

    let category = '';
    let color = '';
    let gaugePercent = 0;
    let advice = '';
    let recommendedModality = 'F4 Total (Natação + Musculação)';

    if (bmi < 18.5) {
      category = 'Abaixo do peso';
      color = 'text-blue-400';
      gaugePercent = 20;
      advice = 'Recomendamos foco em musculação orientada para ganho de massa muscular magra, associada a natação moderada para condicionamento cardiovascular.';
      recommendedModality = 'Musculação Orientada';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Peso saudável (Ideal)';
      color = 'text-green-400';
      gaugePercent = 50;
      advice = 'Excelente! Você está na faixa ideal. A combinação de natação para resistência cardiorrespiratória e musculação para tônus e força é o caminho perfeito para sua longevidade.';
      recommendedModality = 'Natação & Musculação';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Sobrepeso';
      color = 'text-amber-400';
      gaugePercent = 75;
      advice = 'A hidroginástica e a natação são ideais aqui, pois promovem queima calórica contínua com IMPACTO ZERO nas articulações (joelhos e coluna), alternadas com musculação.';
      recommendedModality = 'Natação & Condicionamento Funcional';
    } else {
      category = 'Obesidade';
      color = 'text-red-400';
      gaugePercent = 95;
      advice = 'A água aquecida da F4 é o melhor ambiente para retomar a saúde com segurança total. Nossas turmas reduzidas garantem atenção especial e cuidado na sua evolução gradual.';
      recommendedModality = 'Hidroginástica & Natação';
    }

    if (resultContainer) resultContainer.classList.remove('hidden');
    if (bmiValueEl) bmiValueEl.textContent = roundedBmi;
    if (bmiCategoryEl) {
      bmiCategoryEl.textContent = category;
      bmiCategoryEl.className = `text-xl font-bold font-heading ${color}`;
    }
    if (bmiGaugeEl) {
      bmiGaugeEl.style.width = `${gaugePercent}%`;
      bmiGaugeEl.className = `h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`;
    }
    if (bmiAdviceEl) bmiAdviceEl.textContent = advice;
    if (bmiPlanCta) {
      const msg = encodeURIComponent(`Olá! Calculei meu IMC no site (${roundedBmi} - ${category}) e gostaria de agendar uma aula experimental com foco em ${recommendedModality}!`);
      bmiPlanCta.href = `https://wa.me/551232045859?text=${msg}`;
    }

    // Smooth scroll to result on mobile
    if (window.innerWidth < 768 && resultContainer) {
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = answer.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        const otherAns = other.querySelector('.faq-answer');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherAns) otherAns.classList.remove('open');
        if (otherIcon) otherIcon.classList.remove('rotated');
      });

      if (!isOpen) {
        answer.classList.add('open');
        if (icon) icon.classList.add('rotated');
      }
    });
  });
}

/* ==========================================================================
   6. FORMULÁRIO DE AULA GRÁTIS COM WHATSAPP
   ========================================================================== */
function initForms() {
  const trialForm = document.getElementById('trialForm');
  if (!trialForm) return;

  trialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('trialName').value.trim();
    const phone = document.getElementById('trialPhone').value.trim();
    const modality = document.getElementById('trialModality').value;
    const shift = document.getElementById('trialShift').value;

    if (!name || !phone) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const message = encodeURIComponent(
      `🏊‍♂️ *Solicitação de Aula Experimental Grátis - F4*\n\n` +
      `*Nome:* ${name}\n` +
      `*Telefone:* ${phone}\n` +
      `*Modalidade:* ${modality}\n` +
      `*Turno Preferido:* ${shift}\n\n` +
      `Olá! Vim pelo site da F4 e gostaria de confirmar o agendamento da minha aula experimental!`
    );

    const whatsappUrl = `https://wa.me/551232045859?text=${message}`;

    showToast('Redirecionando para o WhatsApp da F4...', 'success');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  });
}

/* ==========================================================================
   7. CONTADORES ANIMADOS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.target);
        const isDecimal = entry.target.dataset.decimal === 'true';
        let current = 0;
        const duration = 1600; // ms
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        }, stepTime);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   8. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold border backdrop-blur-lg';
    document.body.appendChild(toast);
  }

  if (type === 'success') {
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold border backdrop-blur-lg bg-green-950/90 border-green-500/50 text-green-200';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-green-400 text-lg"></i> <span>${message}</span>`;
  } else if (type === 'error') {
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold border backdrop-blur-lg bg-red-950/90 border-red-500/50 text-red-200';
    toast.innerHTML = `<i class="fa-solid fa-circle-exclamation text-red-400 text-lg"></i> <span>${message}</span>`;
  } else {
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold border backdrop-blur-lg bg-[#151B26]/95 border-[#FF6600]/40 text-white';
    toast.innerHTML = `<i class="fa-solid fa-circle-info text-[#FF6600] text-lg"></i> <span>${message}</span>`;
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
