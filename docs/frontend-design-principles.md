# Frontend design principles for the Live Lab

This note records the criteria used to avoid generic AI-generated frontend patterns.

## Problems removed

- Decorative operational labels that do not communicate real state (`LIVE`, arbitrary sequence numbers, synthetic signal counters).
- Excessive uppercase monospace microcopy used to imitate a control room.
- Glows, radial gradients, and animation without a functional purpose.
- A centered fixed-width canvas that leaves large desktop margins.
- Repetitive equal cards that flatten information hierarchy.
- Oversized marketing language without enough specific, human context.

## Applied principles

1. **Every visible element must carry information or enable an action.** Decorative system status was removed.
2. **Use a restrained typographic system.** DM Sans carries content; Space Mono is limited to genuine metadata.
3. **Build hierarchy with scale, contrast, and grouping.** Section introductions now pair one clear heading with one explanation.
4. **Use the viewport while protecting readable line length.** Sections span the desktop; prose remains locally constrained.
5. **Prefer editorial variation over repeated components.** Project cards use an asymmetric twelve-column composition.
6. **Keep motion and effects subordinate to meaning.** Glows and fake pulses were removed; interaction feedback is simple contrast.
7. **Preserve accessibility.** Fluid `clamp()` sizing has upper and lower bounds, responsive breakpoints remain explicit, and reduced-motion preferences are respected.

## References

- Nielsen Norman Group, “Good Visual Design, Explained”: https://www.nngroup.com/articles/good-visual-design/
- Nielsen Norman Group, “Visual Hierarchy in UX”: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- Nielsen Norman Group, “The Characteristics of Minimalism in Web Design”: https://www.nngroup.com/articles/characteristics-minimalism/
- web.dev, “Responsive web design basics”: https://web.dev/articles/responsive-web-design-basics
- web.dev, “CSS min(), max(), and clamp()”: https://web.dev/articles/min-max-clamp
- web.dev, “Typography”: https://web.dev/learn/design/typography/

The goal is not minimalism for its own sake. The goal is a specific, authored interface whose visual language follows the work rather than imitating a generic futuristic dashboard.

## Generated visual assets

The Material Study images were generated on 2026-08-20 with OpenAI `gpt-image-2-low`, then reviewed for the absence of readable text, logos, people, and generic futuristic UI imagery. They are stored as optimized WebP files and used as editorial material studies rather than evidence of physical prototypes.
