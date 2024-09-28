from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.llms import ollama
from langchain.prompts import PromptTemplate
from fastapi.middleware.cors import CORSMiddleware
import os
import ffmpeg
from elevenlabs.client import ElevenLabs
from elevenlabs import save
app = FastAPI()

# Initialize the Ollama model
llm = ollama.Ollama(model="llama3.1")

# Create a prompt template
story_prompt = PromptTemplate(
    input_variables=["topic"],
    template=(
        "Write a short children's story about {topic}. "
        "The story should be engaging and suitable for young children, "
        "The story should be in Spanish. "
        "approximately 5 minutes long when read aloud, and in the language of the topic. "
        "Enclose the story within <story> </story> tags. "
        "Avoid using special characters like <, >, {{, }}, or *."
        "The story should have a happy ending."
        "The story should have a moral lesson."
        "The story should make me feel good."
        "The story should be inspiring."
    )
)

# Create the chain using the new recommended approach
story_chain = story_prompt | llm

class StoryRequest(BaseModel):
    prompt: str

class AudioRequest(BaseModel):
    text: str

@app.post("/api/generate-story")
async def generate_story(request: StoryRequest):
    try:
        story = story_chain.invoke({"topic": request.prompt})
        # Extract the story content from within <story> tags
        start_tag = "<story>"
        end_tag = "</story>"
        start_index = story.find(start_tag)
        end_index = story.find(end_tag)
        
        if start_index != -1 and end_index != -1:
            extracted_story = story[start_index + len(start_tag):end_index].strip()
        else:
            extracted_story = story  # Fallback to the full story if tags are not found
        # Remove <story> and </story> tags if present
        extracted_story = extracted_story.replace("<story>", "").replace("</story>", "").strip()
        story = extracted_story  # Replace the original story with the extracted content
        
        return {"story": story}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-audio")
async def generate_audio(request: AudioRequest):
    try:
        # Get the ElevenLabs API key from environment variable
        elevenlabs_api_key = "sk_b4df0b781f836c29510b133018b6ac710988fec67ea1f071" #os.environ.get('ELEVENLABS_API_KEY')
        if not elevenlabs_api_key:
            raise ValueError("ELEVENLABS_API_KEY environment variable is not set")
        client = ElevenLabs(api_key=elevenlabs_api_key)

        print("Generating audio...")
        
        # Generate speech using ElevenLabs
        audio = client.generate(
            text=request.text,
            voice="Isabela - Spanish Children's Book Narrator",
            model="eleven_multilingual_v2"
        )

        # Save the generated audio
        speech_file = "audio/speech.mp3"
        save(audio, speech_file)

        print("Audio generated")
        
        # Select background music based on the story content
        background_music = select_background_music(request.text)

        # Combine speech and background music
        final_audio_file = mix_audio(speech_file, background_music)

        return {"audioUrl": f"/audio/mixed_audio.mp3"}
    except Exception as e:
        print(f"Error in generate_audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def select_background_music(story_text):
    # For now, we'll just return a default music file
    default_music = "audio/default_background.mp3"
    if os.path.exists(default_music):
        return default_music
    else:
        print(f"Warning: Default background music file not found at {default_music}")
        return None

def mix_audio(speech_file, music_file):
    output_file = "audio/mixed_audio.mp3"
    
    if music_file and os.path.exists(music_file):
        # Use ffmpeg-python to mix audio
        input_speech = ffmpeg.input(speech_file)
        input_music = ffmpeg.input(music_file)
        
        # Adjust volume of background music (lowered significantly for subtlety)
        lowered_music = ffmpeg.filter(input_music, "volume", volume=0.1 )
        
        # Mix the audio streams
        mixed = ffmpeg.filter([input_speech, lowered_music], 'amix', duration='first')
        
        # Output the mixed audio
        output = ffmpeg.output(mixed, output_file)
    else:
        # If no background music, just use the speech file
        input_speech = ffmpeg.input(speech_file)
        output = ffmpeg.output(input_speech, output_file)
    
    # Run the ffmpeg command
    ffmpeg.run(output, overwrite_output=True)
    
    return output_file

# Serve static files (audio)
from fastapi.staticfiles import StaticFiles
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)