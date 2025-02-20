import React, { useEffect, useRef, useState } from "react";
import { Trash2, RotateCcw, Pencil } from "lucide-react";
import { Timer } from "../types/timer";
import { formatTime } from "../utils/time";
import { useTimerStore } from "../store/useTimerStore";
import { toast } from "sonner";
import { TimerAudio } from "../utils/audio";
import { TimerControls } from "./TimerControls";
import { TimerProgress } from "./TimerProgress";
import { TimerModal } from "./TimerModal";

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { toggleTimer, deleteTimer, updateTimer, restartTimer, updateStatus } =
    useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timerAudio = TimerAudio.getInstance();
  const hasEndedRef = useRef(false);
  const [localTimer, setLocalTimer] = useState({ ...timer });

  useEffect(() => {
    if (localTimer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (localTimer.remainingTime !== 0) {
          setLocalTimer({
            ...localTimer,
            remainingTime: localTimer.remainingTime - 1,
            isRunning: localTimer.remainingTime > 0,
          });
        }
        updateTimer(localTimer.id);

        if (localTimer.remainingTime <= 1 && !hasEndedRef.current) {
          hasEndedRef.current = true;
          timerAudio.play().catch(console.error);

          toast.success(`Timer "${localTimer.title}" has ended!`, {
            duration: 5000,
            action: {
              label: "Dismiss",
              onClick: () => timerAudio.stop(),
            },
          });
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [
    localTimer.isRunning,
    localTimer.id,
    localTimer.remainingTime,
    localTimer.title,
    timerAudio,
    updateTimer,
  ]);

  useEffect(() => {
    setLocalTimer({ ...timer });
  }, [timer.duration, timer.title]);

  const handleRestart = () => {
    hasEndedRef.current = false;
    setLocalTimer({
      ...timer,
      isRunning: false,
      remainingTime: timer.duration,
    });
    restartTimer(localTimer.id);
  };

  const handleDelete = () => {
    timerAudio.stop();
    deleteTimer(localTimer.id);
  };

  const handleToggle = () => {
    if (localTimer.remainingTime <= 0) {
      hasEndedRef.current = false;
    }
    setLocalTimer({ ...localTimer, isRunning: !localTimer.isRunning });
    toggleTimer(localTimer.id);
  };

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-102 overflow-hidden">
        <div className="absolute inset-0 w-full h-full -z-10 opacity-5">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M50 20V50L70 70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {localTimer.title}
              </h3>
              <p className="text-gray-600 mt-1">{localTimer.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
                title="Edit Timer">
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-full hover:bg-blue-50 text-blue-500 transition-colors"
                title="Restart Timer">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                title="Delete Timer">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(localTimer.remainingTime)}
            </div>

            <TimerProgress
              progress={(localTimer.remainingTime / localTimer.duration) * 100}
            />

            <TimerControls
              isRunning={localTimer.isRunning}
              remainingTime={localTimer.remainingTime}
              duration={localTimer.duration}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>

      <TimerModal
        type="update"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
      />
    </>
  );
};
