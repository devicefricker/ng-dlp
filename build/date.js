class Date2 {
	constructor() { }
	getDate() {
	      const date = new Date(),
              day = date.getUTCDate(),
              month = date.getUTCMonth() + 1,
              year = date.getUTCFullYear();
              return `v${year}.${month}.${day}`
	}
}
function getDate() {
	const date = new Date(),
	      day = date.getUTCDate(),
	      month = date.getUTCMonth() + 1,
	      year = date.getUTCFullYear();
	return `v${year}.${month}.${day}`
}
console.log(getDate())
export { Date2 }
