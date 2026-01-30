<template>
  <div class="mission-control">
    <GlassContainer class="hud-container">
      <h1 ref="titleRef" class="mission-title">Mission Control</h1>
      
      <div v-if="!submitted" class="form-content" ref="formRef">
        
        <div class="status-bar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <span class="step-indicator">SYSTEM {{ currentIndex + 1 }} / {{ questions.length }}</span>
        </div>

        <h2 class="step-title">
          <HackerText :text="currentQuestion.title" />
        </h2>
        
        <!-- Render Selection Component for specific types -->
        <FormSelection
          v-if="currentQuestion.type === 'select'"
          v-model="currentAnswer"
          :options="currentQuestion.options || []"
        />

        <!-- Render Standard Input for text/date/etc -->
        <FormInput 
          v-else
          v-model="currentAnswer"
          :label="currentQuestion.label" 
          :placeholder="currentQuestion.placeholder"
          :type="currentQuestion.type"
          @keyup.enter="handleEnterKey"
        />

        <div class="controls">
          <button 
            @click="prevStep" 
            class="btn btn-secondary"
            :disabled="history.length === 0"
            :class="{ hidden: history.length === 0 }"
          >
            &lt; BACK
          </button>
          
          <button @click="nextStep" class="btn btn-primary">
            {{ isLastStep ? 'INITIATE LAUNCH' : 'CONFIRM DATA &gt;' }}
          </button>
        </div>
      </div>

      <div v-else class="success-message" ref="successRef">
        <h2 class="success-title">TRANSMISSION COMPLETE</h2>
        <p class="success-text">Your application has been logged in the Enactus mainframe.</p>
        <div class="success-icon">🚀</div>
        <button @click="resetMission" class="btn btn-secondary">NEW ENTRY</button>
      </div>
    </GlassContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import GlassContainer from './GlassContainer.vue';
import FormInput from './FormInput.vue';
import FormSelection from './FormSelection.vue';
import HackerText from './HackerText.vue';
import { playSound, initAudio } from '../composables/SoundManager';
import { useSpace } from '../composables/useSpace';

const { triggerWarp } = useSpace();

// Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYk8BBmBIH7qvPQ2fQCych8bWJwIKlmibohSPNGE-bf-1yZA6eXGaodZaMYbI8XXOb/exec';

interface Question {
  id: string;
  title: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'date' | 'tel' | 'select' | 'textarea';
  options?: string[]; // For select type
}

// ... QUESTIONS ARRAY REMAINS SAME ...
const questions: Question[] = [
  { id: 'NomPrenom', title: 'Identity Verification', label: 'Nom et Prénom', placeholder: 'Ex: Skywalker Luke', type: 'text' },
  { id: 'Email', title: 'Comms Channel', label: 'E-mail', placeholder: 'Ex: luke@alliance.com', type: 'email' },
  { id: 'DateNaissance', title: 'Temporal Origin', label: 'Date de naissance', placeholder: '', type: 'date' },
  { id: 'Telephone', title: 'Direct Link', label: 'Numéro de téléphone', placeholder: 'Ex: +216 00 000 000', type: 'tel' },
  { id: 'Departement', title: 'Sector Assignment', label: 'Département', type: 'select', options: ['TI', 'ECO&GES', 'MECANIQUE', 'ELECTRIQUE'] },
  { id: 'Niveau', title: 'Rank / Level', label: 'Niveau (ISET Djerba)', type: 'select', options: ['1er', '2éme', '3éme'] },
  { id: 'PourquoiEnactus', title: 'Mission Motivation', label: 'Pourquoi souhaites-tu rejoindre Enactus ?', placeholder: 'Tell us your story...', type: 'textarea' },
  { id: 'Apprendre', title: 'Skill Adaptation', label: 'Qu’espères-tu apprendre ?', placeholder: 'What skills do you seek?', type: 'textarea' },
  { id: 'Motivation', title: 'Core Drive', label: 'Qu’est-ce qui t’a motivé(e) ?', placeholder: 'What ignites your spark?', type: 'textarea' }
];

const currentIndex = ref(0);
const answers = ref<Record<string, string>>({});
const history = ref<number[]>([]);
const submitted = ref(false);

const titleRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLElement | null>(null);
const successRef = ref<HTMLElement | null>(null);

const currentQuestion = computed(() => questions[currentIndex.value]);
const currentAnswer = computed({
  get: () => answers.value[currentQuestion.value.id] || '',
  set: (val) => answers.value[currentQuestion.value.id] = val
});

const isLastStep = computed(() => currentIndex.value === questions.length - 1);
const progressPercentage = computed(() => ((currentIndex.value + 1) / questions.length) * 100);

// Animation Utilities
const warpTransition = (callback: () => void) => {
  if (!formRef.value) {
    callback();
    return;
  }

  // Trigger Audio and Visual Warp
  playSound.warpHandler();
  triggerWarp();

  const tl = gsap.timeline();
  
  // High-speed Warp Out
  tl.to(formRef.value, { 
    duration: 0.25, 
    opacity: 0, 
    scale: 1.2, // Zoom TOWARDS camera
    filter: 'blur(10px)',
    ease: 'power3.in',
    onComplete: () => {
      callback();
      // Warp In from center
      gsap.fromTo(formRef.value, 
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        { duration: 0.4, opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power3.out' }
      );
    }
  });
};

const handleEnterKey = () => {
  if (currentQuestion.value.type !== 'textarea') {
    nextStep();
  }
};

const nextStep = () => {
  // Initialize audio on first interaction if needed
  initAudio();

  if (!currentAnswer.value) {
    playSound.error();
    gsap.to(formRef.value, { x: 5, duration: 0.1, yoyo: true, repeat: 3 });
    return; 
  }

  playSound.click();

  if (isLastStep.value) {
    submitForm();
  } else {
    warpTransition(() => {
      history.value.push(currentIndex.value);
      currentIndex.value++;
    });
  }
};

const prevStep = () => {
  playSound.click();
  if (history.value.length === 0) return;
  
  // Reverse Warp
  const tl = gsap.timeline();
  tl.to(formRef.value, { 
    duration: 0.2, 
    opacity: 0, 
    scale: 0.8, // Zoom AWAY
    onComplete: () => {
      const prev = history.value.pop();
      if (prev !== undefined) currentIndex.value = prev;
      gsap.fromTo(formRef.value, 
        { opacity: 0, scale: 1.2 },
        { duration: 0.3, opacity: 1, scale: 1 }
      );
    }
  });
};

const submitForm = async () => {
  playSound.warpHandler();
  triggerWarp();
  
  const launchTl = gsap.timeline();
  launchTl.to(formRef.value, { duration: 0.5, scale: 0.1, opacity: 0, ease: 'back.in(1.7)' });

  const formData = new FormData();
  Object.keys(answers.value).forEach(key => {
    formData.append(key, answers.value[key] as string);
  });

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' 
    });

    submitted.value = true;
    playSound.success();
    
    nextTick(() => {
        gsap.fromTo(successRef.value, 
            { scale: 0.5, opacity: 0 },
            { duration: 0.8, scale: 1, opacity: 1, ease: 'elastic.out(1, 0.5)' }
        );
    });

  } catch (error) {
    console.error('Transmission Failed', error);
    playSound.error();
    alert('Transmission Failed: Signal Lost');
    launchTl.reverse();
  }
};

const resetMission = () => {
  playSound.click();
  submitted.value = false;
  currentIndex.value = 0;
  answers.value = {};
  history.value = [];
  nextTick(() => {
      gsap.fromTo(formRef.value, { opacity: 0 }, { duration: 1, opacity: 1 });
  });
};

onMounted(() => {
  gsap.from(titleRef.value, { duration: 1.5, y: -50, opacity: 0, ease: 'expo.out' });
  gsap.from(formRef.value, { duration: 1, delay: 0.5, opacity: 0, ease: 'power2.out' });
  
  // Try to start audio on interaction
  window.addEventListener('click', initAudio, { once: true });
});
</script>

<style scoped>
.mission-control {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding-top: 15vh;
  padding-bottom: 5vh;
}

.mission-title {
  color: white;
  text-align: center;
  margin-bottom: 2.5rem;
  font-family: 'Montserrat', sans-serif; /* Cleaner modern font */
  font-weight: 800;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 6px;
  background: linear-gradient(135deg, #fff 0%, #00f3ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px rgba(0, 243, 255, 0.3));
}

.step-title {
  color: #00f3ff;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 600;
  text-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  gap: 1.5rem;
}

.hidden {
  opacity: 0;
  pointer-events: none;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 50px; /* Pill shape */
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #00f3ff 0%, #0066ff 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 243, 255, 0.3);
  flex: 2;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 243, 255, 0.5);
  filter: brightness(1.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: white;
}

/* Progress Bar */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Courier New', monospace;
}

.progress-track {
  flex-grow: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-right: 1rem;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #00f3ff;
  box-shadow: 0 0 10px #00f3ff;
  transition: width 0.5s ease;
}

/* Success State */
.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-title {
  font-size: 2rem;
  color: #00f3ff;
  margin-bottom: 1rem;
}

.success-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 5rem;
  margin: 2rem 0;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 768px) {
  .mission-control {
    padding-top: 10vh;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .mission-title {
    font-size: 1.8rem;
    letter-spacing: 3px;
    margin-bottom: 1.5rem;
  }

  .step-title {
    font-size: 1.4rem;
  }

  .controls {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    padding: 0.8rem;
  }
}
</style>
