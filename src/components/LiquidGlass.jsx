import { default as LibLiquidGlass } from 'liquid-glass-react'

const LiquidGlass = ({ children, intensity = 1, className = "", cornerRadius = 24 }) => {
  return (
    <div className={`relative w-full h-full ${className} liquid-glass-tamed overflow-hidden group/glass`}>
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
        <div className="w-full h-full p-6 sm:p-8 md:p-10 relative z-10">
          {children}
        </div>
        {/* Shine Sweep Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/glass:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/glass:animate-[shine_1.5s_ease-in-out_infinite]" />
        </div>
      </LibLiquidGlass>
    </div>
  )
}

export default LiquidGlass
