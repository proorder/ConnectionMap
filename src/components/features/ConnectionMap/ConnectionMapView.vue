<template>
    <canvas width="800" height="500" ref="canvas" class="connection-map"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import ConnectionMap from './ConnectionMap'
import { SquareFigure } from './figures'

const canvas: Ref<HTMLCanvasElement | undefined> = ref()

const map = ref(new ConnectionMap())

function mountMap () {
    if (!canvas.value) {
        return
    }

    map.value.mount(canvas.value)
    map.value.render()

    map.value
        .addFigure(new SquareFigure(0, 0))
        .addFigure(new SquareFigure(-60, 150))
        .addFigure(new SquareFigure(200, -30))
}

onMounted(() => {
    mountMap()
})

onUnmounted(() => {
    map.value.unmount()
})

defineExpose({
    map,
})
</script>

<script lang="ts">
export default {
    watch: {
        '$store.getters.figures' (nextValue, prev) {
            if (!nextValue || !nextValue.length) {
                return
            }

            // Причина такого хардкорного впиливания в последнем абзаце readme
            this.map.addFigure(SquareFigure.Factory(nextValue[nextValue.length-1]))
        },
    },
}
</script>

<style>
.connection-map {
    width: 800px;
    height: 500px;
    border: 1px solid grey;
}
</style>