/**
 * Copyright (c) 2022
 *
 * @summary Moleculer Nodemailer mixin
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @mixin NodemailerMixin
 *
 */

import nodemailer from 'nodemailer';

const mixin = ({ key = 'nodemailer', options }) => ({
  settings: {
    [key]: options,
  },
  created() {
    const { host, port, secure, auth } = this.settings[key];
    this[key] = nodemailer.createTransport({ host, port, secure, auth });
  },
  started() {
  },
  stopped() {
  },
});

export default mixin;
