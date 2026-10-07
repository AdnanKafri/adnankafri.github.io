# Verification — October 8, 2026

## Real-browser coverage

Tested with Playwright and installed Google Chrome 155.0.8059.39 in headless mode, using an isolated browser context.

- Eight combinations: English/Arabic × dark/light × 1440×1000 desktop / 390×844 mobile emulation.
- Captured hero, Education, Skills, Experience, Contact, and full-page screenshots for each combination. Visually reviewed representative captures across languages, themes, and widths, with particular attention to Education and the new logo.
- Education value and label columns have identical horizontal coordinates across all three rows, with consistent value font size/line height. Arabic aligns to the right/start edge; English to the left/start edge.
- No JavaScript page errors or document-level horizontal overflow in the matrix. Additional checks at 320, 360, 768, and 1024 pixels passed after fixing narrow-screen mesh overflow.
- Actual display fonts loaded successfully in all eight cases.
- Axe WCAG 2 A/AA, 2.1 AA, and 2.2 AA automated checks reported zero violations in all eight cases, including rendered color contrast. Automated results do not establish complete accessibility conformance.

## Interaction checks

- Real GSAP, ScrollTrigger, and Lenis initialization; profile request typing and valid JSON; pause/resume; reduced-motion behavior.
- Native command dialog opening, section navigation, focus placement, Tab/Shift+Tab containment, Escape, and WhatsApp search.
- Clipboard email copy in a secure localhost context, theme/language persistence, preservation of form text when switching languages, mobile navigation, and project expansion.
- Empty form and malformed email produce inline errors before either contact action can proceed.
- WhatsApp opens the exact `wa.me/963952749458` destination. Tests decoded both English and Arabic drafts, including names, email addresses, project text, and `%0A` line breaks. The form link uses `target="_blank"` and `rel="noopener noreferrer"`.
- WhatsApp test requests were intercepted locally. No test messages were sent or transmitted to WhatsApp.
- JavaScript syntax checks passed. No references to the old wordmark/favicon remain in the deployed sources. Supplied portrait retained; all generated logo files and icon sizes verified.

## Evidence

Workspace files: `qa/browser-report.json`, `qa/interaction-report.json`, and `qa/screenshots/`. Section-only captures temporarily hide fixed navigation/progress overlays to avoid tall-screenshot artifacts; hero and full-page captures retain the real interface.

## Remaining untested

- Safari and Firefox engines; physical iPhone/Android touch behavior and device performance.
- Actual WhatsApp mobile/Web/Desktop handoff or sending, and opening/sending from a configured email application. Draft generation and link output were verified; external delivery was not attempted.
- Production hosting, canonical-domain configuration, search indexing, and social-network preview caches. These depend on the final deployment URL.
- Hardware-level 60fps performance profiling and a manual screen-reader audit.

The site remains buildless; the test dependencies are outside the deployment files.
