import {ButtonStates} from "./types"

type Props = {
	buttonStates: ButtonStates
	startGame: () => void
	togglePause: () => void
	newGame: () => void
	gosperGliderGun: () => void
	gamePaused: boolean
}

export const Panel = (props: Props) => {
	const {buttonStates, startGame, togglePause, newGame, gosperGliderGun, gamePaused} = props

	return (
		<div className="flex flex-row">
			<div className="flex flex-row w-auto ml-6 rounded-xl border-2 border-slate-300 cursor-default">
				<button
					disabled={!buttonStates.start}
					onClick={startGame}
					className="flex-initial w-24 px-5 py-2 border-r-2 rounded-l-lg hover:bg-slate-200 disabled:text-gray-400"
				>
					Start
				</button>
				<button
					disabled={!buttonStates.pause}
					onClick={togglePause}
					className="flex-initial w-24 px-5 py-2 border-r-2 hover:bg-slate-200 disabled:text-gray-400"
				>
					{gamePaused ? "Resume" : "Pause"}
				</button>
				<button
					disabled={!buttonStates.newGame}
					onClick={newGame}
					className="flex-initial grow px-5 py-2 border-r-2 rounded-r-lg hover:bg-slate-200 disabled:text-gray-400"
				>
					New game
				</button>
				<button
					disabled={!buttonStates.gosperGliderGun}
					onClick={gosperGliderGun}
					className="flex-initial grow px-5 py-2 rounded-r-lg hover:bg-slate-200 disabled:text-gray-400"
				>
					Gosper Glider Gun
				</button>
			</div>
		</div>
	)
}
