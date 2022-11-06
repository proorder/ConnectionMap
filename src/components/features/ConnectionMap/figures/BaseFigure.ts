import type { IBaseFigure, IConnectable, IEventful, IShape, Quarter } from '../types'
import { MethodNotImplemented } from '../errors'
import type ConnectionMap from '../ConnectionMap'
import { v4 as uuid } from 'uuid'

type SetupFigure = (options: { root: ConnectionMap, reRerenderCallback: () => void }) => void

export default class BaseFigure implements IBaseFigure, IConnectable, IEventful {
    $root: ConnectionMap | null = null
    shapes: IShape[] = []
    reRenderCallback: (() => void) | null = null
    priority: number = 0
    id: string = uuid()

    x = 0
    y = 0

    onHover () {
        throw new MethodNotImplemented()
    }

    onClick () {
        throw new MethodNotImplemented()
    }

    delete () {
        this.$root?.deleteFigure(this.id)
    }

    move (x: number, y: number) {
        this.x += x
        this.y += y

        this.reRenderCallback && this.reRenderCallback()
    }

    addConnection () {
        throw new MethodNotImplemented()
    }

    setupFigure: SetupFigure = ({
        root,
        reRerenderCallback,
    }) => {
        this.$root = root
        this.reRenderCallback = reRerenderCallback
        this.setupShapes()
    }

    setupShapes () {
        this.shapes.forEach((s) => {
            s.setRoot(this.$root as ConnectionMap)
            s.setReRenderCallback(this.reRenderCallback as () => void)
            s.setFigure(this)
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
    }

    render (ctx: CanvasRenderingContext2D, bias: { x: number, y: number, centerX: number, centerY: number, cursorX: number, cursorY: number }) {
        this.shapes.forEach((s) => {
            s.render(ctx, {
                x: this.x + bias.x,
                y: this.y + bias.y,
                centerX: bias.centerX,
                centerY: bias.centerY,
                cursorX: bias.cursorX,
                cursorY: bias.cursorY,
            })
        })
    }
}
