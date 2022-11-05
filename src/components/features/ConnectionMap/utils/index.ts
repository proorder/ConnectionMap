import { Quarter } from '../types'

interface ComputeQuarterProps {
    x: number
    y: number
    centerX: number
    centerY: number
}

export function computeQuarter ({ x, y, centerX, centerY }: ComputeQuarterProps) {
    switch (true) {
        case x <= centerX && y <= centerY:
            return Quarter.LeftUp
        case x > centerX && y <= centerY:
            return Quarter.RightUp
        case x <= centerX && y > centerY:
            return Quarter.LeftDown
        default:
            return Quarter.RightDown
    }
}
