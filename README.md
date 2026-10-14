# Angel Beauty Center & Spa

A complete Arabic / RTL sales demonstration for the private Moroccan hammam proposal, created by **Kairo Dev**. Built with React 19, TypeScript, Vite, Motion and Lucide. No backend or credentials are needed.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite (normally `http://localhost:5173`).

```sh
npm run typecheck
npm run build
npm run preview
```

## Presentation routes

- `/` — cinematic customer experience, package builder, booking and gifts.
- `/?present=1` — seven-scene presentation with previous/next controls.
- `/owner-demo` — requests, package interest, reminder previews and revenue scenarios.
- `/owner-demo?present=1` — owner scene with presentation controls.
- `/#sanctuary`, `/#packages`, `/#enhancements`, `/#booking`, `/#gifts` — direct section links.

On the customer page, **وضع العرض** is also available in the footer. On the owner page, **ابدئي العرض** opens the presenter guide. **إعادة ضبط العرض** restores sample requests, message templates, selections and calculator defaults in this browser. It asks before deleting local demonstration requests. Nothing is sent or charged.

## Edit the business information

Edit `src/config/angel.ts`:

| Setting | Purpose |
| --- | --- |
| `name`, `location`, `logo` | Business identity. An empty logo uses a concept typographic mark, not an official logo. |
| `images` and `imageDisclaimer` | Central image URLs and conceptual-image disclosure. Place replacement files in `public/images`. |
| `whatsapp` | Leave empty until the owner approves a destination. Set international digits without `+`, spaces or separators to enable WhatsApp handoff. |
| `packages` | Names, copy, sample prices, durations, inclusions and selectable status. `enabled: false` prevents selection of the unconfirmed two-person concept. |
| `addons` | Names, estimates, additional minutes and `includedIn` package IDs to prevent charging for an included treatment. |
| `giftOffers` | Package IDs available in gift previews. |
| `depositRate` | Suggested deposit fraction; `.25` means 25%. This only changes a preview. |
| `preferredTimes` | Example preferred windows, not appointment inventory. |
| `reminderTemplates` | Editable template defaults. Variables: `{name}`, `{date}`, `{time}`. |
| `socialLinks` | Reserved approved profile URLs. No social links are rendered until deliberately added to the UI. |

All amounts use EGP. The example packages, durations, inclusions, prices and images are **unverified concepts**. Do not remove the demonstration disclosures before confirming business details and connecting actual services.

Brand colors, typography, responsive rules and printable voucher styles live in `src/styles.css`. Font loading uses Google Fonts with system fallbacks; self-host the approved font files for production if desired. Layouts respect reduced motion.

## Working demonstrations

- Package comparison, selection, optional enhancements, included-service protection, live price and duration totals.
- Six-stage request flow: package, custom calendar, preferred time, validated contact details, review/deposit concept, message and saved local request.
- Egyptian phone validation accepts local and international formats, including Arabic numerals.
- Arabic WhatsApp message generation, clipboard copy and conditional external link when an approved destination is configured. No automatic sending.
- Suggested deposit and balance preview; **no card fields, payments or fake transactions**.
- Personalized gift voucher, three designs, print and browser “Save as PDF”. Vouchers are permanently labeled as demo / non-redeemable.
- Requests in localStorage, status changes, filtering and separate sample-versus-local indicators.
- Package-interest counts, local average value and add-on selection rate, calculated from demonstration requests.
- Editable and locally saved reminder templates; preview only, no messages delivered.
- Interactive revenue, gross profit and incremental-cost scenarios, including lower conversion outcomes and optional margin.
- Responsive navigation, dialog keyboard handling, focus states, presentation controls and local reset.

Data is stored under `angel-demo-requests-v1` and `angel-reminders-v1`. There is no server synchronization, authentication or secure administration. Use invented contact details during presentations. Private browsing or blocked storage can prevent saving; the UI reports failures.

## Revenue assumptions

`bookings = monthly inquiries × conversion rate / 100`

`incremental revenue = (target bookings − current bookings) × average package value`

`incremental gross profit = incremental revenue × gross margin / 100`

`after incremental costs = incremental gross profit − additional monthly operating costs`

Example defaults: 120 inquiries, 25% current conversion, 40% target, EGP 1,450 package value, 60% gross margin, EGP 1,500 additional costs → 18 additional bookings, EGP 26,100 additional revenue, EGP 15,660 incremental gross profit, EGP 14,160 after the specified incremental costs. These are hypothetical expected values, not actual results or accounting net profit. The calculator intentionally allows a target below the current conversion rate.

## Deploy to Vercel

1. Put this project in a GitHub, GitLab or Bitbucket repository and import it into Vercel.
2. Select **Vite**, leave the project root as the repository root, use `npm run build`, and output directory `dist`.
3. No environment variables are required. Deploy.
4. Check `/`, `/?present=1` and `/owner-demo` on the deployment. `vercel.json` supplies SPA rewrites for direct navigation.

Alternatively, run `npx vercel` from this directory and follow Vercel's account prompts. A production build is available in `dist` after `npm run build`. This task prepares the project; it does not publish to a Vercel account.

## Before production: ask Angel for

1. Authorized photos of the actual entrance, hammam, relaxation space and treatment details; official logo and approved branding.
2. Approved packages, prices, durations, add-ons and which services are already included.
3. Private-suite capacity and whether two-person experiences are operationally possible.
4. Opening days, staffing, availability rules, booking buffers and confirmation process.
5. Verified WhatsApp number, exact address, map and approved social profiles.
6. Deposit amount, cancellation / refund terms, gift validity and redemption policy.
7. Approved privacy notice, retention rules and consent wording for any actual customer messaging.

Actual deployment needs backend storage, secure staff authentication and access controls, real availability/booking management, authorized WhatsApp messaging, a suitable approved payment provider with verified webhooks, voucher issuance/redemption and operational monitoring. The UI currently demonstrates these commercial ideas honestly without pretending those integrations exist.

## Browser validation

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright starts/reuses a Vite server on port 5173. Tests cover booking and input errors, upgrades, clipboard message, browser persistence, owner status/filtering, personalized gift designs, a printable voucher PDF, calculator arithmetic, saved reminder templates, reset, mobile navigation and overflow/image checks at 1440, 768, 390 and 360px. Screenshots and the generated voucher PDF go in ignored `test-results/`. Run the tests before presenting if the business configuration changes.

## Images

The two images in `public/images` were created with the built-in Imagegen tool and optimized to WebP. They are **concept imagery, not photographs of Angel's rooms**. Generation briefs are preserved in `docs/image-prompts.md`; no third-party spa photography is used. The decorative wordmark and gift art are also design concepts.

The Egyptian Arabic 60–90 second owner walkthrough is in `docs/presentation-ar.md`.
