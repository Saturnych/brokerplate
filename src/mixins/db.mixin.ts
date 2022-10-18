/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin DbMixin
 *
 */

import { existsSync } from 'fs';
import { sync } from 'mkdirp';
import { Context, Service, ServiceSchema } from 'moleculer';
import DbService from 'moleculer-db';
import MongoAdapter from 'moleculer-db-adapter-mongo';
import SqlAdapter from 'moleculer-db-adapter-sequelize';

import { NODE_ENV, DEBUG, POSTGRES_URI, MONGO_URI } from '../config/vars';

export default class Connection
	implements Partial<ServiceSchema>, ThisType<Service>
{
	private cacheCleanEventName: string;
	private collection: string;
	private schema: Partial<ServiceSchema> & ThisType<Service>;

	public constructor(public collectionName: string) {
		this.collection = collectionName;
		this.cacheCleanEventName = `cache.clean.${this.collection}`;
		this.schema = {
			mixins: [DbService],
			events: {
				/**
				 * Subscribe to the cache clean event. If it's triggered
				 * clean the cache entries for this service.
				 *
				 */
				async [this.cacheCleanEventName]() {
					if (this.broker.cacher) {
						await this.broker.cacher.clean(`${this.fullName}.*`);
					}
				},
			},
			methods: {
				/**
				 * Send a cache clearing event when an entity changed.
				 *
				 * @param {String} type
				 * @param {any} json
				 * @param {Context} ctx
				 */
				entityChanged: async (
					type: string,
					json: any,
					ctx: Context
				) => {
					await ctx.broadcast(this.cacheCleanEventName);
				},
			},
			async started() {
				// Check the count of items in the DB. If it's empty,
				// Call the `seedDB` method of the service.
				if (this.seedDB) {
					const count = await this.adapter.count();
					if (count === 0) {
						this.logger.info(
							`The '${this.collection}' collection is empty. Seeding the collection...`
						);
						await this.seedDB();
						this.logger.info(
							'Seeding is done. Number of records:',
							await this.adapter.count()
						);
					}
				}
			},
		};
	}

	public start() {
		if (POSTGRES_URI) {
			// PG adapter
			this.schema.adapter = new SqlAdapter(POSTGRES_URI);
			this.schema.collection = this.collection;
		} else if (MONGO_URI) {
			// Mongo adapter
			this.schema.adapter = new MongoAdapter(MONGO_URI, {
				useUnifiedTopology: true,
			});
			this.schema.collection = this.collection;
		} else if (!!NODE_ENV && NODE_ENV.indexOf('test') > -1) {
			// NeDB memory adapter for testing
			// @ts-ignore
			this.schema.adapter = new DbService.MemoryAdapter();
		} else {
			// NeDB file DB adapter
			// Create data folder
			if (!existsSync('./data')) {
				sync('./data');
			}
			// @ts-ignore
			this.schema.adapter = new DbService.MemoryAdapter({
				filename: `./data/${this.collection}.db`,
			});
		}

		return this.schema;
	}

	public get _collection(): string {
		return this.collection;
	}

	public set _collection(value: string) {
		this.collection = value;
	}
}
