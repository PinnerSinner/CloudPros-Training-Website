(() => {
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');
    const yearEl = document.getElementById('year');
    const modal = document.getElementById('enrollModal');
    const modalCourse = document.getElementById('modalCourse');
    const modalDate = document.getElementById('modalDate');
    const modalForm = modal ? modal.querySelector('form') : null;
    const body = document.body;

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach((link) =>
            link.addEventListener('click', () => navLinks.classList.remove('open'))
        );
    }

    const revealElements = document.querySelectorAll('.section, .glow-card, .course-card, .info-panel, .contact-form, .cohort-card, .testimonial, .filter-panel, .enroll-panel');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '0px 0px -10%',
            threshold: 0.2,
        }
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.setProperty('--index', index);
        observer.observe(el);
    });

    const state = {
        courseDates: new Map(),
        defaultDates: [],
    };

    window.CloudPros = window.CloudPros || {};

    window.CloudPros.registerDates = (course, dates) => {
        if (!course) return;
        state.courseDates.set(course, dates);
    };

    window.CloudPros.setDefaultDates = (dates) => {
        state.defaultDates = dates || [];
    };

    const openModal = (course) => {
        if (!modal) return;
        const availableDates = state.courseDates.get(course) || state.defaultDates;
        if (modalCourse) {
            modalCourse.value = course || 'CloudPros Cohort';
        }
        if (modalDate) {
            modalDate.innerHTML = '';
            const options = (availableDates && availableDates.length ? availableDates : ['Request next available cohort']).slice(0, 6);
            options.forEach((date) => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = date;
                modalDate.append(option);
            });
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
    };

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.matches('[data-enroll]')) {
            const course = target.getAttribute('data-enroll');
            openModal(course);
        }
        if (target.matches('[data-close-modal]')) {
            closeModal();
        }
    });

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal__overlay')) {
                closeModal();
            }
        });

        modalForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent ?? 'Confirm reservation';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Reserved!';
            }
            setTimeout(() => {
                closeModal();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                modalForm.reset();
            }, 1400);
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
})();
