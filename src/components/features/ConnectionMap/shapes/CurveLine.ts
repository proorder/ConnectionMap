import Shape from './Shape'
import type { IShape } from '../types'

export default class CurveLine extends Shape {
    // endX: number
    // endY: number

    // constructor (startPoint: { x: number, y: number }, endPoint: { x: number, y: number }) {
    //     super()
    //     this.x = startPoint.x
    //     this.y = startPoint.y
    //     this.endX = endPoint.x
    //     this.endY = endPoint.y
    // }
    startPoint: IShape
    endPoint: IShape | null

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

    ownRender (ctx: CanvasRenderingContext2D, x: number, y: number) {
        console.log('Curve')

        const { x: startX, y: startY } = this.startPoint.getRelativePosition()
        let endX, endY
        if (this.endPoint) {
            endX = this.endPoint.x
            endY = this.endPoint.y
        } else {
            endX = x
            endY = y
        }

        ctx.beginPath()
        ctx.strokeStyle = this.stroke
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.closePath()
    }
}