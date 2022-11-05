import type { IBaseFigure, IConnectable, IEventful, IShape, Quarter } from '../types'
import { MethodNotImplemented } from '../errors'

export default class BaseFigure implements IBaseFigure, IConnectable, IEventful {
    shapes: IShape[] = []

    x = 0
    y = 0

    delete () {
        throw new MethodNotImplemented()
    }

    move (x: number, y: number) {
        console.log(x + y)
    }

    addConnection () {
        throw new MethodNotImplemented()
    }

    render (ctx: CanvasRenderingContext2D, bias: { x: number, y: number, centerX: number, centerY: number }) {
        this.shapes.forEach((s) => {
            s.render(ctx, {
                x: this.x + bias.x,
                y: this.y + bias.y,
                centerX: bias.centerX,
                centerY: bias.centerY,
            })
        })
    }

    determineElement (quarter: Quarter, cursor: { x: number, y: number }) {
        const shapes = this.shapes
            .filter(s => s.getQuarters().includes(quarter))
            .reverse()

        for (let s of shapes) {
            if (s.inEvent({ x: cursor.x, y: cursor.y })) {
                return s
            }
        }

        return false
    };

    onHover () {
        throw new MethodNotImplemented()
    }

    onClick () {
        throw new MethodNotImplemented()
    }
}
