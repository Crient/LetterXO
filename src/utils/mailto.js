const CRLF = '\r\n';

function encodeMailto({ to, subject, body }) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body.replace(/\n/g, CRLF));
  const query = params.toString();
  const address = to ? encodeURIComponent(to) : '';
  return `mailto:${address}${query ? `?${query}` : ''}`;
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

  return encodeMailto({
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

  return encodeMailto({
    to: senderEmail || '',
    subject: 'Your Valentine answer is ready 💞',
    body: lines.filter((line) => line !== null).join('\n'),
  });
}
