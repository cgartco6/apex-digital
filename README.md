# Apex Digital – Complete Production Agency Platform

## Features
- JWT authentication (register/login)
- Secure per‑client dashboard
- Admin & owner dashboards
- Full shopping cart (session + DB)
- Checkout: Payfast, Stripe, PayPal, Direct EFT (FNB)
- AI agents: 1000 clients in 3 days, content generator, social rule checker
- PDF/ZIP creator, compliance (POPIA/GDPR/CCPA), revenue tracker, SEO

## Quick Start
1. `cp .env.example .env` and fill in your API keys (Stripe, Payfast, PayPal, OpenAI, Twilio – optional for demo)
2. `docker-compose up --build`
3. `docker exec -it apex-digital_web_1 flask seed-db` (creates admin@apex.com / admin123 and products)
4. Visit `http://localhost:5000`

## Default Admin
- Email: admin@apex.com
- Password: admin123

## Folder Structure
See repository tree below.
