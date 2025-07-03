<script>
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';
  
  let minutes = 5;
  let seconds = 0;
  let totalSeconds = minutes * 60 + seconds;
  let timerRunning = false;
  let timerInterval;
  let settingsVisible = false;
  let audio;
  
  // Format time as MM:SS
  function formatTime(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Start the timer
  function startTimer() {
    if (!timerRunning && totalSeconds > 0) {
      timerRunning = true;
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
        } else {
          clearInterval(timerInterval);
          timerRunning = false;
        }
      }, 1000);
    }
  }
  
  // Pause the timer
  function pauseTimer() {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    }
  }
  
  // Reset the timer
  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    totalSeconds = minutes * 60 + seconds;
  }
  
  // Toggle settings
  function toggleSettings() {
    settingsVisible = !settingsVisible;
  }
  
  // Update total seconds when minutes or seconds change
  function updateTimer() {
    totalSeconds = minutes * 60 + seconds;
  }
  
  let buzzerInterval;
  
  // Play buzzer sound
  function playBuzzer() {
    if (!browser || !audio) return;
    
    // Clear any existing interval
    clearInterval(buzzerInterval);
    
    // Play sound immediately
    audio.currentTime = 0;
    audio.play().catch(e => console.error('Error playing audio:', e));
    
    // Setup interval to keep playing while button is held
    buzzerInterval = setInterval(() => {
      audio.currentTime = 0;
      audio.play().catch(e => console.error('Error playing audio:', e));
    }, 400); // Repeat every 400ms while held
  }
  
  // Stop buzzer sound when released
  function stopBuzzer() {
    if (buzzerInterval) {
      clearInterval(buzzerInterval);
      buzzerInterval = null;
    }
  }
  
  // Handle keyboard shortcuts
  function handleKeydown(event) {
    // 's' key to toggle settings
    if (event.key === 's') {
      toggleSettings();
    }
    // 'space' to start/pause timer
    if (event.key === ' ') {
      if (timerRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    }
    // 'r' to reset timer
    if (event.key === 'r') {
      resetTimer();
    }
    // 'b' to trigger buzzer
    if (event.key === 'b') {
      playBuzzer();
    }
  }
  
  // Create a better buzzer sound using Web Audio API as fallback
  function createBuzzerSound() {
    if (!browser) return;
    
    try {
      // Use Web Audio API as a fallback
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.error('Web Audio API not supported');
        return;
      }
      
      const audioContext = new AudioContext();
      let activeOscillators = [];
      
      // Create a better game show buzzer sound
      audio = {
        play: function() {
          try {
            // Create two oscillators for a richer sound
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const distortion = audioContext.createWaveShaper();
            
            // Add to active oscillators to be able to stop them
            activeOscillators.push(oscillator1, oscillator2);
            
            // First oscillator - lower frequency
            oscillator1.type = 'square';
            oscillator1.frequency.setValueAtTime(55, audioContext.currentTime);
            
            // Second oscillator - higher frequency
            oscillator2.type = 'sawtooth';
            oscillator2.frequency.setValueAtTime(110, audioContext.currentTime);
            
            // Create distortion curve for more aggressive sound
            function makeDistortionCurve(amount) {
              const k = typeof amount === 'number' ? amount : 50;
              const n_samples = 44100;
              const curve = new Float32Array(n_samples);
              const deg = Math.PI / 180;
              
              for (let i = 0; i < n_samples; i++) {
                const x = (i * 2) / n_samples - 1;
                curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
              }
              
              return curve;
            }
            
            distortion.curve = makeDistortionCurve(400);
            distortion.oversample = '4x';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            
            // Connect the audio graph
            oscillator1.connect(distortion);
            oscillator2.connect(distortion);
            distortion.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Start oscillators
            oscillator1.start();
            oscillator2.start();
            
            // Stop after 300ms for a sharp buzz sound
            setTimeout(() => {
              try {
                oscillator1.stop();
                oscillator2.stop();
                
                // Remove from active oscillators
                activeOscillators = activeOscillators.filter(osc => 
                  osc !== oscillator1 && osc !== oscillator2);
              } catch (e) {
                // Ignore errors from stopping already stopped oscillators
              }
            }, 300);
            
            return Promise.resolve();
          } catch (e) {
            console.error('Error playing synthetic sound:', e);
            return Promise.reject(e);
          }
        },
        currentTime: 0,
        // Add method to stop all active oscillators
        stop: function() {
          activeOscillators.forEach(osc => {
            try {
              osc.stop();
            } catch (e) {
              // Ignore errors from stopping already stopped oscillators
            }
          });
          activeOscillators = [];
        }
      };
    } catch (e) {
      console.error('Error creating fallback buzzer sound:', e);
    }
  }
  
  onMount(() => {
    if (!browser) return;
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeydown);
    
    try {
      // Try to initialize audio with a file
      audio = new Audio('/sounds/buzzer.mp3');
      
      // Test if audio loaded properly - if not, create a synthesized sound
      audio.addEventListener('error', () => {
        console.log('Buzzer sound file error, using synthesized sound');
        createBuzzerSound();
      });
      
      audio.addEventListener('loadeddata', () => {
        if (audio.duration === 0) {
          console.log('Buzzer sound file empty, using synthesized sound');
          createBuzzerSound();
        }
      });
    } catch (e) {
      console.error('Error initializing audio, using fallback:', e);
      createBuzzerSound();
    }
  });
  
  onDestroy(() => {
    if (!browser) return;
    
    // Clean up
    if (timerInterval) clearInterval(timerInterval);
    if (buzzerInterval) clearInterval(buzzerInterval);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="buzzer-container">
  <div class="game-show-timer">
    <div class="timer-display {timerRunning ? 'running' : totalSeconds === 0 ? 'expired' : ''}">
      <h1 class="timer-text">{formatTime(totalSeconds)}</h1>
    </div>
  </div>
  
  <button 
    class="buzzer-button" 
    on:mousedown={playBuzzer} 
    on:mouseup={stopBuzzer} 
    on:mouseleave={stopBuzzer} 
    on:touchstart|preventDefault={playBuzzer} 
    on:touchend|preventDefault={stopBuzzer}
  >
    <span class="buzzer-text">Time's up!</span>
  </button>
  
  <!-- Control panel in a separate overlay, only shown when 'S' key is pressed -->
  {#if settingsVisible}
    <div class="settings-overlay" transition:slide={{ duration: 300 }}>
      <div class="settings-panel">
        <button class="close-settings" on:click={toggleSettings}>×</button>
        <h2>Timer Controls</h2>
        
        <div class="timer-controls">
          <button class="control-btn" on:click={timerRunning ? pauseTimer : startTimer}>
            {timerRunning ? 'Pause' : 'Start'}
          </button>
          <button class="control-btn" on:click={resetTimer}>Reset</button>
        </div>
        
        <h3>Set Timer</h3>
        <div class="time-inputs">
          <div class="input-group">
            <label for="minutes">Minutes:</label>
            <input 
              type="number" 
              id="minutes" 
              bind:value={minutes} 
              min="0" 
              max="99"
              on:change={updateTimer}
            />
          </div>
          <div class="input-group">
            <label for="seconds">Seconds:</label>
            <input 
              type="number" 
              id="seconds" 
              bind:value={seconds} 
              min="0" 
              max="59"
              on:change={updateTimer}
            />
          </div>
        </div>
        
        <div class="shortcuts-info">
          <h3>Keyboard Shortcuts</h3>
          <ul>
            <li><kbd>Space</kbd> Start/Pause timer</li>
            <li><kbd>R</kbd> Reset timer</li>
            <li><kbd>S</kbd> Show/hide this control panel</li>
            <li><kbd>B</kbd> Sound buzzer</li>
          </ul>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap');
  
  .buzzer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    font-family: 'Roboto Condensed', sans-serif;
    background-color: var(--color-base-100, #F8FBF8);
  }
  
  .game-show-timer {
    width: 100%;
    max-width: 600px;
    margin-bottom: 4rem;
    padding: 2rem;
    border-radius: 16px;
    border: 4px solid var(--color-neutral, #2B2B2B);
    background-color: var(--color-base-200, #EDEDED);
    box-shadow: 0 8px 0 0 var(--color-neutral, #2B2B2B);
  }
  
  .timer-display {
    font-family: 'Roboto Condensed', sans-serif;
    background-color: var(--course-neutral);
    color: var(--course-orange);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 1.5rem;
    border: 4px solid var(--color-neutral, #2B2B2B);
    box-shadow: 
      0 0 20px rgba(255, 136, 0, 0.5) inset,
      0 8px 0 0 var(--color-neutral, #2B2B2B);
    position: relative;
    overflow: hidden;
  }
  
  .timer-display::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, rgba(255, 136, 0, 0.8), transparent);
    animation: scanline 2s linear infinite;
  }
  
  .timer-display::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1) 2px,
      rgba(0, 0, 0, 0) 2px,
      rgba(0, 0, 0, 0) 4px
    );
    pointer-events: none;
  }
  
  @keyframes scanline {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
  
  .timer-display.running {
    animation: pulse 1s infinite;
  }
  
  .timer-display.expired {
    animation: blink 0.5s infinite;
    background-color: var(--color-red, #B56666);
    color: white;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 
        0 0 20px rgba(255, 136, 0, 0.5) inset,
        0 8px 0 0 var(--color-neutral, #2B2B2B);
    }
    50% {
      box-shadow: 
        0 0 10px rgba(255, 136, 0, 0.3) inset,
        0 8px 0 0 var(--color-neutral, #2B2B2B);
    }
  }
  
  @keyframes blink {
    0%, 100% {
      background-color: var(--color-red, #B56666);
    }
    50% {
      background-color: var(--course-red);
    }
  }
  
  .timer-text {
    font-size: 5rem;
    font-weight: 700;
    letter-spacing: 4px;
    margin: 0;
    color: white;
    text-shadow: 
      0 0 10px rgba(255, 136, 0, 0.7),
      0 2px 0 #000;
    filter: drop-shadow(0 0 5px rgba(255, 136, 0, 0.5));
  }
  
  .timer-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .control-btn {
    background-color: var(--color-blue, #4D80E6);
    color: white;
    font-family: 'Roboto Condensed', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    border: 2px solid var(--color-neutral, #2B2B2B);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 0 0 var(--color-neutral, #2B2B2B);
  }
  
  .control-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 0 var(--color-neutral, #2B2B2B);
  }
  
  .control-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 0 var(--color-neutral, #2B2B2B);
  }
  
  .settings-btn {
    background-color: var(--color-sage, #949B80);
  }
  
  .settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .settings-panel {
    background-color: white;
    border: 4px solid var(--color-neutral, #2B2B2B);
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .close-settings {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--color-base-200, #EDEDED);
  }
  
  .close-settings:hover {
    background-color: var(--color-base-300, #A3A3A2);
  }
  
  .settings-panel h2 {
    font-family: 'LibreCaslonCondensed', serif;
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    border-bottom: 2px solid var(--color-base-200, #EDEDED);
    padding-bottom: 0.5rem;
  }
  
  .settings-panel h3 {
    font-family: 'LibreCaslonCondensed', serif;
    font-size: 1.3rem;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .time-inputs {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
  }
  
  .input-group label {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .input-group input {
    width: 80px;
    font-size: 1.2rem;
    padding: 0.5rem;
    border: 2px solid var(--color-neutral, #2B2B2B);
    border-radius: 4px;
    text-align: center;
  }
  
  .shortcuts-info {
    margin-top: 1.5rem;
    font-family: 'Roboto Condensed', sans-serif;
    border-top: 2px solid var(--color-base-200, #EDEDED);
    padding-top: 1rem;
  }
  
  .shortcuts-info ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
  }
  
  .shortcuts-info li {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }
  
  kbd {
    background-color: var(--color-base-200, #EDEDED);
    border-radius: 4px;
    border: 1px solid var(--color-base-300, #A3A3A2);
    box-shadow: 0 1px 0 rgba(0,0,0,0.2);
    color: var(--color-neutral, #2B2B2B);
    display: inline-block;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1;
    margin-right: 0.5rem;
    padding: 0.25rem 0.5rem;
    text-align: center;
    min-width: 1.5rem;
  }
  
  .buzzer-button {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: var(--color-red, #B56666);
    border: 8px solid var(--color-neutral, #2B2B2B);
    box-shadow: 
      0 8px 0 0 var(--color-neutral, #2B2B2B),
      0 0 0 8px #f8d7da,
      0 0 30px 5px rgba(181, 102, 102, 0.6);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s ease;
    position: relative;
    overflow: hidden;
  }
  
  .buzzer-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
  }
  
  .buzzer-button:hover {
    transform: scale(1.05);
    box-shadow: 
      0 12px 0 0 var(--color-neutral, #2B2B2B),
      0 0 0 8px #f8d7da,
      0 0 40px 10px rgba(181, 102, 102, 0.8);
  }
  
  .buzzer-button:active {
    transform: scale(0.95) translateY(8px);
    box-shadow: 
      0 2px 0 0 var(--color-neutral, #2B2B2B),
      0 0 0 8px #f8d7da,
      0 0 20px 3px rgba(181, 102, 102, 0.5);
    animation: buzzing 0.1s infinite alternate;
  }
  
  @keyframes buzzing {
    0% {
      transform: scale(0.95) translateY(8px) translateX(-1px);
    }
    100% {
      transform: scale(0.95) translateY(8px) translateX(1px);
    }
  }
  
  .buzzer-text {
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    text-shadow: 
      -2px -2px 0 var(--color-neutral, #2B2B2B),
      2px -2px 0 var(--color-neutral, #2B2B2B),
      -2px 2px 0 var(--color-neutral, #2B2B2B),
      2px 2px 0 var(--color-neutral, #2B2B2B);
    letter-spacing: 2px;
  }
</style>