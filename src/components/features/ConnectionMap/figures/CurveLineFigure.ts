import BaseFigure from './BaseFigure'
import type { IShape } from '../types'
import { CurveLine } from '../shapes'

export default class CurveLineFigure extends BaseFigure {
    startPoint: IShape
    endPoint: IShape | null
    shapes: CurveLine[] = []

    constructor (startPoint: IShape, endPoint: IShape | null) {
        super()

        this.startPoint = startPoint
        this.endPoint = endPoint

        this.defineShapes()
    }

    setEndPoint (endPoint: IShape) {
        this.endPoint = endPoint

        this.shapes[0]?.setEndPoint(endPoint)
    }

    defineShapes () {
        this.shapes =  [
            new CurveLine(this.startPoint, this.endPoint),
        ]
    }
}
