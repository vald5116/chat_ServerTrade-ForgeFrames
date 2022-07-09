const
	fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)),
	QueueService = require("moleculer-bee-queue");

module.exports = {
	name: "alertmanager",
	settings: {
		centrifugoapi: process.env.centrifugoapi || "centrifugoapi",
		auth: {
			user: process.env.mailer_user || "mailer_user",
			pass: process.env.mailer_pass || "mailer_pass"
		},
		DOMEN: process.env.DOMEN || "DOMEN"
	},
	mixins: [QueueService({
		redis: {
			host: 'redis',
			password: process.env.R_DB_PW
		}
	})],
	queues: {
		async "alertmanager.Centrifugo"(job) {
			this.logger.info(`alertmanager.Centrifugo: New job received! ${job.id} ${Date.now()}`);
			job.reportProgress(25);
			let info = { status: false, err: '' };


			const controller = new AbortController();
			const timeout = setTimeout(() => { controller.abort(); }, 25000);

			try {

				info = await new Promise((resolve) => {
					fetch(`https://chat_servertrade-forgeframesws.vald5116.dev/api`, {
						signal: controller.signal,
						method: 'post',
						body: JSON.stringify(job.data),
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `apikey ${this.settings.centrifugoapi}`
						}
					})
						.then(() => resolve({ status: true }))
						.catch(error => resolve({ status: false, err: error.message }));
				})
			} catch (error) {
				if (error instanceof AbortError) {
					console.log('request was aborted');
					info = { status: false, err: 'request was aborted' };
				}
			} finally {
				clearTimeout(timeout);
			}



			this.logger.info(`alertmanager.Centrifugo: End job received! ${job.id} ${Date.now()}`);
			console.log(info)
			if (info.status) {
				return this.Promise.resolve({
					done: true,
					id: job.data.id,
					worker: process.pid
				});
			} else {
				return this.Promise.resolve({
					done: false,
					id: job.data.id,
					err: info.err,
					worker: process.pid
				});
			}
		}
	},
	methods: {
	}

};
