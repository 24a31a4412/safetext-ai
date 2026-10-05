import os
import tempfile

import speech_recognition as sr
from pydub import AudioSegment


def transcribe_audio(audio_bytes: bytes, file_extension: str = ".ogg") -> str:
    recognizer = sr.Recognizer()

    input_path = None
    wav_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=file_extension,
        ) as temp_file:
            temp_file.write(audio_bytes)
            input_path = temp_file.name

        audio = AudioSegment.from_file(input_path)

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav",
        ) as temp_wav:
            wav_path = temp_wav.name

        audio.export(wav_path, format="wav")

        with sr.AudioFile(wav_path) as source:
            recorded_audio = recognizer.record(source)

        text = recognizer.recognize_google(recorded_audio)

        return text.strip()

    except sr.UnknownValueError:
        return ""

    except sr.RequestError as error:
        raise RuntimeError(
            f"Speech recognition service error: {error}"
        )

    finally:
        if input_path and os.path.exists(input_path):
            try:
                os.remove(input_path)
            except PermissionError:
                pass

        if wav_path and os.path.exists(wav_path):
            try:
                os.remove(wav_path)
            except PermissionError:
                pass