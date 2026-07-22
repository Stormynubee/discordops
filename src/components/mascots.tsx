import { motion, useTransform, type MotionValue } from 'framer-motion'

export const BLURPLE = '#5865F2'
export const BLURPLE_DARK = '#3a41b0'
export const WUMPUS = '#8b9cf0'
export const WUMPUS_DARK = '#5865F2'
export const BAT_GOLD = '#ff2d95'
export const BAT_GOLD_DARK = '#b3923f'
export const PUPIL = '#141618'

type FaceProps = {
  pupilX: MotionValue<number>
  pupilY: MotionValue<number>
  reduceMotion: boolean
  blink?: boolean
  bodyOpacity?: number
}

const blinkKeys = [1, 1, 0.12, 1, 1]
const blinkTimes = [0, 0.92, 0.955, 0.99, 1]

function EyeBlink({
  reduceMotion,
  blink,
  children,
}: {
  reduceMotion: boolean
  blink: boolean
  children: React.ReactNode
}) {
  return (
    <motion.g
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      animate={reduceMotion || !blink ? undefined : { scaleY: blinkKeys }}
      transition={
        reduceMotion || !blink
          ? undefined
          : { duration: 4.6, repeat: Infinity, times: blinkTimes, ease: 'easeInOut' }
      }
    >
      {children}
    </motion.g>
  )
}

// Official Discord "Clyde" head silhouette (viewBox 0 0 127.14 96.36).
const CLYDE_HEAD =
  'M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07Z'

/**
 * Faithful 1:1 Discord Clyde logo. White face + blurple eyes, exactly like the
 * real mark, with the eyes gently tracking the cursor. Draw inside an svg with
 * viewBox "0 0 240 200".
 */
export function DiscordFace({ pupilX, pupilY, reduceMotion, blink = true, bodyOpacity = 1 }: FaceProps) {
  // The logo is scaled 1.5x into the shared box, so divide pupil motion to keep
  // the eye travel consistent with the other characters.
  const px = useTransform(pupilX, (v) => v / 1.5)
  const py = useTransform(pupilY, (v) => v / 1.5)

  return (
    <g transform="translate(24 28) scale(1.5)">
      <path d={CLYDE_HEAD} fill="#fff" opacity={bodyOpacity} />
      <EyeBlink reduceMotion={reduceMotion} blink={blink}>
        <motion.g style={reduceMotion ? undefined : { x: px, y: py }}>
          <ellipse cx="42.45" cy="53" rx="10" ry="12.5" fill={BLURPLE} />
          <ellipse cx="84.69" cy="53" rx="10" ry="12.5" fill={BLURPLE} />
        </motion.g>
      </EyeBlink>
    </g>
  )
}

/**
 * Wumpus, Discord's mascot. Friendly rounded blue blob with tracking eyes.
 * Draw inside an svg with viewBox "0 0 240 200".
 */
export function WumpusFace({ pupilX, pupilY, reduceMotion, blink = true, bodyOpacity = 1 }: FaceProps) {
  return (
    <g>
      {/* Arms */}
      <ellipse cx="58" cy="132" rx="11" ry="18" fill={WUMPUS} opacity={bodyOpacity} />
      <ellipse cx="182" cy="132" rx="11" ry="18" fill={WUMPUS} opacity={bodyOpacity} />
      {/* Body / head blob */}
      <path
        d="M120 52 C160 52 184 82 184 120 C184 156 158 178 120 178 C82 178 56 156 56 120 C56 82 80 52 120 52 Z"
        fill={WUMPUS}
        opacity={bodyOpacity}
      />
      {/* Feet */}
      <ellipse cx="100" cy="177" rx="15" ry="9" fill={WUMPUS_DARK} opacity={bodyOpacity} />
      <ellipse cx="140" cy="177" rx="15" ry="9" fill={WUMPUS_DARK} opacity={bodyOpacity} />
      {/* Mouth */}
      <path
        d="M107 146 Q120 155 133 146"
        fill="none"
        stroke={WUMPUS_DARK}
        strokeWidth="5"
        strokeLinecap="round"
        opacity={bodyOpacity}
      />
      {/* Eyes */}
      <EyeBlink reduceMotion={reduceMotion} blink={blink}>
        <ellipse cx="100" cy="112" rx="13" ry="17" fill="#fff" />
        <ellipse cx="140" cy="112" rx="13" ry="17" fill="#fff" />
        <motion.g style={reduceMotion ? undefined : { x: pupilX, y: pupilY }}>
          <circle cx="100" cy="112" r="6" fill={PUPIL} />
          <circle cx="140" cy="112" r="6" fill={PUPIL} />
        </motion.g>
      </EyeBlink>
    </g>
  )
}

/** Bat character, matching the Gotham theme. Draw inside an svg with viewBox "0 0 240 200". */
export function BatFace({ pupilX, pupilY, reduceMotion, blink = true, bodyOpacity = 1 }: FaceProps) {
  return (
    <g>
      {/* Wings */}
      <path
        d="M78 98 C44 82 20 96 10 128 C33 119 43 125 47 138 C63 127 71 133 77 144 C83 125 85 112 91 106 Z"
        fill={BAT_GOLD}
        opacity={bodyOpacity}
      />
      <path
        d="M162 98 C196 82 220 96 230 128 C207 119 197 125 193 138 C177 127 169 133 163 144 C157 125 155 112 149 106 Z"
        fill={BAT_GOLD}
        opacity={bodyOpacity}
      />
      {/* Ears */}
      <path d="M96 76 L106 40 L120 80 Z" fill={BAT_GOLD} opacity={bodyOpacity} />
      <path d="M144 76 L134 40 L120 80 Z" fill={BAT_GOLD} opacity={bodyOpacity} />
      {/* Head / body */}
      <ellipse cx="120" cy="110" rx="50" ry="44" fill={BAT_GOLD} opacity={bodyOpacity} />
      {/* Little fangs */}
      <path d="M110 150 L114 160 L118 150 Z" fill={BAT_GOLD_DARK} opacity={bodyOpacity} />
      <path d="M122 150 L126 160 L130 150 Z" fill={BAT_GOLD_DARK} opacity={bodyOpacity} />
      {/* Eyes */}
      <EyeBlink reduceMotion={reduceMotion} blink={blink}>
        <ellipse cx="102" cy="106" rx="12.5" ry="15.5" fill="#fff" />
        <ellipse cx="138" cy="106" rx="12.5" ry="15.5" fill="#fff" />
        <motion.g style={reduceMotion ? undefined : { x: pupilX, y: pupilY }}>
          <circle cx="102" cy="106" r="5.6" fill={PUPIL} />
          <circle cx="138" cy="106" r="5.6" fill={PUPIL} />
        </motion.g>
      </EyeBlink>
    </g>
  )
}
