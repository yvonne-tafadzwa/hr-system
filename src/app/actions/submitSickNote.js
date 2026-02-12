/**
 * Client-side action to submit a sick note.
 * Calls the Express API server which handles server-side operations.
 *
 * @param {Object} formData - Sick note form data
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function submitSickNoteAction(formData) {
  try {
    const response = await fetch('/api/submit-sick-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await response.json();
  } catch (error) {
    console.error('Submit sick note error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}