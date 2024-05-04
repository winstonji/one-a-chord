import { ipcMain } from 'electron'
import { HandlerWrapper, handlerMethods } from './handlerDecorator'
import { ExampleHandler } from '../exampleHandler'

/**
 * Inject handlers for all service methods annoted with @handler into the ipcMain context.
 */
export function injectAllHandlers() {
	const results = {}

	//Unfortunately do to tree shaking, we need to declare an instance of each service here or the imports for the service will be removed during transpiling
	// and then they will not be decorated.
	const exampleHandler = new ExampleHandler()

	Object.keys(handlerMethods).forEach((serviceClassName) => {
		const handlerWrapper: HandlerWrapper = handlerMethods[serviceClassName]

		const service = new handlerWrapper.constructor()
		handlerMethods[serviceClassName].functions.forEach((handler) => {
			console.log(`creating handler for: ${handler}`)
			ipcMain.handle(handler as string, (event, ...args) => {
				const handlerFunction = service[handler]
				return handlerFunction.call(service, ...args)
			})
		})
	})
}
