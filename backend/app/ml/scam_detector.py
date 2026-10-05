import re
from typing import Dict

from app.ml.url_analyzer import analyze_urls


SCAM_PATTERNS = {
    "urgency": [
        "act now",
        "act immediately",
        "immediately",
        "urgent",
        "urgent action required",
        "within 24 hours",
        "within 48 hours",
        "last chance",
        "final warning",
        "account will be blocked",
        "account will be suspended",
        "account will be closed",
        "do it now",
        "respond immediately",
        "ఇప్పుడే",
        "తక్షణం",
        "అత్యవసరం",
        "24 గంటల్లో",
        "ఖాతా బ్లాక్ అవుతుంది",
        "ఖాతా నిలిపివేయబడుతుంది",
        "చివరి అవకాశం",
    ],

    "financial": [
        "send money",
        "transfer money",
        "bank account",
        "bank details",
        "account number",
        "credit card",
        "debit card",
        "payment",
        "make a payment",
        "pay now",
        "refund",
        "cash prize",
        "money",
        "₹",
        "$",
        "financial",
        "transaction",
        "డబ్బు",
        "బ్యాంక్",
        "బ్యాంకు",
        "ఖాతా",
        "బ్యాంక్ వివరాలు",
        "క్రెడిట్ కార్డ్",
        "డెబిట్ కార్డ్",
        "చెల్లింపు",
        "చెల్లించండి",
        "ఇప్పుడే చెల్లించండి",
        "రిఫండ్",
        "నగదు",
        "లావాదేవీ",
    ],

    "credentials": [
        "password",
        "otp",
        "verification code",
        "security code",
        "pin",
        "cvv",
        "login details",
        "login credentials",
        "account password",
        "one time password",
        "share your otp",
        "share otp",
        "enter otp",
        "పాస్‌వర్డ్",
        "ఓటీపీ",
        "otp కోడ్",
        "వెరిఫికేషన్ కోడ్",
        "సెక్యూరిటీ కోడ్",
        "పిన్",
        "సీవీవీ",
        "లాగిన్ వివరాలు",
        "పాస్‌వర్డ్ ఇవ్వండి",
        "ఓటీపీ ఇవ్వండి",
    ],

    "prize": [
        "you won",
        "you have won",
        "winner",
        "lottery",
        "prize",
        "reward",
        "cash prize",
        "claim your prize",
        "claim prize",
        "lucky winner",
        "selected as winner",
        "won ₹",
        "won $",
        "free gift",
        "free reward",
        "గెలిచారు",
        "మీరు గెలిచారు",
        "విజేత",
        "లాటరీ",
        "బహుమతి",
        "రివార్డ్",
        "నగదు బహుమతి",
        "బహుమతి క్లెయిమ్",
        "ఉచిత బహుమతి",
    ],

    "suspicious_action": [
        "click here",
        "click this link",
        "click the link",
        "open this link",
        "verify now",
        "verify your account",
        "verify account",
        "claim now",
        "claim your prize",
        "confirm your account",
        "update your account",
        "update your details",
        "login now",
        "sign in now",
        "ఇక్కడ క్లిక్ చేయండి",
        "ఈ లింక్‌పై క్లిక్ చేయండి",
        "లింక్‌పై క్లిక్ చేయండి",
        "ఈ లింక్‌ను ఓపెన్ చేయండి",
        "ఇప్పుడే వెరిఫై చేయండి",
        "మీ ఖాతాను వెరిఫై చేయండి",
        "ఇప్పుడే క్లెయిమ్ చేయండి",
        "మీ ఖాతాను నిర్ధారించండి",
        "మీ వివరాలను అప్డేట్ చేయండి",
        "ఇప్పుడే లాగిన్ అవ్వండి",
        "క్లిక్ చేయండి",
    ],

    "job": [
        "job offer",
        "work from home",
        "part time job",
        "part-time job",
        "easy job",
        "online job",
        "earn money",
        "daily income",
        "high salary",
        "hiring",
        "vacancy",
        "ఉద్యోగ అవకాశం",
        "ఇంటి నుండి పని",
        "పార్ట్ టైమ్ ఉద్యోగం",
        "ఆన్‌లైన్ ఉద్యోగం",
        "డబ్బు సంపాదించండి",
        "రోజువారీ ఆదాయం",
        "అధిక జీతం",
        "హైరింగ్",
        "ఖాళీ",
    ],

    "investment": [
        "investment",
        "invest now",
        "guaranteed profit",
        "guaranteed returns",
        "high returns",
        "quick profit",
        "double your money",
        "crypto",
        "cryptocurrency",
        "trading",
        "stock trading",
        "investment opportunity",
        "పెట్టుబడి",
        "ఇప్పుడే పెట్టుబడి పెట్టండి",
        "గ్యారంటీ లాభం",
        "గ్యారంటీ రిటర్న్స్",
        "అధిక లాభాలు",
        "త్వరగా లాభం",
        "డబ్బు రెట్టింపు",
        "క్రిప్టో",
        "ట్రేడింగ్",
        "పెట్టుబడి అవకాశం",
    ],
}


CATEGORY_KEYWORDS = {
    "Prize Scam": [
        "won",
        "winner",
        "lottery",
        "prize",
        "reward",
        "claim your prize",
        "cash prize",
        "lucky winner",
        "free gift",
        "గెలిచారు",
        "విజేత",
        "లాటరీ",
        "బహుమతి",
        "రివార్డ్",
        "క్లెయిమ్",
        "నగదు బహుమతి",
    ],

    "Banking Scam": [
        "bank",
        "bank account",
        "bank details",
        "account number",
        "debit card",
        "credit card",
        "transaction",
        "payment",
        "refund",
        "బ్యాంక్",
        "బ్యాంకు",
        "ఖాతా",
        "బ్యాంక్ వివరాలు",
        "డెబిట్ కార్డ్",
        "క్రెడిట్ కార్డ్",
        "లావాదేవీ",
        "చెల్లింపు",
        "రిఫండ్",
    ],

    "OTP Scam": [
        "otp",
        "verification code",
        "security code",
        "one time password",
        "pin",
        "cvv",
        "share your otp",
        "enter otp",
        "ఓటీపీ",
        "వెరిఫికేషన్ కోడ్",
        "సెక్యూరిటీ కోడ్",
        "పిన్",
        "సీవీవీ",
    ],

    "Job Scam": [
        "job offer",
        "work from home",
        "part time job",
        "part-time job",
        "online job",
        "salary",
        "hiring",
        "vacancy",
        "earn money",
        "daily income",
        "ఉద్యోగ అవకాశం",
        "ఇంటి నుండి పని",
        "పార్ట్ టైమ్ ఉద్యోగం",
        "ఆన్‌లైన్ ఉద్యోగం",
        "జీతం",
        "హైరింగ్",
        "ఖాళీ",
        "డబ్బు సంపాదించండి",
    ],

    "Investment Scam": [
        "investment",
        "invest now",
        "profit",
        "guaranteed profit",
        "guaranteed returns",
        "high returns",
        "crypto",
        "cryptocurrency",
        "trading",
        "stock trading",
        "returns",
        "పెట్టుబడి",
        "లాభం",
        "గ్యారంటీ లాభం",
        "గ్యారంటీ రిటర్న్స్",
        "క్రిప్టో",
        "ట్రేడింగ్",
        "రిటర్న్స్",
    ],

    "Phishing": [
        "verify",
        "verify your account",
        "login",
        "login now",
        "sign in",
        "password",
        "account",
        "click here",
        "click the link",
        "update your account",
        "వెరిఫై",
        "లాగిన్",
        "పాస్‌వర్డ్",
        "ఖాతా",
        "క్లిక్ చేయండి",
    ],
}


def detect_language(text: str) -> str:
    """
    Detect languages using Unicode script ranges.
    Supports Telugu, Hindi, Tamil, Kannada, Malayalam,
    Bengali, Gujarati, Punjabi, English, and mixed messages.
    """

    scripts = {
        "Telugu": r"[\u0C00-\u0C7F]",
        "Hindi": r"[\u0900-\u097F]",
        "Bengali": r"[\u0980-\u09FF]",
        "Punjabi": r"[\u0A00-\u0A7F]",
        "Gujarati": r"[\u0A80-\u0AFF]",
        "Tamil": r"[\u0B80-\u0BFF]",
        "Kannada": r"[\u0C80-\u0CFF]",
        "Malayalam": r"[\u0D00-\u0D7F]",
    }

    detected = []

    for language, pattern in scripts.items():
        if re.search(pattern, text):
            detected.append(language)

    if re.search(r"[A-Za-z]", text):
        detected.append("English")

    if not detected:
        return "Unknown"

    if len(detected) == 1:
        return detected[0]

    return " + ".join(detected)


def _contains_pattern(text: str, pattern: str) -> bool:
    """
    Match longer phrases normally and protect short keywords
    such as OTP, PIN, CVV from accidental substring matches.
    """

    pattern = pattern.lower().strip()

    if not pattern:
        return False

    if len(pattern) <= 4 and re.fullmatch(
        r"[a-z0-9]+",
        pattern,
    ):
        return bool(
            re.search(
                rf"\b{re.escape(pattern)}\b",
                text,
                flags=re.IGNORECASE,
            )
        )

    return pattern in text


def _count_category_matches(
    text: str,
    keywords: list[str],
) -> int:
    return sum(
        1
        for keyword in keywords
        if _contains_pattern(text, keyword)
    )


def analyze_message(message: str) -> Dict:
    text = message.lower().strip()

    detected_indicators = []

    # Detect scam indicator groups
    for indicator_name, patterns in SCAM_PATTERNS.items():
        for pattern in patterns:
            if _contains_pattern(text, pattern):
                detected_indicators.append(indicator_name)
                break

    unique_indicators = list(dict.fromkeys(detected_indicators))

    # Weighted risk scoring
    indicator_weights = {
        "urgency": 12,
        "financial": 18,
        "credentials": 22,
        "prize": 18,
        "suspicious_action": 15,
        "job": 10,
        "investment": 12,
    }

    risk_score = sum(
        indicator_weights.get(indicator, 0)
        for indicator in unique_indicators
    )

    # URL analysis
    url_results = analyze_urls(message)
    links = [item["url"] for item in url_results]

    if links:
        risk_score += 8

        highest_url_risk = max(
            item["risk_score"]
            for item in url_results
        )

        risk_score += round(highest_url_risk * 0.30)

    # Strong scam combinations
    if (
        "prize" in unique_indicators
        and "suspicious_action" in unique_indicators
    ):
        risk_score += 12

    if (
        "financial" in unique_indicators
        and "credentials" in unique_indicators
    ):
        risk_score += 15

    if (
        "urgency" in unique_indicators
        and "suspicious_action" in unique_indicators
    ):
        risk_score += 10

    if (
        "credentials" in unique_indicators
        and links
    ):
        risk_score += 10

    if (
        "job" in unique_indicators
        and "financial" in unique_indicators
    ):
        risk_score += 8

    if (
        "investment" in unique_indicators
        and "urgency" in unique_indicators
    ):
        risk_score += 8

    if (
        "investment" in unique_indicators
        and "financial" in unique_indicators
    ):
        risk_score += 8

    # Strong combination: urgent request for sensitive credentials
    if (
        "urgency" in unique_indicators
        and "credentials" in unique_indicators
    ):
        risk_score += 15

    risk_score = min(round(risk_score), 100)

    # Final prediction
    if risk_score >= 70:
        prediction = "SCAM"
    elif risk_score >= 35:
        prediction = "SUSPICIOUS"
    else:
        prediction = "LIKELY SAFE"

    # Category detection
    category = "General"
    highest_category_score = 0

    for category_name, keywords in CATEGORY_KEYWORDS.items():
        match_count = _count_category_matches(
            text,
            keywords,
        )

        if match_count > highest_category_score:
            highest_category_score = match_count
            category = category_name

    # Language detection
    language = detect_language(message)

    # Explanation
    explanation_parts = []

    if "urgency" in unique_indicators:
        explanation_parts.append(
            "The message uses urgent or pressure-based language."
        )

    if "financial" in unique_indicators:
        explanation_parts.append(
            "The message contains financial or money-related language."
        )

    if "credentials" in unique_indicators:
        explanation_parts.append(
            "The message appears to request sensitive authentication information."
        )

    if "prize" in unique_indicators:
        explanation_parts.append(
            "The message contains prize or reward-related claims."
        )

    if "suspicious_action" in unique_indicators:
        explanation_parts.append(
            "The message encourages the user to click, claim, verify, or take immediate action."
        )

    if "job" in unique_indicators:
        explanation_parts.append(
            "The message contains job or income-related claims."
        )

    if "investment" in unique_indicators:
        explanation_parts.append(
            "The message contains investment, trading, or profit-related claims."
        )

    if links:
        explanation_parts.append(
            "The message contains a URL that requires additional verification."
        )

        highest_url_risk = max(
            item["risk_score"]
            for item in url_results
        )

        if highest_url_risk >= 60:
            explanation_parts.append(
                "The detected URL contains multiple high-risk indicators."
            )
        elif highest_url_risk >= 30:
            explanation_parts.append(
                "The detected URL contains suspicious characteristics."
            )

    if (
        "prize" in unique_indicators
        and links
        and "suspicious_action" in unique_indicators
    ):
        explanation_parts.append(
            "The combination of a prize claim, action request, and external URL is a strong scam signal."
        )

    if (
        "credentials" in unique_indicators
        and links
    ):
        explanation_parts.append(
            "A request for sensitive information combined with an external URL requires extra caution."
        )

    if not explanation_parts:
        explanation_parts.append(
            "No major scam indicators were detected by the current analysis engine."
        )

    return {
        "prediction": prediction,
        "risk_score": risk_score,
        "category": category,
        "language": language,
        "indicators": unique_indicators,
        "explanation": explanation_parts,
        "links_detected": len(links),
        "url_analysis": url_results,
    }