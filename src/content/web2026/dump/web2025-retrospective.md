# web2025 Retrospective → web2026 Decision Log

*Internal planning document. Not routed on the course site (lives in `dump/`). Written July 2026, ahead of web2026 (starts Mon, Jul 20 2026).*

---

## 1. Method & sources

- **Course content:** all day pages, slides, assignments, and appendix files in `src/content/web2025/`.
- **Student feedback:** the day-by-day dev notes repo (`web2025-dev-notes`), covering Days 1–4, 6–9, 11–12. **Caveat: notes for Days 5, 10, and 13–15 are missing**, so the tail of project week is reconstructed from Day 12 trajectories, not observed.
- **Instructor observations:** embedded in the day-5 reflection, day pages, and the snippet dump.
- **Timing signal:** comment timestamps on dev notes — 48% posted 6pm–midnight, 35% after midnight, only ~6% midday.

Class of 18, mixed creative backgrounds (painters, writers, crafters, 3D modelers), mostly complete beginners.

---

## 2. What worked (protect these)

1. **CSS games.** CSS Diner ("pure dopamine dose!"), Flexbox Froggy, Grid Garden. Gamification removed the shame from not-knowing; students *revisited* the games on their own when stuck. Keep all three; keep them early in each concept's arc.
2. **The ugly site ("Hey Jude").** "The idea of making the worst (ugly) website as a beginner is great… whatever we'll create further on will somehow be better." It killed perfectionism on day two and made experimentation the default mode. Untouchable.
3. **Personally chosen content.** Students picking their own Andersen story drove real engagement: "Seeing my own designed website (wip) come to life was a huge confidence booster… Today felt like a milestone."
4. **Day 7 (IndieWeb / manifesto day).** The single biggest energy spike of the course. "It's better to have a messy but personal space than to depend on digital giants." The garden metaphor out-performed the portfolio metaphor everywhere it appeared. A no-code day mid-course was restorative, not a loss.
5. **Deployment moments.** The first live Netlify URL was a thrill and a public milestone; sharing links created accountability and celebration.
6. **Peer debugging culture.** "No gatekeeping in this class, love that." Emerged organically; worth ritualizing.
7. **Design-tokens day (Day 9).** CSS variables + a shared `:root` format felt grounding and produced genuinely diverse, personal palettes and type choices.
8. **Teaching how to ask an LLM well.** Students explicitly thanked the instructor for it ("Thank you so much for teaching AI2HTML"). One noted she "learned how to communicate differently with GPT to get better and accurate coding solutions."

---

## 3. What struggled (fix these)

1. **Astro arrived too late.** Introduced Day 10; project week started Day 11. Students got ~3 build days on a framework they'd known for one.
   - "It was kind of difficult to understand the astro system when I started it again from a blank file. And I was very close to go back to vanilla HTML." (Day 12)
   - One student spent an entire project day only experimenting with Astro, building nothing.
   - One switched to vanilla HTML mid-project.
   - Best self-reported outcome across the class: "I figured it out a little."
   - Vanilla-HTML students moved faster and finished stronger. Nobody left able to carry Astro forward — the exact opposite of the intent.
2. **Images and file paths.** Roughly half the class lost multi-hour blocks to: images working locally but 404ing on Netlify, case-sensitivity (`Photo.JPG` vs `photo.jpg`), relative-path confusion, sizing/cropping/z-index. There was **no dedicated lesson** for any of this.
3. **Git/GitHub felt abstract and landed at the worst time.** Forking/pushing introduced during the Day 6 cognitive peak; several students hit walls that needed instructor rescue. It read as "computer science homework," not "saving my work."
4. **Semantic HTML had no anchors.** `<section>` / `<article>` / `<aside>` didn't stick. Direct request from a student: "more tangible examples… I like to imagine these entities and associate them with real life objects."
5. **Grid math.** "It's look easy, but doing it really fried my brain." `fr` units and implicit/explicit grids taught before students had a spatial vocabulary for them.
6. **Blank-page paralysis + niche paralysis.** Project Day 1: "Getting started is the hardest part." Day 7–8: "i just.could.not.pick.one.damn.niche." The course gave inspiration but no anti-paralysis machinery.
7. **The code-along life jacket.** "As soon as we are asked to do something of our own… I feel like that life jacket has been taken away." Independence was never explicitly scaffolded; it was assumed.
8. **Sleep.** 35% of dev-note activity after midnight. Assignments implicitly due "tonight," Saturdays carried homework, and ambition compounded. Productive energy, but it was burning students by Week 2.
9. **Positioning.** `position: absolute/relative` pulled forward by student ambition on Day 4, then consumed disproportionate debugging time all course.

---

## 4. What was missing entirely

- **Icebreakers / warm-ups** — no day had a documented opener; classes cold-started into content.
- **Slide decks for Days 4, 5, 8, 9, 10** — half the teaching days ran without decks.
- **A dedicated image-handling lesson** (see §3.2).
- **A CSS property reference** — students kept meeting untaught properties (`mix-blend-mode`, `filter`, `transform`) with no map of what's core vs. exotic.
- **Days 13–15 records** — no notes, so no evidence of how the final push actually went.

---

## 5. Decision log: finding → web2026 change

| # | 2025 finding | 2026 decision |
|---|---|---|
| 1 | Astro too late; not carried forward | **Thread Astro through Week 2.** Terminal + Astro on Day 6; every Week 2 exercise lives inside an Astro project; the mini-project ships as a two-page Astro site (Day 8); personal-site repo is deployed on Day 10 — *before* the sprint. Starter reworked into a staged tutorial shaped like a mini personal site. |
| 2 | Images/paths = biggest silent time-sink | Day 3 "break it on purpose" file-paths lab (case sensitivity, 404 forensics); Day 4 image half-day (`object-fit`, `figure`/alt, compression, file hygiene); Day 6 covers Astro `public/` vs `src/`; Day 13 image-audit checklist. |
| 3 | Git abstract, badly timed | "Save-game checkpoint" ritual from Day 2 (GitHub Desktop fine); commit+push closes *every* class; CLI git arrives Day 6 with the terminal; the 2025 git deck is carved into three 5-slide "git minutes" (D2, D3, D6). No monolithic Git lecture. |
| 4 | Semantic HTML unanchored | Day 2 rebuilt around "HTML is a home" + labeling a printed newspaper (masthead/byline/lede → tags). |
| 5 | Grid math fried brains | `grid-template-areas` (names) taught **first**; `fr` last, as "the leftover-space unit." |
| 6 | Blank-page + niche paralysis | Mini-project reply letter (Day 7) becomes seed content for the personal site; Day 10 kickoff deploys the site *before any design exists*; content inventory homework = words before code. |
| 7 | Code-along dependence | Every code-along ends with a timed "now-you" sibling task; solo blocks ramp 10 → 20 → 40 min → full days; "stuck protocol" poster from Day 3 (error aloud → rubber duck → docs → neighbor → instructor/LLM with a well-formed question). |
| 8 | Sleep deprivation | Assignments due at *start of class*; Saturdays low/no homework; 90-minute time-box rule ("a stuck-note counts as done"); Day 14 midday content freeze — no showcase-eve all-nighter. |
| 9 | Positioning/floats overweight | Floats: historical mention only. Absolute positioning: "ask before you absolute." Time reinvested in images and typography. |
| 10 | No icebreakers | Every teaching day opens with a 5–10 min warm-up that foreshadows the day; project week ritual = standup + "bug of the day" show-and-tell. |
| 11 | Five days without decks | Every teaching day gets a deck in 2026. |
| 12 | LLM coaching ad-hoc but loved | AI policy gains an "Asking better questions" section; LLM is step 5 of the stuck protocol. |
| 13 | Mid-project theme reuse | Same proven typeset-a-text arc, new material: **"Letters to a Young Designer"** — typeset a public-domain letter, then write and typeset your reply to a stranger who finds your site. Two pages ⇒ first real multi-page routing in Astro; the reply feeds the personal site. |
| 14 | Figma used informally in 2025 | Formal **Figma guest lecture** slotted Day 9 afternoon, between visual hierarchy and design systems — exactly where low-fi → mid-fi handoff happens. |

**Kept as-is:** ugly-sites arc, indie-web/manifesto day, CSS games, anthology + critique ritual, dev notes on GitHub issues, showcase gallery, "ship your draft" ethos, 2+ pages / real content / live-on-Netlify final requirements.

---

## 6. The 2026 calendar

| Week | Days | Dates |
|---|---|---|
| 1 — Foundations | D1–D6 | Mon Jul 20 – Sat Jul 25 |
| 2 — Building with Astro | D7–D12 | Mon Jul 27 – Sat Aug 1 |
| 3 — Ship | D13–D15 | Mon Aug 3 – Wed Aug 5 |

Teaching days D1–D10 · project sprint D11–D14 (Fri, Sat, Mon, Tue) · showcase D15 (Wed Aug 5).

2025 nominally had ~7 project days but students burned 1–2 of them learning Astro cold and several more re-learning paths/images. 2026 trades raw sprint days for preparedness: the repo exists, is deployed, and is token-themed before the sprint begins.

---

## 7. Risks & watch items

1. **Day 6 is a Saturday and carries the terminal + Astro jump.** Mitigations: no homework that night, the day is hands-on rather than lecture-heavy, and the letter migration gives an immediate payoff. Watch energy; be ready to push the quiz to D7 morning.
2. **4.5 sprint days is tight.** Mitigation: content is drafted (D7 reply, D10 inventory) and infrastructure is live before D11. If a student is behind on Astro by D10, the vanilla escape hatch still exists — but it should now be the exception.
3. **Guest lecture is a scheduling dependency.** If the Figma guest moves, D9 morning (hierarchy + critique) stands alone and the guest can swap with D10 afternoon kickoff — kickoff must not slip past D10.
4. **Letters theme depends on students finding a letter that resonates.** Mitigation: curated menu of 10+ letters in the assignment, but allow any public-domain letter with instructor sign-off.
5. **Threading Astro earlier means Week 1 must stay vanilla and light.** Resist the temptation to mention frameworks before D6; the 2025 notes show cognitive load was already at ceiling in Week 1.
