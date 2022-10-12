/**
 * Copyright (c) 2022
 *
 * @summary Brokerplate Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

export default [compression(), cookieParser(), helmet()];
