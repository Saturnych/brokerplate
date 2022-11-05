/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import { Duplex } from 'stream';
import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';
import SocketIOService from 'moleculer-io';
import SocketIOAdapter from 'socket.io-nats'; // socket.io-redis
import ApiGateway from 'moleculer-web';
const { Errors } = ApiGateway;

import { DEBUG, VERSION, SOCKET_IO_PORT, TRANSPORTER, CACHER_REDIS } from '../config/vars';

export default class IoService extends Service {
	public constructor(
		public broker: ServiceBroker,
		public name: string = 'io'
	) {
		super(broker);
		const options = { adapter: null };
		//if (!!CACHER_REDIS) options.adapter = SocketIOAdapter(CACHER_REDIS);
		if (!!TRANSPORTER) options.adapter = SocketIOAdapter(TRANSPORTER);
		const schema: ServiceSchema = {
			name,
			version: VERSION,
			meta: { scalable: true },
			mixins: [SocketIOService],
			settings: {
				port: SOCKET_IO_PORT,
				io: {
					options,
					namespaces: {
		        '/': {
							authorization: false,
							middlewares: [ //Namespace level middlewares, equipment to namespace.use()
		            (socket, next) => {
		              //if (socket.request.headers.cookie) return next();
		              //next(new Error('Authentication error'));
									this.logger.info('io namespace middleware'); //point to service instance.
									next();
		            },
		          ],
		          packetMiddlewares: [ // equipment to socket.use()
		            (packet, next) => {
		              //if (packet.doge === true) return next();
		              //next(new Error('Not a doge error'));
									this.logger.info('io namespace packet middleware'); //point to service instance.
									next();
		            },
		          ],
							events: {
		            call: {
		              whitelist: [
		                `${VERSION}.io.*`, `${VERSION}.greeter.*`, `${VERSION}.file.*`
		              ],
									callOptions: {
		                timeout: 500,
		                retryCount: 0,
		                fallbackResponse(ctx, err) {
											ctx.service.logger.info('io fallbackResponse err:', err);
		                },
		              },
		              onBeforeCall: async (ctx, socket, action, params, callOptions) => { //before hook
		                ctx.service.logger.info('io before hook:', { action, params, callOptions });
		              },
		              onAfterCall: async (ctx, socket, res) => { //after hook
		                ctx.service.logger.info('io after hook:', res);
		                // res: The respose data.
		              },
		            },
		            admin: {
		              whitelist: [
		                //'users.*',
		                '$node.*'
		              ]
		            },
								welcome: async (data, ack) => { // write your handler function here.
									this.logger.info('io welcome:', data, ack, this);
		              await this.broker.call(`${VERSION}.greeter.welcome`, { name: 'Io' });
									await this.socket.emit('hello', 'world');
		            },
								upload: async ({ name, type }, file, respond) => {
									const stream = new Duplex();
									stream.push(file);
									stream.push(null);
									await this.broker.call(`${VERSION}.file.save`, stream, {
										meta: {
											filename: name
										}
									});
									respond(null, name);
								},
		          }
		        }
		      }
		    },
			},
		  methods: {
		    async socketAuthorize(socket, eventHandler): Promise<any> {
					console.log('Login using socket:', socket.handshake.query, socket.client.user);
					const token = socket.handshake.query.token;
		      if (token) {
						return this.broker.call(`${VERSION}.auth.access`, { token });
		      } else {
		        // anonymous user
						// throw new Errors.UnAuthorizedError(Errors.ERR_INVALID_TOKEN, { error: 'Invalid Token' });
		        return null;
		      }
		    },
		    // In addition, you can also customize the place where user is stored.
		    // Here is the default method the save user:
		    socketSaveMeta(socket, ctx) {
					console.log('io socketSaveMeta ctx.meta:', ctx.meta);
					socket.client.user = ctx.meta.user;
		    },
				socketGetMeta(socket) { //construct the meta object.
		      return {
		        user: socket.client.user,
		        $rooms: Object.keys(socket.rooms),
		        socketId: socket.id,
		      };
		    },
		  },
		};
		this.parseServiceSchema(schema);
	}
}
