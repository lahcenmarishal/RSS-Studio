interface LogoProps {
  className?: string;
  color?: string;
}

const Logo = ({ className = "h-14 w-auto", color = "currentColor" }: LogoProps) => {
  return (
    <svg
      viewBox="0 0 140 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Diamond shape with facets - smaller */}
      <g stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round" transform="translate(35, 5) scale(0.5)">
        {/* Top crown - flat top edge */}
        <path d="M40 25 L100 25" />
        
        {/* Crown sides */}
        <path d="M40 25 L25 45" />
        <path d="M100 25 L115 45" />
        
        {/* Crown to girdle connections */}
        <path d="M25 45 L115 45" />
        
        {/* Crown inner facets */}
        <path d="M40 25 L55 45" />
        <path d="M70 25 L70 45" />
        <path d="M100 25 L85 45" />
        
        {/* Crown top inner lines */}
        <path d="M55 25 L55 45" />
        <path d="M85 25 L85 45" />
        
        {/* Pavilion - bottom point */}
        <path d="M25 45 L70 95" />
        <path d="M115 45 L70 95" />
        
        {/* Pavilion inner facets */}
        <path d="M55 45 L70 95" />
        <path d="M85 45 L70 95" />
        <path d="M70 45 L70 95" />
        
        {/* Additional pavilion facets */}
        <path d="M40 45 L70 95" />
        <path d="M100 45 L70 95" />
      </g>
      
      {/* RSS STUDIO text - larger */}
      <text
        x="70"
        y="90"
        textAnchor="middle"
        fill={color}
        fontFamily="Montserrat, sans-serif"
        fontSize="14"
        fontWeight="500"
        letterSpacing="3"
      >
        RSS STUDIO
      </text>
    </svg>
  );
};

export default Logo;
