import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-purple-600">PeanutPal</h1>
          </div>

          {/* Navigation Links */}
          <div className="ml-10 flex items-baseline space-x-4">
            <Link
              to={"/"}
              className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to={"/wallet"}
              className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Wallet
            </Link>
            <Link
              to={"/connect"}
              className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Connect
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
