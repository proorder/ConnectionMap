import type { IShape, ShapeProps, Quarter } from '../types'
import { MethodNotImplemented, QuarterNotComputed } from '../errors'
import { computeQuarter } from '../utils'

class Shape implements IShape {
    x: number = 0
    y: number = 0
    relativeX: number = 0
    relativeY: number = 0
    fill: string = '#FAA36B'
    stroke: string = '#E2FA2D'
    strokeWidth: number = 0
    quarters: Quarter[] = []

    computeQuarters (centerX: number, centerY: number) {
        throw new MethodNotImplemented()
    }

    inEvent (cursor: { x: number, y: number }) {
        throw new MethodNotImplemented()

        return false
    }

    getQuarters () {
        return this.quarters
    }

    render (ctx: CanvasRenderingContext2D, position: { x: number, y: number, centerX: number, centerY: number }) {
        const { x, y, centerX, centerY } = position

        this.relativeX = x + this.x
        this.relativeY = y + this.y
        this.computeQuarters(centerX, centerY)
        this.ownRender(ctx, this.relativeX, this.relativeY)
    }

    protected ownRender (ctx: CanvasRenderingContext2D, x: number, y: number) {
        throw new MethodNotImplemented()
    }
}

export class Square extends Shape {
    radius: number

    constructor (x: number, y: number, radius: number, props?: ShapeProps) {
        super()
        this.x = x
        this.y = y
        this.radius = radius
    }

    onMouseDown () {
        console.log('Ssquare')
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

export class Circle extends Shape {
    radius: number

    constructor (x: number, y: number, radius: number, props?: ShapeProps) {
        super()
        this.x = x
        this.y = y
        this.radius = radius
    }

    onMouseDown () {
        console.log('Click')
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

        return this.radius >= Math.sqrt(
            Math.pow(x - this.relativeX, 2) + Math.pow(y - this.relativeY, 2)
        )
    }

    protected ownRender (ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.beginPath()
        ctx.fillStyle = '#E0FFFD'
        ctx.arc(x, y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}
