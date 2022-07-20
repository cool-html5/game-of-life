import {Cell} from "./cell"

const drawColor = "green"

export class CellTable {
	context: CanvasRenderingContext2D
	canvasWidth: number
	canvasHeight: number
	horizontalCells: number
	verticalCells: number
	cellWidth: number
	cellHeight: number

	constructor(
		context: CanvasRenderingContext2D,
		canvasWidth: number,
		canvasHeight: number,
		horizontalCells: number,
		verticalCells: number
	) {
		this.context = context
		this.canvasWidth = canvasWidth
		this.canvasHeight = canvasHeight
		this.horizontalCells = horizontalCells
		this.verticalCells = verticalCells
		this.cellWidth = this.canvasWidth / this.horizontalCells
		this.cellHeight = this.canvasHeight / this.verticalCells
	}

	cellArray = new Array<Cell>()
	steps = 0
	drawColor = "green"

	createCells() {
		for (let y = 0; y < this.verticalCells; y++) {
			for (let x = 0; x < this.horizontalCells; x++) {
				this.cellArray.push(new Cell(x, y, false, false, this))
			}
		}
		console.log("cellArray len", this.cellArray.length)
		this.drawGrid()
	}

	drawGrid() {
		this.context.fillStyle = "#FFFFFF"
		this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.context.strokeStyle = "#999999"
		this.context.lineWidth = 0.5

		// Draw vertical lines
		for (let x = this.cellWidth; x < this.canvasWidth; x += this.cellWidth) {
			this.context.beginPath()
			this.context.moveTo(x - 0.5, 0)
			this.context.lineTo(x - 0.5, this.canvasHeight)
			this.context.stroke()
		}

		// Draw horizontal lines
		for (let y = this.cellHeight; y < this.canvasHeight; y += this.cellHeight) {
			this.context.beginPath()
			this.context.moveTo(0, y - 0.5)
			this.context.lineTo(this.canvasWidth, y - 0.5)
			this.context.stroke()
		}
	}

	clearStates() {
		for (let i = 0; i < this.cellArray.length; i++) {
			this.cellArray[i].clearState()
		}
		for (let x = 0; x <= this.horizontalCells; x++) {
			for (let y = 0; y <= this.verticalCells; y++) {
				this.setPixelState(x, y, false)
			}
		}
	}

	setPixelState(x: number, y: number, state: boolean) {
		this.drawRect(x, y, state)
	}

	drawRect(x: number, y: number, state: boolean) {
		if (state) {
			this.context.fillStyle = drawColor
		} else {
			this.context.fillStyle = "#FFFFFF"
		}
		this.context.lineWidth = 0.5
		this.context.fillRect(x * this.cellWidth + 1, y * this.cellHeight + 1, this.cellWidth - 2, this.cellHeight - 2)
		this.setCellState(x, y, state)
	}

	setCellState(x: number, y: number, state: boolean) {
		const ind = y * this.horizontalCells + x
		this.cellArray[ind].setState(state)
	}

	determineNextStates() {
		for (let i = 0; i < this.cellArray.length; i++) {
			this.cellArray[i].determineNextState()
		}
	}

	getCellState(x: number, y: number) {
		if (x < 0 || y < 0 || x >= this.horizontalCells || y >= this.verticalCells) {
			return false
		}
		const ind = y * this.horizontalCells + x
		return this.cellArray[ind].getState()
	}

	updateCurrentStates() {
		let transitions = 0
		for (let i = 0; i < this.cellArray.length; i++) {
			transitions += this.cellArray[i].updateCurrentState()
		}
		console.log("transitions", transitions)
		return transitions
	}

	countLivingNeighborCells(x: number, y: number) {
		return (
			(this.getCellState(x - 1, y) ? 1 : 0) +
			(this.getCellState(x + 1, y) ? 1 : 0) +
			(this.getCellState(x, y + 1) ? 1 : 0) +
			(this.getCellState(x, y - 1) ? 1 : 0) +
			(this.getCellState(x + 1, y + 1) ? 1 : 0) +
			(this.getCellState(x - 1, y - 1) ? 1 : 0) +
			(this.getCellState(x - 1, y + 1) ? 1 : 0) +
			(this.getCellState(x + 1, y - 1) ? 1 : 0)
		)
	}

	gosperGliderGun() {
		const xarr = [
			6, 6, 7, 7, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 21, 21, 22, 22, 22, 23, 26, 26, 26, 27, 27, 27, 28, 28, 30, 30, 30, 30, 40, 40, 41, 41
		]
		const yarr = [
			11, 12, 11, 12, 11, 12, 13, 10, 14, 9, 15, 9, 15, 12, 10, 14, 11, 12, 13, 12, 9, 10, 11, 9, 10, 11, 8, 12, 7, 8, 12, 13, 9, 10, 9, 10
		]
		const yarr2 = yarr.map(y => y - 5)
		console.log("xarr", yarr2)
		for (let i = 0; i < xarr.length; i++) {
			this.drawRect(xarr[i], yarr[i], true)
		}
	}
}
