import re

# Platform-specific forbidden words and patterns
FORBIDDEN = {
    'facebook': [
        r'\bmiracle\b', r'\bguarantee\b', r'\bfree money\b', r'\bhack\b',
        r'\bclickbait\b', r'\blike farming\b'
    ],
    'twitter': [
        r'\bfollow back\b', r'\bgain followers fast\b', r'\bfree followers\b',
        r'\bretweet for retweet\b'
    ],
    'tiktok': [
        r'\blike for like\b', r'\bcheat\b', r'\bfree likes\b', r'\bbuy views\b'
    ],
    'linkedin': [
        r'\bconnection hack\b', r'\bspam\b', r'\bunrelated promotion\b'
    ],
    'instagram': [
        r'\bfollow unfollow\b', r'\bbuy likes\b', r'\bpodcast loop\b'
    ]
}

URL_SHORTENERS = [r'bit\.ly', r'tinyurl\.com', r'ow\.ly', r'goo\.gl']

def check_platform_rules(content, platform):
    """
    Returns (safe: bool, violations: list)
    """
    violations = []
    platform = platform.lower()
    if platform in FORBIDDEN:
        for pattern in FORBIDDEN[platform]:
            if re.search(pattern, content, re.IGNORECASE):
                violations.append(f"Forbidden pattern: {pattern}")
    # URL shortener check
    for shortener in URL_SHORTENERS:
        if re.search(shortener, content, re.IGNORECASE):
            violations.append(f"URL shortener not allowed ({shortener})")
    # Profanity check (simple)
    profane = ['fuck', 'shit', 'asshole', 'cunt']
    for word in profane:
        if word in content.lower():
            violations.append(f"Profanity detected: {word}")
    return (len(violations) == 0, violations)
