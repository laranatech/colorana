import {
	ArcOpts,
	ArcToOpts,
	Box,
	CommandOptions,
	DrawImageOpts,
	DrawSpriteOpts,
	EllipseOpts,
	FillTextOpts,
	PasteBitmapOpts,
	Point,
	PrimitiveCommandType,
	QuadraticCurveToOpts,
	RenderCommand,
	RoundedRectOpts,
	StrokeTextOpts,
} from '@laranatech/lareq'

export type CommandHandler = (
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	images: Map<string, HTMLImageElement>,
	command: RenderCommand
) => void

export const commandHandlers: Record<PrimitiveCommandType, CommandHandler> = {
	beginPath: (_canvas, ctx, _images, _command) => { ctx.beginPath() },
	setCtx: (_canvas, ctx, _images, command) => {
		const o = command.o as CommandOptions

		Object.entries(o).forEach(([k, value]) => {
			const key = k as keyof CanvasRenderingContext2D & keyof CommandOptions
			if (['radius', 'pattern'].includes(key)) {
				return
			}
			if (!(key in ctx)) {
				return
			}
			const current = ctx[key as keyof CanvasRenderingContext2D]
			if (typeof current === typeof value) {
				(ctx as Record<typeof key, typeof value>)[key] = value
			}
		})
	},
	arc: (_canvas, ctx, _images, command) => {
		const o = command.o as ArcOpts
		const { x, y, radius, start = 0, end = Math.PI * 2 } = o
		ctx.arc(x, y, radius, start, end)
	},
	arcTo: (_canvas, ctx, _images, command) => {
		const o = command.o as ArcToOpts
		ctx.arcTo(o.a.x, o.a.y, o.b.x, o.b.y, o.radius)
	},
	bezierQurveTo: (_canvas, _ctx, _images, _command) => {
		throw new Error('Function not implemented.')
	},
	clip: (_canvas, ctx, _images, _command) => {
		ctx.clip()
	},
	closePath: (_canvas, ctx, _images, _command) => {
		ctx.closePath()
	},
	clearRect: (_canvas, ctx, _images, command) => {
		const o = command.o as Box
		const { x, y, w, h } = o
		ctx.clearRect(x, y, w, h)
	},
	drawImage: (_canvas, ctx, images, command) => {
		const o = command.o as DrawImageOpts

		const img = images.get(o.img)

		if (!img) {
			return
		}

		ctx.drawImage(img, o.x, o.y, o.w, o.h)
	},
	drawSprite: (_canvas, ctx, images, command) => {
		const o = command.o as DrawSpriteOpts

		const img = images.get(o.img)

		if (!img) {
			return
		}

		const s = o.source
		const d = o.destination

		ctx.drawImage(img, s.x, s.y, s.w, s.h, d.x, d.y, d.w, d.h)
	},
	fill: (_canvas, ctx, _images, _command) => {
		ctx.fill()
	},
	fillText: (_canvas, ctx, _images, command) => {
		const o = command.o as FillTextOpts
		ctx.fillText(o.text, o.x, o.y, o.maxWidth)
	},
	lineTo: (_canvas, ctx, _images, command) => {
		const o = command.o as Point
		const { x, y } = o
		ctx.lineTo(x, y)
	},
	moveTo: (_canvas, ctx, _images, command) => {
		const o = command.o as Point
		const { x, y } = o
		ctx.moveTo(x, y)
	},
	pasteBitmap: (_canvas, ctx, _images, command) => {
		const o = command.o as PasteBitmapOpts

		const b = (o.bitmap as unknown) as Uint8ClampedArray

		const h = b.length / o.channels / o.length

		const data = new ImageData(b, o.length, h, {})

		ctx.putImageData(data, o.x, o.y)
	},
	quadraticCurveTo: (_canvas, ctx, _images, command) => {
		const o = command.o as QuadraticCurveToOpts
		ctx.quadraticCurveTo(o.c.x, o.c.y, o.p.x, o.p.y)
	},
	rect: (_canvas, ctx, _images, command) => {
		const o = command.o as Box
		const { x, y, w, h } = o
		ctx.rect(x, y, w, h)
	},
	restore: (_canvas, ctx, _images, _command) => {
		ctx.restore()
	},
	rotate: (_canvas, ctx, _images, command) => {
		ctx.rotate(command.o as number)
	},
	roundedRect: (_canvas, ctx, _images, command) => {
		const o = command.o as RoundedRectOpts
		const { x, y, w, h, radius } = o
		ctx.roundRect(x, y, w, h, radius)
	},
	save: (_canvas, ctx, _images, _command) => {
		ctx.save()
	},
	scale: (_canvas, ctx, _images, command) => {
		const o = command.o as Point
		const { x, y } = o
		ctx.scale(x, y)
	},
	stroke: (_canvas, ctx, _images, _command) => {
		ctx.stroke()
	},
	strokeText: (_canvas, ctx, _images, command) => {
		const o = command.o as StrokeTextOpts
		ctx.strokeText(o.text, o.x, o.y, o.maxWidth)
	},
	translate: (_canvas, ctx, _images, command) => {
		const o = command.o as Point
		const { x, y } = o
		ctx.translate(x, y)
	},
	reset: (_canvas, ctx, _images, _command) => {
		ctx.reset()
	},
	resetTransform: (_canvas, ctx, _images, _command) => {
		ctx.resetTransform()
	},
	setLineDash: (_canvas, ctx, _images, command) => {
		ctx.setLineDash(command.o as number[])
	},
	setTransform: (_canvas, ctx, _images, command) => {
		const m = command.o as number[]
		ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
	},
	transform: (_canvas, ctx, _images, command) => {
		const m = command.o as number[]
		ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5])
	},
	ellipse: (_canvas, ctx, _images, command) => {
		const o = command.o as EllipseOpts
		ctx.ellipse(
			o.p.x,
			o.p.y,
			o.r.x,
			o.r.y,
			o.rotation,
			o.start || 0,
			o.end || Math.PI * 2,
			o.counterclockwise || false
		)
	},
	tick: (_canvas, _ctx, _images, _command) => {
		console.log('Not implemented yet.')
	},
}
