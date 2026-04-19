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

  if (session) {
    authBtn.textContent = 'Log Out';
    authBtn.onclick = async () => {
       await supabase.auth.signOut();
       window.location.reload(); 
    };
  } else {
    authBtn.textContent = 'Sign In with Google';
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