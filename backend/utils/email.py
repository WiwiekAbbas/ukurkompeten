import resend
from config import settings

resend.api_key = settings.RESEND_API_KEY


def send_welcome_email(to_email: str, user_name: str):
    """Send welcome email to new user"""
    params = {
        "from": f"UkurKompeten <{settings.EMAIL_FROM}>",
        "to": to_email,
        "subject": "Selamat Datang di UkurKompeten! 🎉",
        "html": f"""
        <h1>Selamat Datang, {user_name}!</h1>
        <p>Terima kasih sudah bergabung dengan UkurKompeten.</p>
        <p>Mulai assessment pertama Anda sekarang dan kenali kemampuan Anda lebih dalam.</p>
        <a href="https://ukurkompeten.id/dashboard" style="background-color: #2D9B8F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Mulai Assessment</a>
        <p>Salam,<br>Tim UkurKompeten</p>
        """
    }
    
    email = resend.Emails.send(params)
    return email
