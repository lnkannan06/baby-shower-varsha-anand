# Varsha & Anand — custom invitation with inline RSVP

A responsive HTML/CSS invitation. No image is needed, so nothing stretches or tilts. Guests complete the custom form on your page; Google Apps Script writes the response into your private Google Sheet. No Google Form is used.

## 1. Connect your Google Sheet
1. Create a blank Google Sheet in your personal Google account, named “Varsha & Anand RSVP”. Keep sharing Restricted.
2. From that Sheet, open Extensions → Apps Script.
3. Replace the sample code with the contents of `Google-Sheets-RSVP.gs`. Save.
4. Select `setup` in the function menu and click Run. Authorize your script to access your spreadsheet. This creates the RSVPs tab and stores its sheet ID privately in the script.
5. Choose Deploy → New deployment → select type Web app.
6. Set Execute as **Me**, and Who has access to **Anyone**. Deploy and copy the Web app URL ending in `/exec`. Workspace accounts may prohibit anonymous access; use a personal account if this option is unavailable.
7. Paste that URL between the quotes for `endpoint` in `config.js`.

## 2. Customize
In `config.js`, add the optional registry link and location/address text. The registry link is hidden when blank. Any address included on the website will be public. Date is October 31, 2026, 11 AM–3 PM Pacific; proposed RSVP deadline October 17. Change these directly in index.html if needed.

## 3. Publish on GitHub
Upload `index.html`, `style.css`, `envelope.js`, `config.js`, and `invite.js` into the root of your GitHub repository, replacing the earlier versions. Old invitation.png and Google Forms scripts are no longer used. No package installation or build is required.
In Settings → Pages choose Deploy from a branch → main → /(root) → Save. Use the actual published link GitHub provides.
Do not upload guest responses or spreadsheet exports to the public repository.

## 4. Test BEFORE sharing
- On the published page in a signed-out browser, submit a yes response with 2 adults and 1 child. Confirm a new row in the private RSVPs tab and success on the page.
- Submit a decline. Confirm zero adults/children in its row.
- Test on your phone and check the registry link.
- Delete test rows. Sum Adults and Children for attending households; review duplicate households before ordering food.
- Guests contact the host for changes after a confirmed response; there is no guest edit or login system.

## If submission fails
Open the /exec URL in a signed-out browser: it should return an RSVP service JSON message, not a login page. Check deployment access is Anyone and execution is Me; run setup if you skipped it. The frontend uses a simple text/plain POST and follows Google's redirect. It confirms success ONLY after reading the server's success reply. Network/browser restrictions can prevent confirmation even if a row was written; retry unchanged details to reuse the request ID and avoid a duplicate during the same page session, or ask the host to check the sheet. Reloading resets that request ID.
After changing Apps Script code, use Deploy → Manage deployments → Edit → New version → Deploy.

## Scope and validation
This is a small-event RSVP collector with server-side validation, formula escaping, a honeypot, serialized writes, and retry deduplication. The anonymous write endpoint is public; it is not a full anti-spam system. It does not expose guest records through GET. After the event, archive the web-app deployment to stop submissions. The date on the page is informational and does not automatically close RSVPs.
Local syntax and mocked server behavior are tested. Real Google authorization, anonymous deployment, and end-to-end submissions must be tested in your account before sharing.

Official references:
https://developers.google.com/apps-script/guides/web
https://developers.google.com/apps-script/guides/content
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Envelope design update
If you already connected Google Sheets, keep your configured `config.js` and your existing Apps Script deployment. Replace `index.html` and upload the new `style.css` and `envelope.js`; keep `invite.js` present. The RSVP backend has not changed in this update. Old images and va-monogram.svg are not used.

Tap the V&A seal to open the flap, release a short burst of moon/star confetti, and slide out the invitation. Turn the card to see the venue, time, optional attire palette, wishes note, registry (if configured), and RSVP. The back grows naturally to fit the form on mobile. A skip-animation link and reduced-motion support are included; inactive sides are hidden from keyboard and screen-reader navigation.

JavaScript syntax and mocked open/flip/return flows passed, including reduced motion. A browser download was blocked, so visual/mobile rendering has not been verified here. Before sharing, check opening and flipping on a phone and submit a test RSVP to your real Sheet.

## Sealed preview update
Replace index.html and style.css. Before opening, only a heart and “A little love, coming soon.” peek out of the envelope. Names, date, time, and all front-card details remain hidden until the opening animation finishes. The card flip and RSVP flow are unchanged.
