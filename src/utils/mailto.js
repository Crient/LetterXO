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

function composeHostToReceiver({
  senderName,
  receiverName,
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

  return {
    subject: "Open this when you’re ready 💗",
    body: lines.filter((line) => line !== null).join('\n'),
    lines,
    topName: receiverName || '',
    bottomName: senderName || '',
  };
}

function composeReceiverToHost({ senderName, receiverName, resultsLink }) {
  const lines = [
    `Hi ${senderName || 'there'},`,
    '',
    'I got your message!',
    "Here's the link to see my answer:",
    resultsLink || '',
    '',
    'Yours,',
    receiverName || '',
  ];

  return {
    subject: 'Your Valentine answer is ready 💞',
    body: lines.filter((line) => line !== null).join('\n'),
    lines,
    topName: senderName || '',
    bottomName: receiverName || '',
  };
}

export function buildHostToReceiverMailto({
  senderName,
  receiverName,
  receiverEmail,
  receiverLink,
  letterMessage,
}) {
  const { subject, body } = composeHostToReceiver({
    senderName,
    receiverName,
    receiverLink,
    letterMessage,
  });

  return encodeMailto({
    to: receiverEmail || '',
    subject,
    body,
  });
}

export function buildHostToReceiverDraft({
  senderName,
  receiverName,
  receiverLink,
  letterMessage,
}) {
  return composeHostToReceiver({
    senderName,
    receiverName,
    receiverLink,
    letterMessage,
  });
}

export function buildHostToReceiverGmail({
  senderName,
  receiverName,
  receiverEmail,
  receiverLink,
  letterMessage,
}) {
  const { subject, body } = composeHostToReceiver({
    senderName,
    receiverName,
    receiverLink,
    letterMessage,
  });

  return encodeGmail({
    to: receiverEmail || '',
    subject,
    body,
  });
}

export function buildReceiverToHostMailto({
  senderName,
  senderEmail,
  receiverName,
  resultsLink,
}) {
  const { subject, body } = composeReceiverToHost({
    senderName,
    receiverName,
    resultsLink,
  });

  return encodeMailto({
    to: senderEmail || '',
    subject,
    body,
  });
}

export function buildReceiverToHostDraft({
  senderName,
  receiverName,
  resultsLink,
}) {
  return composeReceiverToHost({
    senderName,
    receiverName,
    resultsLink,
  });
}

export function buildReceiverToHostGmail({
  senderName,
  senderEmail,
  receiverName,
  resultsLink,
}) {
  const { subject, body } = composeReceiverToHost({
    senderName,
    receiverName,
    resultsLink,
  });

  return encodeGmail({
    to: senderEmail || '',
    subject,
    body,
  });
}
