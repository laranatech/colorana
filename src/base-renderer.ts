import { RenderCommand } from '@laranatech/lareq'

export type RendererConfig = {
	fps?: number
	preloadImages?: string[]
}

export abstract class BaseRenderer {
	config: RendererConfig = {}
	currentCommand: number = 0
	lastQueue: RenderCommand[] = []

	constructor(config: RendererConfig) {
		this.config = config
	}

	init() {
		throw new Error('Not implemented.')
	}

	prepare(_queue: RenderCommand[]) {
		throw new Error('Not implemented.')
	}

	render(_queue: RenderCommand[]) {
		throw new Error('Not implemented.')
	}

	resize(_w: number, _h: number) {
		throw new Error('Not implemented.')
	}
}
