function getDate() {
	const date = new Date(),
	      day = date.getUTCDate(),
	      month = date.getUTCMonth() + 1,
	      year = date.getUTCFullYear();
	return `v${year}.${month}.${day}`
}
console.log(getDate())
