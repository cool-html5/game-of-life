import {CellTable} from "./cell-table"

const s = [false, true, true, false, false, false, false, false]
const b = [false, false, true, false, false, false, false, false]

export class Cell {
	x: number
	y: number
	currentState: boolean
	nextState: boolean
	cellTable: CellTable

	constructor(x: number, y: number, currentState: boolean, nextState: boolean, cellTable: any) {
		this.x = x
		this.y = y
		this.currentState = currentState
		this.nextState = nextState
		this.cellTable = cellTable
	}

	clearState() {
		this.currentState = false
		this.nextState = false
	}

	getState() {
		return this.currentState
	}

	setState(state: boolean) {
		this.currentState = state
	}

	determineNextState() {
		const aliveCount = this.cellTable.countLivingNeighborCells(this.x, this.y)

		if (aliveCount == 0) {
			this.nextState = false // Death
			return
		}

		if (
			(s[0] && aliveCount == 1) ||
			(s[1] && aliveCount == 2) ||
			(s[2] && aliveCount == 3) ||
			(s[3] && aliveCount == 4) ||
			(s[4] && aliveCount == 5) ||
			(s[5] && aliveCount == 6) ||
			(s[6] && aliveCount == 7) ||
			(s[7] && aliveCount == 8)
		) {
			this.nextState = this.currentState // Survival if already alive
		} else {
			this.nextState = false // Death
		}

		if (
			(b[0] && aliveCount == 1) ||
			(b[1] && aliveCount == 2) ||
			(b[2] && aliveCount == 3) ||
			(b[3] && aliveCount == 4) ||
			(b[4] && aliveCount == 5) ||
			(b[5] && aliveCount == 6) ||
			(b[6] && aliveCount == 7) ||
			(b[7] && aliveCount == 8)
		) {
			this.nextState = true // Birth
		}
	}

	updateCurrentState() {
		if (this.currentState != this.nextState) {
			this.cellTable.setPixelState(this.x, this.y, this.nextState)
			return 1
		}
		return 0
	}
}
