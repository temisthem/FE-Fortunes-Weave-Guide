export default {
  // Hover styles only apply on devices with a real pointer, so a tapped button
  // on a phone doesn't keep its hover colour and look different from the rest.
  future: { hoverOnlyWhenSupported: true },
  content: ['index.html', './src/**/*.{js,ts,svelte}'],
  theme: {
    extend: {
      screens: {
        xs: '550px',
        '2xs': '500px',
        '3xs': '400px',
      },
    },
  },
  plugins: [],
};
