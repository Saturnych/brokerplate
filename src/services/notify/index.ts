/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import email from './email.service';
import push from './push.service';
import sms from './sms.service';
import telegram from './telegram.service';

export default {
	email,
	push,
	sms,
	telegram,
};
