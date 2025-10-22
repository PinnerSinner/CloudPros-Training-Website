(() => {
    const navToggle = document.querySelector('.nav__toggle');
    const navCluster = document.querySelector('.nav__cluster');
    const navLinks = navCluster ? navCluster.querySelector('.nav__links') : null;
    const yearEl = document.getElementById('year');
    const modal = document.getElementById('enrollModal');
    const modalCourse = document.getElementById('modalCourse');
    const modalDate = document.getElementById('modalDate');
    const modalForm = modal ? modal.querySelector('form') : null;
    const body = document.body;
    const modeToggle = document.querySelector('[data-mode-toggle]');
    const modalCalendarGoogle = modal ? modal.querySelector('[data-calendar-google]') : null;
    const modalCalendarIcs = modal ? modal.querySelector('[data-calendar-ics]') : null;

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const closeNavigation = () => {
        if (navCluster) {
            navCluster.classList.remove('open');
        }
    };

    if (navToggle && navCluster) {
        navToggle.addEventListener('click', () => {
            navCluster.classList.toggle('open');
        });

        navCluster.querySelectorAll('a.nav__link, .nav__controls .cta-button').forEach((link) =>
            link.addEventListener('click', closeNavigation)
        );
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeNavigation();
        }
    });

    const revealElements = document.querySelectorAll(
        '.section, .glow-card, .course-card, .info-panel, .contact-form, .cohort-card, .testimonial, .filter-panel, .enroll-panel, .preview-drawer__meta div, .preview-drawer__schedule'
    );
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

    const slugify = (value = '') =>
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

    const parseDateFromText = (dateText = '') => {
        if (!dateText || /request|choose|tbd/i.test(dateText)) return null;
        const parsed = new Date(`${dateText} 09:00`);
        if (Number.isNaN(parsed.getTime())) {
            return null;
        }
        return parsed;
    };

    const formatAsCalendarStamp = (date) =>
        date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    window.CloudPros.getCalendarLinks = (course, dateText, options = {}) => {
        const start = parseDateFromText(dateText);
        if (!course || !start) return null;
        const durationHours = options.durationHours || 2;
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
        const startStamp = formatAsCalendarStamp(start);
        const endStamp = formatAsCalendarStamp(end);
        const details = options.details || 'Join your live CloudPros cohort session. We will follow up with dial-in details after confirmation.';
        const title = options.title || course;
        const location = options.location || 'Virtual Classroom';
        const google =
            'https://calendar.google.com/calendar/render?action=TEMPLATE' +
            `&text=${encodeURIComponent(title)}` +
            `&dates=${startStamp}/${endStamp}` +
            `&details=${encodeURIComponent(details)}` +
            `&location=${encodeURIComponent(location)}`;
        const timestamp = formatAsCalendarStamp(new Date());
        const uid = `${startStamp}-${slugify(course)}@cloudpros.io`;
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//CloudPros//Training Cohorts//EN',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${timestamp}`,
            `DTSTART:${startStamp}`,
            `DTEND:${endStamp}`,
            `SUMMARY:${title}`,
            `DESCRIPTION:${details}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n');
        const dateSlug = start.toISOString().split('T')[0];
        return {
            google,
            outlook: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
            slug: `${slugify(course)}-${dateSlug}`,
        };
    };

    window.CloudPros.registerDates = (course, dates) => {
        if (!course) return;
        state.courseDates.set(course, dates);
    };

    window.CloudPros.setDefaultDates = (dates) => {
        state.defaultDates = dates || [];
    };

    const updateModalCalendarLinks = () => {
        if (!modalDate || !modalCalendarGoogle || !modalCalendarIcs) return;
        const selectedDate = modalDate.value;
        const courseName = modalCourse?.value || 'CloudPros Cohort';
        const links = window.CloudPros.getCalendarLinks(courseName, selectedDate);
        if (links) {
            modalCalendarGoogle.href = links.google;
            modalCalendarGoogle.classList.remove('is-disabled');
            modalCalendarGoogle.setAttribute('aria-disabled', 'false');
            modalCalendarIcs.href = links.outlook;
            modalCalendarIcs.download = `${links.slug}.ics`;
            modalCalendarIcs.classList.remove('is-disabled');
            modalCalendarIcs.setAttribute('aria-disabled', 'false');
        } else {
            modalCalendarGoogle.href = '#';
            modalCalendarGoogle.classList.add('is-disabled');
            modalCalendarGoogle.setAttribute('aria-disabled', 'true');
            modalCalendarIcs.href = '#';
            modalCalendarIcs.removeAttribute('download');
            modalCalendarIcs.classList.add('is-disabled');
            modalCalendarIcs.setAttribute('aria-disabled', 'true');
        }
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
        updateModalCalendarLinks();
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
                updateModalCalendarLinks();
            }, 1400);
        });

        modalDate?.addEventListener('change', updateModalCalendarLinks);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const storageKey = 'cloudpros-theme';
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

    const applyTheme = (theme) => {
        body.dataset.theme = theme;
        if (modeToggle) {
            modeToggle.setAttribute('data-mode', theme);
            const isLight = theme === 'light';
            modeToggle.setAttribute('aria-pressed', String(isLight));
            modeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }
    };

    const initialTheme = (() => {
        const stored = localStorage.getItem(storageKey);
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        return prefersLight.matches ? 'light' : 'dark';
    })();

    applyTheme(initialTheme);

    modeToggle?.addEventListener('click', () => {
        const nextTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem(storageKey, nextTheme);
    });

    prefersLight?.addEventListener('change', (event) => {
        const stored = localStorage.getItem(storageKey);
        if (stored) return;
        applyTheme(event.matches ? 'light' : 'dark');
    });
})();
