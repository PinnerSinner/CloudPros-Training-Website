(() => {
    const grid = document.querySelector('[data-course-grid]');
    const cards = grid ? Array.from(grid.children) : [];
    const searchInput = document.getElementById('searchCourses');
    const providerFilter = document.getElementById('providerFilter');
    const trackFilter = document.getElementById('trackFilter');
    const levelFilter = document.getElementById('levelFilter');
    const emptyState = document.querySelector('[data-empty]');
    const previewDrawer = document.querySelector('[data-preview-drawer]');
    const previewTitle = document.querySelector('[data-preview-title]');
    const previewDescription = document.querySelector('[data-preview-description]');
    const previewHighlights = document.querySelector('[data-preview-highlights]');
    const body = document.body;

    const courseDates = {
        'AWS Solutions Architect Sprint': ['July 8, 2024', 'August 12, 2024', 'September 9, 2024'],
        'Serverless Ops for AWS': ['July 15, 2024', 'August 19, 2024'],
        'Azure DevOps Accelerator': ['July 22, 2024', 'September 2, 2024'],
        'Azure AI Engineer Studio': ['August 5, 2024', 'September 16, 2024'],
        'GCP Data Engineering Studio': ['August 5, 2024', 'October 7, 2024'],
        'GCP Security Incident Lab': ['July 29, 2024', 'September 23, 2024'],
        'Cloud Security Zero-to-Hero': ['August 19, 2024', 'October 14, 2024'],
        'Multi-Cloud FinOps Leadership': ['September 2, 2024', 'November 4, 2024'],
        'Cloud Foundations Flight School': ['July 1, 2024', 'August 26, 2024'],
        'General Inquiry': ['Choose custom schedule'],
    };

    if (window.CloudPros) {
        Object.entries(courseDates).forEach(([name, dates]) => window.CloudPros.registerDates(name, dates));
    }

    const applyFilters = () => {
        const searchTerm = searchInput?.value.toLowerCase().trim() ?? '';
        const provider = providerFilter?.value ?? 'all';
        const track = trackFilter?.value ?? 'all';
        const level = levelFilter?.value ?? 'all';
        let visibleCount = 0;

        cards.forEach((card) => {
            const matchesSearch = searchTerm
                ? card.textContent.toLowerCase().includes(searchTerm)
                : true;
            const matchesProvider = provider === 'all' || card.dataset.provider === provider;
            const matchesTrack = track === 'all' || card.dataset.track === track;
            const matchesLevel = level === 'all' || card.dataset.level === level;
            const isVisible = matchesSearch && matchesProvider && matchesTrack && matchesLevel;
            card.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount += 1;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    };

    searchInput?.addEventListener('input', applyFilters);
    providerFilter?.addEventListener('change', applyFilters);
    trackFilter?.addEventListener('change', applyFilters);
    levelFilter?.addEventListener('change', applyFilters);

    applyFilters();

    const openPreview = (card) => {
        if (!previewDrawer || !card) return;
        const title = card.querySelector('h2')?.textContent?.trim() ?? '';
        const description = card.querySelector('p')?.textContent?.trim() ?? '';
        const highlights = Array.from(card.querySelectorAll('ul li')).map((item) => item.textContent.trim());
        if (previewTitle) previewTitle.textContent = title;
        if (previewDescription) previewDescription.textContent = description;
        if (previewHighlights) {
            previewHighlights.innerHTML = '';
            highlights.forEach((highlight) => {
                const li = document.createElement('li');
                li.textContent = highlight;
                previewHighlights.append(li);
            });
        }
        previewDrawer.classList.add('open');
        body.style.overflow = 'hidden';
    };

    const closePreview = () => {
        if (!previewDrawer) return;
        previewDrawer.classList.remove('open');
        body.style.overflow = '';
    };

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.matches('[data-preview]')) {
            const card = target.closest('.course-card');
            openPreview(card);
        }
        if (target.matches('[data-close-preview]')) {
            closePreview();
        }
    });

    previewDrawer?.addEventListener('click', (event) => {
        if (event.target === previewDrawer) {
            closePreview();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closePreview();
        }
    });
})();
