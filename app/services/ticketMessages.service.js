
const
	QueueService = require("moleculer-bee-queue"),
	{MoleculerClientError} = require("moleculer").Errors;
let id = 0
let chat = [];


module.exports = {
	name: "ticketMessages",
	mixins: [
		QueueService({
			redis: {
				host: 'redis',
				password:process.env.R_DB_PW
			}
		})
	],
	settings: {
		rest: "/"
	},

	/**
	 * Actions
	 */
	actions: {


		newMessages: {
			auth: "required",
			rest: "POST /new/messages",
			params: {
				messages: {type: "string", optional: true }
			},
			async handler(ctx) {
				id++;
				const
					params = ctx.params,
					entity = {
						id,
						messages: params.messages,
						userId: ctx.meta.user.id,
						date: Date.now()
				};
				chat.push(entity)
				this.sendCentrifugo({"method":"publish","params":{ "channel": `chat`,"data": {"status":"new", "date":entity}}})
				return {status:true};
			}
		},

		Messages: {
			auth: "required",
			rest: "GET /messages",
			async handler(ctx) {
				return chat;
			}
		},
		user: {
			auth: "required",
			rest: "GET /user",
			async handler(ctx) {
				console.log(ctx.meta.user)
				return {user:ctx.meta.user};
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {
		sendCentrifugo(data) {
			console.log(`sendCentrifugo`)
			console.log(data)
			const sendMail = this.createJob("alertmanager.Centrifugo", data);

			sendMail.on("progress", progress => {
				this.logger.info(`alertmanager.Centrifugo #${sendMail.id} progress is ${progress}%`);
			});

			sendMail.on("succeeded", res => {
				this.logger.info(`alertmanager.Centrifugo #${sendMail.id} completed!. Result:`, res);
			});
			sendMail.save();
		}
	}
};