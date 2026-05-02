import openai
from flask import current_app

openai.api_key = current_app.config.get('OPENAI_API_KEY', '')

def generate_blog(topic, max_words=500):
    """Generate a blog post using OpenAI GPT."""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user",
                   "content": f"Write a {max_words}-word blog post about {topic} for a digital marketing agency."}]
    )
    return response.choices[0].message.content

def generate_social_post(prompt, max_chars=280):
    """Generate a short social media post."""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user",
                   "content": f"Write a social media post under {max_chars} characters: {prompt}"}]
    )
    return response.choices[0].message.content[:max_chars]

def generate_email(subject, recipient_name=None):
    """Generate a marketing email."""
    personalization = f"Hi {recipient_name},\n\n" if recipient_name else ""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user",
                   "content": f"Write a marketing email with subject '{subject}'. Keep it persuasive and include a CTA."}]
    )
    return personalization + response.choices[0].message.content

def generate_image(prompt):
    """Generate an image using DALL-E (requires paid OpenAI credits)."""
    response = openai.Image.create(prompt=prompt, n=1, size="512x512")
    return response['data'][0]['url']
