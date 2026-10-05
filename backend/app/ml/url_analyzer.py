import re
from urllib.parse import urlparse
from typing import Dict, List


SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "is.gd",
    "ow.ly",
    "cutt.ly",
}

SUSPICIOUS_WORDS = {
    "login",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "confirm",
    "password",
    "wallet",
    "claim",
    "prize",
    "free",
}


def analyze_url(url: str) -> Dict:
    parsed = urlparse(url)

    hostname = (parsed.hostname or "").lower()

    indicators: List[str] = []
    risk_score = 0

    if not hostname:
        return {
            "url": url,
            "risk_score": 100,
            "risk_level": "HIGH",
            "indicators": ["Invalid URL"],
        }

    # HTTP instead of HTTPS
    if parsed.scheme.lower() != "https":
        risk_score += 20
        indicators.append("URL does not use HTTPS")

    # URL shortener
    if hostname in SHORTENERS:
        risk_score += 25
        indicators.append("URL uses a link-shortening service")

    # IP address instead of domain
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", hostname):
        risk_score += 30
        indicators.append("URL uses an IP address instead of a domain name")

    # Suspicious keywords
    found_words = [
        word for word in SUSPICIOUS_WORDS
        if word in hostname.lower()
    ]

    if found_words:
        risk_score += min(len(found_words) * 10, 30)
        indicators.append(
            "Domain contains potentially suspicious keywords"
        )

    # Excessive subdomains
    if len(hostname.split(".")) > 4:
        risk_score += 15
        indicators.append("URL contains an unusually large number of subdomains")

    # Very long URL
    if len(url) > 150:
        risk_score += 10
        indicators.append("URL is unusually long")

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    if not indicators:
        indicators.append("No major URL risk indicators detected")

    return {
        "url": url,
        "domain": hostname,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "indicators": indicators,
    }


def analyze_urls(message: str) -> List[Dict]:
    urls = re.findall(
        r"https?://[^\s]+|www\.[^\s]+",
        message,
        flags=re.IGNORECASE,
    )

    results = []

    for url in urls:
        clean_url = url.rstrip(".,!?;:)")

        if clean_url.startswith("www."):
            clean_url = "https://" + clean_url

        results.append(analyze_url(clean_url))

    return results