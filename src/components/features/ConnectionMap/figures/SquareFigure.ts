import BaseFigure from './BaseFigure'
import type { IShape, ShapeProps } from '../types'
import { Square, Circle } from '../shapes'
import type { ShapeData, Shape } from '@/components/features/FigureConstructor/types'

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

    static Factory (data: ShapeData[]) {
        const getShapeClass = (type: Shape) => {
            switch (type) {
                case 'square':
                    return Square
                default:
                    return Circle
            }
        }
        
        const shapes: IShape[] = data.map(
            (s) => {
                const shapeProps: ShapeProps = {}
                if (s.color) {
                    shapeProps.backgroundColor = s.color
                }

                return new (getShapeClass(s.type))(
                    s.x,
                    s.y,
                    s.radius,
                    shapeProps,
                )
            }
        )

        return new SquareFigure(0, 0, shapes)
    }
}
