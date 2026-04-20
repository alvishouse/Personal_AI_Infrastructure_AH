import React from 'react'

export default function Post04Framework() {
  const styles: Record<string, React.CSSProperties> = {
    root: {
      width: 1080,
      height: 1350,
      background: '#FDFBF7',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      padding: '52px 56px 44px',
      boxSizing: 'border-box',
    },
    titleBlock: {
      textAlign: 'center',
      marginBottom: 36,
    },
    titleMain: {
      fontSize: 38,
      fontWeight: 800,
      color: '#1A2A3A',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      lineHeight: 1.1,
      margin: 0,
      marginBottom: 8,
    },
    titleHighlight: {
      display: 'inline-block',
      background: '#C0513A',
      color: '#FDFBF7',
      padding: '4px 16px',
      borderRadius: 4,
      fontSize: 34,
      fontWeight: 800,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 400,
      color: '#1A2A3A',
      opacity: 0.65,
      marginTop: 14,
      margin: 0,
    },
    divider: {
      height: 2,
      background: '#1A2A3A',
      opacity: 0.12,
      margin: '28px 0',
      borderRadius: 1,
    },
    columnsRow: {
      display: 'flex',
      gap: 28,
      flex: 1,
    },
    column: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    colHeaderOld: {
      fontSize: 22,
      fontWeight: 800,
      color: '#1A2A3A',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      paddingBottom: 10,
      borderBottom: '3px solid #C0513A',
      marginBottom: 20,
    },
    colHeaderNew: {
      fontSize: 22,
      fontWeight: 800,
      color: '#1A2A3A',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      paddingBottom: 10,
      borderBottom: '3px solid #8FAF7E',
      marginBottom: 20,
    },
    iconBlock: {
      fontSize: 32,
      marginBottom: 16,
      textAlign: 'center' as const,
    },
    bullet: {
      fontSize: 17,
      color: '#1A2A3A',
      lineHeight: 1.55,
      marginBottom: 10,
      paddingLeft: 0,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
    },
    bulletDot: {
      color: '#C0513A',
      fontWeight: 700,
      flexShrink: 0,
      marginTop: 2,
    },
    bulletDotGreen: {
      color: '#8FAF7E',
      fontWeight: 700,
      flexShrink: 0,
      marginTop: 2,
    },
    resultLabel: {
      fontSize: 16,
      fontWeight: 700,
      color: '#1A2A3A',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      marginTop: 'auto' as const,
      marginBottom: 6,
    },
    resultTextOld: {
      fontSize: 17,
      color: '#C0513A',
      fontStyle: 'italic',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    resultTextNew: {
      fontSize: 17,
      color: '#8FAF7E',
      fontStyle: 'italic',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    zoneBox: {
      borderLeft: '4px solid #8FAF7E',
      background: 'rgba(143,175,126,0.07)',
      padding: '10px 14px',
      marginBottom: 10,
      borderRadius: '0 4px 4px 0',
    },
    zoneLabel: {
      fontSize: 14,
      fontWeight: 800,
      color: '#1A2A3A',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',
      marginBottom: 3,
    },
    zoneDesc: {
      fontSize: 14,
      color: '#1A2A3A',
      opacity: 0.7,
      lineHeight: 1.4,
    },
    zoneTagline: {
      fontSize: 13,
      color: '#8FAF7E',
      fontWeight: 600,
      marginTop: 3,
    },
    footer: {
      textAlign: 'center',
      fontSize: 16,
      color: '#1A2A3A',
      opacity: 0.45,
      marginTop: 28,
      fontWeight: 500,
    },
  }

  return (
    <div style={styles.root}>
      {/* Title Block */}
      <div style={styles.titleBlock}>
        <p style={styles.titleMain}>Fixing AI Inconsistency</p>
        <span style={styles.titleHighlight}>Context First</span>
        <p style={styles.subtitle}>Stop switching models. Start structuring context.</p>
      </div>

      <div style={styles.divider} />

      {/* Two Columns */}
      <div style={styles.columnsRow}>
        {/* OLD WAY */}
        <div style={styles.column}>
          <div style={styles.colHeaderOld}>Old Way</div>

          <div style={styles.iconBlock}>&#x21BA;</div>

          {[
            'Output drifts after 10 exchanges',
            'Switch to newer model',
            'Same drift returns within days',
            'Blame the model, repeat cycle',
          ].map((text, i) => (
            <div key={i} style={styles.bullet}>
              <span style={styles.bulletDot}>&#x25CF;</span>
              <span>{text}</span>
            </div>
          ))}

          <div style={{ marginTop: 'auto' }}>
            <div style={styles.resultLabel}>Result:</div>
            <div style={styles.resultTextOld}>
              Endless model-switching loop. No structural fix.
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 2, background: '#1A2A3A', opacity: 0.1, borderRadius: 1, flexShrink: 0 }} />

        {/* NEW WAY */}
        <div style={styles.column}>
          <div style={styles.colHeaderNew}>New Way</div>

          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A2A3A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
            Three-Zone Context Map
          </div>

          <div style={styles.zoneBox}>
            <div style={styles.zoneLabel}>Zone A: Pinned</div>
            <div style={styles.zoneDesc}>System instructions, constraints, identity</div>
            <div style={styles.zoneTagline}>Always at top. Never buried.</div>
          </div>

          <div style={styles.zoneBox}>
            <div style={styles.zoneLabel}>Zone B: Active</div>
            <div style={styles.zoneDesc}>Current task context, working data</div>
            <div style={styles.zoneTagline}>Refreshed each exchange.</div>
          </div>

          <div style={styles.zoneBox}>
            <div style={styles.zoneLabel}>Zone C: Archive</div>
            <div style={styles.zoneDesc}>Prior results, reference material</div>
            <div style={styles.zoneTagline}>Compressed. Retrieved on demand.</div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={styles.resultLabel}>Result:</div>
            <div style={styles.resultTextNew}>
              Consistent outputs. No model change needed.
            </div>
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.footer}>Follow Alvis House for AI architecture insights</div>
    </div>
  )
}
