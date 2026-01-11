
import { ChangeEvent, CSSProperties, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskStore } from '@/store/taskStore';
import { toast } from '@/hooks/use-toast';
import { GameAvatarFrame } from '@/components/GameAvatarFrame';
import { getRarity } from '@/utils/rankStyles';
import { useShallow } from 'zustand/react/shallow';

const MAX_AVATAR_SIZE_MB = 5;

const UserAvatar = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploadingState = useState(false);
    const isUploading = isUploadingState[0];
    const setIsUploading = isUploadingState[1];

    const { user: authUser } = useAuth();
    
    const { 
        userId, 
        hasHydrated, 
        userProgress, 
        avatarUrl, 
        isLoading, 
        isSynced,
        updateAvatar 
    } = useTaskStore(
        useShallow((state) => ({
            userId: state.userId,
            hasHydrated: state._hasHydrated,
            userProgress: state.userProgress,
            avatarUrl: state.avatarUrl,
            isLoading: state.isLoading,
            isSynced: state.isSynced,
            updateAvatar: state.updateAvatar,
        }))
    );

    // Require hydration, sync, and matching user before rendering the avatar data
    const isDataReady = 
        hasHydrated &&
        isSynced &&
        !isLoading &&
        authUser &&
        userId === authUser.uid &&
        userProgress.level > 0;

    useEffect(() => {
        const handleExternalUpload = () => {
            if (!hasHydrated || isLoading || !isSynced || isUploading) return;
            fileInputRef.current?.click();
        };

        window.addEventListener('taskquest:open-avatar-upload', handleExternalUpload);
        return () => {
            window.removeEventListener('taskquest:open-avatar-upload', handleExternalUpload);
        };
    }, [hasHydrated, isLoading, isSynced, isUploading]);

    // Progress calculation for the ring
    const rawProgress = (userProgress.currentLevelXp / userProgress.xpToNextLevel) * 100;
    const progressPercent = Number.isFinite(rawProgress)
        ? Math.min(100, Math.max(0, rawProgress))
        : 0;

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
            toast({
                title: 'Imagem muito grande',
                description: `Envie uma imagem de até ${MAX_AVATAR_SIZE_MB}MB.`,
                variant: 'destructive',
            });
            event.target.value = '';
            return;
        }

        try {
            setIsUploading(true);
            await updateAvatar(file);
            toast({
                title: 'Avatar atualizado',
                description: 'Sua imagem foi salva com sucesso!',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Erro ao subir avatar',
                description: 'Tente novamente em instantes.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const progressRingStyle: CSSProperties = {
        background: `conic-gradient(#facc15 ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}%)`,
        mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px))',
        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px))',
    };

    if (!isDataReady) {
        return (
            <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full bg-muted/20 border border-white/5" />
                    <div className="absolute inset-[22px] rounded-full bg-muted/30" />
                    {/* Circle representing the frame area */}
                    <div className="absolute inset-8 rounded-full border-4 border-muted/20" />
                </div>
                <div className="h-5 w-20 bg-muted/20 rounded-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative group">
                {/* Main Avatar Container */}
                <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center">
                    {/* XP Progress Ring (Base) */}
                    <div className="absolute inset-4 rounded-full border border-white/5 z-0" />

                    {/* XP Progress Ring (Active) */}
                    <div className="absolute inset-4 rounded-full opacity-90 z-10" style={progressRingStyle} />

                    {/* Inner Background for Contrast */}
                    <div className="absolute inset-[22px] rounded-full bg-background/85 backdrop-blur-sm border border-white/5 z-10" />

                    {/* Avatar Frame & Image */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <GameAvatarFrame 
                            level={userProgress.level}
                            rarity={getRarity(userProgress.level)}
                            avatarUrl={avatarUrl}
                            frameSrc={userProgress.customFrameUrl}
                            className="w-28 h-28 md:w-32 md:h-32" 
                            animated={true}
                        />
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default UserAvatar;
