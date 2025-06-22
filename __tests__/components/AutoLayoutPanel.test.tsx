import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AutoLayoutPanel from '../../components/AutoLayoutPanel';

describe('AutoLayoutPanel', () => {
  // Test 1: Renders all new controls in the default state.
  test('renders all controls in their default state', () => {
    render(<AutoLayoutPanel />);

    // Check heading
    expect(screen.getByRole('heading', { name: /auto layout/i })).toBeInTheDocument();

    // Check default alignment toggle (distribute)
    expect(screen.getByRole('radio', { name: /distribute/i, checked: true })).toBeInTheDocument();

    // Check default input values
    expect(screen.getByLabelText('W')).toHaveValue(80);
    expect(screen.getByLabelText('H')).toHaveValue(40);
    expect(screen.getByLabelText(/spacing/i)).toHaveValue(8);
    expect(screen.getByLabelText(/horizontal padding/i)).toHaveValue(20);
    expect(screen.getByLabelText(/vertical padding/i, { selector: 'input' })).toHaveValue(10);

    // Check checkbox default state
    expect(screen.getByLabelText(/clip content/i)).toBeChecked();
  });

  // Test 2: Icon toggle works correctly.
  test('alignment icon toggle works correctly on click', () => {
    render(<AutoLayoutPanel />);
    const gridButton = screen.getByRole('radio', { name: /layout in a grid/i });
    
    expect(gridButton).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(gridButton);
    expect(gridButton).toHaveAttribute('aria-checked', 'true');
    
    const distributeButton = screen.getByRole('radio', { name: /distribute/i });
    expect(distributeButton).toHaveAttribute('aria-checked', 'false');
  });

  // Test 3: Inputs accept value changes.
  test('number inputs accept new values', () => {
    render(<AutoLayoutPanel />);
    const widthInput = screen.getByLabelText('W');
    
    fireEvent.change(widthInput, { target: { value: '100' } });
    expect(widthInput).toHaveValue(100);
  });

  // Test 4: Checkbox toggles state.
  test('checkbox toggles state on click', () => {
    render(<AutoLayoutPanel />);
    const checkbox = screen.getByLabelText(/clip content/i);
    
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // Test 5: Keyboard accessibility
  test('all controls are focusable and operable via keyboard', async () => {
    const user = userEvent.setup();
    render(<AutoLayoutPanel />);

    const firstToggleButton = screen.getByRole('radio', { name: /distribute/i });
    await user.keyboard('{Tab}'); // Focus heading
    
    firstToggleButton.focus();
    expect(firstToggleButton).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    const hashtagButton = screen.getByRole('radio', { name: /hashtag layout/i });
    expect(hashtagButton).toBeChecked();

    await user.keyboard('{Tab}');
    const widthInput = screen.getByLabelText('W');
    expect(widthInput).toHaveFocus();
  });
}); 