<script setup lang="ts">
import ConnectionMap from '@/components/features/ConnectionMap'
import FigureConstructor from '@/components/features/FigureConstructor'
</script>

<template>
  <header class="figure-constructor">
    <FigureConstructor />
  </header>
  <main>
    <ConnectionMap />
  </main>
</template>

<style scoped>
.figure-constructor {
  margin-bottom: 50px;
}
</style>
