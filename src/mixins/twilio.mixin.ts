/**
 * Copyright (c) 2022
 *
 * @summary Moleculer Twilio mixin
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin TwilioMixin
 *
 */

import twilio from 'twilio';

const mixin = ({ key = 'twilio', options }) => ({
  settings: {
    [key]: options,
  },
  created() {
    const { accountSid, authToken } = this.settings[key];
    this[key] = twilio(accountSid, authToken);
  },
  started() {
  },
  stopped() {
  },
});

export default mixin;
