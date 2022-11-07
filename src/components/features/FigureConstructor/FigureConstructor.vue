<template>
    <div>
        <h3>Figure constructor</h3>
        <div class="flex">
            <div class="shapes-mover" ref="shapeMover">
                <div
                    v-for="f in shapes"
                    :key="f.id"
                    :class="`${f.type} figure`"
                    :ref="f.id"
                    :style="{ background: f.color }"
                    @mousedown="figureDown(f.id, $event)"
                >
                    <div class="expander" @mousedown="expanderDown(f.id, $event)"></div>
                    <div class="delete" @mouseup="deleteShape(f.id)"></div>
                </div>
            </div>
            <div class="shape-list">
                <div>
                    <div v-for="(t, i) in basedTypes" :key="`${t}${i}`" :class="`figure-block ${t === choosenType ? 'figure-block_active' : ''}`" @click="choosenType = t">
                        <div :class="t"></div>
                        {{ `${t.charAt(0).toUpperCase()}${t.slice(1)}` }}
                    </div>
                    <div v-if="choosenType" class="color-selector-container">
                        Choose color
                        <div class="color-selector">
                            <div v-for="c in colors" :style="{ backgroundColor: c }" :key="c" @click="addShape(c)"></div>
                        </div>
                    </div>
                </div>
                <button class="create-figure" @click="exportFigure()">Create figure</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { v4 as uuid } from 'uuid'
import type { Shape, ShapeData } from '@/components/features/FigureConstructor/types'

type EventHandler = ({}: PointerEvent) => void
let moveEventHandler: EventHandler | null = null
let upEventHandler: EventHandler | null = null

export default {
    data () {
        return {
            choosenType: null as null | Shape,
            colors: ['#FAA36B', '#E0FFFD', '#76F589', '#DE675F', '#E1B3FF'],
            shapeMoverSize: { width: 0, height: 0, left: 0, top: 0 },
            expanderLastPosition: { x: 0, y: 0 },
            expandedNow: null as null | string,
            isMouseDown: false,
            basedTypes: ['square', 'circle'] as Shape[],
            shapes: [] as ShapeData[],
        }
    },
    mounted () {
        const { width, height, left, top } = (this.$refs.shapeMover as HTMLDivElement).getBoundingClientRect()
        this.shapeMoverSize = { width, height, left, top }
    },
    methods: {
        exportFigure () {
            this.$store.dispatch('addFigure', this.shapes)
        },
        deleteShape (id: string) {
            this.shapes = this.shapes.filter(s => s.id !== id)
        },
        addShape (color: string) {
            this.shapes.push({
                type: this.choosenType as Shape,
                radius: 20,
                x: 0,
                y: 0,
                id: uuid(),
                color,
            })
            this.choosenType = null
        },
        figureDown (id: string, event: MouseEvent) {
            const { pageX, pageY } = event
            this.expandedNow = id
            this.expanderLastPosition = { x: pageX, y: pageY }
            
            moveEventHandler = function ({ pageX, pageY }: PointerEvent) {
                const x = pageX - this.expanderLastPosition.x
                const y = pageY - this.expanderLastPosition.y
                this.expanderLastPosition = { x: pageX, y: pageY }
                const shape = this.shapes.find(f => f.id === this.expandedNow)
                shape.x += x
                shape.y += y
                this.$refs[this.expandedNow][0].style.left = `${this.shapeMoverSize.width / 2 + shape.x + this.shapeMoverSize.left - shape.radius}px`
                this.$refs[this.expandedNow][0].style.top = `${this.shapeMoverSize.height / 2 + shape.y + this.shapeMoverSize.top - shape.radius}px`

            }.bind(this)

            upEventHandler = function () {
                document.removeEventListener('pointermove', moveEventHandler as EventHandler)
                document.removeEventListener('pointerup', upEventHandler as EventHandler)
            }.bind(this)

            document.addEventListener('pointermove', moveEventHandler)
            document.addEventListener('pointerup', upEventHandler)
        },
        expanderDown (id: string, event: MouseEvent) {
            event.stopPropagation()
            const { pageX, pageY } = event
            this.expandedNow = id
            this.expanderLastPosition = { x: pageX, y: pageY }
            
            moveEventHandler = function ({ pageX, pageY }: PointerEvent) {
                const x = pageX - this.expanderLastPosition.x
                const y = pageY - this.expanderLastPosition.y
                this.expanderLastPosition = { x: pageX, y: pageY }
                const shape = this.shapes.find(f => f.id === this.expandedNow)
                shape.radius += x < 0 || y < 0 ? Math.max(x, y) : Math.min(x, y)
                this.$refs[this.expandedNow][0].style.width = `${shape.radius * 2}px`
                this.$refs[this.expandedNow][0].style.height = `${shape.radius * 2}px`

            }.bind(this)

            upEventHandler = function () {
                document.removeEventListener('pointermove', moveEventHandler as EventHandler)
                document.removeEventListener('pointerup', upEventHandler as EventHandler)
            }.bind(this)

            document.addEventListener('pointermove', moveEventHandler)
            document.addEventListener('pointerup', upEventHandler)
        },
    },
}
</script>

<style>
.flex {
    display: flex;
}
.shapes-mover {
    width: 100%;
    flex: 1;
    background-color: #6798E0;
    height: 300px;
    display: grid;
    place-items: center;
}
.figure-block {
    position: relative;
    display: flex;
    width: 200px;
    justify-content: space-between;
    align-items: center;
    color: #5A7BA1;
    background-color: #FFDBD1;
    border-radius: 30px;
    height: 60px;
    padding: 20px 20px;
    box-sizing: border-box;
    transition: background-color 300ms;
    cursor: pointer;
}
.figure-block_active {
    border: 2px solid #5F82DE;
}
.figure {
    position: absolute;
}
.figure:hover > .expander {
    display: block;
}
.figure:hover > .delete {
    display: block;
}
.figure-block:hover {
    background-color: #FDB7A1;
}
.figure-block:not(:first-of-type) {
    margin-top: 10px;
}
.shape-list {
    background-color: #6798E0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.square {
    width: 40px;
    height: 40px;
    background-color: #FAA36B;
}
.circle {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #E0FFFD;
}
.expander {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 15px;
    height: 15px;
    background-color: #F4B3FF;
}
.color-selector {
    margin-top: 3px;
    background-color: #FFF;
    border-radius: 25px;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(5, 30px);
    grid-template-rows: 30px;
    justify-content: space-between;
}
.color-selector-container {
    text-align: center;
    margin-top: 10px;
}
.color-selector > div {
    border-radius: 100%;
    cursor: pointer;
}
.create-figure {
    font-size: 18px;
    padding: 10px;
    border-radius: 10px;
    background-color: #96D8FF;
    cursor: pointer;
    font-weight: bold;
    transition: all 300ms;
}
.create-figure:hover {
    background-color: #89C5E8;
    color: #3E5969;
}
.delete {
    display: none;
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background: red;
}
.delete:before {
    content: '';
    position: absolute;
    rotate: -45deg;
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 1px;
    background: #FFF;
}
.delete:after {
    content: '';
    position: absolute;
    rotate: 45deg;
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 1px;
    background: #FFF;
}
</style>
