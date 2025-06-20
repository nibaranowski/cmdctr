import React from 'react';

import UIButton from './ui/Button';
import type { ButtonProps as UIButtonProps } from './ui/Button';

// Re-export the new UI Button for backward compatibility
export default UIButton;
export type ButtonProps = UIButtonProps; 