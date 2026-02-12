/**
 * Client-side action to register a new company with admin account.
 * Calls the Express API server which handles server-side operations.
 *
 * @param {Object} formData - Registration form data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function registerCompanyAction(formData) {
  try {
    const response = await fetch('/api/register-company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during registration' };
  }
}
