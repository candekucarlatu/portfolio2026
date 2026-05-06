/**
 * Individual decor item components — purely decorative, no parallax, no pointer events.
 * Each component is absolutely positioned on the canvas at its design-coord origin.
 *
 * Positions (design coords, 2500×1800 board):
 *   WOW      : left=153,  top=74,   w=110, h=212   (Figma 439:12870)
 *   Lettering: left=1174, top=148,  w=267, h=274   (Figma 439:12844)
 *   Gastly   : left=2229, top=113,  w=127, h=212   (Figma 439:12821)
 *   Collage  : left=996,  top=1195, w=311, h=384
 *
 * Coordinate derivation: board = figma_absolute + (567, 431)
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
// Container: 110 × 212  board: left=153, top=74
// ─────────────────────────────────────────────
export function WowDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 153, top: 74, width: 109.958, height: 212 }}
    >
      {/* Pinza — figma(-382,-357) → board(185,74) → rel(32,0) */}
      <Image
        src="/canvas/wow/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 32, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Sticker flex container — figma(-414,-261) → board(153,170) → rel(0,96) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 0, top: 96, width: 109.958, height: 115.859 }}
      >
        <div
          className="relative flex-none"
          style={{
            width: 92.217,
            height: 99.735,
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
// Container: 267 × 274  board: left=1174, top=148
// ─────────────────────────────────────────────
export function LetteringDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 1174, top: 148, width: 266.975, height: 274 }}
    >
      {/* Pinza — figma(763,-283) → board(1330,148) → rel(156,0) */}
      <Image
        src="/canvas/lettering/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 156, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Lettering card flex container — figma(607,-197) → board(1174,234) → rel(0,86) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 0, top: 86, width: 266.975, height: 188.342 }}
      >
        <div
          className="flex-none"
          style={{
            width: 250,
            height: 160.307,
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
            sizes="250px"
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
// Container: 127 × 212  board: left=2229, top=113
// ─────────────────────────────────────────────
export function GastlyDecor() {
  // The gastly sticker is a 337.667×253.25 div inside a 414×375 flex container,
  // positioned at rel(-165.84, 5.72) within this container. It is rotated 25.71deg
  // and CSS-masked to a 92.458px circle via the mask SVG.
  const maskStyle: React.CSSProperties = {
    maskImage: 'url(/canvas/gastly/mask.svg)',
    WebkitMaskImage: 'url(/canvas/gastly/mask.svg)',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: '182.407px 94.743px',
    WebkitMaskPosition: '182.407px 94.743px',
    maskSize: '92.458px 92.458px',
    WebkitMaskSize: '92.458px 92.458px',
    maskMode: 'alpha' as const,
    maskComposite: 'intersect' as const,
    maskClip: 'no-clip' as const,
    WebkitMaskComposite: 'source-in' as const,
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: 2229, top: 113, width: 126.695, height: 212 }}
    >
      {/* Pinza — figma(1716,-318) → board(2283,113) → rel(54,0) */}
      <Image
        src="/canvas/gastly/pinza.png"
        alt=""
        width={92}
        height={277}
        quality={90}
        className="absolute select-none"
        style={{ left: 54, top: 0, width: 46, height: 138.5 }}
        draggable={false}
      />

      {/* Ellipse flex — figma(1664.21,-229.66) → board(2231.21,201.34) → rel(2.21,88.34) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 2.21, top: 88.34, width: 123.388, height: 123.388 }}
      >
        <div className="flex-none" style={{ transform: 'rotate(25.71deg)' }}>
          <div className="relative" style={{ width: 92.436, height: 92.436 }}>
            <div style={{ position: 'absolute', inset: '-4.33%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/gastly/ellipse.svg"
                alt=""
                className="pointer-events-none block h-full w-full select-none"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gastly sticker — 414×375 flex, inner 337×253 masked to 92px circle */}
      {/* figma(1496.16,-312.28) → board(2063.16,118.72) → rel(-165.84,5.72) */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: -165.84, top: 5.72, width: 414.107, height: 374.676 }}
      >
        <div className="flex-none" style={{ transform: 'rotate(25.71deg)' }}>
          <div
            style={{
              width: 337.667,
              height: 253.25,
              position: 'relative',
              ...maskStyle,
            }}
          >
            <Image
              src="/canvas/gastly/sticker.png"
              alt=""
              width={800}
              height={600}
              sizes="338px"
              quality={90}
              className="absolute inset-0 h-full w-full object-cover select-none"
              draggable={false}
            />
          </div>
        </div>
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
