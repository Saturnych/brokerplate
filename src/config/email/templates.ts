const config = {
	title: 'Brokerplate',
	href: 'https://bro.saturnych.ru',
	contact: 'i@saturnych.ru',
	name: 'Denis Glebko',
};

const imgLogo = "";

const trPinLine = '<tr width="100%"><td class="block-line"></td></tr>';

const styles = `
<style type="text/css">

.table-1 {
  padding: 16px;
  text-align: center;
  width: 100%;
}

.column {
  text-align: center;
}

.logo {
  text-align: center;
}

.responsive-img {
  width: 100%;
  height: auto;
}

.text {
  position: absolute;
  font-family: IBM Plex Sans;
  font-style: normal;
  left: 50%;
  transform: translate(-50%, 0);
  width: 295px;
}

.text h4 {
  text-align: left;
  font-weight: 500;
  font-size: 23px;
  line-height: 30px;
}

.text-info {
  text-align: left;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.0025em;
}

.text a {
  text-decoration: none;
  color: #777777;
}

.block-line {
  background-color: #5c24e3;
  height: 21px;
}

.img-block {
  height: 82px;
  text-align: center;
}

.grey-info {
  text-align: left;
  margin-bottom: 0;
  color: #777777;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  padding-bottom: 8px;
}
.email-cred {
  padding: 0;
  margin: 0;
  text-align: left;
  font-style: normal;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.0025em;
}

.btn-accept {
  text-align: center;
  padding: 14px 16px;
  color: #fff;
  position: static;
  width: 295px;
  height: 46px;
  left: 345px;
  top: 336px;
  background: #5c24e3;
  box-shadow: 0px 4px 8px rgba(133, 91, 200, 0.3);
  border-radius: 4px;
  border: #fff;
}

.fa-code {
  padding: 14px 0 0 14px;
  position: static;
  height: 46px;
  left: 0px;
  top: 0px;
  background: #f8f8f8;
  border-radius: 8px;
  text-align: center;
}

.code-text {
  position: static;
  width: 125px;
  font-weight: 500;
  font-size: 23px;
  line-height: 30px;
  letter-spacing: 10px;
}

@media screen and (max-width: 700px) {
  .responsive-img {
    background-position: center;
    width: 100%;
  }

  .logo {
    width: 70px;
    height: 60px;
  }

  .text {
    padding: 0;
  }
}

</style>
`;

const header = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.title}</title>
    ${styles}
  </head>
  <body>
    <table cellpadding="0" cellspacing="0" width="100%" class="table-1">
      <tr>
        <td class="column">${imgLogo}</td>
      </tr>
`;

const cheers = `<p class="grey-info">Cheers, <br><i><a href="${config.href}" target="_blank">${config.name}</a></i></p>`;

const footer = `
  </table>
  </body>
</html>
`;

const linkButton = (link: string, text: string): string =>
	`<a class="btn-accept" href="${link}" target="_blank">${text}</a>`;

const emailTemplates = {
	resetPassword: ({
		firstName,
		buttonLink = '',
		buttonText = 'Reset password',
	}) => {
		return {
			text: '',
			html: `
        ${header}
        <tr>
          <td style="padding-top: 24px; text-align: center;" align="center"></td>
        </tr>
        <tr>
          <td class="text">
            <h4>Hi, ${firstName}!</h4>
            <p class="text-info">We received a request to reset the password for your ${
				config.title
			} app account. To proceed, click the “Reset Password” button below.</p>
            <p class="text-info">If you did not initiate this request, please contact us at <a href="mailto:${
				config.contact
			}" style="color: #5C24E3">${config.contact}</a>.</p>
            ${cheers}
            ${linkButton(buttonLink, 'Reset password')}
          </td>
        </tr>
        ${footer}
      `,
		};
	},

	enterPin: ({ firstName, pin }) => {
		pin = String(pin).replace(/ /g, '').trim();
		return {
			text: '',
			html: `
        ${header}
        ${trPinLine}
        <tr>
        <td class="text" style="padding-top: 24px;">
          <h4>Hi, ${firstName}!</h4>
          <p class="text-info">Please enter the ${pin.length}-digit PIN into ${config.title} app to restore password.</p>
          <div class="fa-code" style="text-align: center;"><span class="code-text">${pin}</span></div>
          <p class="text-info">If you did not initiate this request, please contact us at <a href="mailto:${config.contact}" style="color: #5C24E3">${config.contact}</a>.</p>
          ${cheers}
        </td>
        </tr>
        ${footer}
      `,
		};
	},

	error: ({ firstName, errorName, error = '' }) => {
		return {
			text: `${errorName}: ${JSON.stringify(error)}`,
			html: `
        ${header}
        <tr>
        <td class="text" style="padding-top: 24px;">
          <h4>Hi, ${firstName}!</h4>
          <p class="text-info">${errorName}:</p>
          <p class="grey-info">${JSON.stringify(error)}</p>
          ${cheers}
        </td>
        </tr>
        ${footer}
      `,
		};
	},
};

export default emailTemplates;
