import subprocess
import io
import os

def mp3_to_wav_bytes(mp3_bytes, ffmpeg_path):
    # Use subprocess to call FFmpeg from the Poetry virtual environment
    ffmpeg_command = [os.path.join(ffmpeg_path, "ffmpeg"), "-i", "pipe:0", "-f", "wav", "pipe:1"]
    ffmpeg_process = subprocess.Popen(ffmpeg_command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(ffmpeg_command)
    print(ffmpeg_process)
    # Pass the MP3 data to FFmpeg's stdin and get the WAV data from stdout
    wav_bytes, error = ffmpeg_process.communicate(input=mp3_bytes)
    print(wav_bytes)
    # Check for errors
    if error:
        print("FFmpeg error:", error.decode("utf-8"))
        return None

    return wav_bytes