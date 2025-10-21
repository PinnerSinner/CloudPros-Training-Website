(() => {
    const track = document.querySelector('[data-carousel-track]');
    const prevBtn = document.querySelector('.carousel__control--prev');
    const nextBtn = document.querySelector('.carousel__control--next');
    const cards = track ? Array.from(track.children) : [];

    if (cards.length) {
        const cohortDates = cards.map((card) => {
            const dateText = card.querySelector('.cohort-card__date')?.textContent?.trim();
            return dateText || card.getAttribute('data-date');
        });
        if (window.CloudPros) {
            window.CloudPros.setDefaultDates(cohortDates);
            cards.forEach((card) => {
                const title = card.querySelector('h3')?.textContent?.trim();
                const dateText = card.querySelector('.cohort-card__date')?.textContent?.trim();
                if (title && dateText) {
                    window.CloudPros.registerDates(title, [dateText]);
                }
            });
        }
    }

    const scrollCarousel = (direction = 1) => {
        if (!track) return;
        const cardWidth = track.firstElementChild?.getBoundingClientRect().width || 260;
        track.scrollBy({ left: direction * (cardWidth + 20), behavior: 'smooth' });
    };

    prevBtn?.addEventListener('click', () => scrollCarousel(-1));
    nextBtn?.addEventListener('click', () => scrollCarousel(1));

    if (track && cards.length > 1) {
        let autoScroll = setInterval(() => scrollCarousel(1), 5000);
        track.addEventListener('mouseenter', () => clearInterval(autoScroll));
        track.addEventListener('mouseleave', () => {
            autoScroll = setInterval(() => scrollCarousel(1), 5000);
        });
    }

    document.querySelectorAll('.info-toggle').forEach((button) => {
        const panelId = button.getAttribute('data-info');
        const panel = document.getElementById(`info-${panelId}`);
        button.addEventListener('click', () => {
            document.querySelectorAll('.info-panel').forEach((panelEl) => {
                if (panelEl !== panel) {
                    panelEl.classList.remove('open');
                }
            });
            panel?.classList.toggle('open');
        });
    });

    const canvas = document.getElementById('orbitCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const resize = () => {
            canvas.width = canvas.clientWidth * window.devicePixelRatio;
            canvas.height = canvas.clientHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        let animationId;
        const particles = Array.from({ length: 60 }, (_, index) => ({
            radius: 1.2 + Math.random() * 2,
            orbit: 40 + Math.random() * 120,
            speed: 0.005 + Math.random() * 0.01,
            angle: Math.random() * Math.PI * 2,
            hue: 180 + Math.random() * 120,
            delay: index * 15,
        }));

        const render = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            ctx.save();
            ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);
            particles.forEach((particle) => {
                particle.angle += particle.speed;
                const x = Math.cos(particle.angle) * particle.orbit;
                const y = Math.sin(particle.angle) * (particle.orbit * 0.55);
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.radius * 6);
                gradient.addColorStop(0, `hsla(${particle.hue}, 90%, 65%, 0.95)`);
                gradient.addColorStop(1, 'rgba(5, 3, 13, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, particle.radius * 4, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
            animationId = requestAnimationFrame(render);
        };

        resize();
        render();
        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationId);
            resize();
            render();
        });
    }
})();
