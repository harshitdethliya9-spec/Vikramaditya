/**
 * Vikram Aditya Pallace - Consolidated Application Logic
 * Avoids local CORS blocks when opening index.html directly from file system.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Initialize Lucide Icons
  // ==========================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================
  // 2. Navigation Scroll & Toggle Effects
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    });
  }

  // Scroll Spy for Nav highlighting
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });


  // ==========================================
  // 3. Hero Slideshow Slider
  // ==========================================
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const INTERVAL_TIME = 6000;

    function showSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
      }

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
      }
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, INTERVAL_TIME);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    indicators.forEach((indicator) => {
      indicator.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
        showSlide(slideIndex);
        startAutoSlide();
      });
    });

    startAutoSlide();
  }


  // ==========================================
  // 4. Booking Enquiry Modal
  // ==========================================
  const modal = document.getElementById('enquiry-modal');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('enquiry-form');
  const dateInput = document.getElementById('enquiry-date');
  const dateDisplay = document.getElementById('selected-date-display');

  function openEnquiryModal(dateInfo) {
    if (!modal) return;
    dateInput.value = dateInfo.formattedDate;
    dateDisplay.textContent = dateInfo.formattedDate;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const nameInput = document.getElementById('client-name');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 100);
    }
  }

  function closeEnquiryModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeEnquiryModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeEnquiryModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeEnquiryModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const eventType = document.getElementById('event-type').value;
      const requests = document.getElementById('special-request').value.trim();
      const selectedDate = dateInput.value;

      if (!name || !phone || !eventType || !selectedDate) {
        alert('Please fill out all required fields.');
        return;
      }

      const whatsappNumber = '919752671437';
      const message = `Namaste Vikram Aditya Pallace & Garden,

Mujhe function booking ke liye inquiry karni hai. Details niche hain:
*Name:* ${name}
*Contact Phone:* ${phone}
*Requested Date:* ${selectedDate}
*Event Type:* ${eventType}
${requests ? `*Special Requests:* ${requests}` : ''}

Kripya is date ki availability and rates share karein. Dhanyawad!`;

      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
      closeEnquiryModal();
    });
  }


  // ==========================================
  // 5. Interactive Availability Calendar
  // ==========================================
  const calendarDaysGrid = document.getElementById('calendar-days');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const monthYearHeader = document.getElementById('calendar-month-year');

  if (calendarDaysGrid) {
    // Mock Database of Booked Dates (Format: YYYY-MM-DD)
    const BOOKED_DATES = new Set([
      // June 2026
      '2026-06-10', '2026-06-13', '2026-06-14', '2026-06-20', '2026-06-21', '2026-06-27', '2026-06-28',
      // July 2026
      '2026-07-04', '2026-07-05', '2026-07-11', '2026-07-12', '2026-07-18', '2026-07-19', '2026-07-25', '2026-07-26',
      // August 2026
      '2026-08-01', '2026-08-08', '2026-08-15', '2026-08-22', '2026-08-23', '2026-08-30',
      // September 2026
      '2026-09-05', '2026-09-06', '2026-09-12', '2026-09-19', '2026-09-20', '2026-09-26',
      // October 2026
      '2026-10-10', '2026-10-11', '2026-10-17', '2026-10-18', '2026-10-24', '2026-10-25', '2026-10-31',
      // November 2026
      '2026-11-08', '2026-11-12', '2026-11-14', '2026-11-15', '2026-11-20', '2026-11-21', '2026-11-22', '2026-11-25', '2026-11-28', '2026-11-29',
      // December 2026
      '2026-12-05', '2026-12-06', '2026-12-10', '2026-12-12', '2026-12-13', '2026-12-18', '2026-12-19', '2026-12-20', '2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31',
      // January 2027
      '2027-01-01', '2027-01-09', '2027-01-10', '2027-01-16', '2027-01-17', '2027-01-23', '2027-01-24', '2027-01-30', '2027-01-31',
      // February 2027
      '2027-02-06', '2027-02-07', '2027-02-13', '2027-02-14', '2027-02-20', '2027-02-21', '2027-02-27', '2027-02-28',
      // March 2027
      '2027-03-06', '2027-03-07', '2027-03-13', '2027-03-20', '2027-03-21', '2027-03-27',
      // April 2027
      '2027-04-03', '2027-04-10', '2027-04-17', '2027-04-18', '2027-04-24',
      // May 2027
      '2027-05-02', '2027-05-08', '2027-05-09', '2027-05-14', '2027-05-15', '2027-05-16', '2027-05-22', '2027-05-23', '2027-05-28', '2027-05-29', '2027-05-30'
    ]);

    const MONTH_NAMES = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];

    let currentDate = new Date();
    // Default view to June 2026 if system date is older, so mock data aligns perfectly
    let currentYear = Math.max(currentDate.getFullYear(), 2026);
    let currentMonth = currentYear === 2026 ? Math.max(currentDate.getMonth(), 5) : currentDate.getMonth();

    function renderCalendar(year, month) {
      calendarDaysGrid.innerHTML = '';
      monthYearHeader.textContent = `${MONTH_NAMES[month]} ${year}`;

      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      // Render empty day paddings
      for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'day-empty');
        calendarDaysGrid.appendChild(emptyCell);
      }

      // Render actual days
      for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = day;

        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${year}-${monthStr}-${dayStr}`;

        if (BOOKED_DATES.has(dateKey)) {
          dayCell.classList.add('day-booked');
          dayCell.setAttribute('title', `Booked - ${day} ${MONTH_NAMES[month]}`);
        } else {
          dayCell.classList.add('day-available');
          dayCell.setAttribute('title', `Available - Click to Book`);
          
          dayCell.addEventListener('click', () => {
            openEnquiryModal({
              formattedDate: `${day} ${MONTH_NAMES[month]} ${year}`,
              isoDate: dateKey
            });
          });
        }

        calendarDaysGrid.appendChild(dayCell);
      }
    }

    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
      });
    }

    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
      });
    }

    renderCalendar(currentYear, currentMonth);
  }
});
