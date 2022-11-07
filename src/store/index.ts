import { createStore } from 'vuex'
import type { ShapeData } from '@/components/features/FigureConstructor/types'
import cloneDeep from 'lodash.clonedeep'

export default createStore({
    state: {
        figures: [] as ShapeData[][],
    },
    getters: {
        figures (state) {
            return state.figures
        },
    },
    mutations: {
        addFigure (state, figure: ShapeData[]) {
            state.figures = [...state.figures, figure]
        },
    },
    actions: {
        addFigure ({ commit }, figure: ShapeData[]) {
            commit('addFigure', figure)
        },
    },
})
