/**
 * Copyright (c) 2022
 *
 * @summary Moleculer FCM mixin
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin FCMMixin
 *
 */

import admin from 'firebase-admin';

const mixin = ({ key = 'fcm', options }) => ({
	settings: {
		[key]: options,
	},
	created() {
		const { projectId, senderId, topic, serviceAccount } =
			this.settings[key];
		const firebaseConfig = {
			authDomain: `${projectId}.firebaseapp.com`,
			databaseURL: `https://${projectId}.firebaseio.com`,
			projectId: projectId,
			appId: projectId,
			messagingSenderId: senderId,
			credential: null,
			topic, // "/topics/[a-zA-Z0-9-_.~%]+"
		};
		if (Object.keys(serviceAccount).length > 0)
			firebaseConfig.credential = admin.credential.cert(serviceAccount);
		admin.initializeApp(firebaseConfig);
		this[key] = admin.messaging();
	},
	started() {},
	stopped() {},
});

export default mixin;
