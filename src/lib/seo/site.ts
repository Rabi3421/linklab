const normalizeSiteUrl = (value: string) => {
  const trimmedValue = value.trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
};

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.APP_URL ??
  'https://www.linklab.in'
);

export const siteName = 'LinkLab';

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
};

export const defaultOgImage = absoluteUrl('/opengraph-image');
