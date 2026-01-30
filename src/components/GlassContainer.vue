<template>
  <div 
    class="glass-container" 
    ref="cardRef"
    @mousemove="handleMouseMove"
    @mouseleave="resetTilt"
    :style="cardStyle"
  >
    <div class="glass-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const cardRef = ref<HTMLDivElement | null>(null);
const rotX = ref(0);
const rotY = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Calculate percentage of position
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Max rotation degrees
  const limit = 10;
  
  // Disable tilt on mobile
  if (window.innerWidth < 768) return;

  rotY.value = ((x - centerX) / centerX) * limit; // Rotate Y based on X movement
  rotX.value = -((y - centerY) / centerY) * limit; // Rotate X based on Y movement (inverted)
};

const resetTilt = () => {
  rotX.value = 0;
  rotY.value = 0;
};

const cardStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotX.value}deg) rotateY(${rotY.value}deg)`,
  transition: 'transform 0.1s ease-out'
}));
</script>

<style scoped>
.glass-container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 243, 255, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;
  overflow: hidden;
}

@media (max-width: 768px) {
  .glass-container {
    padding: 1.5rem;
    border-radius: 16px;
  }
}

/* Internal Glow Effect */
.glass-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 50%);
  transform: translateZ(10px); /* Parallax inner glow */
  pointer-events: none;
  opacity: 0.5;
}

/* Dynamic Border Pulse */
@keyframes borderPulse {
  0% { border-color: rgba(0, 243, 255, 0.1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.1); }
  50% { border-color: rgba(0, 243, 255, 0.4); box-shadow: 0 0 30px rgba(0, 243, 255, 0.3); }
  100% { border-color: rgba(0, 243, 255, 0.1); box-shadow: 0 0 20px rgba(0, 243, 255, 0.1); }
}

.glass-container:hover {
  animation: borderPulse 3s infinite ease-in-out;
}

.glass-content {
  transform: translateZ(20px); /* Floating content effect */
}
</style>
