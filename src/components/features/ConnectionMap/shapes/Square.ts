import Shape from './Shape'
import type { ShapeProps, Quarter } from '../types'
import { computeQuarter } from '../utils'

export default class Square extends Shape {
    radius: number

    constructor (x: number, y: number, radius: number, props?: ShapeProps) {
        super()
        this.x = x
        this.y = y
        this.radius = radius
        
        if (props) {
            this.setupProps(props)
        }
    }

    onPointerDown (pointer: { x: number, y: number }) {
        this._lastPointerMove = null
        this._pointerDownStart = pointer
    }

    onMove (pointer: { x: number, y: number }) {
        const { x: lastX, y: lastY } = (this._lastPointerMove || this._pointerDownStart) as { x: number, y: number }

        this._lastPointerMove = pointer

        this.figure?.move(pointer.x - lastX, pointer.y - lastY)
    }

    computeQuarters (centerX: number, centerY: number) {
        const quarters = new Set<Quarter>()
        
        quarters.add(
            computeQuarter({
                x: this.relativeX - this.radius,
                y: this.relativeY - this.radius,
                centerX,
                centerY,
            })
        )
        quarters.add(
            computeQuarter({
                x: this.relativeX + this.radius,
                y: this.relativeY - this.radius,
                centerX,
                centerY,
            })
        )
        quarters.add(
            computeQuarter({
                x: this.relativeX - this.radius,
                y: this.relativeY + this.radius,
                centerX,
                centerY,
            })
        )
        quarters.add(
            computeQuarter({
                x: this.relativeX + this.radius,
                y: this.relativeY + this.radius,
                centerX,
                centerY,
            })
        )
        this.quarters = [...quarters]
    }

    inEvent (cursor: { x: number, y: number }) {
        const { x, y } = cursor

        return (
            x > this.relativeX - this.radius &&
            y > this.relativeY - this.radius &&
            x < this.relativeX + this.radius &&
            y < this.relativeY + this.radius
        )
    }

    protected ownRender (ctx: CanvasRenderingContext2D, x: number, y: number) {
        const side = this.radius * 2

        ctx.beginPath()
        ctx.fillStyle = this.fill
        ctx.fillRect(x - this.radius, y - this.radius, side, side)
        ctx.closePath()
    }
}