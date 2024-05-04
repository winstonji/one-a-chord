import React, { useEffect, useState } from 'react'
import '../styles/global.scss'
const Home = () => {
	const [backendData, setBackendData] = useState<string | undefined>()
	useEffect(() => {
		(window as any).electron.ipcRenderer
			.invoke('exampleHandler')
			.then((data: string) => {
				setBackendData(data)
			})
	}, [])

	return (
		<div className="oac-main-container">
			Hello world!
			{backendData && <strong>{backendData}</strong>}
		</div>
	)
}

export default Home
