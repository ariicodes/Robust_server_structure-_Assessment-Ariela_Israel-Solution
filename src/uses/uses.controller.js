const uses = require('../data/uses-data');

const useExists = (req, res, next) => {
	const { useId } = req.params;
	const foundUse = uses.find(use => use.id === Number(useId));

	if (foundUse) {
		res.locals.use = foundUse;
		return next();
	}
	next({
		status: 404,
		message: `Use id not found: ${useId}`,
	});
};

////////////////////////////////////////////////////

// READ route
const read = (req, res) => {
	res.json({ data: res.locals.use });
};

// DESTROY route
const destroy = (req, res) => {
	const { useId } = req.params;
	const index = uses.findIndex(use => use.id === Number(useId));
	// `splice()` returns an array of the deleted elements, even if it is one element
	const deletedUses = uses.splice(index, 1);
	res.sendStatus(204);
};

// LIST route
const list = (req, res) => {
	const { urlId } = req.params;
	res.json({ data: uses.filter(urlId ? use => use.urlId == urlId : () => true) });
};

module.exports = {
	read: [useExists, read],
	delete: [useExists, destroy],
	list,
};
