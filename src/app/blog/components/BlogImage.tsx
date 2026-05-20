'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { BlogSectionImage } from '../data';

interface BlogImageProps extends BlogSectionImage {
  className?: string;
}

export default function BlogImage({
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
  className = '',
}: BlogImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure className={`not-prose ${className}`}>
      <div
        className="overflow-hidden rounded-2xl"
        style={{ border: '1px solid rgba(200,205,220,0.10)' }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-auto object-cover"
          onError={() => setFailed(true)}
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="font-body text-xs text-white/38 mt-2 px-1 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
