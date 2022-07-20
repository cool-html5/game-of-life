import {useEffect, useRef, useState} from "react"
import {Panel} from "./panel"
import {CellTable} from "./cell-table"

const cellWidth = 15
const cellHeight = 15
const intervalInMs = 50

type Props = {
	horizontalCells: number
	verticalCells: number
}

export const Game = (props: Props) => {
	const {horizontalCells, verticalCells} = props
	const canvasWidth = cellWidth * horizontalCells
	const canvasHeight = cellHeight * verticalCells
	const [buttonStates, setButtonStates] = useState({start: true, pause: false, newGame: false, gosperGliderGun: true})
	const intervalHandle = useRef<number>()
	const context = useRef<CanvasRenderingContext2D>()
	const cellTable = useRef<CellTable>()
	const gamePaused = useRef(false)
	const mouse_down = useRef(0)
	const mouse_x = useRef(0)
	const mouse_y = useRef(0)

	const startGame = function () {
		setButtonStates({start: false, pause: true, newGame: true, gosperGliderGun: true})
		intervalHandle.current = setInterval(nextStep, intervalInMs)
	}

	const deactivateTimer = function () {
		clearInterval(intervalHandle.current)
		intervalHandle.current = undefined
	}

	const newGame = function () {
		deactivateTimer()
		initCellTable()
		cellTable.current?.createCells()
		cellTable.current?.drawGrid()
		gamePaused.current = false
		setButtonStates({start: true, pause: false, newGame: false, gosperGliderGun: true})
	}

	const gosperGliderGun = function () {
		cellTable.current?.gosperGliderGun()
	}

	const initCellTable = function () {
		if (context?.current) {
			cellTable.current = new CellTable(context.current, canvasWidth, canvasHeight, horizontalCells, verticalCells)
		}
	}

	const togglePause = function () {
		if (gamePaused.current) {
			nextStep()
			intervalHandle.current = setInterval(nextStep, intervalInMs)
		} else {
			deactivateTimer()
		}

		setButtonStates({start: false, pause: true, newGame: true, gosperGliderGun: true})
		gamePaused.current = !gamePaused.current
	}

	const nextStep = () => {
		if (cellTable?.current) {
			cellTable.current.determineNextStates()
			const transitions = cellTable.current.updateCurrentStates()
			if (transitions === 0) {
				setButtonStates({start: true, pause: false, newGame: true, gosperGliderGun: true})
				deactivateTimer()
			}
		}
	}

	const getBlockCoordinate = (q: number) => {
		return q > 1 ? Math.floor((q - 1) / cellWidth) : 0
	}

	const mouseMoveHandler = (event: MouseEvent) => {
		if (!cellTable?.current || !context?.current) {
			return
		}

		const rect = context.current.canvas.getBoundingClientRect()
		mouse_x.current = Math.round(event.clientX - rect.left)
		mouse_y.current = Math.round(event.clientY - rect.top)
		if (mouse_x.current < 0) mouse_x.current = 0
		if (mouse_x.current > canvasWidth) mouse_x.current = canvasWidth
		if (mouse_y.current < 0) mouse_y.current = 0
		if (mouse_y.current > canvasHeight) mouse_y.current = canvasHeight
		if (mouse_down.current == 1) {
			cellTable.current.drawRect(getBlockCoordinate(mouse_x.current), getBlockCoordinate(mouse_y.current), true)
		} else if (mouse_down.current == 2) {
			cellTable.current.drawRect(getBlockCoordinate(mouse_x.current), getBlockCoordinate(mouse_y.current), false)
		}
	}

	const mouseDownHandler = (event: MouseEvent) => {
		if (!cellTable?.current) {
			return
		}

		console.log("event", event)
		event.preventDefault()
		event.cancelBubble = true
		event.stopPropagation()
		if (event.button == 0) {
			mouse_down.current = 1
			cellTable.current.drawRect(getBlockCoordinate(mouse_x.current), getBlockCoordinate(mouse_y.current), true)
		} else if (event.button == 2) {
			mouse_down.current = 2
			cellTable.current.drawRect(getBlockCoordinate(mouse_x.current), getBlockCoordinate(mouse_y.current), false)
		} else {
			mouse_down.current = 0
		}
	}

	const mouseUpHandler = (event: MouseEvent) => {
		event.preventDefault()
		event.cancelBubble = true
		event.stopPropagation()
		mouse_down.current = 0
	}

	useEffect(() => {
		const canvas = document.getElementById("canvas")! as HTMLCanvasElement
		context.current = canvas.getContext("2d")!
		cellTable.current = new CellTable(context.current, canvasWidth, canvasHeight, horizontalCells, verticalCells)
		cellTable.current.createCells()
		canvas.addEventListener("mousemove", mouseMoveHandler)
		canvas.addEventListener("mousedown", mouseDownHandler)
		canvas.addEventListener("mouseup", mouseUpHandler)
		canvas.addEventListener('contextmenu', event => event.preventDefault());

	}, [])

	return (
		<div className="ml-24">
			<h1 className="text-3xl font-bold p-6">Game of Life</h1>
			<Panel
				buttonStates={buttonStates}
				startGame={startGame}
				togglePause={togglePause}
				newGame={newGame}
				gosperGliderGun={gosperGliderGun}
				gamePaused={gamePaused.current}
			/>
			<div className="flex flex-row my-5 mx-8">
			<canvas id="canvas" width={canvasWidth} height={canvasHeight} className="border-2 border-slate-300"></canvas>
			</div>
		</div>
	)
}
