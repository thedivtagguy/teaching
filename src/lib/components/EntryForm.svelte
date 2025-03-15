<!-- 
  EntryForm.svelte - Component for submitting entries to the Google Spreadsheet
  using our schema validation
-->
<script lang="ts">
  import { spreadsheetSchema, type SpreadsheetEntry, formatDate } from '$lib/schema';
  import { onMount } from 'svelte';

  // Initialize with empty values
  let formData: Partial<SpreadsheetEntry> = {
    date: formatDate(new Date()),
    username: '',
    class_confidence: 0,
    sentence_summary: '',
    keywords: '',
    sleep_hours: undefined,
    skipped_meals_prev_day: undefined
  };

  let errors: Record<string, string> = {};
  let isSubmitting = false;
  let submitSuccess = false;
  let submitError = '';

  // Validate a single field
  function validateField(field: keyof SpreadsheetEntry, value: any) {
    try {
      // Use Zod to validate just this field
      const fieldValidator = spreadsheetSchema.shape[field];
      fieldValidator.parse(value);
      // Clear any previous error for this field
      delete errors[field];
    } catch (error: any) {
      // Set the error message for this field
      errors[field] = error.errors?.[0]?.message || `Invalid ${field}`;
    }
  }

  // Validate all required fields
  function validateForm() {
    // Check each required field
    validateField('username', formData.username);
    validateField('class_confidence', formData.class_confidence);
    validateField('sentence_summary', formData.sentence_summary);
    validateField('keywords', formData.keywords);
    
    // Only validate optional fields if they have values
    if (formData.sleep_hours !== undefined) {
      validateField('sleep_hours', formData.sleep_hours);
    }
    
    if (formData.skipped_meals_prev_day !== undefined) {
      validateField('skipped_meals_prev_day', formData.skipped_meals_prev_day);
    }
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
  }
  
  // Handle form submission
  async function handleSubmit() {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Reset status
    submitSuccess = false;
    submitError = '';
    
    // Validate form
    if (!validateForm()) {
      submitError = 'Please fix the errors in the form';
      return;
    }
    
    try {
      isSubmitting = true;
      
      // Use either the SvelteKit API endpoint or direct Netlify function URL
      const apiUrl = typeof window !== 'undefined' 
        ? new URL('/api/submit', window.location.origin).href
        : '';
      
      console.log('Submitting form to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || 'Failed to submit entry');
      }
      
      // Success!
      submitSuccess = true;
      // Reset form
      formData = {
        date: formatDate(new Date()),
        username: formData.username, // Keep the username for convenience
        class_confidence: 0,
        sentence_summary: '',
        keywords: '',
        sleep_hours: undefined,
        skipped_meals_prev_day: undefined
      };
    } catch (error) {
      console.error('Error submitting form:', error);
      submitError = error instanceof Error ? error.message : 'An unknown error occurred';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="entry-form">
  
  {#if submitSuccess}
    <div class="bg-sage p-4 mb-6 rounded-md border-2 border-neutral btn-drop-shadow text-white font-archivo font-bold">
      Entry submitted successfully!
    </div>
  {/if}
  
  {#if submitError}
    <div class="bg-red p-4 mb-6 rounded-md border-2 border-neutral btn-drop-shadow text-white font-archivo font-bold">
      {submitError}
    </div>
  {/if}
  
  <!-- Required fields -->
  <div class="mb-6">
    <label for="username" class="block font-bold font-roboto text-neutral uppercase mb-2">Username *</label>
    <input
      type="text"
      id="username"
      bind:value={formData.username}
      on:blur={() => validateField('username', formData.username)}
      class="w-full p-3 bg-base-100 border-2 border-neutral rounded-md font-archivo focus:outline-none focus:ring-2 focus:ring-blue"
      required
    />
    {#if errors.username}
      <span class="text-red font-archivo mt-1 block">{errors.username}</span>
    {/if}
  </div>
  
  <div class="mb-6">
    <label for="class_confidence" class="block font-bold font-roboto text-neutral uppercase mb-2">Class Confidence (0-100) *</label>
    <input
      type="number"
      id="class_confidence"
      min="0"
      max="100"
      bind:value={formData.class_confidence}
      on:blur={() => validateField('class_confidence', formData.class_confidence)}
      class="w-full p-3 bg-base-100 border-2 border-neutral rounded-md font-archivo focus:outline-none focus:ring-2 focus:ring-blue"
      required
    />
    {#if errors.class_confidence}
      <span class="text-red font-archivo mt-1 block">{errors.class_confidence}</span>
    {/if}
  </div>
  
  <div class="mb-6">
    <label for="sentence_summary" class="block font-bold font-roboto text-neutral uppercase mb-2">Sentence Summary *</label>
    <textarea
      id="sentence_summary"
      bind:value={formData.sentence_summary}
      on:blur={() => validateField('sentence_summary', formData.sentence_summary)}
      class="w-full p-3 bg-base-100 border-2 border-neutral rounded-md font-archivo focus:outline-none focus:ring-2 focus:ring-blue h-32"
      required
    ></textarea>
    {#if errors.sentence_summary}
      <span class="text-red font-archivo mt-1 block">{errors.sentence_summary}</span>
    {/if}
  </div>
  
  <div class="mb-6">
    <label for="keywords" class="block font-bold font-roboto text-neutral uppercase mb-2">Keywords (comma-separated) *</label>
    <input
      type="text"
      id="keywords"
      bind:value={formData.keywords}
      on:blur={() => validateField('keywords', formData.keywords)}
      placeholder="e.g. visualization, data, chart"
      class="w-full p-3 bg-base-100 border-2 border-neutral rounded-md font-archivo focus:outline-none focus:ring-2 focus:ring-blue"
      required
    />
    {#if errors.keywords}
      <span class="text-red font-archivo mt-1 block">{errors.keywords}</span>
    {/if}
  </div>
  
  <!-- Optional fields -->
  <h3 class="text-xl font-bold font-libre-caslon text-neutral border-b border-base-300 pb-2 mb-6 mt-10">Optional Information</h3>
  
  <div class="mb-6">
    <label for="sleep_hours" class="block font-bold font-roboto text-neutral uppercase mb-2">Sleep Hours</label>
    <input
      type="number"
      id="sleep_hours"
      min="0"
      max="24"
      step="0.5"
      bind:value={formData.sleep_hours}
      on:blur={() => {
        if (formData.sleep_hours !== undefined) {
          validateField('sleep_hours', formData.sleep_hours);
        }
      }}
      class="w-full p-3 bg-base-100 border-2 border-neutral rounded-md font-archivo focus:outline-none focus:ring-2 focus:ring-blue"
    />
    {#if errors.sleep_hours}
      <span class="text-red font-archivo mt-1 block">{errors.sleep_hours}</span>
    {/if}
  </div>
  
  <div class="mb-6">
    <label for="skipped_meals" class="block font-bold font-roboto text-neutral uppercase mb-2">Skipped Meals (comma-separated)</label>
    <input
      type="text"
      id="skipped_meals"
      bind:value={formData.skipped_meals_prev_day}
      placeholder="e.g. breakfast, lunch"
      on:blur={() => {
        if (formData.skipped_meals_prev_day) {
          validateField('skipped_meals_prev_day', formData.skipped_meals_prev_day);
        }
      }}
      class="w-full p-3 bg-base-100 border-2 border-neutral rounded-md font-archivo focus:outline-none focus:ring-2 focus:ring-blue"
    />
    {#if errors.skipped_meals_prev_day}
      <span class="text-red font-archivo mt-1 block">{errors.skipped_meals_prev_day}</span>
    {/if}
  </div>
  
  <div class="mt-8">
    <button 
      type="submit" 
      disabled={isSubmitting}
      class="bg-blue hover:bg-purple text-white py-3 px-6 rounded-md border-2 border-neutral btn-drop-shadow font-roboto font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Submitting...' : 'Submit Entry'}
    </button>
  </div>
</form>

<style>
  .entry-form {
    max-width: 600px;
  
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  
  h3 {
    color: #555;
    margin: 20px 0 10px;
    font-size: 1.1em;
  }
  
 
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
  }
  
  textarea {
    height: 100px;
    resize: vertical;
  }
  
  .error {
    color: #e53935;
    font-size: 0.85em;
    margin-top: 5px;
    display: block;
  }
  
  .success-message {
    background-color: #e8f5e9;
    color: #388e3c;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .error-message {
    background-color: #ffebee;
    color: #c62828;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  button {
    background-color: #1976d2;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s;
  }
  
  button:hover:not(:disabled) {
    background-color: #1565c0;
  }
  
  button:disabled {
    background-color: #90caf9;
    cursor: not-allowed;
  }
  
  .form-actions {
    text-align: right;
    margin-top: 20px;
  }
</style> 