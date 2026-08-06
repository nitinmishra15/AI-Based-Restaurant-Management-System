import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for routing redirection
import { useAuth } from '../../app/providers/AuthContextApi/AuthProvider';
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Consume the login method from our Context hook
  const { login } = useAuth();
  
  // Hook for navigation
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Password validation rule
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setError("Password must be at least 8 characters long.");
      setSubmitting(false);
      return;
    }
    if (!hasUpperCase) {
      setError("Password must contain at least one capital letter.");
      setSubmitting(false);
      return;
    }
    if (!hasLowerCase) {
      setError("Password must contain at least one small letter.");
      setSubmitting(false);
      return;
    }
    if (!hasSpecialChar) {
      setError("Password must contain at least one special symbol.");
      setSubmitting(false);
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      console.log("Logged in successfully via Context!");
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const role = savedUser?.role || savedUser?.Role;
      if (role === 'Admin') {
        navigate('/admin/');
      } else if (role === 'Chef') {
        navigate('/chef/');
      } else {
        navigate('/user');
      }
    } else {
      setError(result.message);
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        </div>
        {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg text-left">{error}</div>}
        <form className="space-y-5 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required 
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B71F04]"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-[#B71F04] text-white font-semibold hover:bg-[#FD745A] disabled:opacity-50 transition-colors duration-200 cursor-pointer"
          >
            {submitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-5">
          <span className="text-xs text-gray-500">no account ? </span>
          <span 
            onClick={() => navigate('/register')} 
            className="text-xs text-[#B71F04] font-bold hover:underline cursor-pointer"
          >
            pleases register ?
          </span>
        </div>
      </div>
    </div>
  );
}

