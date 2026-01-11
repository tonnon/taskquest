import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, ImagePlus } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { SettingsModal } from './SettingsModal';
import { getFrameTheme } from '@/utils/rankStyles';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface FrameGeneratorProps {
  level: number;
}

export function FrameGenerator({ level }: FrameGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const { setCustomFrameUrl } = useTaskStore();
  const theme = getFrameTheme(level);

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const prompt = `A high quality, circular game avatar frame, RPG style, theme: ${theme.name}, colors: ${theme.accentMain} and ${theme.accentSecondary}, glowing magical effects, transparent background, centered composition, vector art style, high contrast, detailed border, isolated on black background`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "vivid"
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.data && data.data[0] && data.data[0].url) {
        setGeneratedImage(data.data[0].url);
        setShowPreview(true);
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(`Falha ao gerar frame: ${error.message}`);
      if (error.message.includes('api_key')) {
        setShowSettings(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedImage) {
      setCustomFrameUrl(generatedImage);
      setShowPreview(false);
      toast.success('Novo frame aplicado com sucesso!');
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-primary transition-all duration-300"
        onClick={handleGenerate}
        disabled={isGenerating}
        title="Gerar Frame com IA"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
      </Button>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Frame Gerado</DialogTitle>
            <DialogDescription className="text-gray-400">
              Aqui está o seu frame exclusivo gerado por IA. Deseja aplicá-lo ao seu avatar?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-6 bg-black/40 rounded-lg">
             {generatedImage && (
               <div className="relative w-64 h-64">
                 <img 
                   src={generatedImage} 
                   alt="Generated Frame" 
                   className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-gray-800 border-2 border-white/10 opacity-50"></div>
                 </div>
               </div>
             )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button onClick={handleApply} className="bg-primary hover:bg-primary/90 text-white gap-2">
              <ImagePlus className="w-4 h-4" />
              Aplicar Frame
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
