(function () {
  const form = document.getElementById('contactForm');
  if (!form) return; // form only exists on contact.html

  const statusEl = document.getElementById('cfStatus');
  const submitBtn = document.getElementById('cfSubmit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic honeypot spam check
    if (form._gotcha && form._gotcha.value) return;

    const endpoint = form.getAttribute('action');
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
      statusEl.textContent = 'Form isn\'t connected yet — see setup note below.';
      statusEl.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        statusEl.textContent = "Thanks — your message is on its way. I'll reply by email soon.";
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        const msg = data && data.errors ? data.errors.map(err => err.message).join(', ') : null;
        statusEl.textContent = msg || 'Something went wrong sending that — please try again or email me directly.';
        statusEl.className = 'form-status error';
      }
    } catch (err) {
      statusEl.textContent = 'Network error — please try again or email me directly.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
})();
