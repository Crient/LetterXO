const CRLF = '\r\n';

function encodeMailto({ to, subject, body }) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body.replace(/\n/g, CRLF));
  const query = params.toString();
  const address = to ? encodeURIComponent(to) : '';
  return `mailto:${address}${query ? `?${query}` : ''}`;
}

function encodeGmail({ to, subject, body }) {
  const params = new URLSearchParams();
  params.set('view', 'cm');
  params.set('fs', '1');
  if (to) params.set('to', to);
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildHostToReceiverMailto({
  senderName,
  receiverName,
  receiverEmail,
  receiverLink,
  letterMessage,
}) {
  const lines = [
    `Hi ${receiverName || 'there'},`,
    '',
    'I made something for you.',
    'Open this link when you have a quiet moment:',
    receiverLink || '',
  ];

  if (letterMessage) {
    lines.push('', `Note: ${letterMessage}`);
  }

  lines.push('', 'Love,', senderName || '');

  const body = lines.filter((line) => line !== null).join('\n');
  const subject = "Open this when you’re ready 💗";

  return encodeMailto({
    to: receiverEmail || '',
    subject,
    body,
  });
}

export function buildHostToReceiverGmail({
  senderName,
  receiverName,
  receiverEmail,
  receiverLink,
  letterMessage,
}) {
  const lines = [
    `Hi ${receiverName || 'there'},`,
    '',
    'I made something for you.',
    'Open this link when you have a quiet moment:',
    receiverLink || '',
  ];

  if (letterMessage) {
    lines.push('', `Note: ${letterMessage}`);
  }

  lines.push('', 'Love,', senderName || '');

  return encodeGmail({
    to: receiverEmail || '',
    subject: "Open this when you’re ready 💗",
    body: lines.filter((line) => line !== null).join('\n'),
  });
}

export function buildReceiverToHostMailto({
  senderName,
  senderEmail,
  receiverName,
  resultsLink,
}) {
  const lines = [
    `Hi ${senderName || 'there'},`,
    '',
    'I finished it.',
    "Here's the link to see my answer:",
    resultsLink || '',
    '',
    'Love,',
    receiverName || '',
  ];

  const body = lines.filter((line) => line !== null).join('\n');
  const subject = 'Your Valentine answer is ready 💞';

  return encodeMailto({
    to: senderEmail || '',
    subject,
    body,
  });
}

export function buildReceiverToHostGmail({
  senderName,
  senderEmail,
  receiverName,
  resultsLink,
}) {
  const lines = [
    `Hi ${senderName || 'there'},`,
    '',
    'I finished it.',
    "Here's the link to see my answer:",
    resultsLink || '',
    '',
    'Love,',
    receiverName || '',
  ];

  return encodeGmail({
    to: senderEmail || '',
    subject: 'Your Valentine answer is ready 💞',
    body: lines.filter((line) => line !== null).join('\n'),
  });
}
