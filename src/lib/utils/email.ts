export const maskEmail = (emailAddress: string): string => {
  const [localPart, domain] = emailAddress.split('@');
  if (!localPart || !domain) return emailAddress;
  const maskedLocal = localPart.slice(0, 3) + '*****';
  return `${maskedLocal}@${domain}`;
};
