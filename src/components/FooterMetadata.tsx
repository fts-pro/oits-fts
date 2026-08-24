import React from 'react';
import { Link } from 'react-router-dom';

interface FooterMetadataProps {
  links: { name: string; url: string }[];
  onClick?: () => void;
}

export const FooterMetadata: React.FC<FooterMetadataProps> = ({ links, onClick }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.url}
          onClick={onClick}
          className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-blue-400 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};
