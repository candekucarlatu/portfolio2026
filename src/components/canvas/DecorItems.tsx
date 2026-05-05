/**
 * Individual decor item components — purely decorative, no parallax, no pointer events.
 * Each component is absolutely positioned on the canvas at its design-coord origin.
 *
 * Positions (design coords, 2500×1800 board):
 *   WOW      : left=132,  top=74,   w=153, h=249
 *   Lettering: left=1100, top=148,  w=351, h=301
 *   Gastly   : left=2180, top=113,  w=189, h=257
 *   Collage  : left=996,  top=1195, w=311, h=384
 */

import Image from 'next/image'

// ─────────────────────────────────────────────
// Shared helper: inset as CSS top/right/bottom/left
// ─────────────────────────────────────────────
function inset(top: string, right: string, bottom: string, left: string) {
  return {
    position: 'absolute' as const,
    top,
    right,
    bottom,
    left,
  }
}

// ─────────────────────────────────────────────
// WOW STICKER  (Figma node 439:12870)
// Container: 153 × 249
// ─────────────────────────────────────────────
export function WowDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 132, top: 74, width: 153, height: 249 }}
    >
      {/* Pinza — left=(153-46)/2 ≈ 53.5 */}
      <Image
        src="/canvas/wow/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 53.5, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Sticker flex container — centers the rotated sticker (128 × 138.435) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 0, top: 88, width: 152.626, height: 160.816 }}
      >
        <div
          className="relative flex-none"
          style={{
            width: 128,
            height: 138.435,
            transform: 'rotate(-11.29deg)',
            filter: 'drop-shadow(4px 4px 2px rgba(0,0,0,0.15))',
          }}
        >
          {/* Base white blob shape */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canvas/wow/sticker.svg"
            alt=""
            className="absolute inset-0 h-full w-full select-none"
            draggable={false}
          />

          {/* Inner detail group — inset 4.39% 5.89% 6.39% 5.86% */}
          <div
            className="absolute"
            style={inset('4.39%', '5.89%', '6.39%', '5.86%')}
          >
            {/* vector0 — lower-right sparkle */}
            <div className="absolute" style={inset('70.22%', '65.14%', '6.52%', '16.68%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/vector0.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* vector1 — lower-left sparkle */}
            <div className="absolute" style={inset('69.07%', '13.88%', '7.66%', '67.93%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/vector1.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* vector2 — main WOW crystal-ball design */}
            <div className="absolute" style={inset('4.39%', '5.89%', '12.23%', '5.86%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/vector2.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* group0 — bottom-center shimmer */}
            <div className="absolute" style={inset('75.46%', '34.26%', '9.63%', '37.37%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/group0.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* vector3 — narrow bottom-center band */}
            <div className="absolute" style={inset('70.22%', '31.21%', '19.68%', '33.86%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/vector3.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* vector4 — circle / face area */}
            <div className="absolute" style={inset('22.52%', '19.38%', '22.21%', '20.84%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/vector4.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* group1 — upper crystal ball body */}
            <div className="absolute" style={inset('7.42%', '10.58%', '20.07%', '11.04%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/group1.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* nested eye/face groups — all relative to inner group (contents wrappers collapsed) */}
            {/* group2 — tiny dot */}
            <div className="absolute" style={inset('43.68%', '48.52%', '47.54%', '47.98%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/group2.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* group3 — horizontal sparkle band */}
            <div className="absolute" style={inset('40.18%', '21.05%', '38%', '24.84%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/group3.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* group4 — horizontal sparkle band (mirrored) */}
            <div className="absolute" style={inset('38.31%', '23.37%', '39.87%', '22.53%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/group4.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>

            {/* group5 — lower area detail */}
            <div className="absolute" style={inset('56.6%', '11.19%', '6.39%', '13.89%')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/canvas/wow/group5.svg" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// LETTERING  (Figma node 439:12844)
// Container: 351 × 301
// ─────────────────────────────────────────────
export function LetteringDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 1100, top: 148, width: 351, height: 301 }}
    >
      {/* Pinza — right-of-center at left=230 */}
      <Image
        src="/canvas/lettering/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 230, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Lettering card flex container — centers rotated card */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 0, top: 53, width: 351, height: 248 }}
      >
        <div
          className="flex-none"
          style={{
            width: 329,
            height: 211,
            transform: 'rotate(6.69deg)',
            boxShadow: '4px 4px 8px 0px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/canvas/lettering/card.png"
            alt=""
            width={1024}
            height={657}
            sizes="329px"
            quality={90}
            className="h-full w-full object-cover select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// GASTLY STICKER  (Figma node 439:12821)
// Container: 189 × 257
// ─────────────────────────────────────────────
export function GastlyDecor() {
  // The gastly sticker is a large 617.959 × 559.116 div positioned at
  // (-247.48, -50.43) within the container, rotated 25.71deg, and clipped
  // via CSS mask-image to a 137.971px circle at (272.199, 141.382) within
  // the div. The resulting visible circle center lands at ~(94, 160) in
  // the 189×257 container (matching the ellipse shadow center).
  const maskStyle: React.CSSProperties = {
    maskImage: 'url(/canvas/gastly/mask.svg)',
    WebkitMaskImage: 'url(/canvas/gastly/mask.svg)',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: '272.199px 141.382px',
    WebkitMaskPosition: '272.199px 141.382px',
    maskSize: '137.971px 137.971px',
    WebkitMaskSize: '137.971px 137.971px',
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 2180, top: 113, width: 189, height: 257 }}
    >
      {/* Pinza — centered right: left=103 */}
      <Image
        src="/canvas/gastly/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 103, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Ellipse shadow — SVG circle behind sticker */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/gastly/ellipse.svg"
        alt=""
        className="pointer-events-none absolute select-none"
        style={{ left: 3.3, top: 72.86, width: 184.128, height: 184.128 }}
        draggable={false}
      />

      {/* Gastly sticker — large div, masked to circle, rotated */}
      <div
        className="absolute"
        style={{
          left: -247.48,
          top: -50.43,
          width: 617.959,
          height: 559.116,
          transform: 'rotate(25.71deg)',
          ...maskStyle,
        }}
      >
        <Image
          src="/canvas/gastly/sticker.png"
          alt=""
          width={800}
          height={600}
          sizes="618px"
          quality={90}
          className="absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// COLLAGE  (Figma node 439:12770)
// Container: 311 × 384
// ─────────────────────────────────────────────
export function CollageDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 996, top: 1195, width: 311, height: 384 }}
    >
      {/* Pinza — slightly right of center: left=141.58 */}
      <Image
        src="/canvas/collage/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 142, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Collage photo flex container — centers rotated photo */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 0, top: 73.64, width: 311.095, height: 309.954 }}
      >
        <div
          className="flex-none"
          style={{
            width: 255.896,
            height: 254.312,
            transform: 'rotate(-14.4deg)',
            boxShadow: '4px 4px 8px 0px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/canvas/collage/photo.png"
            alt=""
            width={1024}
            height={1017}
            sizes="256px"
            quality={90}
            className="h-full w-full object-cover select-none"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}
