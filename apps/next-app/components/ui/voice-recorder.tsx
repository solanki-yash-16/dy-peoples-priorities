"use client"

import * as React from "react"
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@repo/ui"
import { cn } from "@/lib/utils"

export interface VoiceRecorderProps {
  className?: string;
  onRecordingComplete?: (data: { blob: Blob; file: File; base64?: string }) => void;
  onDelete?: () => void;
}

export function VoiceRecorder({ className, onRecordingComplete, onDelete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const mediaRecorder = React.useRef<MediaRecorder | null>(null)
  const audioChunks = React.useRef<Blob[]>([])
  const timerInterval = React.useRef<NodeJS.Timeout | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  
  // Waveform state
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const audioContext = React.useRef<AudioContext | null>(null)
  const analyser = React.useRef<AnalyserNode | null>(null)
  const source = React.useRef<MediaStreamAudioSourceNode | null>(null)
  const animationRef = React.useRef<number | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    timerInterval.current = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }
  }

  const drawWaveform = () => {
    if (!canvasRef.current || !analyser.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording || isPaused) return

      animationRef.current = requestAnimationFrame(draw)
      analyser.current!.getByteTimeDomainData(dataArray)

      ctx.fillStyle = "rgb(250, 250, 250)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 2
      ctx.strokeStyle = "rgb(37, 99, 235)" // Blue-600
      ctx.beginPath()

      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }
    draw()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      
      // Setup AudioContext for waveform
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyser.current = audioContext.current.createAnalyser()
      source.current = audioContext.current.createMediaStreamSource(stream)
      source.current.connect(analyser.current)
      analyser.current.fftSize = 2048
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Create File object
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" })
        
        // Optional Base64 conversion
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          const base64data = reader.result as string
          if (onRecordingComplete) {
            onRecordingComplete({ blob: audioBlob, file: audioFile, base64: base64data })
          }
        }
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)
      startTimer()
      drawWaveform()
    } catch (err) {
      console.error("Error accessing microphone:", err)
      alert("Could not access microphone.")
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder.current && isRecording && !isPaused) {
      mediaRecorder.current.pause()
      setIsPaused(true)
      stopTimer()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder.current && isRecording && isPaused) {
      mediaRecorder.current.resume()
      setIsPaused(false)
      startTimer()
      drawWaveform()
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      stopTimer()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }

  const deleteRecording = () => {
    setAudioUrl(null)
    setDuration(0)
    audioChunks.current = []
    if (onDelete) onDelete()
  }

  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Cleanup
  React.useEffect(() => {
    const currentAudioNode = audioRef.current
    return () => {
      stopTimer()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (currentAudioNode) currentAudioNode.pause()
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  return (
    <div className={cn("flex flex-col gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 font-mono text-lg font-medium text-zinc-700 dark:text-zinc-300">
            {formatTime(duration)}
          </div>
          {isRecording && !isPaused && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-2 text-sm text-red-500 font-medium"
            >
              <div className="size-2 rounded-full bg-red-500" />
              Recording
            </motion.div>
          )}
          {isPaused && (
            <div className="flex items-center gap-2 text-sm text-yellow-600 font-medium">
              <div className="size-2 rounded-full bg-yellow-600" />
              Paused
            </div>
          )}
        </div>
      </div>

      {/* Waveform Canvas */}
      {!audioUrl && (
        <div className="h-16 w-full bg-white dark:bg-zinc-950 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 relative">
          <canvas ref={canvasRef} className="w-full h-full" width={400} height={64} />
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">
              Press record to start
            </div>
          )}
        </div>
      )}

      {/* Audio Playback */}
      {audioUrl && (
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => setIsPlaying(false)} 
            className="hidden" 
          />
          <Button type="button" variant="ghost" size="icon" onClick={togglePlayback}>
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
          </Button>
          <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full opacity-50" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        {!audioUrl ? (
          <div className="flex items-center gap-2 w-full justify-center">
            {!isRecording ? (
              <Button type="button" onClick={startRecording} className="rounded-full gap-2 px-6">
                <Mic className="size-4" /> Start Recording
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button type="button" variant="secondary" onClick={resumeRecording} className="rounded-full gap-2">
                    <Mic className="size-4" /> Resume
                  </Button>
                ) : (
                  <Button type="button" variant="secondary" onClick={pauseRecording} className="rounded-full gap-2">
                    <Pause className="size-4" /> Pause
                  </Button>
                )}
                <Button type="button" variant="destructive" onClick={stopRecording} className="rounded-full gap-2">
                  <Square className="size-4" /> Stop
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full justify-between">
            <Button type="button" variant="outline" onClick={deleteRecording} className="text-red-500 hover:text-red-600 gap-2">
              <Trash2 className="size-4" /> Delete
            </Button>
            <Button type="button" variant="default" onClick={(e) => e.preventDefault()} className="gap-2">
              <RotateCcw className="size-4" /> Re-record
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
