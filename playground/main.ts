import { Point, RenderQueue, point } from '@laranatech/lareq'
import { CanvasRenderer } from '../src/canvas-renderer'

const renderer = new CanvasRenderer({
	preloadImages: ['/maria.webp'],
})

const lareq = new RenderQueue()

lareq.complex.sprite({
	img: '/maria.webp',
	source: {
		x: 0,
		y: 0,
		w: 50,
		h: 50,
	},
	destination: {
		x: 100,
		y: 100,
		w: 600,
		h: 450,
	},
	customShape: (q, _opts) => {
		q.command.beginPath()
		q.command.moveTo(point(100, 100))
		q.command.lineTo(point(700, 150))
		q.command.lineTo(point(700, 350))
		q.command.lineTo(point(100, 400))
		q.command.closePath()
	}
})

const arrow = (a: Point, b: Point) => {
	const angle = Math.atan2(b.y - a.y, b.x - a.x)
	const arrowSize = 16

	lareq.command.beginPath()
	lareq.command.moveTo(a)
	lareq.command.lineTo(b)
	lareq.command.stroke()

	lareq.command.beginPath()
	lareq.command.moveTo(b)
	lareq.command.lineTo({
		x: b.x - arrowSize * Math.cos(angle - Math.PI / 6),
		y: b.y - arrowSize * Math.sin(angle - Math.PI / 6),
	})
	lareq.command.lineTo({
		x: b.x - arrowSize * Math.cos(angle + Math.PI / 6),
		y: b.y - arrowSize * Math.sin(angle + Math.PI / 6),
	})
	lareq.command.closePath()
	lareq.command.fill()
}

lareq.command.setCtx({
	lineWidth: 2,
	lineCap: 'round',
	lineJoin: 'round',
	strokeStyle: '#fff',
	fillStyle: '#fff',
})

lareq.command.tick()
// top
arrow(point(800, 800), point(800, 750))
lareq.command.tick()
// top-right
arrow(point(800, 800), point(850, 750))
lareq.command.tick()
// right
arrow(point(800, 800), point(850, 800))
lareq.command.tick()
// bottom-right
arrow(point(800, 800), point(850, 850))
lareq.command.tick()
// bottom
arrow(point(800, 800), point(800, 850))
lareq.command.tick()
// bottom-left
arrow(point(800, 800), point(750, 850))
lareq.command.tick()
// left
arrow(point(800, 800), point(750, 800))
lareq.command.tick()
// top-left
arrow(point(800, 800), point(750, 750))
lareq.command.tick()

lareq.command.beginPath()
lareq.command.ellipse({
	p: point(80, 80),
	r: point(16, 8),
	rotation: 0,
})
lareq.command.fill()
lareq.command.tick()

const invert = (input: Uint8ClampedArray) => {
	const data = new Uint8ClampedArray(input)

	for (let i = 0; i < data.length; i += 4) {
		data[i] = 255 - data[i]; // red
		data[i + 1] = 255 - data[i + 1]; // green
		data[i + 2] = 255 - data[i + 2]; // blue
	}

	return data
}

const mirror = (input: Uint8ClampedArray, w: number, h: number, axis: 'x' | 'y') => {
	const output = new Uint8ClampedArray(input.length)
	const channels = 4

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const srcIndex = (y * w + x) * channels
			const mirroredX = axis === 'x' ? w - x - 1 : x
			const mirroredY = axis === 'y' ? h - y - 1 : y
			const destIndex = (mirroredY * w + mirroredX) * channels

			for (let c = 0; c < channels; c++) {
				output[destIndex + c] = input[srcIndex + c]
			}
		}
	}

	return output
}

const sort = (input: Uint8ClampedArray) => {
	return input.toSorted()
}

const bitmapA = () => {
	const data = new Uint8ClampedArray(400_000)

	for (let i = 0; i < data.length; i += 4) {
		// Percentage in the x direction, times 255
		const x = ((i % 400) / 4000) * 255
		// Percentage in the y direction, times 255
		const y = (Math.ceil(i / 4000) / 1000) * 255
		// Modify pixel data
		data[i + 0] = x // R value
		data[i + 1] = y // G value
		data[i + 2] = 255 - x // B value
		data[i + 3] = 255 // A value
	}

	lareq.command.tick()

	lareq.command.pasteBitmap({
		bitmap: data,
		x: 100,
		y: 100,
		length: 400,
		channels: 4,
	})

	// lareq.command.pasteBitmap({
	// 	bitmap: invert(data),
	// 	x: 200,
	// 	y: 200,
	// 	length: 100,
	// 	channels: 4,
	// })

	// lareq.command.pasteBitmap({
	// 	bitmap: mirror(data, 100, 100, 'x'),
	// 	x: 200,
	// 	y: 100,
	// 	length: 100,
	// 	channels: 4,
	// })

	// lareq.command.pasteBitmap({
	// 	bitmap: mirror(data, 100, 100, 'y'),
	// 	x: 100,
	// 	y: 200,
	// 	length: 100,
	// 	channels: 4,
	// })

	// lareq.command.pasteBitmap({
	// 	bitmap: data,
	// 	x: 300,
	// 	y: 100,
	// 	length: 100,
	// 	channels: 4,
	// })

	// lareq.command.pasteBitmap({
	// 	bitmap: mirror(data, 100, 100, 'y'),
	// 	x: 300,
	// 	y: 200,
	// 	length: 100,
	// 	channels: 4,
	// })
}

bitmapA()

document.addEventListener('DOMContentLoaded', () => {
	renderer.init()
	renderer.prepare(lareq.commands)
	renderer.render(lareq.commands)
})


