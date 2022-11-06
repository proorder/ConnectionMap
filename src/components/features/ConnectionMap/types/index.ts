export interface IConnectable {
    addConnection: () => void
}

export const enum Quarter {
    LeftUp,
    RightUp,
    LeftDown,
    RightDown,
}

export const enum TransmitterEvent {
    Move,
    Down,
    Up,
    Double,
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
    id: string

    inEvent: (cursor: { x: number, y: number }) => boolean
    computeQuarters: (centerX: number, centerY: number) => void
    getQuarters: () => Quarter[]
    setFigure: (figure: IBaseFigure) => void
    setReRenderCallback: (callback: () => void) => void
    onPointerDown?: (pointer: { x: number, y: number }) => void | ((event: TransmitterEvent) => void)
    onPointerUp?: (pointer: { x: number, y: number }) => void | ((event: TransmitterEvent) => void)
    onMove?: (pointer: { x: number, y: number }) => void | ((event: TransmitterEvent) => void)
    onClick?: (pointer: { x: number, y: number }) => void | ((event: TransmitterEvent) => void)
    onHover?: () => void | ((event: TransmitterEvent) => void)
    onHoverOut?: () => void | ((event: TransmitterEvent) => void)
    render: (ctx: CanvasRenderingContext2D, position: { x: number, y: number, centerX: number, centerY: number }) => void
}

export interface ShapeProps {
    backgroundColor: string
    strokeWidth: string
    strokeColor: string
}