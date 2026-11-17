/**
 * ClimaMais Climatização - Script Principal
 * Funcionalidades interativas, calculadora de BTUs e integração WhatsApp
 * Telefone Oficial: (81) 98602-2271
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração padrão
  const WHATSAPP_PHONE = '5581986022271';

  /* ==========================================================================
     1. Menu Mobile Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fechar ao clicar em qualquer link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     2. Calculadora Interativa de BTUs
     ========================================================================== */
  const areaRange = document.getElementById('calcArea');
  const areaValue = document.getElementById('calcAreaValue');
  const sunOptions = document.querySelectorAll('.calc-sun-option');
  const peopleRange = document.getElementById('calcPeople');
  const peopleValue = document.getElementById('calcPeopleValue');
  const elecRange = document.getElementById('calcElec');
  const elecValue = document.getElementById('calcElecValue');
  
  const btuDisplay = document.getElementById('calcBtuResult');
  const modelDisplay = document.getElementById('calcModelRec');
  const btuWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  let currentSun = 'morning'; // 'morning' (600 BTUs) ou 'afternoon' (800 BTUs)

  function updateCalculator() {
    if (!areaRange || !btuDisplay) return;

    const area = parseInt(areaRange.value, 10);
    const people = parseInt(peopleRange ? peopleRange.value : 1, 10);
    const electronics = parseInt(elecRange ? elecRange.value : 1, 10);

    if (areaValue) areaValue.textContent = `${area} m²`;
    if (peopleValue) peopleValue.textContent = `${people} ${people === 1 ? 'pessoa' : 'pessoas'}`;
    if (elecValue) elecValue.textContent = `${electronics} ${electronics === 1 ? 'aparelho' : 'aparelhos'}`;

    // Base de cálculo por m² conforme normas de climatização
    const basePerMeter = currentSun === 'afternoon' ? 800 : 600;
    
    // Cálculo: Área * base + adicionais por pessoa extra e eletrônicos
    let rawBTUs = (area * basePerMeter);
    if (people > 1) {
      rawBTUs += (people - 1) * 600;
    }
    rawBTUs += electronics * 600;

    // Arredondamento para potências comerciais padrão no Brasil
    let recommendedBTU = 9000;
    let modelDesc = '';

    if (rawBTUs <= 9500) {
      recommendedBTU = 9000;
      modelDesc = 'Split Hi-Wall 9.000 BTUs (Ideal para quartos e salas compactas)';
    } else if (rawBTUs <= 12500) {
      recommendedBTU = 12000;
      modelDesc = 'Split Hi-Wall 12.000 BTUs (Mais vendido - Quartos médios e escritórios)';
    } else if (rawBTUs <= 18500) {
      recommendedBTU = 18000;
      modelDesc = 'Split Hi-Wall 18.000 BTUs (Salas amplas e ambientes integrados)';
    } else if (rawBTUs <= 25000) {
      recommendedBTU = 24000;
      modelDesc = 'Split Hi-Wall 24.000 BTUs (Comércios, salas grandes e lojas)';
    } else if (rawBTUs <= 32000) {
      recommendedBTU = 30000;
      modelDesc = 'Split Hi-Wall ou Piso-Teto 30.000 BTUs (Espaços amplos)';
    } else {
      recommendedBTU = 36000;
      modelDesc = 'Split Piso-Teto ou Cassete 36.000+ BTUs (Consulte nosso técnico)';
    }

    // Atualiza interface
    btuDisplay.innerHTML = `${recommendedBTU.toLocaleString('pt-BR')} <span>BTUs</span>`;
    if (modelDisplay) {
      modelDisplay.textContent = modelDesc;
    }

    // Atualiza link de WhatsApp direto com os dados simulados
    if (btuWhatsAppBtn) {
      const solTexto = currentSun === 'afternoon' ? 'Sol da tarde (forte)' : 'Sol da manhã / moderado';
      const msg = `Olá! Fiz a simulação no site da ClimaMais:
- Área: ${area} m²
- Exposição Solar: ${solTexto}
- Ocupantes: ${people}
- Potência recomendada: ${recommendedBTU.toLocaleString('pt-BR')} BTUs (${modelDesc})

Gostaria de um orçamento para fornecimento e/ou instalação!`;
      btuWhatsAppBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  // Event Listeners da Calculadora
  if (areaRange) areaRange.addEventListener('input', updateCalculator);
  if (peopleRange) peopleRange.addEventListener('input', updateCalculator);
  if (elecRange) elecRange.addEventListener('input', updateCalculator);

  sunOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      sunOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      currentSun = opt.getAttribute('data-sun');
      updateCalculator();
    });
  });

  // Executa uma vez no início para calibrar
  updateCalculator();

  /* ==========================================================================
     3. FAQ Acordeão
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha todos os outros itens
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Alterna o atual
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // Abre a primeira pergunta por padrão
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }

  /* ==========================================================================
     4. Formulário de Orçamento / Agendamento para WhatsApp
     ========================================================================== */
  const contactForm = document.getElementById('scheduleForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim() || 'Cliente';
      const phone = document.getElementById('clientPhone')?.value.trim() || 'Não informado';
      const neighborhood = document.getElementById('clientNeighborhood')?.value.trim() || 'Recife e Região';
      const service = document.getElementById('clientService')?.value || 'Manutenção Preventiva';
      const units = document.getElementById('clientUnits')?.value || '1 aparelho';
      const notes = document.getElementById('clientNotes')?.value.trim() || 'Sem observações adicionais';

      const whatsappText = `*Novo Agendamento / Orçamento - ClimaMais Climatização*
---------------------------------------
*Nome:* ${name}
*Telefone/WhatsApp:* ${phone}
*Bairro/Cidade:* ${neighborhood}
*Serviço Solicitado:* ${service}
*Quantidade de Aparelhos:* ${units}
*Detalhes:* ${notes}
---------------------------------------
_Mensagem enviada através do site oficial ClimaMais._`;

      const targetUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappText)}`;
      window.open(targetUrl, '_blank');
    });
  }

  /* ==========================================================================
     5. Modal do Panfleto Oficial
     ========================================================================== */
  const openModalBtns = document.querySelectorAll('.open-flyer-modal');
  const flyerModal = document.getElementById('flyerModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (flyerModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        flyerModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        flyerModal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    flyerModal.addEventListener('click', (e) => {
      if (e.target === flyerModal) {
        flyerModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && flyerModal.classList.contains('open')) {
        flyerModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================================================
     6. Fechar Balão do WhatsApp Flutuante
     ========================================================================== */
  const bubbleCloseBtn = document.getElementById('closeBubbleBtn');
  const whatsappBubble = document.getElementById('whatsappBubble');

  if (bubbleCloseBtn && whatsappBubble) {
    bubbleCloseBtn.addEventListener('click', () => {
      whatsappBubble.style.display = 'none';
    });
  }

  /* ==========================================================================
     7. Efeito de Header Ativo no Scroll
     ========================================================================== */
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

});
