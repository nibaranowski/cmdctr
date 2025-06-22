import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  GridIcon,
  SizeIcon,
  AngleIcon,
  PaddingIcon,
  BoxIcon,
  CheckIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';
import { clsx } from 'clsx';
import React, { useState, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

// Implementation Plan:
// 1.  State Management: Use `useState` for all interactive elements:
//     - `alignment`: For the top row of four toggle buttons.
//     - `width`, `height`: For the W and H number inputs.
//     - `widthMode`, `heightMode`: For the "Hug" toggles.
//     - `alignmentGrid`: For the 3x3 alignment matrix.
//     - `spacing`: For the primary spacing input.
//     - `horizontalPadding`, `verticalPadding`: For the padding inputs.
//     - `clipContent`: For the checkbox at the bottom.
// 2.  Component Structure:
//     - Main container with border, shadow, and padding.
//     - Title "Auto layout".
//     - A series of `div` rows for each group of controls.
//     - Utilize `flexbox` and `grid` for layout as per the screenshot.
// 3.  Styling with Tailwind CSS:
//     - Use `twMerge` and `clsx` for conditional and clean class names.
//     - Inactive elements will have a light gray background (`slate-100`).
//     - Active/selected elements will be white with a shadow or have a blue accent (`blue-500`), matching the screenshot.
//     - Inputs will be styled with consistent height, padding, and borders.
// 4.  Icons:
//     - Use icons from `@radix-ui/react-icons`, selecting the closest match for each control.
// 5.  Accessibility:
//     - Use `button` and `input` for native keyboard navigation.
//     - Add `aria-label` to all icon buttons and controls for screen readers.
//     - Use `role="radiogroup"` for the main alignment toggles to group them semantically.
//     - Ensure all interactive elements are focusable and operable via keyboard.

type Alignment = 'distribute' | 'vertical' | 'horizontal' | 'grid';
type AlignmentGrid = [number, number];

const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

const AutoLayoutPanel = () => {
  const [alignment, setAlignment] = useState<Alignment>('distribute');
  const [width, setWidth] = useState(80);
  const [height, setHeight] = useState(40);
  const [alignmentGrid, setAlignmentGrid] = useState<AlignmentGrid>([1, 1]);
  const [spacing, setSpacing] = useState(8);
  const [horizontalPadding, setHorizontalPadding] = useState(20);
  const [verticalPadding, setVerticalPadding] = useState(10);
  const [clipContent, setClipContent] = useState(true);

  const alignmentOptions = useMemo(
    () => [
      { id: 'distribute', label: 'Distribute', icon: GridIcon },
      { id: 'hash', label: 'Hashtag layout', icon: () => <span className="font-bold text-lg">#</span> },
      { id: 'align', label: 'Align', icon: MixerHorizontalIcon },
      { id: 'grid', label: 'Layout in a grid', icon: GridIcon },
    ],
    []
  );

  const handleAlignmentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = alignmentOptions.findIndex((opt) => opt.id === alignment);
    let nextIndex;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % alignmentOptions.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + alignmentOptions.length) % alignmentOptions.length;
    } else {
      return;
    }

    const nextOption = alignmentOptions[nextIndex];
    if (nextOption) {
      setAlignment(nextOption.id as Alignment);
    }
  };

  return (
    <div className="w-64 rounded-lg bg-white p-2 text-sm font-medium text-slate-800 shadow-md ring-1 ring-slate-900/5 space-y-2">
      <h2 className="px-2 py-1.5 text-sm font-semibold">Auto layout</h2>

      {/* Row 1: Alignment Toggles */}
      <div onKeyDown={handleAlignmentKeyDown} className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-md" role="radiogroup" aria-label="Layout alignment">
        {alignmentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setAlignment(option.id as Alignment)}
            className={cn(
              'flex h-7 w-full items-center justify-center rounded',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
              alignment === option.id
                ? 'bg-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200'
            )}
            aria-label={option.label}
            aria-checked={alignment === option.id}
            role="radio"
          >
            <option.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Row 2: Width and Height */}
      <div className="flex gap-2 px-1">
        <div className="flex items-center gap-1">
          <label htmlFor="width-input" className="text-xs text-slate-500">W</label>
          <input id="width-input" type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value, 10))} className="w-16 rounded border border-slate-200 bg-slate-100 py-1 px-2 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200">Hug</button>
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="height-input" className="text-xs text-slate-500">H</label>
          <input id="height-input" type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value, 10))} className="w-16 rounded border border-slate-200 bg-slate-100 py-1 px-2 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200">Hug</button>
        </div>
      </div>

      {/* Row 3 & 4: Alignment Matrix and Spacing */}
      <div className="grid grid-cols-2 gap-2 px-1 py-1.5">
          <div className="h-20 w-full rounded border border-slate-200 bg-slate-100 flex items-center justify-center">
            <div className="w-1/2 h-1/2 bg-white border border-dashed border-slate-400"></div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <SizeIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input type="number" value={spacing} onChange={(e) => setSpacing(parseInt(e.target.value, 10))} className="w-full rounded border border-slate-200 bg-slate-100 py-1 pl-7 pr-7 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Spacing" />
              <AngleIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            </div>
            <div className="relative">
              <BoxIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input type="number" value={verticalPadding} onChange={(e) => setVerticalPadding(parseInt(e.target.value, 10))} className="w-full rounded border border-slate-200 bg-slate-100 py-1 pl-7 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Vertical padding" />
            </div>
          </div>
      </div>

      {/* Row 5: Padding */}
      <div className="grid grid-cols-2 gap-2 px-1">
        <div className="relative">
          <PaddingIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input type="number" value={horizontalPadding} onChange={(e) => setHorizontalPadding(parseInt(e.target.value, 10))} className="w-full rounded border border-slate-200 bg-slate-100 py-1 pl-7 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Horizontal padding" />
        </div>
        <div className="relative">
          <BoxIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 -rotate-90" />
          <input type="number" value={verticalPadding} onChange={(e) => setVerticalPadding(parseInt(e.target.value, 10))} className="w-full rounded border border-slate-200 bg-slate-100 py-1 pl-7 text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" aria-label="Vertical padding" />
        </div>
      </div>

      {/* Bottom: Clip Content */}
      <div className="flex items-center gap-2 px-2 py-2">
        <input id="clip-content-checkbox" type="checkbox" checked={clipContent} onChange={() => setClipContent(!clipContent)} className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
        <label
          htmlFor="clip-content-checkbox"
          className="cursor-pointer select-none"
        >
          Clip content
        </label>
      </div>
    </div>
  );
};

export default AutoLayoutPanel; 