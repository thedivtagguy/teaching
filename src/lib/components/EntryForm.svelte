<!-- 
  EntryForm.svelte - Component for submitting entries to the Google Spreadsheet
  using our schema validation
-->
<script lang="ts">
  import { spreadsheetSchema, type SpreadsheetEntry, formatDate } from '$lib/schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Alert } from '$lib/components/ui/alert/index.js';
  import { Card } from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { CheckCircle, AlertCircle } from 'lucide-svelte';
  import { cn } from '$lib/utils/index.js';

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

<Card.Root class="max-w-2xl mx-auto">
  <Card.Header>
    <Card.Title class="font-libre-caslon text-2xl text-foreground">Submit Your Entry</Card.Title>
    <Card.Description class="font-archivo text-muted-foreground">
      Fill out the form below to submit your class entry. Required fields are marked with an asterisk.
    </Card.Description>
  </Card.Header>
  
  <Card.Content>
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      
      {#if submitSuccess}
        <Alert.Root class="border-green-200 bg-green-50 text-green-800">
          <CheckCircle class="h-4 w-4" />
          <Alert.Title>Success!</Alert.Title>
          <Alert.Description>Entry submitted successfully!</Alert.Description>
        </Alert.Root>
      {/if}
      
      {#if submitError}
        <Alert.Root variant="destructive">
          <AlertCircle class="h-4 w-4" />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{submitError}</Alert.Description>
        </Alert.Root>
      {/if}
  
      <!-- Required fields -->
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="username" class="font-roboto font-bold uppercase text-foreground">
            Username *
          </Label>
          <Input
            id="username"
            type="text"
            bind:value={formData.username}
            on:blur={() => validateField('username', formData.username)}
            class={cn(
              "font-archivo",
              errors.username && "border-destructive focus-visible:ring-destructive"
            )}
            required
          />
          {#if errors.username}
            <p class="text-sm text-destructive font-archivo">{errors.username}</p>
          {/if}
        </div>
  
        <div class="space-y-2">
          <Label for="class_confidence" class="font-roboto font-bold uppercase text-foreground">
            Class Confidence (0-100) *
          </Label>
          <Input
            id="class_confidence"
            type="number"
            min="0"
            max="100"
            bind:value={formData.class_confidence}
            on:blur={() => validateField('class_confidence', formData.class_confidence)}
            class={cn(
              "font-archivo",
              errors.class_confidence && "border-destructive focus-visible:ring-destructive"
            )}
            required
          />
          {#if errors.class_confidence}
            <p class="text-sm text-destructive font-archivo">{errors.class_confidence}</p>
          {/if}
        </div>
  
        <div class="space-y-2">
          <Label for="sentence_summary" class="font-roboto font-bold uppercase text-foreground">
            Sentence Summary *
          </Label>
          <Textarea
            id="sentence_summary"
            bind:value={formData.sentence_summary}
            on:blur={() => validateField('sentence_summary', formData.sentence_summary)}
            class={cn(
              "font-archivo min-h-[8rem] resize-y",
              errors.sentence_summary && "border-destructive focus-visible:ring-destructive"
            )}
            required
          />
          {#if errors.sentence_summary}
            <p class="text-sm text-destructive font-archivo">{errors.sentence_summary}</p>
          {/if}
        </div>
  
        <div class="space-y-2">
          <Label for="keywords" class="font-roboto font-bold uppercase text-foreground">
            Keywords (comma-separated) *
          </Label>
          <Input
            id="keywords"
            type="text"
            bind:value={formData.keywords}
            on:blur={() => validateField('keywords', formData.keywords)}
            placeholder="e.g. visualization, data, chart"
            class={cn(
              "font-archivo",
              errors.keywords && "border-destructive focus-visible:ring-destructive"
            )}
            required
          />
          {#if errors.keywords}
            <p class="text-sm text-destructive font-archivo">{errors.keywords}</p>
          {/if}
        </div>
      </div>
  
      <div class="py-4">
        <Separator />
      </div>
      
      <div class="space-y-2">
        <h3 class="text-xl font-bold font-libre-caslon text-foreground">Optional Information</h3>
        <p class="text-sm text-muted-foreground font-archivo">The following fields are optional but help us understand your experience better.</p>
      </div>
  
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="sleep_hours" class="font-roboto font-bold uppercase text-foreground">
            Sleep Hours
          </Label>
          <Input
            id="sleep_hours"
            type="number"
            min="0"
            max="24"
            step="0.5"
            bind:value={formData.sleep_hours}
            on:blur={() => {
              if (formData.sleep_hours !== undefined) {
                validateField('sleep_hours', formData.sleep_hours);
              }
            }}
            class={cn(
              "font-archivo",
              errors.sleep_hours && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {#if errors.sleep_hours}
            <p class="text-sm text-destructive font-archivo">{errors.sleep_hours}</p>
          {/if}
        </div>
  
        <div class="space-y-2">
          <Label for="skipped_meals" class="font-roboto font-bold uppercase text-foreground">
            Skipped Meals (comma-separated)
          </Label>
          <Input
            id="skipped_meals"
            type="text"
            bind:value={formData.skipped_meals_prev_day}
            placeholder="e.g. breakfast, lunch"
            on:blur={() => {
              if (formData.skipped_meals_prev_day) {
                validateField('skipped_meals_prev_day', formData.skipped_meals_prev_day);
              }
            }}
            class={cn(
              "font-archivo",
              errors.skipped_meals_prev_day && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {#if errors.skipped_meals_prev_day}
            <p class="text-sm text-destructive font-archivo">{errors.skipped_meals_prev_day}</p>
          {/if}
        </div>
      </div>
  
      <div class="pt-6">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          class={cn(
            "w-full font-roboto font-bold uppercase tracking-wide",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "border-2 border-foreground shadow-[var(--shadow-btn-drop)]",
            "transition-all duration-[var(--duration-250)]",
            "hover:shadow-[var(--shadow-btn-hover)] hover:-translate-y-0.5",
            "active:shadow-[var(--shadow-btn-active)] active:-translate-y-0",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          )}
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Entry'}
        </Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>

 