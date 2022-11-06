import { HTMLCanvasNotMounted, RenderingContextNotInstalled } from './errors'
import type { IEventful } from './types'
import type BaseFigure from './figures/BaseFigure'
import Transmitter from './Transmitter'

export default class ConnectionMap {
    canvas: HTMLCanvasElement | null = null
    ctx: CanvasRenderingContext2D | null = null
    isMounted = false

    transmitter: Transmitter | null = null

    figures: BaseFigure[] = []

    centerX: number = 0
    centerY: number = 0
    biasX: number = 0
    biasY: number = 0
    isRenderInQueue: boolean = false

    mount (canvas: HTMLCanvasElement) {
        if (!canvas) {
            throw new HTMLCanvasNotMounted()
        }

        const { width, height } = (canvas as HTMLCanvasElement).getBoundingClientRect()

        this.centerX = width / 2
        this.centerY = height / 2
        this.biasX = width / 2
        this.biasY = height / 2

        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        this.transmitter = new Transmitter(canvas, this.getFigures.bind(this))
    }

    unmount () {
        if (!this.isMounted) {
            return
        }
    }

    getFigures (): BaseFigure[] {
        return this.figures.reverse()
    }

    addFigure (figure: BaseFigure) {
        figure.setReRenderCallback(this.render.bind(this))
        this.figures.push(figure)
        this.render()

        return this
    }

    render () {
        if (this.isRenderInQueue) {
            return
        }

        this.isRenderInQueue = true

        requestAnimationFrame(() => {
            if (!this.ctx) {
                throw new RenderingContextNotInstalled
            }

            this.isRenderInQueue = false
            this.ctx.fillStyle = '#96D8FF'
            this.ctx.fillRect(0, 0, (this.canvas as HTMLCanvasElement).width, (this.canvas as HTMLCanvasElement).height)

            this.figures.forEach((f) => {
                f.render(
                    this.ctx as CanvasRenderingContext2D,
                    {
                        x: this.biasX,
                        y: this.biasY,
                        centerX: this.centerX,
                        centerY: this.centerY,
                    }
                )
            })
        })
    }
}
