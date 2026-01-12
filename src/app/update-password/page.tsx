'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Initialize the Supabase client once per component
  const supabase = createClientComponentClient();

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);

    try {
      // The user is already authenticated at this point because they followed a valid link from the password reset email.
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        // If Supabase returns an error, show it to the user
        setError(`Error updating password: ${error.message}`);
      } else {
        // On success, show a confirmation message and then redirect
        setMessage("Password updated successfully! You will be redirected to the home page shortly.");
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (e: any) {
        // Catch any other unexpected errors
        console.error("An unexpected error occurred:", e);
        setError(e.message);
    } finally {
        // IMPORTANT: This ensures the loading state is always turned off, even if an error occurs.
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Your Password</h2>
      <form onSubmit={handleUpdatePassword}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>{message}</p>}
      </form>
    </div>
  );
}
