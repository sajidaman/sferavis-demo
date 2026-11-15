export interface ClassificationTutorialStep {
  title: string;
  body: string;
  details?: Array<{ label: string; value: string }>;
  note?: string;
}

export interface ClassificationTutorial {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  steps: ClassificationTutorialStep[];
}

/**
 * Reference criteria transcribed from the Sferavis tutorial notes supplied by
 * the project co-author. Values are presented as candidate-identification
 * heuristics, not as universal definitions or a substitute for source review.
 */
export const CLASSIFICATION_TUTORIALS: ClassificationTutorial[] = [
  {
    id: 'asteroids',
    title: 'Asteroids',
    eyebrow: 'Photometry & spectra',
    summary: 'Compare the candidate spectrum and multi-filter light curve with the asteroid reference criteria.',
    steps: [
      {
        title: 'Check the spectral coverage',
        body: 'The supplied notes give 0.3–4 μm as the asteroid comparison range. Check whether the candidate has spectral information in that range before applying the remaining criteria.',
        details: [{ label: 'Reference range in the notes', value: '0.3–4 μm' }],
      },
      {
        title: 'Compare the photometric signature',
        body: 'Use the referenced apparent-magnitude-versus-time graph to compare the candidate in each filter. The supplied ranges are approximate; use the reference graph itself when available.',
        details: [
          { label: 'I filter · burgundy diamonds', value: '16.9–17.4 mag' },
          { label: 'R filter · red squares', value: '17.35–17.7 mag' },
          { label: 'V filter · green circles', value: '17.8–18.2 mag' },
        ],
        note: 'If the spectrum or observed photometric signature is inconsistent with the reference, do not classify the object as an asteroid using this criterion; compare it with the other object-class tutorials.',
      },
    ],
  },
  {
    id: 'galaxies',
    title: 'Galaxies',
    eyebrow: 'Emission lines & colour',
    summary: 'Check the stated spectral range and line positions, then compare the brightness and colours with the supplied reference.',
    steps: [
      {
        title: 'Check spectral coverage and emission lines',
        body: 'The supplied notes give 0.9–2.5 μm as the galaxy comparison range. They identify H₂ and Br γ emission at the wavelengths below as an initial check.',
        details: [
          { label: 'Reference range in the notes', value: '0.9–2.5 μm' },
          { label: 'H₂ line', value: '2.122 μm' },
          { label: 'Br γ line', value: '2.166 μm' },
        ],
        note: 'The presence or absence of individual lines alone is not a definitive galaxy classification; verify line identification and redshift against the source data.',
      },
      {
        title: 'Compare surface brightness',
        body: 'Examine the object using the referenced graph. The notes suggest a surface-brightness range of 14.5 to 16 J as the comparison criterion.',
        details: [{ label: 'Surface-brightness range given', value: '14.5–16 J' }],
        note: 'The unit or band represented by “J” should be checked against the original graph or documentation.',
      },
      {
        title: 'Compare V−K and H−K colours',
        body: 'Once a galaxy is a plausible match, compare its colour indices with the supplied subtype reference values.',
        details: [
          { label: 'E', value: 'V−K 3.30 · H−K 0.21' },
          { label: 'S0', value: 'V−K 3.25 · H−K 0.22' },
          { label: 'Sa', value: 'V−K 3.24 · H−K 0.25' },
          { label: 'Sb', value: 'V−K 3.21 · H−K 0.25' },
          { label: 'Sc', value: 'V−K 3.03 · H−K 0.25' },
        ],
      },
    ],
  },
  {
    id: 'comets',
    title: 'Comets',
    eyebrow: 'Spectral features & light curves',
    summary: 'Look for the listed infrared emission features, then compare multi-band magnitudes with the reference light curve.',
    steps: [
      {
        title: 'Check spectral coverage and features',
        body: 'The supplied notes give 3–160 μm as the comet comparison range. They list these spectral features as additional evidence to inspect.',
        details: [
          { label: 'Reference range in the notes', value: '3–160 μm' },
          { label: '~3.4 μm', value: 'C–H emission band' },
          { label: '~10 μm', value: 'Broad Si–O emission band' },
          { label: '~20 μm', value: 'Si–O–Si emission band' },
        ],
        note: 'If the listed features are not present, the supplied notes say not to identify the object as a comet by this method.',
      },
      {
        title: 'Compare H(1, 1, α) multiband magnitudes',
        body: 'Compare the observed magnitudes over time with the reference graph. The intervals below are transcribed from the supplied notes.',
        details: [
          { label: 'SDSS g', value: '12.4–13 mag' },
          { label: 'SDSS i', value: '11.5–12.1 mag' },
          { label: 'SDSS r', value: '11.3–12.3 mag' },
          { label: 'SDSS zₛ', value: '11.5–12.0 mag' },
          { label: 'B band', value: '12.2–12.6 mag' },
          { label: 'V band', value: '11.3–11.7 mag' },
          { label: 'Additional band labelled B in source notes', value: '10.7–11.1 mag' },
        ],
        note: 'The last band is labelled “B-band” in the supplied notes, duplicating an earlier B-band entry. Confirm its intended filter against the original graph. If the light curve does not match the reference, this criterion does not support a comet classification.',
      },
    ],
  },
  {
    id: 'supernovas',
    title: 'Supernovas',
    eyebrow: 'Spectral features & photometry',
    summary: 'Check near-infrared coverage and the listed elemental or ion features, then compare photometric evolution with the reference graph.',
    steps: [
      {
        title: 'Check spectral coverage',
        body: 'The supplied notes give 0.8–2.5 μm as the supernova comparison range.',
        details: [{ label: 'Reference range in the notes', value: '0.8–2.5 μm' }],
      },
      {
        title: 'Look for characteristic spectral features',
        body: 'The notes list the following features. Their absence makes a supernova identification less likely under this criterion.',
        details: [
          { label: 'Mg II', value: '0.922–0.924 μm' },
          { label: 'Mg II (overlapped by Co II)', value: '1.091–1.095 μm' },
          { label: 'Ca II', value: '0.850–0.866 μm' },
          { label: 'Si II / Mg II (possible blending)', value: '1.676–1.691 μm' },
          { label: 'Fe-group', value: '1.50–1.90 μm' },
        ],
      },
      {
        title: 'Compare the photometric evolution',
        body: 'Examine the observed supernova photometry against the reference graph. The graph and numerical values were not included in the supplied text, so this comparison needs the original figure.',
        note: 'A spectrum and light curve should be interpreted with the supernova subtype, phase, and redshift in mind.',
      },
    ],
  },
  {
    id: 'brown-dwarfs',
    title: 'Brown dwarfs',
    eyebrow: 'Molecular bands & variability',
    summary: 'Check near-infrared molecular absorption, compare physical and colour parameters, and use photometry to assess a possible subtype.',
    steps: [
      {
        title: 'Confirm near-infrared coverage',
        body: 'The supplied notes specify observations covering 1.13–2.33 μm. The candidate needs adequate coverage in this region for a useful comparison.',
        details: [{ label: 'Observation range in the notes', value: '1.13–2.33 μm' }],
      },
      {
        title: 'Inspect molecular absorption features',
        body: 'Look for the molecular features listed in the notes. Their presence can support—but does not by itself establish—a brown-dwarf identification.',
        details: [
          { label: 'FeH band position', value: '1.19 μm' },
          { label: 'CO band position', value: '2.295 μm' },
          { label: 'Initial CH₄ signatures in K band', value: '2.20 μm' },
          { label: 'CH₄ appearance in H band', value: '1.667 μm' },
        ],
        note: 'The supplied text wrote “1,667 μm”; this is shown as 1.667 μm because it is within the stated near-infrared coverage. Verify the intended value with the source documentation.',
      },
      {
        title: 'Compare physical and colour parameters',
        body: 'Use these reference parameters alongside the spectral evidence. The J−H colour index provides an additional compatibility check.',
        details: [
          { label: 'Mean temperature', value: '1500 K' },
          { label: 'Model metallicity', value: 'Solar' },
          { label: 'J−H colour', value: '1.32' },
        ],
      },
      {
        title: 'Assess variability and compare subtype magnitudes',
        body: 'Compare the variability with the supplied graph. The notes say a mean range of 1 over time supports the final classification; confirm the unit and timescale on the original graph. Then compare J, H, and K magnitudes with the reference table.',
        details: [
          { label: 'L5 · J / H / K', value: '12.82 / 11.89 / 11.30 mag' },
          { label: 'L7 · J / H / K', value: '14.55 / 13.59 / 12.99 mag' },
          { label: 'L8 · J / H / K', value: '16.32 / 15.00 / 14.24 mag' },
          { label: 'T1 · J / H / K', value: '16.90 / 16.21 / 15.98 mag' },
          { label: 'T6 · J / H / K', value: '15.80 / 15.64 / 15.83 mag' },
        ],
      },
    ],
  },
  {
    id: 'quasars',
    title: 'Quasars',
    eyebrow: 'Spectral coverage & normalized flux',
    summary: 'Check the instrument spectral range and compare normalized-flux variation with the reference photometric signature.',
    steps: [
      {
        title: 'Check spectral coverage',
        body: 'The supplied notes list separate coverage for the SXD and LXD settings.',
        details: [
          { label: 'SXD', value: '0.8–2.5 μm' },
          { label: 'LXD', value: '1.9–4.1 μm' },
        ],
      },
      {
        title: 'Compare the normalized-flux signature',
        body: 'Compare the candidate’s normalized-flux graph with the supplied quasar reference graph. The notes give an approximate range of 0.12.',
        details: [{ label: 'Approximate normalized-flux range in the notes', value: '0.12' }],
        note: 'The original graph was not included in the supplied text. Confirm how “range” is measured and use the graph before drawing a classification conclusion.',
      },
    ],
  },
];
