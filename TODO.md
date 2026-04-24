# Portfolio 3D Model Integration — Full Update Plan

## Overview
Integrate scroll-driven 3D models into every portfolio section while preserving all existing data/content and ensuring maximum smoothness/performance.

## Performance Targets
- First Contentful Paint < 1.5s
- 60fps scroll throughout
- Canvas only renders when section is in viewport
- DPR capped to [1, 1.2] for background scenes
- Geometry resolution reduced where possible

---

## Phase 1: Performance Foundation (Shared Infrastructure)

- [x] 1.1 Read all existing files (complete)
- [x] 1.2 SectionCanvas.jsx already exists — viewport-optimized R3F wrapper
- [x] 1.3 section3d/index.js barrel export partially exists

## Phase 2: Section 3D Background Components

- [x] 2.1 About3D.jsx — Already exists (gold floating geometry)
- [ ] 2.2 Skills3D.jsx — Orbiting colored spheres representing tech categories
- [ ] 2.3 Process3D.jsx — 4 connected pipeline nodes with flowing particles
- [ ] 2.4 GitHub3D.jsx — 3D contribution bar grid pulsing with activity
- [ ] 2.5 Stats3D.jsx — 4 rising geometric pillars that grow on scroll
- [ ] 2.6 Projects3D.jsx — 3 stacked architecture blocks / server layers
- [ ] 2.7 Experience3D.jsx — Curved timeline path with glowing milestone nodes
- [ ] 2.8 Testimonials3D.jsx — Floating spheres with elegant ring halos
- [ ] 2.9 Contact3D.jsx — Expanding signal/communication rings

## Phase 3: Update EditorialLayout & All Sections

- [ ] 3.1 Update EditorialLayout.jsx SectionLayout to accept optional bg3d prop
- [ ] 3.2 Wire each section component to pass its matching 3D background

## Phase 4: Optimize Existing 3D Components

- [ ] 4.1 ScrollModel.jsx — Reduce torusKnot resolution, lower fragment count
- [ ] 4.2 ScrollModel2.jsx — Reduce helix particles (32→20), sphere segments
- [ ] 4.3 ScrollModel3.jsx — Reduce orbit ring segments
- [ ] 4.4 HeroNetworkCanvas.jsx — Reduce satellite count (16→10)
- [ ] 4.5 scrollEngine.js — Pause rAF when tab hidden

## Phase 5: Global Optimizations

- [ ] 5.1 index.css — Add content-visibility: auto to sections
- [ ] 5.2 TechStack.jsx — Fix stray \n syntax artifact

## Phase 6: Build & Verify

- [ ] 6.1 Run npm run build — verify no errors
- [ ] 6.2 Test scroll performance
- [ ] 6.3 Verify all sections render correctly with 3D backgrounds

