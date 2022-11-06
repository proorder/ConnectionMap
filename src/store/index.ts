import { createStore } from 'vuex'
import type { StoreFigure } from '@/components/features/FigureConstructor/types'

export default createStore({
    state: {
        figures: [] as StoreFigure[],
    },
    getters: {
        figures (state) {
            return state.figures
        },
    },
    mutations: {
        setFigures (state, figures) {
            state.figures = figures
        },
    },
    actions: {
        setFigures ({ commit }, figures) {
            commit('setFigures', figures)
        },
    },
})
