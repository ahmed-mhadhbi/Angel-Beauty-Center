# Validation record — 14 October 2026

- Dependencies installed successfully; npm reported zero audit vulnerabilities at installation.
- `npm run typecheck`: passed.
- `npm run build`: passed. Vite emits the deployable application to `dist`.
- `npm run test:e2e`: eight Chromium tests passed, including complete desktop and 390px mobile booking journeys.
- Layout / route checks at 1440, 768, 390 and 360px: customer and owner routes loaded; no horizontal document overflow, missing images or browser runtime errors in the tested journeys.
- Browser screenshots inspected for desktop/mobile entrance, package sections, owner dashboard, gift preview and mobile booking review.
- Request creation, invalid phone/date/time handling, Arabic-number normalization, clipboard message copy, page-reload persistence, request filtering and status changes exercised.
- Gift names/messages/design changes and print action exercised. The actual browser-generated PDF was rendered and visually inspected as a single A5 page; print pagination was corrected during review.
- Revenue arithmetic checked against the expected default and modified scenarios; optional margin, saved reminder templates, presentation controls and reset exercised.
- React and React DOM were pinned to matching exact versions after the initial browser run exposed an incompatible dependency resolution.

The tests are repeatable with `npm run test:e2e`; screenshots and the voucher PDF are written to `test-results`. Test storage is isolated from the user's normal preview browser.

Not verified: real business offerings, official images/prices, appointment inventory, live WhatsApp delivery, actual payments, production staff security, cross-device storage, Safari or Firefox. Those integrations are deliberately absent from this frontend demonstration. No Vercel account deployment was made.
