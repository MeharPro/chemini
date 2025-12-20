"""
Kyutai TTS Backend Server for Chemini
Run with: python tts_server.py
Requires: pip install fastapi uvicorn torch moshi
"""
import os
import io
import wave
import struct
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import subprocess
import tempfile

app = FastAPI(title="Chemini TTS Server")

# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TTSRequest(BaseModel):
    text: str

@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using Kyutai TTS.
    Returns WAV audio bytes.
    """
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        # Create temp files for input and output
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(request.text)
            input_file = f.name
        
        output_file = tempfile.mktemp(suffix='.wav')
        
        # Run Kyutai TTS via the official script
        # Assumes moshi package is installed: pip install moshi
        result = subprocess.run(
            ['python', 'scripts/tts_pytorch.py', input_file, output_file],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode != 0:
            # Fallback to simple TTS if Kyutai fails
            raise Exception(f"Kyutai TTS failed: {result.stderr}")
        
        # Read the generated audio
        with open(output_file, 'rb') as f:
            audio_bytes = f.read()
        
        # Cleanup temp files
        os.unlink(input_file)
        if os.path.exists(output_file):
            os.unlink(output_file)
        
        return Response(content=audio_bytes, media_type="audio/wav")
    
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="TTS generation timed out")
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="TTS scripts not found. Ensure moshi package is installed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": "kyutai/tts-1.6b-en_fr"}

if __name__ == "__main__":
    import uvicorn
    print("Starting Kyutai TTS Server on http://localhost:8000")
    print("Frontend should call POST /tts with JSON body: {\"text\": \"Hello world\"}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
