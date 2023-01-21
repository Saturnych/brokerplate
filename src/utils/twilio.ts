/**
 * Copyright (c) 2022
 *
 * @summary Moleculer Twilio utils
 * @author Denis Glebko <saturnych@gmail.com>
 * @copyright Denis Glebko 2022
 *
 * @module utils/twilio
 *
 */

import { DEBUG, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../config/vars';
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// 2FA Twilio service names
export const SMS_SERVICE = 'SMS';

export const SendSMS = async (phoneNumber) => {
  const { sid } = await client.verify.services.create({ friendlyName: SMS_SERVICE });

  await client.verify.services(sid)
    .verifications
    .create({
      to: phoneNumber,
      channel: 'sms'
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return sid;
};

export const VerifySMSCode = async (phoneNumber, sid, code) => {
  const SUCCESS_STATUS = 'approved';

  const verificationCheck = await client.verify.services(sid)
    .verificationChecks
    .create({
      code,
      to: phoneNumber
    }).catch((err) => {
      console.log(err);
      return null;
    });

  return verificationCheck && verificationCheck.status === SUCCESS_STATUS;
};
