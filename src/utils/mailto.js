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

function composeHostToReceiver({ senderName, receiverName, receiverLink }) {
  const bodyLines = [
    `Hi ${receiverName || 'there'},`,
    '',
    'I made something for you.',
    'Open this link whenever you can:',
    receiverLink || '',
    '',
    'Love,',
    senderName || '',
  ];

  const displayLines = [
    { type: 'text', text: `Hi ${receiverName || 'there'},` },
    { type: 'spacer' },
    { type: 'text', text: 'I made something for you.' },
    {
      type: 'link',
      prefix: 'Open this link whenever you can: ',
      text: 'click here',
      href: receiverLink || '',
    },
    { type: 'spacer' },
    { type: 'text', text: 'Love,' },
    { type: 'text', text: senderName || '' },
  ];

  return {
    subject: "Open this when you’re ready 💗",
    body: bodyLines.filter((line) => line !== null).join('\n'),
    lines: bodyLines,
    displayLines,
    topName: receiverName || '',
    bottomName: senderName || '',
  };
}

function composeReceiverToHost({ senderName, receiverName, resultsLink }) {
  const bodyLines = [
    `Hi ${senderName || 'there'},`,
    '',
    'I got your message!',
    "Here's the link to see my answer:",
    resultsLink || '',
    '',
    'Yours,',
    receiverName || '',
  ];

  const displayLines = [
    { type: 'text', text: `Hi ${senderName || 'there'},` },
    { type: 'spacer' },
    { type: 'text', text: 'I got your message!' },
    {
      type: 'link',
      prefix: "Here's the link to see my answer: ",
      text: 'click here',
      href: resultsLink || '',
    },
    { type: 'spacer' },
    { type: 'text', text: 'Yours,' },
    { type: 'text', text: receiverName || '' },
  ];

  return {
    subject: 'Your Valentine answer is ready 💞',
    body: bodyLines.filter((line) => line !== null).join('\n'),
    lines: bodyLines,
    displayLines,
    topName: senderName || '',
    bottomName: receiverName || '',
  };
}

export function buildHostToReceiverMailto({
  senderName,
  receiverName,
  receiverEmail,
  receiverLink,
}) {
  const { subject, body } = composeHostToReceiver({
    senderName,
    receiverName,
    receiverLink,
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
}) {
  return composeHostToReceiver({
    senderName,
    receiverName,
    receiverLink,
  });
}

export function buildHostToReceiverGmail({
  senderName,
  receiverName,
  receiverEmail,
  receiverLink,
}) {
  const { subject, body } = composeHostToReceiver({
    senderName,
    receiverName,
    receiverLink,
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
