import { HTMLCanvasNotMounted, RenderingContextNotInstalled } from './errors'
import type { IEventful } from './types'
import type BaseFigure from './figures/BaseFigure'
import Transmitter from './Transmitter'
import CurveLineFigure from './figures/CurveLineFigure'
import type { StoreFigure } from '@/components/features/FigureConstructor/types'
import { SquareFigure } from './figures'
import { Square, Circle } from './shapes'

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
    cursorX: number = 0
    cursorY: number = 0

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

        this.transmitter = new Transmitter(canvas, this.getFigures.bind(this), this.setCursor.bind(this))
    }

    unmount () {
        if (!this.isMounted) {
            return
        }
    }

    setCursor (x: number, y: number) {
        this.cursorX = x
        this.cursorY = y
    }

    getFigures (): BaseFigure[] {
        return this.figures.reverse()
    }

    addFigure (figure: BaseFigure) {
        figure.setupFigure({
            root: this,
            reRerenderCallback: this.render.bind(this),
        })
        this.figures.push(figure)
        this.render()

        return this
    }

    addFigures (figures: StoreFigure[]) {
        const getShapeClass = (type) => {
            switch (type) {
                case 'square':
                    return Square
                default:
                    return Circle
            }
        }

        figures.forEach((f) => {
            this.addFigure(SquareFigure.Factory([

            ]))
        })
    }

    deleteFigure (id: string) {
        this.figures = this.figures.filter(f => f.id !== id)
        this.render()
    }

    findOpenCurve () {
        return this.figures.find(f => f instanceof CurveLineFigure && !f.endPoint) as (CurveLineFigure | undefined)
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

            this.figures.sort((a, b) => a.priority - b.priority).forEach((f) => {
                f.render(
                    this.ctx as CanvasRenderingContext2D,
                    {
                        x: this.biasX,
                        y: this.biasY,
                        centerX: this.centerX,
                        centerY: this.centerY,
                        cursorX: this.cursorX,
                        cursorY: this.cursorY,
                    }
                )
            })
        })
    }
}
