from app.services.ai_content import generate_blog, generate_image

def create_ad_campaign(business_niche):
    """
    Generates ad copy, creative assets, and a landing page.
    Returns a dict ready to be used by the marketing engine.
    """
    headlines = generate_blog(f"Write 5 compelling ad headlines for {business_niche}.")
    image_url = generate_image(f"Professional marketing image for {business_niche} business")
    landing_page_html = f"""
    <!DOCTYPE html>
    <html>
    <head><title>Special Offer for {business_niche}</title></head>
    <body>
        <h1>Grow Your {business_niche} Business with AI</h1>
        <p>{headlines}</p>
        <img src="{image_url}" alt="Ad visual">
        <button onclick="location.href='/register'">Claim Your Free Tier</button>
    </body>
    </html>
    """
    return {
        'headlines': headlines,
        'image_url': image_url,
        'landing_page': landing_page_html
    }
