/**
 * Copyright (c) 2022
 *
 * @summary Moleculer API
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 */

export const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);