import { BaseRenderer, RendererConfig } from './base-renderer'
import { CommandType, DrawImageOpts, RenderCommand, getCommandNameByByte } from '@laranatech/lareq'
import { commandHandlers } from './command-handlers'
import { debounce } from './utils'

export class CanvasRenderer extends BaseRenderer {
	canvas: HTMLCanvasElement | null = null
	ctx: CanvasRenderingContext2D | null = null

	images = new Map<string, HTMLImageElement>()

	lastQueue: RenderCommand[] = []

	constructor(config: RendererConfig) {
		super(config)

		this.resize = debounce((w: number, h: number) => {
			if (!this.canvas) {
				throw new Error('The canvas is not initialized')
			}
			this.canvas.width = w
			this.canvas.height = h
			this.render(this.lastQueue)
		}, 16)
	}

	init() {
		this.canvas = document.getElementById('larana-canvas') as HTMLCanvasElement
		this.ctx = this.canvas.getContext('2d')

		this.preloadImages()

		this.resize(window.innerHeight, window.innerWidth)

		window.addEventListener('resize', () => {
			this.resize(window.innerHeight, window.innerWidth)
		})
	}

	prepare(queue: RenderCommand[]) {
		this.lastQueue = queue

		queue
			.filter((c) => ['drawImage', 'drawSprite'].includes(getCommandNameByByte(c.c)))
			.forEach((c) => {
				const opts = c.o as DrawImageOpts
				if (this.images.has(opts.img)) {
					return
				}

				const img = new Image()

				img.onload = () => {
					this.images.set(opts.img, img)
					this.render(queue)
				}

				img.src = opts.img
			})
	}

	render(queue: RenderCommand[]) {
		this.lastQueue = queue

		this.currentCommand = 0

		this.draw(queue)
	}

	draw(queue: RenderCommand[]) {
		if (!this.canvas || !this.ctx) {
			throw new Error('The canvas is not initialized')
		}

		if (this.currentCommand >= queue.length) {
			return
		}

		const command = queue[this.currentCommand]

		const commandName: CommandType = getCommandNameByByte(command.c)

		commandHandlers[commandName](
			this.canvas as HTMLCanvasElement,
			this.ctx as CanvasRenderingContext2D,
			this.images,
			command
		)

		this.currentCommand += 1
		this.draw(queue)
	}

	preloadImages() {
		if (!this.config.preloadImages) {
			return
		}
		this.config.preloadImages.forEach((src: string) => {
			const img = new Image()

			img.onload = () => {
				this.images.set(src, img)
			}

			img.src = src
		})
	}
}
