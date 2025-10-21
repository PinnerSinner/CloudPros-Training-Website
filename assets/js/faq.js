(() => {
    document.querySelectorAll('.faq-item').forEach((item) => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach((openItem) => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.toggle('open', !isOpen);
            question.setAttribute('aria-expanded', String(!isOpen));
            if (!isOpen) {
                answer?.setAttribute('aria-hidden', 'false');
            } else {
                answer?.setAttribute('aria-hidden', 'true');
            }
        });
    });
})();
