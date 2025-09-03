import { supabase } from '../lib/supabase'; // adjust path as needed

/**
 * Style Transfer Image utility functions
 * Sends image and style to backend for neural style transfer
 */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Transfer style to an image with user authentication
 * @param {File} file - The image file to apply style transfer to
 * @param {string} styleName - The name of the style to apply
 * @returns {Promise<{url: string, filename: string}>} Object with blob URL and suggested filename
 */
export const transferStyle = async (file, styleName) => {
  // Get current user session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error('User not authenticated');
  }



  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('style_name', styleName);
    

    // Call FastAPI
    const response = await fetch(`${API_BASE_URL}/transfer-style/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Style transfer failed: ${response.status}`);
    }

    // Convert response to blob and create object URL
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const filename = `${styleName}_${Date.now()}.jpg`;

    return { url, filename };

  } catch (error) {
    console.error('Style transfer error:', error);
    throw new Error(error.message || 'Failed to apply style transfer');
  }
};

/**
 * Simple style transfer without authentication (alternative version)
 * @param {File} imageFile - The image file to apply style transfer to
 * @param {string} styleName - The name of the style to apply
 * @returns {Promise<string>} Object URL of the styled image
 */
export const styleTransferImage = async (imageFile, styleName) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('style_name', styleName);

    const response = await fetch(`${API_BASE_URL}/transfer-style/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Style transfer failed: ${response.status}`);
    }

    // Convert response to blob and create object URL
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error('Style transfer error:', error);
    throw new Error(error.message || 'Failed to apply style transfer');
  }
};

/**
 * Fetch available styles from backend
 * @returns {Promise<Array>} Array of available style names/objects
 */
export const fetchAvailableStyles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/styles`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch styles: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching styles:', error);
    throw new Error('Failed to load available styles');
  }
};