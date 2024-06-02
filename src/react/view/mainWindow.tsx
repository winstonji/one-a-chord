import React, { useEffect, useState } from 'react'
import '../styles/global.scss'
import ProgramWindow from './programWindow'
const MainWindow = () => {
	// const [backendData, setBackendData] = useState<string | undefined>()
	// useEffect(() => {
	// 	(window as any).electron.ipcRenderer
	// 		.invoke('exampleHandler')
	// 		.then((data: string) => {
	// 			setBackendData(data)
	// 		})
	// }, [])

	return (
		<div className="oac-main-container">
			<ProgramWindow/>
		</div>
	)
}

export default MainWindow
