// Calculator module that imports math
import { add, multiply } from './math.js';

export function calculate(a, b, operation) {
  if (operation === 'add') {
    return add(a, b);
  } else if (operation === 'multiply') {
    return multiply(a, b);
  }
  return null;
}

// Global function to test calling from Elixir
globalThis.calculate = calculate;
