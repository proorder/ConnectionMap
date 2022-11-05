export interface IConnectable {
    addConnection: () => void
}

export const enum Quarter {
    LeftUp,
    RightUp,
    LeftDown,
    RightDown,
}

export interface IEventful {
    determineElement: (quarter: Quarter, cursor: { x: number, y: number }) => IShape | false
    onHover: (cursorPosition: { relativeX: number, relativeY: number }) => void
    onClick: (cursorPosition: { relativeX: number, relativeY: number }) => void
}

export interface IBaseFigure {
    x: number
    y: number

    delete: () => void
    move: (relativeX: number, relativeY: number) => void
    render: (ctx: CanvasRenderingContext2D, bias: { x: number, y: number, centerX: number, centerY: number }) => void
}

export interface IShape {
    x: number
    y: number

    inEvent: (cursor: { x: number, y: number }) => boolean
    computeQuarters: (centerX: number, centerY: number) => void
    getQuarters: () => Quarter[]
    onMouseDown?: () => void
    onMouseUp?: () => void
    onClick?: () => void
    onHover?: () => void
    onHoverOut?: () => void
    render: (ctx: CanvasRenderingContext2D, position: { x: number, y: number, centerX: number, centerY: number }) => void
}

export interface ShapeProps {
    backgroundColor: string
    strokeWidth: string
    strokeColor: string
}