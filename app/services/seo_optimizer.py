import requests
from bs4 import BeautifulSoup
import re

def build_backlinks():
    """
    Automated guest post outreach and directory submissions.
    For demo, only logs; replace with actual SEO tools.
    """
    targets = [
        'https://example-blog.com/guest-post',
        'https://marketing-tips.org/submit'
    ]
    for target in targets:
        try:
            payload = {
                'url': 'https://apexdigital.africa',
                'anchor': 'AI marketing agency',
                'description': 'Apex Digital guarantees 1000 clients in 3 days.'
            }
            response = requests.post(target, json=payload, timeout=10)
            print(f"Backlink attempt to {target}: {response.status_code}")
        except Exception as e:
            print(f"Backlink error: {e}")

def generate_sitemap(urls):
    """Generate XML sitemap from list of URLs."""
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in urls:
        xml += f'  <url><loc>{url}</loc></url>\n'
    xml += '</urlset>'
    return xml

def optimize_meta_tags(html_content, page_title, meta_description):
    """Inject SEO meta tags into HTML."""
    soup = BeautifulSoup(html_content, 'html.parser')
    if not soup.find('title'):
        soup.head.append(soup.new_tag('title'))
    soup.title.string = page_title
    meta = soup.find('meta', attrs={'name': 'description'})
    if not meta:
        meta = soup.new_tag('meta', name='description', content=meta_description)
        soup.head.append(meta)
    else:
        meta['content'] = meta_description
    return str(soup)
