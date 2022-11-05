import BaseFigure from './BaseFigure'
import { Square, Circle } from '../shapes'

export default class SquareFigure extends BaseFigure {
    constructor (x: number, y: number) {
        super()

        this.x = x
        this.y = y

        this.setupFigure()
    }

    setupFigure () {
        this.shapes =  [
            new Square(0, 0, 40),
            new Circle(-40, 0, 20),
            new Circle(40, 0, 20),
            new Circle(0, -40, 20),
            new Circle(0, 40, 20),
        ]
    }
}
