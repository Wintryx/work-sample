# Tailwind CSS (lokale node_modules)

Version: 4.1.18
Paket: tailwindcss

## Pakete im node_modules
- tailwindcss: A utility-first CSS framework for rapidly building custom user interfaces.
- @tailwindcss/postcss: PostCSS plugin for Tailwind CSS, a utility-first CSS framework for rapidly building custom user interfaces
- @tailwindcss/node: A utility-first CSS framework for rapidly building custom user interfaces.
- @tailwindcss/oxide-win32-x64-msvc: Native engine (platform build)

## CSS Entry Points (aus package.json exports)
- ./index.css
- ./preflight.css
- ./theme.css
- ./utilities.css

## CSS/At-Rule Features (aus dist + index.css)
- @layer (theme/base/components/utilities)
- @theme (theme blocks, z.B. default und custom properties)
- @tailwind (utilities layer, inkl. source(...) Steuerung)
- @apply (Utility-Expansion in CSS)
- @utility (eigene Utility-Definitionen)
- @variant / @custom-variant (eigene Varianten)
- @config / @plugin (config + plugin Einbindung)
- @source (Content/Scan Quellen)

## Konfiguration (UserConfig Keys aus plugin.d.ts)
Keys: blocklist, content, darkMode, experimental, future, important, plugins, prefix, presets, theme
Dark-Mode Strategien (plugin.d.ts): false | media | class | [class, selector] | selector | [selector, selector] | [variant, string|string[]].

## Plugin API (plugin.d.ts)
- addBase, addUtilities, addComponents (CSS registrieren)
- matchUtilities, matchComponents (wertbasierte Utilities)
- addVariant, matchVariant (Varianten definieren)
- theme(path), config(path), prefix(className)

## Default Theme Keys (vollstaendige Liste aus default-theme.d.ts)
accentColor, animation, aria, aspectRatio, backdropBlur, backdropBrightness, backdropContrast, backdropGrayscale, backdropHueRotate, backdropInvert, backdropOpacity, backdropSaturate, backdropSepia, backgroundColor, backgroundImage, backgroundOpacity, backgroundPosition, backgroundSize, blur, borderColor, borderOpacity, borderRadius, borderSpacing, borderWidth, boxShadow, boxShadowColor, brightness, caretColor, colors, columns, container, content, contrast, cursor, data, divideColor, divideOpacity, divideWidth, dropShadow, fill, flex, flexBasis, flexGrow, flexShrink, fontFamily, fontSize, fontWeight, gap, gradientColorStopPositions, gradientColorStops, grayscale, gridAutoColumns, gridAutoRows, gridColumn, gridColumnEnd, gridColumnStart, gridRow, gridRowEnd, gridRowStart, gridTemplateColumns, gridTemplateRows, height, hueRotate, inset, invert, keyframes, letterSpacing, lineClamp, lineHeight, listStyleImage, listStyleType, margin, maxHeight, maxWidth, minHeight, minWidth, objectPosition, opacity, order, outlineColor, outlineOffset, outlineWidth, padding, placeholderColor, placeholderOpacity, ringColor, ringOffsetColor, ringOffsetWidth, ringOpacity, ringWidth, rotate, saturate, scale, screens, scrollMargin, scrollPadding, sepia, size, skew, space, spacing, stroke, strokeWidth, supports, textColor, textDecorationColor, textDecorationThickness, textIndent, textOpacity, textUnderlineOffset, transformOrigin, transitionDelay, transitionDuration, transitionProperty, transitionTimingFunction, translate, width, willChange, zIndex

## Default Colors (colors.js)
inherit, current, transparent, black, white, slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose

## Nutzungs-Regelwerk (Kurzform)
1) Theme Keys definieren die Skalen fuer Utility-Familien (z.B. colors, spacing, fontSize, borderRadius, zIndex).
2) Utilities referenzieren Theme-Keys ueber Namenspraefixe (z.B. bg- fuer backgroundColor, text- fuer textColor/fontSize, p-/m- fuer spacing).
3) Varianten praefixieren Utilities (z.B. hover:, focus:, sm:). Eigene Varianten ueber @variant/@custom-variant oder plugin API.
4) Layering: theme -> base -> components -> utilities (siehe index.css @layer).

## Beispiele (Auszug)
- Farben: bg-red-500, text-slate-700, border-amber-400, ring-indigo-500.
- Spacing: p-4, px-6, m-2, gap-3, space-x-2.
- Typografie: font-sans, text-lg, leading-6, tracking-wide.
- Layout: flex, grid, grid-cols-3, w-1/2, max-w-screen-lg.
- Effekte/Filter: shadow-md, blur-sm, backdrop-blur, opacity-60.
- Transition/Transform: transition, duration-200, ease-in-out, translate-x-2, rotate-45, scale-95.

