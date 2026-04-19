// 1. Import Supabase directly via CDN (No complex installations needed!)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 2. Initialize Supabase (REPLACE THESE WITH YOUR COPIED KEYS)
const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
const supabaseKey = 'YOUR_PUBLISHABLE_API_KEY_HERE';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async function() {
  // Fetch Header
  await fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    });

  // Fetch Footer
  await fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    });

  // Run Authentication Check after header loads
  setupAuth();
});

async function setupAuth() {
  const authBtn = document.getElementById('auth-btn');
  if (!authBtn) return;

  // Check if a user is currently logged in
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // User IS logged in
    authBtn.textContent = 'Log Out';
    authBtn.onclick = async () => {
       await supabase.auth.signOut();
       window.location.reload(); // Refresh the page to show Login button again
    };
  } else {
    // User is NOT logged in
    authBtn.textContent = 'Sign In with Google';
    authBtn.onclick = async () => {
      // Trigger Google Login and redirect back to the site
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/Invitations'
        }
      });
    };
  }
}