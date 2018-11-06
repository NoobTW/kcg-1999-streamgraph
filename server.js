const Koa = require('koa');
const koaViews = require('koa-views');
const koaBody = require('koa-body');
const koaServe = require('koa-static');
const koaMount = require('koa-mount');
const router = require('koa-router')({prefix: ''});
const axios = require('axios');
const moment = require('moment');

const app = new Koa();

app.use(koaBody({multipart: true}));
app.use(koaMount('/public', koaServe(`${__dirname}/public`)));
app.use(koaViews(`${__dirname}/views`, {
	extension: 'pug'
}));

router

.get('/api', async ctx => {
	const startDate = ctx.query.startDate;
	const endDate = ctx.query.endDate;

	let results = [];

	for(let day = moment(startDate); day <= moment(endDate); day = day.add(1, 'day')){
		console.log(moment(day).format('YYYY-MM-DD'))
		const data = await axios.get('https://solhistory.kcg.gov.tw/his-open1999/api/case/?date=' + day.format('YYYY-MM-DD'))
		results = [...results, ...data.data];
	}

	ctx.body = {
		results,
		startDate,
		endDate,
	}
})

.get('/', async ctx => {
	await ctx.render('index');
});

app.use(router.routes());

app.listen(3000, async () => {
	console.log('Server started on port 3000.');
});

