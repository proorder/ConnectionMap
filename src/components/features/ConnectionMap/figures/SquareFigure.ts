import BaseFigure from './BaseFigure'
import type { IShape } from '../types'
import { Square, Circle } from '../shapes'

export default class SquareFigure extends BaseFigure {
    constructor (x: number, y: number, customShapes?: IShape[]) {
        super()

        this.x = x
        this.y = y

        this.defineShapes(customShapes)
    }

    defineShapes (customShapes?: IShape[]) {
        this.shapes = customShapes || [
            new Square(0, 0, 40),
            new Circle(-40, 0, 20),
            new Circle(40, 0, 20),
            new Circle(0, -40, 20),
            new Circle(0, 40, 20),
        ]
    }

    static Factory (shapes: IShape[]) {
        const figure = new SquareFigure(0, 0, shapes)
    }
}
