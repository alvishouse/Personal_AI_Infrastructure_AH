# Sketchnote Infographic — React Template Reference

This document contains the exact component structure, styling constants, SVG icon library, and composition patterns for generating sketchnote infographics. Read this BEFORE writing any artifact code.

## Font Imports

Always include this style block as the first child of the root container:

```jsx
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&family=Fredoka:wght@400;600;700&display=swap');
`}</style>
```

## CSS Variables & Theming

Define these at the root container level via inline style or a wrapping div:

```javascript
const theme = {
  // Paper
  paperBg: '#faf8f0',
  paperLines: '#e8e4d9',
  spiralColor: '#b0b0b0',
  
  // Text
  textDark: '#2d3436',
  textMedium: '#555555',
  textLight: '#888888',
  
  // Column header backgrounds (pastel)
  colGreen: '#d4edda',
  colGreenBorder: '#a3d5b1',
  colBlue: '#cce5ff',
  colBlueBorder: '#8bb8e8',
  colPink: '#f8d7da',
  colPinkBorder: '#e8a5ab',
  colYellow: '#fff3cd',
  colYellowBorder: '#e8d48a',
  
  // Accents
  highlightYellow: '#ffeaa7',
  highlightPink: '#fab1a0',
  highlightGreen: '#b8e6c8',
  
  // Fonts
  fontDisplay: "'Fredoka', sans-serif",
  fontBody: "'Patrick Hand', cursive",
  fontAccent: "'Caveat', cursive",
  
  // Spacing
  sp: (n) => `${n * 8}px`, // spacing scale: sp(1)=8px, sp(2)=16px, etc.
};
```

## Column Color Assignment

Assign colors to columns in this order:

```javascript
const columnColors = [
  { bg: theme.colGreen, border: theme.colGreenBorder, label: 'green' },
  { bg: theme.colBlue, border: theme.colBlueBorder, label: 'blue' },
  { bg: theme.colPink, border: theme.colPinkBorder, label: 'pink' },
  { bg: theme.colYellow, border: theme.colYellowBorder, label: 'yellow' },
];
```

## Root Container Style

The outermost div simulates the notebook page:

```javascript
const rootStyle = {
  fontFamily: theme.fontBody,
  background: theme.paperBg,
  color: theme.textDark,
  maxWidth: '880px',
  margin: '0 auto',
  padding: '40px 48px 40px 64px', // extra left padding for spiral binding
  position: 'relative',
  minHeight: '100vh',
  lineHeight: 1.5,
};
```

## Spiral Binding (Left Edge)

Render as a column of SVG ovals along the left edge:

```jsx
const SpiralBinding = () => (
  <div style={{
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    paddingTop: '20px', gap: '28px',
  }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <svg key={i} width="30" height="18" viewBox="0 0 30 18">
        <ellipse cx="15" cy="9" rx="13" ry="7" fill="none"
          stroke="#999" strokeWidth="2.5" />
      </svg>
    ))}
  </div>
);
```

## Title Section

The title uses the display font with a marker highlight effect on key words:

```jsx
const HighlightedText = ({ children, color = theme.highlightYellow }) => (
  <span style={{
    background: `linear-gradient(180deg, transparent 55%, ${color} 55%, ${color} 90%, transparent 90%)`,
    padding: '0 4px',
  }}>
    {children}
  </span>
);

const TitleSection = ({ title, highlightWord, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: theme.sp(4) }}>
    <h1 style={{
      fontFamily: theme.fontDisplay,
      fontSize: '2rem',
      fontWeight: 700,
      margin: '0 0 4px 0',
      lineHeight: 1.3,
    }}>
      {title.split(highlightWord).map((part, i, arr) => (
        <React.Fragment key={i}>
          {part}
          {i < arr.length - 1 && <HighlightedText>{highlightWord}</HighlightedText>}
        </React.Fragment>
      ))}
    </h1>
    {subtitle && (
      <p style={{
        fontFamily: theme.fontBody,
        fontSize: '1.05rem',
        color: theme.textMedium,
        margin: 0,
      }}>
        {subtitle}
      </p>
    )}
  </div>
);
```

## Column Layout

Use CSS Grid for the multi-column comparison area:

```javascript
const columnsGridStyle = (count) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${count}, 1fr)`,
  gap: theme.sp(2),
  marginBottom: theme.sp(4),
});
```

## Column Card

Each column is a card with a colored header, optional diagram area, a character with speech bubble, and bullet points:

```jsx
const ColumnCard = ({ header, subheader, color, diagram, quote, bullets, icon }) => (
  <div style={{
    border: `2px solid ${color.border}`,
    borderRadius: '12px 8px 14px 10px', // hand-drawn feel
    overflow: 'hidden',
    background: 'white',
  }}>
    {/* Header banner */}
    <div style={{
      background: color.bg,
      padding: '12px 16px',
      borderBottom: `2px solid ${color.border}`,
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: theme.fontDisplay,
        fontSize: '0.95rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {header}
      </div>
      {subheader && (
        <div style={{
          fontFamily: theme.fontBody,
          fontSize: '0.9rem',
          color: theme.textMedium,
        }}>
          {subheader}
        </div>
      )}
    </div>
    
    {/* Diagram area */}
    {diagram && (
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
        {diagram}
      </div>
    )}
    
    {/* Character + Speech bubble */}
    {quote && (
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        padding: '8px 12px', gap: '8px',
      }}>
        <div style={{ flexShrink: 0 }}>{icon || <StickFigure />}</div>
        <SpeechBubble text={quote} />
      </div>
    )}
    
    {/* Bullet points */}
    {bullets && (
      <div style={{ padding: '12px 16px' }}>
        {bullets.map((b, i) => (
          <BulletPoint key={i} icon={b.icon} text={b.text} />
        ))}
      </div>
    )}
  </div>
);
```

## Speech Bubble

```jsx
const SpeechBubble = ({ text }) => (
  <div style={{
    background: '#f9f9f4',
    border: '1.5px solid #ccc',
    borderRadius: '14px 14px 14px 4px',
    padding: '8px 12px',
    fontSize: '0.8rem',
    fontFamily: theme.fontAccent,
    fontStyle: 'italic',
    color: theme.textMedium,
    position: 'relative',
    lineHeight: 1.4,
  }}>
    "{text}"
  </div>
);
```

## Bullet Point with Icon

```jsx
const BulletPoint = ({ icon, text }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start',
    gap: '8px', marginBottom: '8px',
    fontSize: '0.85rem',
  }}>
    <span style={{ flexShrink: 0, fontSize: '1.1rem' }}>{icon || '•'}</span>
    <span><strong>{text.split('.')[0]}.</strong>{text.split('.').slice(1).join('.')}</span>
  </div>
);
```

## Progression Flow (Bottom)

The bottom section shows a horizontal flow: STEP 1 → STEP 2 → STEP 3

```jsx
const ProgressionFlow = ({ label, steps }) => (
  <div style={{
    textAlign: 'center',
    marginTop: theme.sp(3),
    padding: `${theme.sp(2)} 0`,
    borderTop: `2px solid ${theme.textDark}`,
  }}>
    {label && (
      <p style={{
        fontFamily: theme.fontDisplay,
        fontSize: '1.1rem',
        margin: '0 0 12px 0',
      }}>
        {label}
      </p>
    )}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px',
      fontSize: '1.6rem',
      fontFamily: theme.fontDisplay,
      fontWeight: 700,
    }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ fontSize: '1.2rem', color: theme.textLight }}>→</span>}
          <span>{step}</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);
```

## Attribution Line

```jsx
const Attribution = ({ text }) => (
  <p style={{
    textAlign: 'center',
    fontFamily: theme.fontAccent,
    fontSize: '0.95rem',
    color: theme.textLight,
    marginTop: theme.sp(2),
  }}>
    {text}
  </p>
);
```

---

## SVG Icon Library

Use these inline SVG components for bullet point icons and column illustrations. Keep them simple — 24x24 or 32x32 viewBox, 2px stroke, no fill (line-art style).

```jsx
// Lightbulb — for ideas, key concepts
const IconLightbulb = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21h6M12 3a6 6 0 014 10.5V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-3.5A6 6 0 0112 3z"/>
  </svg>
);

// People / Group — for collaboration, teams
const IconPeople = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2980b9" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="3"/>
    <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>
  </svg>
);

// Magnifying Glass — for details, search, analysis
const IconSearch = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8e44ad" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

// Chain Link — for connections, relationships
const IconLink = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1.5 1.5"/>
    <path d="M14 11a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1.5-1.5"/>
  </svg>
);

// Gear — for optimization, settings, technical
const IconGear = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

// Spreadsheet / Table — for data, structure
const IconTable = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#16a085" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);

// Database — for storage, physical implementation
const IconDatabase = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
  </svg>
);

// Checkmark — for completed, agreed, confirmed
const IconCheck = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// Document — for specifications, detailed plans
const IconDoc = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#34495e" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);

// Cloud — for cloud/infrastructure
const IconCloud = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round">
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
  </svg>
);
```

## Stick Figure Characters

Use these for the character illustrations in each column. Vary hair/accessories to differentiate:

```jsx
const StickFigure = ({ variant = 0, size = 48 }) => {
  const variants = [
    // Variant 0: basic person
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
      <circle cx="24" cy="10" r="7"/>
      <line x1="24" y1="17" x2="24" y2="32"/>
      <line x1="16" y1="24" x2="32" y2="24"/>
      <line x1="24" y1="32" x2="18" y2="44"/>
      <line x1="24" y1="32" x2="30" y2="44"/>
    </svg>,
    // Variant 1: person with short hair
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
      <circle cx="24" cy="10" r="7"/>
      <path d="M17 8c0-4 3-7 7-7s7 3 7 7" fill="none"/>
      <line x1="24" y1="17" x2="24" y2="32"/>
      <line x1="16" y1="24" x2="32" y2="24"/>
      <line x1="24" y1="32" x2="18" y2="44"/>
      <line x1="24" y1="32" x2="30" y2="44"/>
    </svg>,
    // Variant 2: person with long hair
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
      <circle cx="24" cy="10" r="7"/>
      <path d="M17 10c0 0-1 10 1 14" fill="none"/>
      <path d="M31 10c0 0 1 10-1 14" fill="none"/>
      <line x1="24" y1="17" x2="24" y2="32"/>
      <line x1="16" y1="24" x2="32" y2="24"/>
      <line x1="24" y1="32" x2="18" y2="44"/>
      <line x1="24" y1="32" x2="30" y2="44"/>
    </svg>,
    // Variant 3: person with tie (business)
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
      <circle cx="24" cy="10" r="7"/>
      <line x1="24" y1="17" x2="24" y2="32"/>
      <polygon points="24,19 22,25 24,32 26,25" fill="#3498db" stroke="#3498db" strokeWidth="1"/>
      <line x1="16" y1="24" x2="32" y2="24"/>
      <line x1="24" y1="32" x2="18" y2="44"/>
      <line x1="24" y1="32" x2="30" y2="44"/>
    </svg>,
  ];
  return variants[variant % variants.length];
};
```

## Diagram Primitives

For the middle diagram area of each column, use these composable SVG building blocks:

### Entity-Relationship Bubbles (Conceptual Model)

```jsx
const ERBubbles = ({ entities }) => (
  <svg width="200" height="120" viewBox="0 0 200 120">
    {entities.map((e, i) => {
      const positions = [
        { x: 60, y: 35 }, { x: 150, y: 35 },
        { x: 60, y: 90 }, { x: 150, y: 90 },
      ];
      const pos = positions[i % 4];
      return (
        <g key={i}>
          <ellipse cx={pos.x} cy={pos.y} rx="45" ry="20"
            fill="#e8f4fd" stroke="#8bb8e8" strokeWidth="1.5"/>
          <text x={pos.x} y={pos.y + 4} textAnchor="middle"
            fontSize="11" fontFamily="Patrick Hand">{e}</text>
          {i > 0 && (
            <line x1={positions[0].x + 40} y1={positions[0].y + 10}
              x2={pos.x - 40} y2={pos.y - 5}
              stroke="#aaa" strokeWidth="1" strokeDasharray="4"/>
          )}
        </g>
      );
    })}
  </svg>
);
```

### Table Schema (Logical Model)

```jsx
const TableSchema = ({ tables }) => (
  <svg width="220" height="140" viewBox="0 0 220 140">
    {tables.map((table, ti) => {
      const offsets = [{ x: 10, y: 5 }, { x: 115, y: 30 }, { x: 10, y: 75 }];
      const pos = offsets[ti % 3];
      return (
        <g key={ti}>
          <rect x={pos.x} y={pos.y} width="95" height={16 + table.fields.length * 14}
            fill="white" stroke="#666" strokeWidth="1.5" rx="2"/>
          <rect x={pos.x} y={pos.y} width="95" height="16"
            fill="#eee" stroke="#666" strokeWidth="1.5" rx="2"/>
          <text x={pos.x + 48} y={pos.y + 12} textAnchor="middle"
            fontSize="10" fontWeight="bold" fontFamily="Patrick Hand">
            {table.name}
          </text>
          {table.fields.map((f, fi) => (
            <text key={fi} x={pos.x + 8} y={pos.y + 28 + fi * 14}
              fontSize="9" fontFamily="Patrick Hand">{f}</text>
          ))}
        </g>
      );
    })}
  </svg>
);
```

## Full Component Skeleton

Here's how to compose everything into the final artifact:

```jsx
import { useState } from "react";

// ... theme, icons, components defined above ...

const data = {
  title: "From Business Idea to",
  titleHighlight: "Scalable Data Platform",
  subtitle: "The three data models behind every strong data foundation",
  columns: [ /* ... */ ],
  progression: { label: "One data strategy implemented across three layers", steps: ["IDEA", "PLAN", "BUILD"] },
  attribution: "Author Name",
};

export default function SketchnoteInfographic() {
  return (
    <div style={rootStyle}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&family=Fredoka:wght@400;600;700&display=swap');`}</style>
      <SpiralBinding />
      <TitleSection title={`${data.title} ${data.titleHighlight}`} highlightWord={data.titleHighlight} subtitle={data.subtitle} />
      <div style={columnsGridStyle(data.columns.length)}>
        {data.columns.map((col, i) => (
          <ColumnCard key={i} {...col} color={columnColors[i]} />
        ))}
      </div>
      <ProgressionFlow {...data.progression} />
      <Attribution text={data.attribution} />
    </div>
  );
}
```

## Adaptability Notes

- **2 columns**: Use for simple A vs B comparisons. Make columns wider.
- **3 columns**: The sweet spot. Matches the reference image exactly.
- **4 columns**: Tighter spacing, smaller text. Good for quadrant models or RACI-style breakdowns.
- **Vertical layout**: For mobile or tall-format, stack columns vertically instead of using grid.
- **No diagram**: If the content doesn't lend itself to a visual diagram, replace with a key stat, pull quote, or simple icon cluster.
- **Multiple progression rows**: If the bottom flow has more than 3-4 steps, wrap to two rows or use a smaller font.
