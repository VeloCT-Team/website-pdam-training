import { createSystem, defaultConfig } from '@chakra-ui/react';

const customConfig = {
  theme: {
    tokens: {
      colors: {
        brand: {
          gold: { value: '#B88E2F' },
          navy: { value: '#2A4D88' },
          gray: { value: '#D9D9D8' },
          lightGray: { value: '#B1BBC8' },
          paleGray: { value: '#D9D9D9' },
        },
      },
      fonts: {
        heading: { value: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` },
        body: { value: `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` },
      },
    },
  },
};

const system = createSystem(defaultConfig, customConfig);

export default system;
