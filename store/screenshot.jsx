// Store screenshot composition — one per artboard
// Renders a marketing screenshot: background + headline + device with screen
const { useMemo } = React;

const FRAMES = {
  ios:    { ratio: 1290/2796, devicePadPct: 0.025, deviceRadiusPct: 0.10, screenRadiusPct: 0.085, notch: true },
  android:{ ratio: 1080/1920, devicePadPct: 0.020, deviceRadiusPct: 0.075, screenRadiusPct: 0.06, notch: false },
};

const PALETTES = {
  light: {
    bg: '#F5F1EB',
    bgSwirl: 'radial-gradient(ellipse at 80% -10%, rgba(15,118,110,.18) 0%, transparent 50%), radial-gradient(ellipse at -20% 120%, rgba(249,115,98,.22) 0%, transparent 55%), #F5F1EB',
    ink: '#1F2937',
    muted: '#5C7B7A',
    accent: '#F97362',
    teal: '#0F766E',
    chip: '#FFFFFF',
    chipBorder: '#E5DFD3',
    deviceBezel: '#0f1115',
  },
  dark: {
    bg: '#0b1118',
    bgSwirl: 'radial-gradient(ellipse at 80% -10%, rgba(15,118,110,.45) 0%, transparent 55%), radial-gradient(ellipse at -10% 110%, rgba(249,115,98,.30) 0%, transparent 60%), #0b1118',
    ink: '#FFFFFF',
    muted: 'rgba(255,255,255,.7)',
    accent: '#F97362',
    teal: '#46B5AB',
    chip: 'rgba(255,255,255,.10)',
    chipBorder: 'rgba(255,255,255,.18)',
    deviceBezel: '#000',
  }
};

function Screenshot({ platform='ios', theme='light', kicker, title, sub, screen, width, height, accent='teal' }) {
  const F = FRAMES[platform];
  const P = PALETTES[theme];
  const W = width, H = height;

  // Layout: top 38% text, bottom 62% device
  const textArea = { top: 0, height: H * 0.34 };
  // Device sized to fit remaining height
  const deviceTop = H * 0.34;
  const deviceMaxH = H - deviceTop - H * 0.04; // 4% bottom margin
  // device aspect = screen aspect (9:19.5 ios, 9:16 android approximation)
  const deviceAspect = F.ratio;
  let deviceH = deviceMaxH;
  let deviceW = deviceH * deviceAspect;
  // Width cap = 80% of screenshot
  const wCap = W * 0.78;
  if (deviceW > wCap) {
    deviceW = wCap;
    deviceH = deviceW / deviceAspect;
  }
  const deviceLeft = (W - deviceW) / 2;

  const pad = deviceW * F.devicePadPct;
  const screenW = deviceW - pad*2;
  const screenH = deviceH - pad*2;
  const screenRadius = deviceW * F.screenRadiusPct;
  const deviceRadius = deviceW * F.deviceRadiusPct;

  const titleSize = W * 0.082;
  const subSize = W * 0.034;
  const kickerSize = W * 0.022;

  return (
    <div style={{
      width:W, height:H, position:'relative', overflow:'hidden',
      background: P.bgSwirl,
      fontFamily: 'Poppins, system-ui, sans-serif',
      color: P.ink,
    }}>
      {/* Decorative shape */}
      <div style={{
        position:'absolute', top: -H*0.08, right: -W*0.18,
        width: W*0.7, height: W*0.7, borderRadius:'50%',
        background: theme==='light' ? 'rgba(15,118,110,.08)' : 'rgba(15,118,110,.22)',
        filter: 'blur(6px)',
      }}/>
      <div style={{
        position:'absolute', bottom: -H*0.05, left: -W*0.15,
        width: W*0.55, height: W*0.55, borderRadius:'50%',
        background: theme==='light' ? 'rgba(249,115,98,.10)' : 'rgba(249,115,98,.18)',
        filter: 'blur(4px)',
      }}/>

      {/* Top: text */}
      <div style={{
        position:'absolute', left: W*0.08, right: W*0.08, top: H*0.06,
        display:'flex', flexDirection:'column', gap: H*0.012, zIndex:2
      }}>
        <div style={{
          display:'inline-flex', alignSelf:'flex-start',
          alignItems:'center', gap: W*0.012,
          fontSize: kickerSize, letterSpacing:'0.22em', textTransform:'uppercase',
          color: P.muted, fontWeight:500
        }}>
          <span style={{
            width: kickerSize*0.5, height: kickerSize*0.5, borderRadius:'50%',
            background: P.accent, display:'inline-block'
          }}/>
          {kicker}
        </div>
        <h1 style={{
          margin: 0, marginTop: H*0.012,
          fontSize: titleSize, fontWeight: 600,
          lineHeight: 1.02, letterSpacing:'-0.03em',
          color: P.ink, whiteSpace:'pre-line'
        }}>{title.split('||').map((p,i)=>(
          <span key={i}>{i>0 && <br/>}{p.includes('*') ? p.split('*').map((seg,j)=>j%2===1?<em key={j} style={{fontStyle:'normal',color:P.accent}}>{seg}</em>:seg) : p}</span>
        ))}</h1>
        {sub && <p style={{
          margin: 0, marginTop: H*0.012,
          fontSize: subSize, lineHeight: 1.4,
          color: P.muted, maxWidth: W*0.78, fontWeight: 400
        }}>{sub}</p>}
      </div>

      {/* Device */}
      <div style={{
        position:'absolute', top: deviceTop + (deviceMaxH - deviceH)/2,
        left: deviceLeft, width: deviceW, height: deviceH,
        borderRadius: deviceRadius, background: P.deviceBezel,
        padding: pad,
        boxShadow: theme==='light'
          ? `0 ${H*0.04}px ${H*0.08}px -${H*0.03}px rgba(15,118,110,.45), 0 ${H*0.025}px ${H*0.05}px -${H*0.02}px rgba(0,0,0,.25)`
          : `0 ${H*0.04}px ${H*0.08}px -${H*0.03}px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05)`,
      }}>
        <div style={{
          width: screenW, height: screenH,
          borderRadius: screenRadius, overflow:'hidden',
          position:'relative', background:'#000',
        }}>
          <img src={screen} alt="" style={{
            width:'100%', height:'100%', objectFit:'cover', display:'block'
          }}/>
          {F.notch && (
            <div style={{
              position:'absolute', top: screenH*0.018,
              left:'50%', transform:'translateX(-50%)',
              width: screenW*0.30, height: screenH*0.022,
              borderRadius: screenH*0.011, background:'#000'
            }}/>
          )}
        </div>
      </div>
    </div>
  );
}

window.Screenshot = Screenshot;
