# Jake + Finn navbar hover animation

## Goal

Replace the current uncanny SVG Jake/Finn navbar gag with a reference-faithful Adventure Time stretch: Jake elongates under the nav on hover, Finn peeks only on Pricing, and nothing collides with the preview card.

## Decisions locked

- **Layout:** Layer cake — nav links → Finn peek → Jake strip → preview (no overlap).
- **Jake trigger:** Any desktop nav link hover.
- **Finn trigger:** Pricing hover only; peeks from above the Pricing label, not from Jake.
- **Art approach:** PNG caps cut from user reference images + CSS yellow stretch tube (Approach 1).
- **Audio:** Trimmed clip from the user-provided Jake stretch MP3 on Jake activate.

## Layout and stacking

Desktop nav only (`lg+`). Characters are `pointer-events-none` and `aria-hidden`.

Vertical order (top → bottom):

1. Nav link text / active underline (highest interactive z).
2. Finn peek (Pricing only), ~40–48px, anchored above the Pricing label.
3. Jake strip (~52px tall) in the gap under the nav pill, above the preview.
4. Preview card offset to roughly `top: calc(100% + 4rem)` so it clears Jake.

Jake is invisible when no nav item is hovered. On leave, he fades and collapses. Finn is fully hidden unless Pricing is hovered.

## Characters and motion

### Jake

- Assets: transparent `jake-head.png` and `jake-feet.png` under `public/stickers/adventure/`.
- Head must keep large white eyes with black pupils (matching references). No background boxes.
- Feet: hind legs, tail, open vertical edge toward the tube.
- Mid-body: solid `#F5C518` tube with black top/bottom outline only; flush with caps (no gaps).
- Anchor near the right (Pricing side); animate mid-body **width** leftward (~28px idle → ~240px full) over ~2.6s with a smooth ease.
- Play trimmed stretch SFX on activate; stop/reset on leave. Catch autoplay failures silently.

### Finn

- Separate transparent peek PNG (user Finn reference), not parented to Jake.
- Pricing only: spring peek above the label (~0.4s); exit quickly on leave.

### Accessibility

- Under `prefers-reduced-motion`: do not render Jake or Finn; keep normal previews only.

## Implementation boundaries

- Rebuild `src/components/JakeStretchRide.tsx` (Jake + exported Finn peek).
- Wire stacking and preview offset in `src/components/Navbar.tsx`.
- Replace/regenerate adventure stickers under `public/stickers/adventure/`; remove reliance on inline SVG faces that looked uncanny.
- No new npm dependencies.
- Do not change non-nav page sections for this work.

## Acceptance criteria

- No white/black rectangular backgrounds on character assets.
- Jake eyes are clearly white with pupils.
- Stretch reads as one continuous dog (no gaps between caps and tube).
- Jake sits under the nav pill and is fully on-screen (not clipped above the viewport).
- Preview never overlaps Jake or Finn.
- Finn peeks only on Pricing, from above the Pricing label.
- Jake appears on any nav hover and disappears on leave.
- Reduced-motion users see no characters.

## Out of scope

- Mobile nav character animation.
- Full PNG body tiling or video/sprite frame sequences.
- Changing pricing content, preview cloning logic, or site-wide theme tokens.
