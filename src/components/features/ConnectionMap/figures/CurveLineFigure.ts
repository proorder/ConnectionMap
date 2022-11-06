import BaseFigure from './BaseFigure'
import type { IShape } from '../types'
import { CurveLine } from '../shapes'

export default class CurveLineFigure extends BaseFigure {
    startPoint: IShape
    endPoint: IShape | null
    shapes: CurveLine[] = []
    priority: number = 10

    constructor (startPoint: IShape, endPoint?: IShape | null | undefined) {
        super()

        this.startPoint = startPoint
        this.endPoint = endPoint || null

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
