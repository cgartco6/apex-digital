import openai
from flask import current_app

def generate_apex_promo():
    """Generates promotional content for Apex Digital itself."""
    openai.api_key = current_app.config.get('OPENAI_API_KEY', '')
    prompt = (
        "Write 3 versions of a Facebook ad headline for Apex Digital, "
        "the AI agency that guarantees 1000 paying clients in 3 days. "
        "Include a call to action for the free tier."
    )
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
