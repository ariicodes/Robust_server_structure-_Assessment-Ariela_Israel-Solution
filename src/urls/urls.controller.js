const urls = require('../data/urls-data');
const uses = require('../data/uses-data');

const bodyHasUrlProperty = (req, res, next) => {
	const { data: { href } = {} } = req.body;
	if (href) {
		return next();
	}
	next({
		status: 400,
		message: "A 'href' property is required",
	});
};

const urlExists = (req, res, next) => {
	const { urlId } = req.params;
	const foundUrl = urls.find(url => url.id === Number(urlId));

	if (foundUrl) {
		res.locals.url = foundUrl;
		return next();
	}
	next({
		status: 404,
		message: `Url id not found: ${urlId}`,
	});
};

let lastUseId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0);

const logTime = (req, res, next) => {
	const { urlId } = req.params;
	const { data: { time } = {} } = req.body;

	const logIndex = uses.findIndex(log => log.urlId === Number(urlId));

	if (logIndex !== -1) {
		uses[logIndex].time = Date.now();
	} else {
		const newLog = {
			id: ++lastUseId,
			urlId: Number(urlId),
			time: Date.now(),
		};
		uses.push(newLog);
	}

	next();
};


////////////////////////////////////////////////

let lastUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

// CREATE route
const create = (req, res) => {
	const { data: { href } = {} } = req.body;
	const newUrl = {
		id: ++lastUrlId,
		href,
	};
	urls.push(newUrl);
	res.status(201).json({ data: newUrl });
};

// READ route
const read = (req, res) => {
	res.json({ data: res.locals.url });
};

// UPDATE route
const update = (req, res) => {
	const url = res.locals.url;
	const { data: { href } = {} } = req.body;

	url.href = href;

	res.json({ data: url });
};

// LIST route
const list = (req, res) => {
	res.json({ data: urls });
};

module.exports = {
	create: [bodyHasUrlProperty, create],
	read: [urlExists, logTime, read],
	list,
	update: [urlExists, update],
  urlExists
};
