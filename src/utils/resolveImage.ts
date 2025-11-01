import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * Resolves a blog post image path to a processed image URL.
 * Handles relative paths (./image.svg), absolute paths (/image.svg), 
 * and direct filenames (image.svg).
 * 
 * @param imagePath - The image path from the blog post frontmatter
 * @param slug - The blog post slug for resolving relative paths
 * @returns The processed image URL or the original path if resolution fails
 */
export async function resolveBlogImage(
  imagePath: string,
  slug: string
): Promise<string> {
  if (!imagePath) {
    return '';
  }

  try {
    let imageAsset: ImageMetadata;
    let imageModule: any;

    // Handle relative paths (./image.svg)
    if (imagePath.startsWith('./')) {
      const path = imagePath.slice(2);
      const pathWithExt = path.includes('.') ? path : `${path}.svg`;
      imageModule = await import(`../content/blog/${slug}/${pathWithExt}`);
      imageAsset = imageModule.default;
    }
    // Handle absolute paths (/image.svg)
    else if (imagePath.startsWith('/')) {
      const path = imagePath.slice(1);
      const pathWithExt = path.includes('.') ? path : `${path}.svg`;
      imageModule = await import(`../content/blog/${pathWithExt}`);
      imageAsset = imageModule.default;
    }
    // Handle direct filenames (image.svg)
    else {
      const pathWithExt = imagePath.includes('.') ? imagePath : `${imagePath}.svg`;
      imageModule = await import(`../content/blog/${slug}/${pathWithExt}`);
      imageAsset = imageModule.default;
    }

    // Process through Astro's asset pipeline
    const processedImage = await getImage({ src: imageAsset });
    
    // getImage returns an object with src property
    // The src should be processed by Astro, but ensure it's absolute
    let src = processedImage.src;
    
    // If it's relative (starts with . or doesn't start with /), make it absolute
    if (src.startsWith('./')) {
      src = src.slice(2);
    }
    if (!src.startsWith('/') && !src.startsWith('http')) {
      src = `/${src}`;
    }
    
    return src;
  } catch {
    // If import fails, assume it's an external URL
    return imagePath;
  }
}


