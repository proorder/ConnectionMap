import type { IShape, Quarter, IBaseFigure, ShapeProps } from '../types'
import type ConnectionMap from '../ConnectionMap'
import { MethodNotImplemented, QuarterNotComputed } from '../errors'
import { v4 as uuid } from 'uuid'

export default class Shape implements IShape {
    x: number = 0
    y: number = 0
    id: string = uuid()
    relativeX: number = 0
    relativeY: number = 0
    fill: string = '#FAA36B'
    stroke: string = '#E2FA2D'
    strokeWidth: number = 0
    quarters: Quarter[] = []
    figure: IBaseFigure | null = null
    _pointerDownStart: null | { x: number, y: number } = null
    _lastPointerMove: null | { x: number, y: number } = null
    $root: ConnectionMap | null = null

    reRenderCallback: null | (() => void) = null

    setReRenderCallback (callback: () => void) {
        this.reRenderCallback = callback
    }

    setupProps (props: ShapeProps) {
        this.fill = props.backgroundColor || this.fill
        this.stroke = props.strokeColor || this.stroke
        // this.? = props.strokeWidth || 
    }

    setFigure (figure: IBaseFigure) {
        this.figure = figure
    }

    setRoot (root: ConnectionMap) {
        this.$root = root
    }

    computeQuarters (centerX: number, centerY: number) {
        throw new MethodNotImplemented()
    }

    getQuarters () {
        return this.quarters
    }

    getRelativePosition () {
        return {
            x: this.relativeX,
            y: this.relativeY,
        }
    }

    inEvent (cursor: { x: number, y: number }) {
        throw new MethodNotImplemented()

        return false
    }

    render (ctx: CanvasRenderingContext2D, position: { x: number, y: number, centerX: number, centerY: number, cursorX: number, cursorY: number }) {
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