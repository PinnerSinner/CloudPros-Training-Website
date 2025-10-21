(() => {
    const contactForm = document.querySelector('.contact-form');
    const inlineForm = document.querySelector('.inline-form');

    contactForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const button = contactForm.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.textContent = 'Message sent!';
        }
        setTimeout(() => {
            contactForm.reset();
            if (button) {
                button.disabled = false;
                button.textContent = 'Send message';
            }
        }, 1500);
    });

    inlineForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const button = inlineForm.querySelector('button');
        if (button) {
            button.disabled = true;
            button.textContent = 'Subscribed';
        }
        setTimeout(() => {
            inlineForm.reset();
            if (button) {
                button.disabled = false;
                button.textContent = 'Subscribe';
            }
        }, 1500);
    });
})();
