<template>
  <div id="app-container">
    <VisualEffects />
    <SpaceBackground />
    <MissionControl />
  </div>
</template>

<script setup lang="ts">
import SpaceBackground from './components/SpaceBackground.vue';
import MissionControl from './components/MissionControl.vue';
import VisualEffects from './components/VisualEffects.vue';
</script>

<style>
#app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

@media (max-width: 768px) {
  #app-container {
    overflow-y: auto; /* Enable scrolling on mobile */
    min-height: 100vh;
    height: auto; /* Allow height to grow with content */
  }
}
</style>
