import { Button } from '@web/components/ui/button';
import { RotateCcw, Trash } from 'lucide-react';

interface TrashBannerProps {
  onRestore: () => void;
  onPermanentDelete: () => void;
}

export function TrashBanner({ onRestore, onPermanentDelete }: TrashBannerProps) {
  return (
    <div className="shrink-0 flex items-center justify-between h-10 px-5 bg-amber-500/[0.08] border-b border-amber-500/[0.15]">
      <span className="text-[13px] text-amber-200/70">This note is in Trash</span>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[12px] gap-1.5 text-amber-200/60 hover:text-amber-200/90 hover:bg-amber-500/10"
          onClick={onRestore}
        >
          <RotateCcw className="h-3 w-3" />
          Restore
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[12px] gap-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
          onClick={onPermanentDelete}
        >
          <Trash className="h-3 w-3" />
          Delete Forever
        </Button>
      </div>
    </div>
  );
}
