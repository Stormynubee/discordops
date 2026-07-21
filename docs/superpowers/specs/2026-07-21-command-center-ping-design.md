# Command Center unread ping

## Goal

Replace the passive "Click a channel. Try it." hint below the Discord Command Center with a short, Discord-native interaction that makes visitors curious enough to click a channel.

## Interaction

When the Command Center enters the viewport, an unread dot appears beside one channel and a compact notice slides into view:

> You have 1 unread channel. Extremely serious business.

The highlighted channel nudges once. The animation then rests instead of looping.

The first time the visitor hovers the Command Center on desktop, or taps it on a touch device, a quiet Discord-style ping plays. This user gesture avoids browser autoplay blocking. The sound plays once per page load.

Clicking any channel:

- clears the unread prompt and dot;
- changes the footer hint to "Good choice. The buttons work.";
- keeps the existing channel-switch animation.

Before interaction, the footer hint reads:

> Open it before the mods do.

## Motion and accessibility

- Animate only `transform` and `opacity`.
- Use one short spring for the notice entrance and one horizontal nudge for the channel.
- Do not loop the notice or channel animation.
- Under `prefers-reduced-motion`, render the notice immediately without movement.
- The ping remains gesture-triggered and quiet. It never loops.

## Implementation boundaries

- Keep the behavior inside `src/components/DiscordMockup.tsx`.
- Add a small local state machine for `idle`, `prompted`, and `used`.
- Add the ping as a small public audio asset, generated locally or stored under `public/`.
- Do not add dependencies.
- Do not change the existing channel data, sticker posts, mascot behavior, or layout.

## Verification

- The prompt appears once when the Command Center enters view.
- Hovering or tapping the Command Center plays one ping and never repeats.
- Clicking any channel dismisses the prompt.
- Reduced-motion mode has no entrance or nudge animation.
- The production build passes.
