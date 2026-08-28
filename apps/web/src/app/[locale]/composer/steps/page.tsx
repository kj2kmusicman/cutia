"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { 
  ArrowLeft, ArrowRight, Check, X, Upload, Type, Sticker, Music, Sparkles, Eye
} from "lucide-react";

const STEPS = [
  { id: 'assets', label: 'Assets', icon: Upload, description: 'Add your media' },
  { id: 'text', label: 'Text', icon: Type, description: 'Add text overlays' },
  { id: 'stickers', label: 'Stickers', icon: Sticker, description: 'Add stickers & effects' },
  { id: 'audio', label: 'Audio', icon: Music, description: 'Add music & sound' },
  { id: 'ai', label: 'AI', icon: Sparkles, description: 'AI enhancements' },
  { id: 'preview', label: 'Preview', icon: Eye, description: 'Review your creation' },
];

export default function ComposerStepsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [mediaItems, setMediaItems] = useState<Array<{ id: string; type: 'video' | 'image' | 'audio'; url: string; name: string }>>([]);
  const [textOverlays, setTextOverlays] = useState<Array<{ id: string; text: string; style: string }>>([]);
  const [selectedStickers, setSelectedStickers] = useState<Array<{ id: string; emoji: string; name: string }>>([]);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [aiEnhancement, setAiEnhancement] = useState<string | null>(null);

  const step = STEPS[currentStep];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Store everything for the editor
    (window as any).__nextmoney_composer_data = {
      mediaItems,
      textOverlays,
      selectedStickers,
      selectedAudio,
      aiEnhancement,
    };
    router.push('/editor/new-project');
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <div className="bg-[#0A0A0A]/90 backdrop-blur-lg border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={handleBack} className={`p-2 rounded-xl ${currentStep > 0 ? 'hover:bg-white/5' : 'opacity-0 pointer-events-none'}`}>
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-base font-bold flex-1 text-left">
          <span className="text-white">Next</span><span className="text-[#10B981]">Money</span>{" "}
          <span className="text-gray-400">Composer</span>
        </h1>
        <button onClick={handleFinish} className="px-4 py-2 bg-[#10B981] text-black rounded-lg text-sm font-semibold">
          Done
        </button>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-[#10B981]' : 'bg-gray-800'}`} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((s, i) => (
            <span key={s.id} className={`text-[10px] font-medium ${i === currentStep ? 'text-[#10B981]' : i < currentStep ? 'text-gray-400' : 'text-gray-600'}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {step.id === 'assets' && (
          <div>
            {/* Hero Image */}
            <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=300&fit=crop" alt="Add media" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-xl font-bold text-white">Add Your Media</h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">Upload videos, photos, or audio files</p>
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center mb-4 hover:border-[#10B981]/40 transition-colors cursor-pointer"
              onClick={() => {
                // Trigger file input
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*,image/*,audio/*';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    const newItems = Array.from(files).map((file, i) => ({
                      id: `media-${Date.now()}-${i}`,
                      type: (file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'audio') as 'video' | 'image' | 'audio',
                      url: URL.createObjectURL(file),
                      name: file.name,
                    }));
                    setMediaItems([...mediaItems, ...newItems]);
                  }
                };
                input.click();
              }}
            >
              <Upload className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Tap to Upload</p>
              <p className="text-gray-500 text-xs">Videos, photos, or audio files</p>
            </div>
            {/* Media items */}
            {mediaItems.length > 0 && (
              <div className="space-y-2">
                {mediaItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 bg-[#111] rounded-xl p-3">
                    <span className="text-xl">{item.type === 'video' ? '🎬' : item.type === 'image' ? '📷' : '🎵'}</span>
                    <span className="text-white text-sm flex-1 truncate">{item.name}</span>
                    <button onClick={() => setMediaItems(mediaItems.filter(m => m.id !== item.id))} className="p-1 hover:bg-white/5 rounded-lg">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step.id === 'text' && (
          <div>
            {/* Hero Image */}
            <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=300&fit=crop" alt="Add text" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-xl font-bold text-white">Add Text</h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">Add captions or text overlays</p>
            <input
              type="text"
              placeholder="Type your text..."
              className="w-full px-4 py-3 bg-white/5 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981]/40 mb-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  setTextOverlays([...textOverlays, {
                    id: `text-${Date.now()}`,
                    text: (e.target as HTMLInputElement).value.trim(),
                    style: 'default',
                  }]);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            {textOverlays.length > 0 && (
              <div className="space-y-2">
                {textOverlays.map(t => (
                  <div key={t.id} className="flex items-center gap-3 bg-[#111] rounded-xl p-3">
                    <span className="text-white text-sm flex-1">{t.text}</span>
                    <button onClick={() => setTextOverlays(textOverlays.filter(x => x.id !== t.id))} className="p-1 hover:bg-white/5 rounded-lg">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step.id === 'stickers' && (
          <div>
            {/* Hero Image */}
            <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=300&fit=crop" alt="Add stickers" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-xl font-bold text-white">Add Stickers</h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">Choose stickers and effects</p>
            <div className="grid grid-cols-4 gap-3">
              {['🔥', '💚', '✨', '🎉', '💰', '⭐', '🚀', '💎'].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const sticker = { id: `sticker-${Date.now()}-${i}`, emoji, name: emoji };
                    if (selectedStickers.find(s => s.emoji === emoji)) {
                      setSelectedStickers(selectedStickers.filter(s => s.emoji !== emoji));
                    } else {
                      setSelectedStickers([...selectedStickers, sticker]);
                    }
                  }}
                  className={`aspect-square rounded-xl text-3xl flex items-center justify-center ${
                    selectedStickers.find(s => s.emoji === emoji) ? 'bg-[#10B981]/20 border border-[#10B981]' : 'bg-white/5 border border-gray-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {step.id === 'audio' && (
          <div>
            {/* Hero Image */}
            <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=300&fit=crop" alt="Add audio" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-xl font-bold text-white">Add Audio</h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">Choose background music</p>
            <div className="space-y-2">
              {[
                { id: 'none', label: 'No Music', emoji: '🔇' },
                { id: 'upbeat', label: 'Upbeat Pop', emoji: '🎵' },
                { id: 'chill', label: 'Chill Vibes', emoji: '🌊' },
                { id: 'trap', label: 'Trap Beat', emoji: '🔥' },
                { id: 'acoustic', label: 'Acoustic', emoji: '🎸' },
                { id: 'electronic', label: 'Electronic', emoji: '⚡' },
              ].map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedAudio(track.id === 'none' ? null : track.id)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-semibold text-left flex items-center gap-3 ${
                    selectedAudio === track.id || (track.id === 'none' && !selectedAudio)
                      ? 'bg-[#10B981] text-black'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  <span className="text-xl">{track.emoji}</span>
                  {track.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step.id === 'ai' && (
          <div>
            {/* Hero Image */}
            <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop" alt="AI enhancement" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-xl font-bold text-white">AI Enhancement</h2>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-4">Let AI improve your content</p>
            <div className="space-y-2">
              {[
                { id: 'auto-caption', label: 'Auto Captions', desc: 'Generate captions from audio', emoji: '💬' },
                { id: 'auto-enhance', label: 'Auto Enhance', desc: 'Improve colors and lighting', emoji: '✨' },
                { id: 'smart-trim', label: 'Smart Trim', desc: 'Remove silence and filler', emoji: '✂️' },
                { id: 'b-roll', label: 'AI B-Roll', desc: 'Generate contextual clips', emoji: '🎬' },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setAiEnhancement(aiEnhancement === option.id ? null : option.id)}
                  className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 ${
                    aiEnhancement === option.id ? 'bg-[#10B981]/20 border border-[#10B981]' : 'bg-white/5 border border-gray-800'
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{option.label}</p>
                    <p className="text-gray-500 text-xs">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step.id === 'preview' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Preview</h2>
            <p className="text-gray-500 text-sm mb-4">Review your creation</p>
            <div className="bg-black rounded-2xl border border-gray-800 p-4 min-h-64 flex items-center justify-center">
              {mediaItems.length > 0 ? (
                <div className="text-center">
                  <span className="text-4xl mb-2">{mediaItems[0].type === 'video' ? '🎬' : mediaItems[0].type === 'image' ? '📷' : '🎵'}</span>
                  <p className="text-white font-semibold">{mediaItems[0].name}</p>
                </div>
              ) : (
                <p className="text-gray-600">No media added yet</p>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-400 text-xs">Media: {mediaItems.length} items</p>
              <p className="text-gray-400 text-xs">Text: {textOverlays.length} overlays</p>
              <p className="text-gray-400 text-xs">Stickers: {selectedStickers.length} selected</p>
              <p className="text-gray-400 text-xs">Audio: {selectedAudio || 'None'}</p>
              <p className="text-gray-400 text-xs">AI: {aiEnhancement || 'None'}</p>
            </div>

            {/* Create Deal Split Card - event card style */}
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-2xl overflow-hidden border border-[#C8A84E]/20 hover:border-[#C8A84E]/40 transition-all text-left">
                <div className="relative h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop" 
                    alt="Deal split" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-semibold text-white text-base">Create a Deal Split</p>
                    <p className="text-gray-300 text-[13px]">Set your deal and invite partners</p>
                  </div>
                </div>
              </button>
              <button className="w-full rounded-2xl overflow-hidden border border-gray-800/50 hover:border-[#10B981]/30 transition-all text-left">
                <div className="relative h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop" 
                    alt="Just post" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-semibold text-white text-base">Just Post</p>
                    <p className="text-gray-300 text-[13px]">Share directly to your feed</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 py-3 border-t border-gray-800 flex gap-3 flex-shrink-0">
        <button onClick={handleSkip} className="px-4 py-3 text-gray-500 text-sm font-medium">
          Skip
        </button>
        {currentStep < STEPS.length - 1 ? (
          <button onClick={handleNext} className="flex-1 py-3 bg-[#10B981] text-black rounded-xl font-semibold flex items-center justify-center gap-2">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleFinish} className="flex-1 py-3 bg-[#C8A84E] text-black rounded-xl font-semibold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Post to NextMoney
          </button>
        )}
      </div>
    </main>
  );
}
