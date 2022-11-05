import type { IEventful } from './types'
import { computeQuarter } from './utils'

export default class Transmitter {
    centerX: number = 0
    centerY: number = 0

    canvas: HTMLCanvasElement
    getProvidedFigures: () => Iterable<IEventful>

    constructor (canvas: HTMLCanvasElement, getFigures: () => Iterable<IEventful>) {
        this.canvas = canvas
        this.getProvidedFigures = getFigures

        this.initialize()
    }

    initialize () {
        const { width, height } = this.canvas.getBoundingClientRect()

        this.centerX = width / 2
        this.centerY = height / 2

        this.canvas.addEventListener('mousemove', ({ offsetX, offsetY }) => {
            this.detectElement(offsetX, offsetY)
        })

        this.canvas.addEventListener('mousedown', ({ offsetX, offsetY }) => {
            const shape = this.detectElement(offsetX, offsetY)
            if (!shape || !shape.onMouseDown) {
                return
            }

            shape.onMouseDown()
        })
    }

    detectElement (x: number, y: number) {
        const figures = this.getProvidedFigures()
        const quarter = computeQuarter({
            x,
            y,
            centerX: this.centerX,
            centerY: this.centerY,
        })
        
        for (let f of figures) {
            const shape = f.determineElement(quarter, { x, y })
            if (shape) {
                return shape
            }
        }
    }
}
