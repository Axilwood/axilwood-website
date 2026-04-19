import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 1. Initialize Supabase (Make sure these are exactly your copied keys!)
const supabaseUrl = 'https://wqlwurobvkzjixkoivxf.supabase.co'; 
const supabaseKey = 'sb_publishable_I4rCqO3kdJLN-U8fgLoskA_AchQwKVr'; 

// Safety net: If keys are wrong, the script won't crash the whole site
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error("Supabase failed to load. Check your URL/Keys.", error);
}

// 2. Load the Header and Footer immediately (Modules don't need to wait)
async function loadSiteComponents() {
  try {
    // Fetch Header
    const headerRes = await fetch('/header.html');
    document.getElementById('header-placeholder').innerHTML = await headerRes.text();

    // Fetch Footer
    const footerRes = await fetch('/footer.html');
    document.getElementById('footer-placeholder').innerHTML = await footerRes.text();

    // Run Auth Check only if Supabase successfully initialized
    if (supabase) {
      setupAuth();
    }
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}

// Execute the component loader
loadSiteComponents();

// 3. Setup Authentication Buttons
async function setupAuth() {
  const authBtn = document.getElementById('auth-btn');
  if (!authBtn) return;

  const { data: { session } } = await supabase.auth.getSession();

  // The official Google SVG Logo
  const googleLogo = `<svg class="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path></svg>`;

  if (session) {
    // Styling for when logged in
    authBtn.innerHTML = 'Log Out';
    authBtn.className = 'text-gray-600 hover:text-red-600 font-medium transition-colors'; 
    authBtn.onclick = async () => {
       await supabase.auth.signOut();
       window.location.reload(); 
    };
  } else {
    // Styling for the Google Sign In Button
    authBtn.innerHTML = `${googleLogo} <span>Sign in with Google</span>`;
    authBtn.className = 'flex items-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg shadow-sm transition-all font-medium';
    authBtn.onclick = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/Invitations'
        }
      });
    };
  }
}