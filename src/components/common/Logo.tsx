// src/components/common/Logo.tsx
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/"
      className="absolute top-6 left-6 flex items-center gap-2 group"
    >
      <div className="w-10 h-10 bg-[#B2EBFF] rounded-full flex items-center justify-center">
        <img
          src="/src/assets/images/landing.png"
          alt="EDUGEN Logo"
          className="w-8 h-8 object-contain"
        />
      </div>
      <span className="text-2xl font-bold font-comic text-primary group-hover:text-blue-600 transition-colors">
        EDUGEN
      </span>
    </Link>
  );
};

export default Logo;