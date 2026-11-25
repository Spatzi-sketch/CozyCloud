import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function CloudFace({ size = 120, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 120 78" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M95.5 62H24.5C12.0736 62 2 51.9264 2 39.5C2 28.3726 10.0934 19.1268 20.7208 17.3433C23.0873 7.4935 32.0028 0 42.5 0C49.737 0 56.1943 3.55744 60.1478 9.05367C63.7066 7.10301 67.8087 6 72.1667 6C85.2776 6 96.0564 16.0135 97.2842 28.8265C109.62 30.3193 119 40.8124 119 53.5C119 58.1944 108.5 62 95.5 62Z" fill="#FFFDF8" stroke="#F4AFC6" strokeWidth="3"/>
      <circle cx="44" cy="38" r="4.5" fill="#55434A"/>
      <circle cx="76" cy="38" r="4.5" fill="#55434A"/>
      <path d="M52 46C54.5 49 65.5 49 68 46" stroke="#55434A" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="36" cy="45" r="5" fill="#F7C9D8" fillOpacity="0.7"/>
      <circle cx="84" cy="45" r="5" fill="#F7C9D8" fillOpacity="0.7"/>
    </svg>
  );
}

export function Star({ size = 32, className, color = "#F4AFC6", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M16 2L19.5 11.5L29 12.5L21.5 19L24 29L16 23L8 29L10.5 19L3 12.5L12.5 11.5L16 2Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function Heart({ size = 28, className, color = "#F4AFC6", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M16 28C16 28 3 20.5 3 11.5C3 6.80558 6.80558 3 11.5 3C13.9853 3 16.2159 4.06867 17.75 5.75C19.2841 4.06867 21.5147 3 24 3C28.6944 3 32.5 6.80558 32.5 11.5C32.5 20.5 16 28 16 28Z" fill={color} transform="translate(-1.75 0) scale(0.95)" />
    </svg>
  );
}

export function Bow({ size = 48, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 64 42" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M32 21C32 21 20 8 10 10C2 12 2 28 10 32C18 36 32 21 32 21Z" fill="#F7C9D8" stroke="#F4AFC6" strokeWidth="2.5"/>
      <path d="M32 21C32 21 44 8 54 10C62 12 62 28 54 32C46 36 32 21 32 21Z" fill="#F7C9D8" stroke="#F4AFC6" strokeWidth="2.5"/>
      <circle cx="32" cy="21" r="6" fill="#F4AFC6" stroke="#E895B0" strokeWidth="2"/>
    </svg>
  );
}

export function Sparkle({ size = 20, className, color = "#E8DDF7", ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={color}/>
    </svg>
  );
}

export function SleepingBear({ size = 140, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 160 120" fill="none" className={className} aria-hidden="true" {...props}>
      <ellipse cx="80" cy="85" rx="55" ry="28" fill="#F7C9D8" />
      <circle cx="45" cy="45" r="16" fill="#E8DDF7" />
      <circle cx="115" cy="45" r="16" fill="#E8DDF7" />
      <circle cx="80" cy="55" r="34" fill="#FFFDF8" stroke="#F4AFC6" strokeWidth="3"/>
      <path d="M66 55C66 55 69 58 72 55" stroke="#55434A" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M88 55C88 55 91 58 94 55" stroke="#55434A" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="80" cy="64" rx="6" ry="4" fill="#F4AFC6"/>
      <path d="M76 68C78 71 82 71 84 68" stroke="#55434A" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="62" cy="62" r="5" fill="#F7C9D8" fillOpacity="0.6"/>
      <circle cx="98" cy="62" r="5" fill="#F7C9D8" fillOpacity="0.6"/>
      <text x="120" y="35" fontSize="20" fill="#F4AFC6">z</text>
      <text x="132" y="24" fontSize="14" fill="#F4AFC6" opacity="0.7">z</text>
    </svg>
  );
}

export function CapybaraMug({ size = 160, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none" className={className} aria-hidden="true" {...props}>
      <ellipse cx="90" cy="155" rx="60" ry="12" fill="#F7C9D8" fillOpacity="0.3"/>
      {/* Body */}
      <path d="M45 120C45 95 60 78 90 78C120 78 135 95 135 120C135 142 120 155 90 155C60 155 45 142 45 120Z" fill="#D4A574"/>
      {/* Head */}
      <ellipse cx="90" cy="72" rx="38" ry="32" fill="#C9956A"/>
      {/* Ears */}
      <ellipse cx="60" cy="48" rx="8" ry="6" fill="#C9956A"/>
      <ellipse cx="120" cy="48" rx="8" ry="6" fill="#C9956A"/>
      <ellipse cx="60" cy="48" rx="4" ry="3" fill="#E8B89D"/>
      <ellipse cx="120" cy="48" rx="4" ry="3" fill="#E8B89D"/>
      {/* Face */}
      <path d="M78 70C78 70 81 73 84 70" stroke="#55434A" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M96 70C96 70 99 73 102 70" stroke="#55434A" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="90" cy="80" rx="10" ry="7" fill="#B8885C"/>
      <ellipse cx="90" cy="78" rx="5" ry="3.5" fill="#55434A"/>
      <path d="M86 84C88 87 92 87 94 84" stroke="#55434A" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="72" cy="77" r="5" fill="#F7C9D8" fillOpacity="0.5"/>
      <circle cx="108" cy="77" r="5" fill="#F7C9D8" fillOpacity="0.5"/>
      {/* Mug */}
      <rect x="108" y="100" width="34" height="36" rx="8" fill="#F4AFC6" stroke="#E895B0" strokeWidth="2.5"/>
      <path d="M142 108C150 108 152 116 152 120C152 124 150 130 142 130" stroke="#E895B0" strokeWidth="3" fill="none"/>
      <path d="M114 100C114 94 118 94 118 90" stroke="#E8DDF7" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M124 98C124 92 128 92 128 88" stroke="#E8DDF7" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M132 100C132 94 136 94 136 90" stroke="#E8DDF7" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M120 122C120 122 125 117 128 119C131 121 128 126 125 128C122 126 119 121 120 122Z" fill="#FFFDF8" fillOpacity="0.8"/>
      {/* Arms holding mug */}
      <path d="M105 118C108 115 112 112 115 114" stroke="#C9956A" strokeWidth="7" strokeLinecap="round"/>
    </svg>
  );
}

export function CozyCloudLogo({ className }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className || ""}`}>
      <svg width="44" height="30" viewBox="0 0 120 78" fill="none" aria-hidden="true">
        <path d="M95.5 62H24.5C12.0736 62 2 51.9264 2 39.5C2 28.3726 10.0934 19.1268 20.7208 17.3433C23.0873 7.4935 32.0028 0 42.5 0C49.737 0 56.1943 3.55744 60.1478 9.05367C63.7066 7.10301 67.8087 6 72.1667 6C85.2776 6 96.0564 16.0135 97.2842 28.8265C109.62 30.3193 119 40.8124 119 53.5C119 58.1944 108.5 62 95.5 62Z" fill="#FFFDF8" stroke="#F4AFC6" strokeWidth="4"/>
        <circle cx="44" cy="38" r="4.5" fill="#55434A"/>
        <circle cx="76" cy="38" r="4.5" fill="#55434A"/>
        <path d="M52 46C54.5 49 65.5 49 68 46" stroke="#55434A" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="36" cy="45" r="5" fill="#F7C9D8" fillOpacity="0.7"/>
        <circle cx="84" cy="45" r="5" fill="#F7C9D8" fillOpacity="0.7"/>
      </svg>
      <span className="font-display font-bold text-2xl md:text-[1.7rem] tracking-tight text-cocoa">
        Cozy <span className="text-rose-soft-deep">Cloud</span>
      </span>
    </div>
  );
}
