import { supabase } from '../lib/supabase'; // adjust path as needed

export const classifyImage = async (file) => {
  // Get current user session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error('User not authenticated');
  }

  const user_email = session.user.email;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_email', user_email); // pass to FastAPI

  const res = await fetch('http://localhost:8000/predict/', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
  const errorData = await res.json();
  throw new Error(errorData.message || 'Classification failed');
}

  return await res.json();
};


