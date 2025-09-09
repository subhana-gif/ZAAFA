export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('shop'); // 'shop', 'admin-login', 'admin'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsAdminAuthenticated(true);
      setCurrentView('admin');
      setError("");
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('shop');
    setUsername("");
    setPassword("");
    setError("");
  };

  // Admin Login View
  if (currentView === 'admin-login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                onClick={handleLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign in
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => setCurrentView('shop')}
              className="text-green-600 hover:text-green-500 bg-transparent border-none cursor-pointer"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <div>
        <div className="p-4 flex justify-between items-center bg-red-600 text-white">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="space-x-4">
            <button 
              onClick={() => setCurrentView('admin')}
              className="hover:underline bg-transparent border-none text-white cursor-pointer"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('shop')}
              className="hover:underline bg-transparent border-none text-white cursor-pointer"
            >
              View Shop
            </button>
            <button 
              onClick={handleLogout}
              className="hover:underline bg-transparent border-none text-white cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
        <Admin />
      </div>
    );
  }

  // Shop View (Default)
  return (
    <div>
      <div className="p-4 flex justify-between items-center bg-green-600 text-white">
        <h1 className="text-xl font-bold">WhatsApp Shop</h1>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentView('shop')}
            className="hover:underline bg-transparent border-none text-white cursor-pointer"
          >
            Products
          </button>
          <button 
            onClick={() => setCurrentView('admin-login')}
            className="hover:underline bg-transparent border-none text-white cursor-pointer"
          >
            Admin Login
          </button>
        </div>
      </div>
      <ProductList />
    </div>
  );
}