import { useState, type ComponentType } from "react";
import { Link, useLocation } from "react-router";
import { FiHome, FiLink2, FiSettings, FiMenu, FiX } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const NavLink = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
  }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? "bg-purple-100 text-purple-700"
            : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
        }`}
      >
        <Icon className="text-base" />
        <span>{label}</span>
      </Link>
    );
  };

  const links = (
    <ul className="space-y-1">
      <li>
        <NavLink to="/" icon={FiHome} label="Home" />
      </li>
      <li>
        <NavLink to="/wallet" icon={FaWallet} label="Wallet" />
      </li>
      <li>
        <NavLink to="/connect" icon={FiLink2} label="Connect" />
      </li>
      <li>
        <NavLink to="/settings" icon={FiSettings} label="Settings" />
      </li>
    </ul>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-purple-600">PeanutPal</div>
          <button
            aria-label="Toggle navigation"
            className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            {links}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="text-2xl font-bold text-purple-600">PeanutPal</div>
        </div>
        <nav className="p-4">{links}</nav>
      </aside>
    </>
  );
}

export default Navbar;
