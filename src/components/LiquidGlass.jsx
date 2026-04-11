import { default as LibLiquidGlass } from 'liquid-glass-react'

const LiquidGlass = ({ children, intensity = 1, className = "", cornerRadius = 24 }) => {
  return (
    <div className={`relative w-full h-full ${className} liquid-glass-tamed`}>
      <LibLiquidGlass
        displacementScale={30 * intensity}
        blurAmount={0.1}
        saturation={120}
        aberrationIntensity={1}
        cornerRadius={cornerRadius}
        elasticity={0}
        padding="0"
        className="w-full h-full"
        style={{
          position: 'relative',
          top: '0',
          left: '0',
          transform: 'none',
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      >
        <div className="w-full h-full p-6 sm:p-8 md:p-10">
          {children}
        </div>
      </LibLiquidGlass>
    </div>
  )
}

export default LiquidGlass
