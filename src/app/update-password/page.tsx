'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient'; // Correct import
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // Initialize the Supabase client here, using the new ssr-friendly client
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(`Error updating password: ${error.message}`);
      } else {
        setMessage("Password updated successfully! You will be redirected to the home page shortly.");
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (e: any) {
        console.error("An unexpected error occurred:", e);
        setError(e.message);
    } finally {
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
