export interface SpherexChannel {
  frame: number;
  band: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
  channel: number;
  wavelength: number;
  isBlank: boolean;
}

export const SPHEREX_BANDS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] as const;
export type SpherexBand = (typeof SPHEREX_BANDS)[number];

export const SPHEREX_BAND_DESCRIPTIONS: Record<SpherexBand, { range: string; desc: string }> = {
  D1: { range: '0.753 – 1.102 μm', desc: 'Near-IR / optical transition (17 channels)' },
  D2: { range: '1.113 – 1.631 μm', desc: 'Near-IR J/H band equivalent (17 channels)' },
  D3: { range: '1.656 – 2.399 μm', desc: 'Near-IR H/K band equivalent (17 channels; channel 17 is dichroic blank)' },
  D4: { range: '2.445 – 3.768 μm', desc: 'Mid-IR water-ice band (17 channels; channel 1 is dichroic blank)' },
  D5: { range: '3.833 – 4.405 μm', desc: 'Mid-IR CO2 absorption region (17 channels)' },
  D6: { range: '4.435 – 4.988 μm', desc: 'Mid-IR long wavelength boundary (17 channels)' },
};

const RAW_CRVAL3: number[] = [
  0.753, 0.771, 0.790, 0.809, 0.828, 0.848, 0.868, 0.889, 0.910, 0.932, 0.955, 0.978, 1.001, 1.025, 1.050, 1.075, 1.102,
  1.113, 1.139, 1.167, 1.195, 1.224, 1.254, 1.284, 1.315, 1.346, 1.378, 1.412, 1.446, 1.481, 1.517, 1.554, 1.592, 1.631,
  1.656, 1.695, 1.735, 1.775, 1.818, 1.861, 1.905, 1.949, 1.995, 2.041, 2.089, 2.139, 2.189, 2.240, 2.292, 2.345, 2.399,
  2.445, 2.506, 2.575, 2.646, 2.719, 2.794, 2.871, 2.951, 3.033, 3.118, 3.204, 3.293, 3.383, 3.476, 3.570, 3.667, 3.768,
  3.833, 3.867, 3.901, 3.935, 3.970, 4.005, 4.040, 4.076, 4.112, 4.148, 4.184, 4.220, 4.257, 4.294, 4.331, 4.368, 4.405,
  4.435, 4.467, 4.500, 4.533, 4.566, 4.600, 4.635, 4.669, 4.704, 4.739, 4.773, 4.808, 4.843, 4.879, 4.915, 4.951, 4.988,
];

export const SPHEREX_CHANNELS: readonly SpherexChannel[] = RAW_CRVAL3.map((wavelength, index) => {
  const frame = index + 1;
  const bandIndex = Math.floor(index / 17);
  const band = SPHEREX_BANDS[bandIndex];
  const channel = (index % 17) + 1;
  const isBlank = frame === 50 || frame === 51;

  return { frame, band, channel, wavelength, isBlank };
});
