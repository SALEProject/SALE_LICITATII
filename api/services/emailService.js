'use strict';

var nodemailer = require('nodemailer'),
  options = {
    host: '',
    port: '',
    secure: true,
    auth: {
      user: '',
      pass: ''
    },
    authMethod: 'PLAIN'
  },
  transporter = nodemailer.createTransport(options);

/**
 * Send an email message.
 *
 * @param from The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted '"Sender Name" <sender@server.com>'
 * @param to Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
 * @param cc Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field. Use null if none.
 * @param subject The subject of the e-mail.
 * @param body The HTML version of the message as an Unicode string, Buffer, Stream or an attachment-like object.
 * @param attachments Array of attachment objects or null if none. See for https://www.npmjs.com/package/nodemailer#attachments for details about object structure.
 * @param callback Callback called when message sending finishes. Optional.
 */
exports.sendEmail = function (from, to, cc, subject, body, attachments, callback) {
  var message = {
    from: from,
    to: to,
    subject: subject,
    html: body
  };

  if (cc !== null) {
    message.cc = cc;
  }

  if (attachments !== null && attachments.length > 0) {
    message.attachments = attachments;
  }

  transporter.sendMail(message, function (err, info) {
    if (callback) {
      if (err) {
        return callback(err);
      }

      return callback(null, info);
    }
  });
};
