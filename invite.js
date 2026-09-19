(() => {
  const config = window.INVITATION || {};
  const form = document.getElementById('rsvp-form');
  const status = document.getElementById('status');
  const button = document.getElementById('send');
  const fields = document.getElementById('guest-fields');
  for (const key of ['location','address']) if(config[key]) document.getElementById(key).textContent = config[key];
  try { const u = new URL(config.registryUrl); if(u.protocol === 'https:') { const a = document.getElementById('registry'); a.href=u.href; a.hidden=false; } } catch {}
  function toggleGuests() {
    const yes = form.elements.attendance.value === 'yes';
    fields.hidden = !yes;
    fields.querySelectorAll('input,textarea').forEach(el => el.disabled = !yes);
    form.elements.adults.required = yes;
    form.elements.children.required = yes;
  }
  form.querySelectorAll('[name=attendance]').forEach(radio => radio.addEventListener('change', toggleGuests));
  toggleGuests();
  const configured = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(config.endpoint || '');
  if(!configured) {button.disabled=true; status.textContent='RSVP opens soon. Please check back or Contact Host Lakshmi Kannan at +1-510-953-1593.';}
  let inFlight = false;
  // Retain the same ID after an uncertain network result, preventing duplicate rows on retry.
  let pending = null;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if(inFlight || !configured || !form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const signature = JSON.stringify(values);
    if(!pending || pending.signature !== signature) pending={signature, id:crypto.randomUUID()};
    const payload = {...values, requestId:pending.id};
    inFlight=true; button.disabled=true; button.textContent='Sending…'; status.textContent='Saving your response…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(config.endpoint, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload), redirect:'follow', credentials:'omit', signal:controller.signal});
      if(!response.ok) throw new Error('network');
      const result = await response.json();
      if(!result.ok) {status.textContent=result.error || 'Your response was not saved. Please check your details and try again.'; return;}
      status.textContent=payload.attendance === 'yes' ? 'You’re on the list! Your RSVP has been saved. We can’t wait to celebrate with you.' : 'Thank you for letting us know. Your response has been saved. You’ll be missed!';
      button.textContent='RSVP saved';
      form.querySelectorAll('input,select,textarea').forEach(el => el.disabled=true);
      form.dataset.saved='true'; pending=null;
    } catch {
      status.textContent='We couldn’t confirm your RSVP. Please retry with the same details, or Contact Host Lakshmi Kannan at +1-510-953-1593 to check whether it arrived.';
    } finally {
      clearTimeout(timer); inFlight=false;
      if(!form.dataset.saved) {button.disabled=false; button.textContent='Send my RSVP';}
    }
  });
})();
