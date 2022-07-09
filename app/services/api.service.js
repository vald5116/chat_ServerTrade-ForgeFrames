const _ = require("lodash");
const jwt = require("jsonwebtoken");
const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 8800,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*", // TODO:Тут надо обязательно 
            // Configures the Access-Control-Allow-Methods CORS header. 
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: [],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [
			{
				path: "/api",

				whitelist: [
					"**"
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {

				},

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 *
				 **/
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.country = req.headers["cf-ipcountry"] || "" ;
					ctx.meta.ip = req.headers["x-forwarded-for"] || req.headers["cf-connecting-ip"] || "" ;
				},

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "restrict", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true
			}
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		/**
		 * Authorize the request
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.authorization.split(" ")[1];
			}

			let user;
			if (token) {
				// Verify JWT token
				try {
					if (token =="123456789") {
						user = {id:1, username:"User1"}
						user.centrifugotoken = jwt.sign({ sub: (user.id).toString(), info: user, exp: new Date().getTime() + 5 * 60 }, 'MYSNgqQHxbS00gnI8WfJFh8p01R6GuDVfH6hhh3SXiEpEttWqaV7GWn60WGqMquY', { algorithm: 'HS256' });
						this.logger.info("Authenticated via JWT: ", user.username);
						// Reduce user fields (it will be transferred to other nodes)
						ctx.meta.user = user;
						ctx.meta.token = token;
						ctx.meta.userID = user.id;
					} else if (token =="12345678922") {
						user = {id:2, username:"User2"}
						this.logger.info("Authenticated via JWT: ", user.user);
						user.centrifugotoken = jwt.sign({ sub: (user.id).toString(), info: user, exp: new Date().getTime() + 5 * 60 }, 'MYSNgqQHxbS00gnI8WfJFh8p01R6GuDVfH6hhh3SXiEpEttWqaV7GWn60WGqMquY', { algorithm: 'HS256' });
						// Reduce user fields (it will be transferred to other nodes)
						ctx.meta.user = user;
						ctx.meta.token = token;
						ctx.meta.userID = user.id;
					}
				} catch (err) {
					// Ignored because we continue processing if user doesn't exists
				}
			}

			if (req.$action.auth == "required" && !user) throw new UnAuthorizedError();
		}

	}
};