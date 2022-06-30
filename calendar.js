function h(tag, attrs, children) {
	const el = document.createElement(tag)
	Object.keys(attrs).forEach(key => {
		el.setAttribute(key, attrs[key])
	})
	children = Array.isArray(children) ? children : [children]
	children.filter(c => c != null).forEach(child => {
		if (typeof child !== 'object') {
			child = document.createTextNode(child)
		}
		el.appendChild(child)
	})
	return el
}

function range(min, max, step = 1) {
	const r = []
	for (i = min; i <= max; i+= step) {
		r.push(i)
	}
	return r
}

function nextDay(date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
}

function prevMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
}

function nextMonth(date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

function shortWeekday(date) {
	const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
	return keys[date.getDay()]
}

function normalizedDate(date) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, '0'),
		String(date.getDate()).padStart(2, '0'),
	].join('-')
}

function buildWeeks(begin) {
	const weeks = []
	const emptyCol = {
		str: '',
		num: '',
		class: '',
	}

	let week = range(0, begin.getDay() - 1).map(_ => emptyCol)
	const end = nextMonth(begin)
	for (let date = begin; date < end; date = nextDay(date)) {
		week.push({
			str: normalizedDate(date),
			num: date.getDate(),
			class: shortWeekday(date)
		})
		if (week.length >= 7) {
			weeks.push(week)
			week = []
		}
	}
	if (week.length > 0) {
		while (week.length < 7) {
			week.push(emptyCol)
		}
		weeks.push(week)
	}
	return weeks
}

function renderCalendar(begin, holidays) {
	const root = document.createDocumentFragment()

	root.appendChild(
		h('div', { id: 'header' }, [
			h('div', { class: 'month' }, [
				h('span', { class: 'num' }, begin.getMonth() + 1),
				h('span', { class: 'gatu' }, '月')
			]),
			h('div', { class: 'year' }, [
				h('span', { class: 'num' }, begin.getFullYear()),
				h('span', { class: 'nen' }, '年')
			])
		])
	)

	root.appendChild(
		h('div', { class: 'row weekdays' }, [
			h('span', { class: 'sun' }, '日'),
			...['月', '火', '水', '木', '金'].map(wday => (
				h('span', {}, wday)
			)),
			h('span', { class: 'sat' }, '土'),
		])
	)

	buildWeeks(begin).forEach(week => {
		root.appendChild(
			h('div', { class: 'row dates' }, week.map(date => (
				h('span', { class: `date ${date.class} ${holidayClass(date, holidays)}` }, date.num)
			)))
		)
	})
	
	return root
}

function holidayClass(date, holidays) {
	return holidays.some(holiday => holiday === date.str) ? 'holiday' : ''
}
