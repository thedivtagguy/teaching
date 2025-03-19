import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Type definitions
type AssignmentKey = string;
type CompletionStore = Record<AssignmentKey, boolean>;

// Create a store key for the specific course
const getStoreKey = (courseId: string) => `${courseId}_assignments`;

// Create function to generate a unique key for an assignment
const createAssignmentKey = (courseId: string, assignmentId: string | null) => {
  if (!assignmentId) return null;
  return `${courseId}:${assignmentId}`;
};

// Initialize the store with data from localStorage if available
function createAssignmentStore() {
  // The main store that contains all assignment completion statuses
  const { subscribe, set, update } = writable<CompletionStore>({});
  
  // Initialize the store for a specific course
  const initCourse = (courseId: string) => {
    if (!browser) return;
    
    // Try to load from localStorage
    try {
      const key = getStoreKey(courseId);
      const storedData = localStorage.getItem(key);
      
      if (storedData) {
        // If we have stored data, merge it with current store
        const parsed = JSON.parse(storedData) as CompletionStore;
        update(current => ({ ...current, ...parsed }));
      }
      
      // Also check for any legacy keys
      const legacyPrefix = `${courseId}_reading_`;
      const assignmentPrefix = `${courseId}_assignment_`;
      
      // Scan localStorage for legacy keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        
        if (key.startsWith(legacyPrefix) || key.startsWith(assignmentPrefix)) {
          const value = localStorage.getItem(key);
          if (value === 'completed') {
            // Extract the assignment ID from the key
            let assignmentId;
            if (key.startsWith(legacyPrefix)) {
              assignmentId = key.substring(legacyPrefix.length);
            } else {
              assignmentId = key.substring(assignmentPrefix.length);
            }
            
            // Mark it as completed in our store
            const assignmentKey = createAssignmentKey(courseId, assignmentId);
            if (assignmentKey) {
              update(store => ({ ...store, [assignmentKey]: true }));
            }
            
            // Clean up legacy key
            localStorage.removeItem(key);
          }
        }
      }
      
      // Save the consolidated data back to localStorage
      syncToStorage(courseId);
    } catch (e) {
      console.error('Failed to load assignment completion data:', e);
    }
  };
  
  // Save the store to localStorage
  const syncToStorage = (courseId: string) => {
    if (!browser) return;
    
    update(store => {
      // Filter only the assignments for this course
      const coursePrefix = `${courseId}:`;
      const courseData: CompletionStore = {};
      
      Object.entries(store).forEach(([key, value]) => {
        if (key.startsWith(coursePrefix)) {
          courseData[key] = value;
        }
      });
      
      // Save to localStorage
      try {
        localStorage.setItem(getStoreKey(courseId), JSON.stringify(courseData));
      } catch (e) {
        console.error('Failed to save assignment completion data:', e);
      }
      
      return store;
    });
  };
  
  // Toggle the completion status of an assignment
  const toggleCompletion = (courseId: string, assignmentId: string | null) => {
    if (!browser || !assignmentId) return false;
    
    let isCompleted = false;
    
    update(store => {
      const key = createAssignmentKey(courseId, assignmentId);
      if (!key) return store;
      
      // Toggle the completion status
      isCompleted = !store[key];
      const updated = { ...store, [key]: isCompleted };
      
      // Save to localStorage
      try {
        localStorage.setItem(getStoreKey(courseId), JSON.stringify(updated));
        
        // Dispatch a storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: getStoreKey(courseId),
          newValue: JSON.stringify(updated),
          storageArea: localStorage
        }));
      } catch (e) {
        console.error('Failed to save assignment completion status:', e);
      }
      
      return updated;
    });
    
    return isCompleted;
  };
  
  // Check if an assignment is completed
  const isCompleted = (courseId: string, assignmentId: string | null) => {
    if (!browser || !assignmentId) return false;
    
    let completed = false;
    
    update(store => {
      const key = createAssignmentKey(courseId, assignmentId);
      if (key) {
        completed = !!store[key];
      }
      return store;
    });
    
    return completed;
  };
  
  // Listen for storage events from other tabs/windows
  if (browser) {
    window.addEventListener('storage', (event) => {
      // If the event is for our assignments store
      if (event.key && event.key.endsWith('_assignments') && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue) as CompletionStore;
          update(current => ({ ...current, ...newData }));
        } catch (e) {
          console.error('Failed to process storage event:', e);
        }
      }
    });
  }
  
  return {
    subscribe,
    initCourse,
    toggleCompletion,
    isCompleted
  };
}

// Export the store
export const assignmentStore = createAssignmentStore(); 