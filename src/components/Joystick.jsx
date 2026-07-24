import { useRef, useEffect } from 'react';

export default function Joystick({ onMove }) {
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  const active = useRef(false);
  const baseRect = useRef({ left: 0, top: 0, size: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    baseRect.current = { left: rect.left, top: rect.top, size: rect.width };

    const handleStart = (e) => {
      e.preventDefault();
      active.current = true;
    };
    const handleMove = (e) => {
      if (!active.current) return;
      const touch = e.touches ? e.touches[0] : e;
      const { left, top, size } = baseRect.current;
      const centerX = left + size / 2;
      const centerY = top + size / 2;
      let dx = touch.clientX - centerX;
      let dy = touch.clientY - centerY;
      const dist = Math.min(size / 2, Math.sqrt(dx * dx + dy * dy));
      const angle = Math.atan2(dy, dx);
      const knobX = Math.cos(angle) * dist;
      const knobY = Math.sin(angle) * dist;
      if (knobRef.current) {
        knobRef.current.style.transform = `translate(${knobX}px, ${knobY}px)`;
      }
      // Normalisasi ke -1..1
      const moveX = dx / (size / 2);
      const moveY = dy / (size / 2);
      onMove({ x: Math.max(-1, Math.min(1, moveX)), y: Math.max(-1, Math.min(1, -moveY)) });
    };
    const handleEnd = () => {
      active.current = false;
      if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
      onMove({ x: 0, y: 0 });
    };

    container.addEventListener('touchstart', handleStart);
    container.addEventListener('touchmove', handleMove);
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      container.removeEventListener('touchstart', handleStart);
      container.removeEventListener('touchmove', handleMove);
      container.removeEventListener('touchend', handleEnd);
      container.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [onMove]);

  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      bottom: 30,
      left: 30,
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      border: '2px solid rgba(255,255,255,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      touchAction: 'none',
      userSelect: 'none',
      zIndex: 1000,
    }}>
      <div ref={knobRef} style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'white',
        transition: 'transform 0.05s',
      }} />
    </div>
  );
                            }
