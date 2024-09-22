'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Github, Loader2, Mic, RefreshCw, Wand2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function Home() {
    const [storyPrompt, setStoryPrompt] = useState('');
    const [generatedStory, setGeneratedStory] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [isLoadingStory, setIsLoadingStory] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);

    const generateStory = async (prompt: string) => {
        setIsLoadingStory(true);
        try {
            const response = await fetch('http://localhost:8000/api/generate-story', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setGeneratedStory(data.story);
        } catch (error) {
            console.error('Error generating story:', error);
            // Handle error (e.g., show error message to user)
        } finally {
            setIsLoadingStory(false);
        }
    };

    const generateAudio = async () => {
        setIsLoadingAudio(true);
        try {
            const response = await fetch('http://localhost:8000/api/generate-audio', {
                method: 'POST',
                body: JSON.stringify({ text: generatedStory }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setAudioUrl(`http://localhost:8000${data.audioUrl}`);
        } catch (error) {
            console.error('Error generating audio:', error);
            // Handle error (e.g., show error message to user)
        } finally {
            setIsLoadingAudio(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg bg-white">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-purple-700">Rufina's Storyteller Machine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="storyPrompt" className="text-sm font-medium text-gray-700">Enter a story prompt:</label>
                        <div className="flex space-x-2">
                            <Input
                                id="storyPrompt"
                                placeholder="Once upon a time in a magical forest..."
                                value={storyPrompt}
                                onChange={(e) => setStoryPrompt(e.target.value)}
                                className="flex-grow"
                            />
                            <Button onClick={() => generateStory(storyPrompt)} className="bg-purple-600 text-white hover:bg-purple-700">
                                {isLoadingStory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Generate
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="storyEditor" className="text-sm font-medium text-gray-700">Edit Your Story:</label>
                        <Textarea
                            id="storyEditor"
                            placeholder="Your magical story will appear here..."
                            value={generatedStory}
                            onChange={(e) => setGeneratedStory(e.target.value)}
                            rows={8}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex justify-between">
                        <Button variant="outline" className="flex-1 mr-2">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Save Story
                        </Button>
                        <Button onClick={generateAudio} disabled={isLoadingAudio || !generatedStory} className="flex-1 ml-2 bg-blue-600 text-white hover:bg-blue-700">
                            {audioUrl ? (
                                <>
                                    {isLoadingAudio ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                    Refresh Audio
                                </>
                            ) : (
                                <>
                                    {isLoadingAudio ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                                    Generate Audio
                                </>
                            )}
                        </Button>
                    </div>

                    {audioUrl && (
                        <div className="mt-4">
                            <label htmlFor="audioPlayer" className="text-sm font-medium text-gray-700 block mb-2">
                                Listen to Your Story:
                            </label>
                            <audio id="audioPlayer" controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <a
                        href="https://github.com/carlos-rodrigo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-purple-600 flex items-center"
                    >
                        <GitHubLogoIcon className="mr-2 h-4 w-4" />
                        Created by Carlos Rodrigo
                    </a>
                </CardFooter>
            </Card>
        </div>
    );
}