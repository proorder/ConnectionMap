import { TransmitterEvent, type IEventful, type IShape } from './types'
import { computeQuarter } from './utils'
import equal from 'fast-deep-equal'

export default class Transmitter {
    centerX: number = 0
    centerY: number = 0

    eventsSequence: { event: TransmitterEvent, time: number }[] = []
    canvas: HTMLCanvasElement
    getProvidedFigures: () => Iterable<IEventful>
    onHoverState: IShape[] = []
    cnvIsDown: boolean = false
    onDownState: IShape[] = []
    emitCursor: (x: number, y: number) => void
    moveCanvasCenter: (x: number, y: number) => void

    constructor (canvas: HTMLCanvasElement, callbacks: { getFigures: () => Iterable<IEventful>, emitCursor: (x: number, y: number) => void, moveCenter: (x: number, y: number) => void }) {
        this.canvas = canvas
        this.getProvidedFigures = callbacks.getFigures
        this.emitCursor = callbacks.emitCursor
        this.moveCanvasCenter = callbacks.moveCenter

        this.initialize()
    }

    clearOnHoverState () {
        this.onHoverState.forEach(s => {
            s.onHoverOut && s.onHoverOut()
        })
        this.onHoverState = []
    }

    eventMiddleware (event: TransmitterEvent) {
        this.eventsSequence.push({
            event,
            time: Date.now(),
        })

        if (this.eventsSequence.length > 10) {
            this.eventsSequence = []
        }
    }

    initialize () {
        const { width, height } = this.canvas.getBoundingClientRect()

        this.centerX = width / 2
        this.centerY = height / 2

        this.canvas.addEventListener('pointermove', ({ offsetX, offsetY }) => {
            if (this.cnvIsDown) {
                this.moveCanvasCenter(offsetX, offsetY)
                return
            }
            this.emitCursor(offsetX, offsetY)
            if (this.onDownState.length) {
                this.onDownState.forEach(s => {
                    s.onMove && s.onMove({ x: offsetX, y: offsetY })
                })
                return
            } 
            // this.eventMiddleware(TransmitterEvent.Move)
            const shape = this.detectElement(offsetX, offsetY)
            if (!shape) {
                this.clearOnHoverState()
                return
            }

            if (!this.onHoverState.find((s) => s.id === shape.id)) {
                this.clearOnHoverState()
            } else {
                return
            }

            this.onHoverState.push(shape)
            shape.onHover && shape.onHover()
        })

        this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this))
        this.canvas.addEventListener('click', this.onClick.bind(this))
        this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this))
    }

    onClick ({ offsetX, offsetY }: MouseEvent) {
        this.eventMiddleware(TransmitterEvent.Click)
        const shape = this.detectElement(offsetX, offsetY)
        if (!shape || !shape.onClick) {
            return
        }

        shape.onClick({ x: offsetX, y: offsetY })
    }

    onPointerDown ({ offsetX, offsetY, pointerId }: PointerEvent) {
        this.emitCursor(offsetX, offsetY)
        this.canvas.setPointerCapture(pointerId)

        this.eventMiddleware(TransmitterEvent.Down)
        const shape = this.detectElement(offsetX, offsetY)
        if (!shape) {
            this.cnvIsDown = true
            return
        }

        this.onDownState.push(shape)
        shape.onPointerDown && shape.onPointerDown({ x: offsetX, y: offsetY })
    }

    onPointerUp ({ offsetX, offsetY }: PointerEvent) {
        if (this.onDownState.length) {
            this.onDownState = []
            return
        }
        if (this.cnvIsDown) {
            this.cnvIsDown = false
            return
        }
        this.eventMiddleware(TransmitterEvent.Up)
        const shape = this.detectElement(offsetX, offsetY)
        if (!shape || !shape.onPointerUp) {
            return
        }

        shape.onPointerUp({ x: offsetX, y: offsetY })
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
