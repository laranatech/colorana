export const debounce = (method: CallableFunction, timeoutMs: number) => {
	let lastCall = 0
	let timer = 0

	return (...args: unknown[]) => {
		const previousCall = lastCall

		lastCall = Date.now()

		if (lastCall - previousCall <= timeoutMs) {
			clearTimeout(timer)
		}

		timer = setTimeout(() => method(...args), timeoutMs)
	}
}
