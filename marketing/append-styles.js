const fs = require('fs');
const css = \

/* --- PREMIUM MANIFESTO BLOCKS --- */
.page-about .source-sections article:first-child,
.page-how-it-works .source-sections article:first-child,
.page-pricing .source-sections article:first-child,
.page-teams .source-sections article:first-child {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: end;
  gap: 60px;
  padding: 80px 70px !important;
  background: linear-gradient(135deg, #071d3c 0%, #102d4f 100%) !important;
  border: 1px solid rgba(196, 161, 90, 0.2) !important;
  border-radius: 12px;
  box-shadow: 0 40px 80px rgba(7,29,60,0.2), inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

/* Hide the pseudo-element 01 number */
.page-about .source-sections article:first-child::before,
.page-how-it-works .source-sections article:first-child::before,
.page-pricing .source-sections article:first-child::before,
.page-teams .source-sections article:first-child::before {
  display: none !important;
}

/* Hide the actual span.section-number */
.page-about .source-sections article:first-child .section-number,
.page-how-it-works .source-sections article:first-child .section-number,
.page-pricing .source-sections article:first-child .section-number,
.page-teams .source-sections article:first-child .section-number {
  display: none !important;
}

/* Headline typography */
.page-about .source-sections article:first-child h3,
.page-how-it-works .source-sections article:first-child h3,
.page-pricing .source-sections article:first-child h3,
.page-teams .source-sections article:first-child h3 {
  font-size: clamp(42px, 4.5vw, 62px) !important;
  line-height: 1.05 !important;
  letter-spacing: -0.03em;
  color: #fff !important;
  margin: 0 !important;
  max-width: none !important;
  grid-column: 1;
  background: linear-gradient(180deg, #ffffff 0%, #c4d1dd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 2;
  position: relative;
}

/* Supporting paragraph typography */
.page-about .source-sections article:first-child p,
.page-how-it-works .source-sections article:first-child p,
.page-pricing .source-sections article:first-child p,
.page-teams .source-sections article:first-child p {
  font-size: 21px !important;
  line-height: 1.6 !important;
  color: #c4a15a !important;
  margin: 0 !important;
  grid-column: 2;
  position: relative;
  padding-left: 30px;
  border-left: 2px solid rgba(196, 161, 90, 0.3);
  z-index: 2;
}

/* Subtle gold glow */
.page-about .source-sections article:first-child::after,
.page-how-it-works .source-sections article:first-child::after,
.page-pricing .source-sections article:first-child::after,
.page-teams .source-sections article:first-child::after {
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;
  width: 70%;
  height: 150%;
  background: radial-gradient(circle, rgba(196,161,90,0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

@media(max-width: 900px) {
  .page-about .source-sections article:first-child,
  .page-how-it-works .source-sections article:first-child,
  .page-pricing .source-sections article:first-child,
  .page-teams .source-sections article:first-child {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 50px 30px !important;
  }
  .page-about .source-sections article:first-child p,
  .page-how-it-works .source-sections article:first-child p,
  .page-pricing .source-sections article:first-child p,
  .page-teams .source-sections article:first-child p {
    grid-column: 1;
    padding-left: 0;
    border-left: none;
    padding-top: 20px;
    border-top: 2px solid rgba(196, 161, 90, 0.3);
  }
}
\;
fs.appendFileSync('src/premium-pages.css', css);

