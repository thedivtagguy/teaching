import { writable, derived, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

// Type definitions
type AssignmentKey = string;
type CompletionStore = Record<AssignmentKey, boolean>;

// Define Assignment metadata interface
export interface AssignmentMeta {
  id: string;
  title: string;
  due?: string;
  description?: string;
  points?: number;
  path?: string;
  source?: string;
}

export interface AssignmentWithStatus extends AssignmentMeta {
  completed: boolean;
}

export type AssignmentMetaStore = Record<string, Record<string, AssignmentMeta>>;
export type AssignmentsWithStatusStore = Record<string, Record<string, AssignmentWithStatus>>;

// Create a store key for the specific course
const getStoreKey = (courseId: string) => `${courseId}_assignments`;

// Create function to generate a unique key for an assignment
const createAssignmentKey = (courseId: string, assignmentId: string | null) => {
  if (!assignmentId) return null;
  return `${courseId}:${assignmentId}`;
};

// Interface for our store
export interface AssignmentStore {
  subscribe: Readable<CompletionStore>['subscribe'];
  assignments: Readable<AssignmentsWithStatusStore>;
  getAssignmentsForCourse: (courseId: string) => Record<string, AssignmentWithStatus>;
  getAssignment: (courseId: string, assignmentId: string) => AssignmentWithStatus | null;
  initCourse: (courseId: string) => void;
  setAssignments: (courseId: string, assignments: AssignmentMeta[]) => void;
  toggleCompletion: (courseId: string, assignmentId: string | null) => boolean;
  isCompleted: (courseId: string, assignmentId: string | null) => boolean;
  markComplete: (courseId: string, assignmentId: string | null) => void;
  markIncomplete: (courseId: string, assignmentId: string | null) => void;
}

// Initialize the store with data from localStorage if available
function createAssignmentStore(): AssignmentStore {
  // The main store that contains all assignment completion statuses
  const completionStore = writable<CompletionStore>({});
  
  // Store for assignment metadata by course and id
  const metadataStore = writable<AssignmentMetaStore>({});
  
  // Derived store that combines completion status with metadata
  const assignmentsWithStatus = derived(
    [completionStore, metadataStore],
    ([$completions, $metadata]): AssignmentsWithStatusStore => {
      const result: AssignmentsWithStatusStore = {};
      
      // For each course in metadata
      Object.entries($metadata).forEach(([courseId, assignments]) => {
        result[courseId] = {};
        
        // For each assignment in the course
        Object.entries(assignments).forEach(([assignmentId, meta]) => {
          const key = createAssignmentKey(courseId, assignmentId);
          const completed = key ? !!$completions[key] : false;
          
          result[courseId][assignmentId] = {
            ...meta,
            completed
          };
        });
      });
      
      return result;
    }
  );
  
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
        completionStore.update(current => ({ ...current, ...parsed }));
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
              completionStore.update(store => ({ ...store, [assignmentKey]: true }));
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
    
    completionStore.update(store => {
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
  
  // Get all assignments for a course with completion status
  const getAssignmentsForCourse = (courseId: string): Record<string, AssignmentWithStatus> => {
    let result: Record<string, AssignmentWithStatus> = {};
    
    assignmentsWithStatus.subscribe(data => {
      result = data[courseId] || {};
    })();
    
    return result;
  };
  
  // Set assignment metadata
  const setAssignments = (courseId: string, assignments: AssignmentMeta[]) => {
    metadataStore.update(store => {
      // Get existing assignments to preserve them
      const existingAssignments = store[courseId] || {};
      const courseAssignments: Record<string, AssignmentMeta> = { ...existingAssignments };
      
      assignments.forEach(assignment => {
        if (assignment.id) {
          // Preserve any existing metadata for this assignment, but update with new data
          courseAssignments[assignment.id] = {
            ...existingAssignments[assignment.id],
            ...assignment
          };
        }
      });
      
      return {
        ...store,
        [courseId]: courseAssignments
      };
    });
  };
  
  // Get a specific assignment by ID with completion status
  const getAssignment = (courseId: string, assignmentId: string): AssignmentWithStatus | null => {
    let result: AssignmentWithStatus | null = null;
    
    assignmentsWithStatus.subscribe(data => {
      result = data[courseId]?.[assignmentId] || null;
    })();
    
    return result;
  };
  
  // Toggle the completion status of an assignment
  const toggleCompletion = (courseId: string, assignmentId: string | null) => {
    if (!browser || !assignmentId) return false;
    
    let isCompleted = false;
    
    completionStore.update(store => {
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
    
    completionStore.subscribe(store => {
      const key = createAssignmentKey(courseId, assignmentId);
      if (key) {
        completed = !!store[key];
      }
    })();
    
    return completed;
  };

  // Mark an assignment as complete
  const markComplete = (courseId: string, assignmentId: string | null) => {
    if (!browser || !assignmentId) return;
    
    completionStore.update(store => {
      const key = createAssignmentKey(courseId, assignmentId);
      if (!key) return store;
      
      const updated = { ...store, [key]: true };
      
      // Save to localStorage immediately
      try {
        const coursePrefix = `${courseId}:`;
        const courseData: CompletionStore = {};
        
        Object.entries(updated).forEach(([storeKey, value]) => {
          if (storeKey.startsWith(coursePrefix)) {
            courseData[storeKey] = value;
          }
        });
        
        localStorage.setItem(getStoreKey(courseId), JSON.stringify(courseData));
      } catch (e) {
        console.error('Failed to save assignment completion data:', e);
      }
      
      return updated;
    });
  };

  // Mark an assignment as incomplete
  const markIncomplete = (courseId: string, assignmentId: string | null) => {
    if (!browser || !assignmentId) return;
    
    completionStore.update(store => {
      const key = createAssignmentKey(courseId, assignmentId);
      if (!key) return store;
      
      const updated = { ...store, [key]: false };
      
      // Save to localStorage immediately
      try {
        const coursePrefix = `${courseId}:`;
        const courseData: CompletionStore = {};
        
        Object.entries(updated).forEach(([storeKey, value]) => {
          if (storeKey.startsWith(coursePrefix)) {
            courseData[storeKey] = value;
          }
        });
        
        localStorage.setItem(getStoreKey(courseId), JSON.stringify(courseData));
      } catch (e) {
        console.error('Failed to save assignment completion data:', e);
      }
      
      return updated;
    });
  };
  
  // Listen for storage events from other tabs/windows
  if (browser) {
    window.addEventListener('storage', (event) => {
      // If the event is for our assignments store
      if (event.key && event.key.endsWith('_assignments') && event.newValue) {
        try {
          const newData = JSON.parse(event.newValue) as CompletionStore;
          completionStore.update(current => ({ ...current, ...newData }));
        } catch (e) {
          console.error('Failed to process storage event:', e);
        }
      }
    });
  }
  
  return {
    subscribe: completionStore.subscribe,
    assignments: assignmentsWithStatus,
    getAssignmentsForCourse,
    getAssignment,
    initCourse,
    setAssignments,
    toggleCompletion,
    isCompleted,
    markComplete,
    markIncomplete
  };
}

// Export the store
export const assignmentStore = createAssignmentStore(); 