#!/usr/bin/env python3
"""
WordPress Blog Post Automation Script
Converts markdown to HTML, uploads images, and posts to WordPress with metadata.

Usage:
    python3 post-to-wordpress.py --config post-config.yaml
    python3 post-to-wordpress.py --markdown article.md --images ./images/ --eyebrow "TEXT"
"""

import os
import sys
import argparse
import json
import yaml
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import requests
from requests.auth import HTTPBasicAuth
import mimetypes

# WordPress configuration
WP_URL = "https://alvishouse.io"
WP_USER = "alvishousepoompow@gmail.com"
WP_APP_PASSWORD = "ez4D2i98iKJJ7JDo2K2PNZmE"

# Image cache file
IMAGE_CACHE_FILE = Path(__file__).parent / ".image-cache.json"

class WordPressImageUploader:
    """Handles image uploads to WordPress Media Library."""

    def __init__(self, wp_url: str, wp_user: str, wp_password: str, cache_file: Path):
        self.wp_url = wp_url
        self.auth = HTTPBasicAuth(wp_user, wp_password)
        self.cache_file = cache_file
        self.cache = self._load_cache()

    def _load_cache(self) -> Dict:
        """Load image upload cache."""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r') as f:
                    return json.load(f)
            except:
                return {}
        return {}

    def _save_cache(self):
        """Save image upload cache."""
        with open(self.cache_file, 'w') as f:
            json.dump(self.cache, f, indent=2)

    def _get_file_hash(self, file_path: Path) -> str:
        """Get file hash for caching."""
        import hashlib
        hasher = hashlib.md5()
        with open(file_path, 'rb') as f:
            hasher.update(f.read())
        return hasher.hexdigest()

    def upload_image(self, image_path: Path, alt_text: str = "") -> Optional[Dict]:
        """
        Upload image to WordPress Media Library.
        Returns dict with 'url' and 'id' or None if failed.
        """
        if not image_path.exists():
            print(f"   ❌ Image not found: {image_path}")
            return None

        # Check cache
        file_hash = self._get_file_hash(image_path)
        cache_key = f"{image_path.name}_{file_hash}"

        if cache_key in self.cache:
            print(f"   ✓ Using cached: {image_path.name}")
            return self.cache[cache_key]

        # Prepare file upload
        mime_type, _ = mimetypes.guess_type(str(image_path))
        if not mime_type:
            mime_type = 'application/octet-stream'

        headers = {
            'Content-Disposition': f'attachment; filename="{image_path.name}"',
            'Content-Type': mime_type
        }

        try:
            with open(image_path, 'rb') as img:
                response = requests.post(
                    f"{self.wp_url}/wp-json/wp/v2/media",
                    headers=headers,
                    data=img,
                    auth=self.auth
                )

            if response.status_code == 201:
                data = response.json()
                result = {
                    'url': data['source_url'],
                    'id': data['id']
                }

                # Update alt text if provided
                if alt_text:
                    self._update_alt_text(data['id'], alt_text)

                # Cache the result
                self.cache[cache_key] = result
                self._save_cache()

                print(f"   ✓ Uploaded: {image_path.name} → {result['url']}")
                return result
            else:
                print(f"   ❌ Upload failed: {image_path.name} (Status: {response.status_code})")
                return None

        except Exception as e:
            print(f"   ❌ Upload error: {image_path.name} - {str(e)}")
            return None

    def _update_alt_text(self, media_id: int, alt_text: str):
        """Update alt text for uploaded image."""
        try:
            requests.post(
                f"{self.wp_url}/wp-json/wp/v2/media/{media_id}",
                json={'alt_text': alt_text},
                auth=self.auth
            )
        except:
            pass

class MarkdownProcessor:
    """Processes markdown files with callout boxes and image references."""

    CALLOUT_PATTERN = re.compile(
        r':::(\w+)\s+([^\n]+)\n(.*?)\n:::',
        re.DOTALL
    )

    @staticmethod
    def process_callouts(markdown_content: str) -> str:
        """
        Convert markdown callout syntax to HTML.

        Syntax:
            :::mechanism LABEL TEXT
            Content here...
            :::
        """
        def replace_callout(match):
            callout_type = match.group(1)  # mechanism, warning, insight
            label = match.group(2).strip()
            content = match.group(3).strip()

            # Convert markdown paragraphs to HTML
            paragraphs = [f'<p>{p.strip()}</p>' for p in content.split('\n\n') if p.strip()]
            content_html = '\n    '.join(paragraphs)

            return f'''<div class="callout {callout_type}">
    <div class="label">{label}</div>
    {content_html}
</div>'''

        return MarkdownProcessor.CALLOUT_PATTERN.sub(replace_callout, markdown_content)

    @staticmethod
    def extract_metadata(markdown_content: str) -> Tuple[str, Dict]:
        """
        Extract YAML frontmatter from markdown.
        Returns (content_without_frontmatter, metadata_dict)
        """
        if not markdown_content.startswith('---'):
            return markdown_content, {}

        parts = markdown_content.split('---', 2)
        if len(parts) < 3:
            return markdown_content, {}

        try:
            metadata = yaml.safe_load(parts[1])
            content = parts[2].strip()
            return content, metadata
        except:
            return markdown_content, {}

class BrandHTMLConverter:
    """Wrapper for BrandHTMLConverter CLI tool."""

    @staticmethod
    def convert(markdown_file: Path, template: str = "wordpress") -> Optional[str]:
        """Convert markdown to HTML using BrandHTMLConverter."""
        try:
            # Check if BrandHTMLConverter is available
            result = subprocess.run(
                ['brand-html-converter', '--version'],
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                print("❌ BrandHTMLConverter not found. Using basic markdown conversion.")
                return BrandHTMLConverter._basic_convert(markdown_file)

            # Run converter
            output_file = markdown_file.with_suffix('.html')
            result = subprocess.run(
                [
                    'brand-html-converter', 'convert',
                    '--input', str(markdown_file),
                    '--output', str(output_file),
                    '--template', template
                ],
                capture_output=True,
                text=True
            )

            if result.returncode == 0 and output_file.exists():
                with open(output_file, 'r') as f:
                    return f.read()
            else:
                print(f"⚠️  BrandHTMLConverter failed: {result.stderr}")
                return BrandHTMLConverter._basic_convert(markdown_file)

        except Exception as e:
            print(f"⚠️  BrandHTMLConverter error: {e}")
            return BrandHTMLConverter._basic_convert(markdown_file)

    @staticmethod
    def _basic_convert(markdown_file: Path) -> str:
        """Basic markdown to HTML conversion fallback."""
        try:
            import markdown
            with open(markdown_file, 'r') as f:
                content = f.read()
            return markdown.markdown(content)
        except ImportError:
            # Last resort: just wrap in paragraphs
            with open(markdown_file, 'r') as f:
                lines = f.readlines()
            paragraphs = []
            current = []
            for line in lines:
                if line.strip():
                    current.append(line.strip())
                elif current:
                    paragraphs.append(f"<p>{''.join(current)}</p>")
                    current = []
            if current:
                paragraphs.append(f"<p>{''.join(current)}</p>")
            return '\n'.join(paragraphs)

class WordPressPoster:
    """Posts content to WordPress with metadata."""

    def __init__(self, wp_url: str, wp_user: str, wp_password: str):
        self.wp_url = wp_url
        self.auth = HTTPBasicAuth(wp_user, wp_password)

    def get_category_id(self, category_name: str) -> Optional[int]:
        """Get category ID by name."""
        try:
            response = requests.get(
                f"{self.wp_url}/wp-json/wp/v2/categories",
                params={'search': category_name},
                auth=self.auth
            )

            if response.status_code == 200:
                categories = response.json()
                if categories:
                    return categories[0]['id']
        except:
            pass

        return None

    def create_post(self, title: str, content: str, metadata: Dict,
                   featured_media_id: Optional[int] = None,
                   category: str = "Strategy",
                   status: str = "draft") -> Optional[Dict]:
        """Create WordPress post with metadata."""

        # Get category ID
        category_id = self.get_category_id(category) or 18  # Default to Strategy (18)

        # Prepare post data
        post_data = {
            'title': title,
            'content': content,
            'status': status,
            'categories': [category_id],
            'meta': {
                'eyebrow_text': metadata.get('eyebrow', ''),
                'subtitle': metadata.get('subtitle', ''),
                'author_title': metadata.get('author_title', 'AI Readiness Consultant'),
                'read_time': str(metadata.get('read_time', '5'))
            }
        }

        # Add excerpt if provided
        if 'excerpt' in metadata:
            post_data['excerpt'] = metadata['excerpt']

        # Add featured image
        if featured_media_id:
            post_data['featured_media'] = featured_media_id

        try:
            response = requests.post(
                f"{self.wp_url}/wp-json/wp/v2/posts",
                json=post_data,
                auth=self.auth
            )

            if response.status_code == 201:
                return response.json()
            else:
                print(f"❌ Post creation failed: {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return None

        except Exception as e:
            print(f"❌ Post creation error: {e}")
            return None

class ImageReplacer:
    """Replaces local image references with WordPress URLs."""

    IMAGE_PATTERN = re.compile(r'<img\s+([^>]*?)\s*/?>')
    SRC_PATTERN = re.compile(r'src="([^"]+)"')
    ALT_PATTERN = re.compile(r'alt="([^"]*)"')

    @staticmethod
    def find_images(html_content: str) -> List[Tuple[str, str]]:
        """
        Find all image references in HTML.
        Returns list of (full_img_tag, src_path) tuples.
        """
        images = []
        for match in ImageReplacer.IMAGE_PATTERN.finditer(html_content):
            img_tag = match.group(0)
            src_match = ImageReplacer.SRC_PATTERN.search(img_tag)
            if src_match:
                src = src_match.group(1)
                # Only process local file references
                if not src.startswith('http'):
                    images.append((img_tag, src))
        return images

    @staticmethod
    def replace_image_src(html_content: str, old_src: str, new_url: str) -> str:
        """Replace image src in HTML."""
        return html_content.replace(f'src="{old_src}"', f'src="{new_url}"')

    @staticmethod
    def get_alt_text(img_tag: str) -> str:
        """Extract alt text from img tag."""
        match = ImageReplacer.ALT_PATTERN.search(img_tag)
        return match.group(1) if match else ""

def main():
    parser = argparse.ArgumentParser(
        description='Post markdown content to WordPress with image upload'
    )

    # Config file option
    parser.add_argument('--config', type=str, help='YAML config file')

    # Manual options
    parser.add_argument('--markdown', type=str, help='Markdown file path')
    parser.add_argument('--images', type=str, help='Image folder path')
    parser.add_argument('--eyebrow', type=str, help='Eyebrow text')
    parser.add_argument('--subtitle', type=str, help='Subtitle text')
    parser.add_argument('--author-title', type=str, default='AI Readiness Consultant')
    parser.add_argument('--read-time', type=str, default='5')
    parser.add_argument('--category', type=str, default='Strategy')
    parser.add_argument('--status', type=str, default='draft', choices=['draft', 'publish'])
    parser.add_argument('--featured-image', type=str, help='Featured image filename')

    args = parser.parse_args()

    # Load config
    if args.config:
        config_path = Path(args.config)
        if not config_path.exists():
            print(f"❌ Config file not found: {args.config}")
            sys.exit(1)

        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)

        markdown_file = Path(config['markdown'])
        image_folder = Path(config.get('images', ''))
        metadata = config.get('metadata', {})
        category = config.get('category', 'Strategy')
        status = config.get('status', 'draft')
        featured_image = config.get('featured_image')
    else:
        if not args.markdown:
            print("❌ Either --config or --markdown is required")
            sys.exit(1)

        markdown_file = Path(args.markdown)
        image_folder = Path(args.images) if args.images else None
        metadata = {
            'eyebrow': args.eyebrow or '',
            'subtitle': args.subtitle or '',
            'author_title': args.author_title,
            'read_time': args.read_time
        }
        category = args.category
        status = args.status
        featured_image = args.featured_image

    if not markdown_file.exists():
        print(f"❌ Markdown file not found: {markdown_file}")
        sys.exit(1)

    print(f"🔄 Processing markdown: {markdown_file.name}")

    # Read and process markdown
    with open(markdown_file, 'r') as f:
        markdown_content = f.read()

    # Extract frontmatter metadata
    markdown_content, frontmatter = MarkdownProcessor.extract_metadata(markdown_content)
    metadata.update(frontmatter.get('metadata', {}))

    # Extract title
    title = frontmatter.get('title', markdown_file.stem.replace('-', ' ').title())

    # Process callouts
    print("🔄 Processing callout boxes...")
    markdown_content = MarkdownProcessor.process_callouts(markdown_content)

    # Convert to HTML
    print("🔄 Converting to HTML...")
    # Save processed markdown temporarily
    temp_md = markdown_file.with_suffix('.processed.md')
    with open(temp_md, 'w') as f:
        f.write(markdown_content)

    html_content = BrandHTMLConverter.convert(temp_md)

    if not html_content:
        print("❌ HTML conversion failed")
        sys.exit(1)

    print("✅ HTML conversion complete")

    # Upload images
    uploader = WordPressImageUploader(WP_URL, WP_USER, WP_APP_PASSWORD, IMAGE_CACHE_FILE)
    featured_media_id = None

    if image_folder and image_folder.exists():
        print(f"\n📸 Processing images from: {image_folder}")

        # Find image references in HTML
        images_to_upload = ImageReplacer.find_images(html_content)

        if images_to_upload:
            print(f"   Found {len(images_to_upload)} image references")

            for img_tag, src in images_to_upload:
                # Find image file
                image_path = image_folder / src

                if not image_path.exists():
                    # Try in subdirectories
                    matches = list(image_folder.rglob(src))
                    if matches:
                        image_path = matches[0]
                    else:
                        print(f"   ⚠️  Image not found: {src}")
                        continue

                # Get alt text
                alt_text = ImageReplacer.get_alt_text(img_tag)

                # Upload
                result = uploader.upload_image(image_path, alt_text)

                if result:
                    # Replace in HTML
                    html_content = ImageReplacer.replace_image_src(
                        html_content, src, result['url']
                    )

                    # Set as featured image if specified or first image
                    if not featured_media_id:
                        if (featured_image and image_path.name == featured_image) or \
                           (not featured_image and src == images_to_upload[0][1]):
                            featured_media_id = result['id']
                            print(f"   ⭐ Set as featured image: {image_path.name}")
        else:
            print("   No image references found in HTML")

    # Post to WordPress
    print(f"\n📝 Creating WordPress post...")
    print(f"   Title: {title}")
    print(f"   Eyebrow: {metadata.get('eyebrow', '(none)')}")
    print(f"   Subtitle: {metadata.get('subtitle', '(none)')[:50]}...")
    print(f"   Category: {category}")
    print(f"   Status: {status}")

    poster = WordPressPoster(WP_URL, WP_USER, WP_APP_PASSWORD)
    post_result = poster.create_post(
        title=title,
        content=html_content,
        metadata=metadata,
        featured_media_id=featured_media_id,
        category=category,
        status=status
    )

    if post_result:
        print(f"\n✅ Post created successfully!")
        print(f"   Post ID: {post_result['id']}")
        print(f"   Preview: {post_result['link']}")
        if status == 'draft':
            print(f"   Preview with draft: {WP_URL}/?p={post_result['id']}&preview=true")
    else:
        print("\n❌ Post creation failed")
        sys.exit(1)

    # Cleanup
    if temp_md.exists():
        temp_md.unlink()

if __name__ == '__main__':
    main()
