import "@testing-library/jest-dom/vitest"

global.matchMedia = global.matchMedia || function () {
    return {
      matches: false,
      addListener: vi.fn(),
      addEventListener: vi.fn(),
      removeListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  };