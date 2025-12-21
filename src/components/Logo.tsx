interface LogoProps {
  className?: string;
  color?: string;
}

const Logo = ({ className = "h-14 w-auto", color = "currentColor" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Diamond shape */}
      <g stroke={color} strokeWidth="2" fill="none">
        {/* Outer diamond */}
        <path d="M60 8 L92 40 L60 72 L28 40 Z" />
        {/* Inner diamond */}
        <path d="M60 18 L82 40 L60 62 L38 40 Z" />
      </g>
      
      {/* RSS STUDIO text */}
      <text
        x="60"
        y="90"
        textAnchor="middle"
        fill={color}
        fontFamily="Montserrat, sans-serif"
        fontSize="12"
        fontWeight="500"
        letterSpacing="3"
      >
        RSS STUDIO
      </text>
    </svg>
  );
};

export default Logo;