import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) setApiKey(storedKey);
  }, [open]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('openai_api_key');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Configurações de IA</DialogTitle>
          <DialogDescription className="text-gray-400">
            Insira sua chave de API da OpenAI para habilitar a geração de molduras personalizadas.
            Sua chave será salva localmente no seu navegador e nunca enviada para nossos servidores.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey" className="text-gray-200">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10 bg-black/20 border-white/10 text-white placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
