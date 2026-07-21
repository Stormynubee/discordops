import { motion, useMotionTemplate, type MotionValue } from 'framer-motion'

const SKYLINE_ASPECT = 'xMidYMax meet'

/** Static faint skyline for decorative use */
export function GothamSkyline({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute bottom-0 left-0 w-full text-white/[0.045] ${className}`}
      viewBox="0 0 1440 220"
      preserveAspectRatio={SKYLINE_ASPECT}
      fill="currentColor"
    >
      <SkylinePaths />
    </svg>
  )
}

export function SkylinePaths() {
  return (
    <>
      {/* Ground line — all buildings sit on this */}
      <rect x="0" y="218" width="1440" height="2" opacity="0.4" />

      {/* Background layer — distant, shorter */}
      <g opacity="0.35">
        <path d="M0 218V140h28v-18h16v18h20V115h14v103H0z" />
        <path d="M120 218V125h20v-30h12v30h18V95h10v123H120z" />
        <path d="M220 218V150h40V110h14v40h24V130h16v88H220z" />
        <path d="M1180 218V130h44V95h16v35h28V115h14v103H1180z" />
        <path d="M1280 218V145h36V120h14v25h22V135h12v83H1280z" />
        <path d="M1360 218V155h32V135h12v20h20v-25h10v45H1360z" />
      </g>

      {/* Mid layer */}
      <g opacity="0.55">
        <path d="M80 218V105h18v-35h12v35h16V78h14v140H80z" />
        <path d="M310 218V118h52V75h18v43h34v-28h14v28h22V138h16v80H310z" />
        <path d="M520 218V88h24v-20h14v20h26V105h38V58h20v160H520z" />
        <path d="M680 218V125h58V98h18v27h32V115h16v103H680z" />
        <path d="M900 218V102h42V68h18v34h30V118h38V82h16v136H900z" />
        <path d="M1050 218V95h48V62h18v33h36V108h26v110H1050z" />
      </g>

      {/* Foreground layer — tallest, full opacity */}
      <g>
        <path d="M180 218V98h16v-42h14v42h20V72h14v146H180z" />
        <path d="M400 218V110h48V72h18v38h36v-48h16v48h28V118h22v100H400z" />
        <path d="M610 218V62h28v-22h18v22h28V85h36V52h22v166H610z" />
        <path d="M780 218V78h26v-32h16v32h30V105h42V68h18v150H780z" />
        <path d="M960 218V98h38V55h22v43h34v-18h16v72H960z" />
        <path d="M1120 218V82h50V48h18v34h38V110h28v108H1120z" />
      </g>

      {/* Bat tower centerpiece — anchored to ground */}
      <g>
        <path d="M700 218V48h8v-20h6v20h8V90h12v-18h5v128H700z" />
        <rect x="694" y="42" width="34" height="2" opacity="0.85" />
        <rect x="706" y="28" width="3" height="14" opacity="0.9" />
        <rect x="714" y="22" width="2" height="6" opacity="0.7" />
      </g>

      {/* Window lights — background */}
      <g opacity="0.3" fill="currentColor">
        <rect x="195" y="115" width="3" height="4" />
        <rect x="202" y="115" width="3" height="4" />
        <rect x="535" y="95" width="3" height="4" />
        <rect x="542" y="95" width="3" height="4" />
        <rect x="1070" y="105" width="3" height="4" />
        <rect x="1077" y="105" width="3" height="4" />
      </g>
    </>
  )
}

const WINDOW_LIGHTS = [
  { x: 195, y: 115, o: 0.9 },
  { x: 202, y: 115, o: 0.55 },
  { x: 195, y: 125, o: 0.7 },
  { x: 202, y: 125, o: 0.95 },
  { x: 535, y: 95, o: 0.85 },
  { x: 542, y: 95, o: 0.5 },
  { x: 549, y: 95, o: 0.9 },
  { x: 535, y: 105, o: 0.6 },
  { x: 542, y: 105, o: 0.95 },
  { x: 706, y: 58, o: 1 },
  { x: 820, y: 105, o: 0.8 },
  { x: 827, y: 105, o: 0.95 },
  { x: 834, y: 105, o: 0.45 },
  { x: 820, y: 115, o: 0.7 },
  { x: 827, y: 115, o: 0.9 },
  { x: 1170, y: 105, o: 0.85 },
  { x: 1177, y: 105, o: 0.55 },
  { x: 1184, y: 105, o: 0.95 },
  { x: 1170, y: 115, o: 0.7 },
  { x: 1177, y: 115, o: 0.9 },
] as const

type InteractiveGothamProps = {
  x: MotionValue<number>
  y: MotionValue<number>
  className?: string
}

/**
 * Interactive Gotham skyline — lit by cursor spotlight from the hero.
 */
export function InteractiveGotham({ x, y, className = '' }: InteractiveGothamProps) {
  const mask = useMotionTemplate`radial-gradient(280px 200px at ${x}% ${y}%, black 0%, transparent 68%)`

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-full ${className}`}
    >
      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full text-white/[0.08]"
        viewBox="0 0 1440 220"
        preserveAspectRatio={SKYLINE_ASPECT}
        fill="currentColor"
      >
        <SkylinePaths />
      </svg>

      <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <svg
          className="absolute inset-x-0 bottom-0 h-full w-full text-white/35"
          viewBox="0 0 1440 220"
          preserveAspectRatio={SKYLINE_ASPECT}
          fill="currentColor"
        >
          <SkylinePaths />
        </svg>
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background:
              'linear-gradient(to top, rgba(200,200,210,0.06) 0%, rgba(200,200,210,0.02) 38%, transparent 68%)',
          }}
        />
        <svg
          className="absolute inset-x-0 bottom-0 h-full w-full"
          viewBox="0 0 1440 220"
          preserveAspectRatio={SKYLINE_ASPECT}
        >
          <g fill="#E6C364">
            {WINDOW_LIGHTS.map((w) => (
              <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="3" height="4" opacity={w.o} />
            ))}
          </g>
          <g fill="#E8E8ED">
            <rect x="330" y="135" width="2.5" height="3.5" opacity="0.5" />
            <rect x="338" y="135" width="2.5" height="3.5" opacity="0.35" />
            <rect x="990" y="125" width="2.5" height="3.5" opacity="0.45" />
            <rect x="998" y="125" width="2.5" height="3.5" opacity="0.6" />
          </g>
        </svg>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
    </div>
  )
}
