import Shape from './Shape'
import type { IShape } from '../types'

export default class CurveLine extends Shape {
    startPoint: IShape
    endPoint: IShape | null
    stroke: string = '#FA806B'

    constructor (startPoint: IShape, endPoint: IShape | null) {
        super()

        this.startPoint = startPoint
        this.endPoint = endPoint
    }

    setEndPoint (endPoint: IShape) {
        this.endPoint = endPoint
    }

    computeQuarters(centerX: number, centerY: number): void {
        this.quarters = []
    }

    inEvent(cursor: { x: number; y: number; }): boolean {
        return false
    }

    render (ctx: CanvasRenderingContext2D, position: { cursorX: number, cursorY: number }) {
        const { cursorX, cursorY } = position

        this.ownRender(ctx, cursorX, cursorY)
    }

    ownRender (ctx: CanvasRenderingContext2D, x: number, y: number) {
        console.log('Curve')

        const { x: startX, y: startY } = this.startPoint.getRelativePosition()
        let endX, endY
        if (this.endPoint) {
            const { x: endRelativeX, y: endRelativeY } = this.endPoint.getRelativePosition()
            endX = endRelativeX
            endY = endRelativeY
        } else {
            endX = x
            endY = y
        }

        ctx.beginPath()
        ctx.strokeStyle = this.stroke
        ctx.lineWidth = 2
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        ctx.closePath()

        if (!this.endPoint) {
            this.reRenderCallback && this.reRenderCallback()
        }
    }
}