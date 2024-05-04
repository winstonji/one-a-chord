import { BaseHandlerService } from './baseHandlerService'
import { handler } from './decorators/handlerDecorator'

export class ExampleHandler extends BaseHandlerService {
	constructor() {
		super('ExampleHandler')
	}

	@handler
	async exampleHandler(): Promise<string> {
		return 'hello this data is from the backend'
	}
}
