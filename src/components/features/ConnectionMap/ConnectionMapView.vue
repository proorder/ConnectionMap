<template>
    <canvas width="800" height="500" ref="canvas" class="connection-map"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import ConnectionMap from './ConnectionMap'
import { SquareFigure } from './figures'

const canvas: Ref<HTMLCanvasElement | undefined> = ref()

const map = new ConnectionMap()

function mountMap () {
    if (!canvas.value) {
        return
    }

    map.mount(canvas.value)

    map
        .addFigure(new SquareFigure(0, 0))
        .addFigure(new SquareFigure(-60, 150))
        .addFigure(new SquareFigure(200, -30))
}

onMounted(() => {
    mountMap()
})

onUnmounted(() => {
    map.unmount()
})
</script>

<style>
.connection-map {
    width: 800px;
    height: 500px;
    border: 1px solid grey;
}
</style>