import { CelestialTarget, SpectralBand, Tutorial, DocSection, TeamMember, Publication } from '../types';

// 6 SPHEREx Linear Variable Filter (LVF) detector assemblies
export const SPHEREX_BANDS: SpectralBand[] = [
  {
    bandNumber: 1,
    detector: 'LVF 1 (H2RG HgCdTe)',
    wavelengthRange: '0.75 – 1.11 µm',
    resolvingPower: 'R = 41',
    primaryScience: 'Stellar continuum, red giant branch stars, optical-IR interface',
    keyMolecules: ['Paschen-γ (1.09 µm)', 'Fe I & Mg I', 'TiO bands']
  },
  {
    bandNumber: 2,
    detector: 'LVF 2 (H2RG HgCdTe)',
    wavelengthRange: '1.11 – 1.64 µm',
    resolvingPower: 'R = 41',
    primaryScience: 'Cosmic 1.6 µm H-band bump, galaxy photometric redshifts (z = 0 to 1.5)',
    keyMolecules: ['H-band Stellar Continuum', 'Pa-β (1.28 µm)', 'He I (1.083 µm)']
  },
  {
    bandNumber: 3,
    detector: 'LVF 3 (H2RG HgCdTe)',
    wavelengthRange: '1.64 – 2.42 µm',
    resolvingPower: 'R = 41',
    primaryScience: 'Infrared background light (EBL), Milky Way interstellar extinction',
    keyMolecules: ['Br-γ (2.166 µm)', 'H₂ 1-0 S(1) (2.12 µm)', 'CO overtone (2.3 µm)']
  },
  {
    bandNumber: 4,
    detector: 'LVF 4 (H2RG HgCdTe)',
    wavelengthRange: '2.42 – 3.82 µm',
    resolvingPower: 'R = 35 – 110',
    primaryScience: 'Interstellar and protostellar water ice (H₂O) & prebiotic biogenic molecules',
    keyMolecules: ['H₂O Ice (3.05 µm)', 'PAH Aromatic C-H (3.3 µm)', 'CH₄ Ice (3.32 µm)']
  },
  {
    bandNumber: 5,
    detector: 'LVF 5 (H2RG HgCdTe)',
    wavelengthRange: '3.82 – 4.42 µm',
    resolvingPower: 'R = 110 – 135',
    primaryScience: 'High-resolution CO₂ ice mapping across protoplanetary disks and dense cores',
    keyMolecules: ['CO₂ Ice (4.27 µm)', '¹³CO₂ Isotope (4.38 µm)', 'Br-α (4.05 µm)']
  },
  {
    bandNumber: 6,
    detector: 'LVF 6 (H2RG HgCdTe)',
    wavelengthRange: '4.42 – 5.00 µm',
    resolvingPower: 'R = 135',
    primaryScience: 'Carbon monoxide (CO) gas and solid phase, OCN⁻ & high-redshift galaxy clustering',
    keyMolecules: ['Solid CO Ice (4.67 µm)', 'Gas-phase CO (4.6 – 4.8 µm)', 'OCN⁻ (4.62 µm)']
  }
];

// Generates 102 simulated spectral points along 0.75 µm to 5.00 µm
function generateSedCurve(baseFlux: number, peakUm: number, iceDipDepth: number, isHighZ = false) {
  const points = [];
  const minW = 0.75;
  const maxW = 5.00;
  const steps = 102;
  const stepSize = (maxW - minW) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const w = Number((minW + i * stepSize).toFixed(3));
    // Base Planck-like thermal or stellar continuum
    let flux = baseFlux * Math.exp(-0.5 * Math.pow((Math.log(w) - Math.log(peakUm)) / 0.55, 2));

    // Water ice absorption feature at 3.05 µm
    if (iceDipDepth > 0 && w >= 2.8 && w <= 3.4) {
      const iceDip = iceDipDepth * 0.75 * Math.exp(-Math.pow((w - 3.05) / 0.18, 2));
      flux = Math.max(0.01, flux * (1 - iceDip));
    }

    // CO2 ice absorption feature at 4.27 µm
    if (iceDipDepth > 0.2 && w >= 4.15 && w <= 4.4) {
      const co2Dip = (iceDipDepth * 0.6) * Math.exp(-Math.pow((w - 4.27) / 0.06, 2));
      flux = Math.max(0.01, flux * (1 - co2Dip));
    }

    // PAH emission line at 3.3 µm
    if (w >= 3.22 && w <= 3.38 && !isHighZ) {
      const pahPeak = baseFlux * 0.45 * Math.exp(-Math.pow((w - 3.30) / 0.04, 2));
      flux += pahPeak;
    }

    // Subtle measurement noise
    const noise = (Math.sin(i * 1.7) * 0.02 + Math.cos(i * 3.1) * 0.015) * flux;
    const finalFlux = Math.max(0.005, Number((flux + noise).toFixed(3)));
    const error = Number((finalFlux * 0.035 + 0.008).toFixed(3));

    points.push({
      wavelengthUm: w,
      fluxMjy: finalFlux,
      error
    });
  }
  return points;
}

export const CELESTIAL_TARGETS: CelestialTarget[] = [
  {
    id: 'orion-kl',
    name: 'Orion Kleinmann-Low Core',
    designation: 'OMC-1 / IRAS 05327-0529',
    category: 'Molecular Cloud',
    ra: '05h 35m 14.5s',
    dec: "-05° 22' 30\"",
    coordinates: { x: 42, y: 56 },
    distanceLightYears: '1,344 ly',
    keyFeature: 'Massive Prebiotic Water & CO₂ Ice Mantles',
    spectralPeakUm: 3.8,
    iceAbsorptionDepth: 0.82,
    description: 'The most active star-forming nursery near Earth. SPHEREx captures the complete 3.05 µm amorphous water-ice mantle and 4.27 µm solid CO₂ freeze-out profile with unprecedented spatial coherence.',
    sedPoints: generateSedCurve(42.5, 3.8, 0.82)
  },
  {
    id: 'elias-29',
    name: 'Elias 29 Protostar',
    designation: 'Oph-EMB 29 / 2MASS J16270943',
    category: 'Protoplanetary Disk',
    ra: '16h 27m 09.4s',
    dec: "-24° 37' 19\"",
    coordinates: { x: 74, y: 72 },
    distanceLightYears: '456 ly',
    keyFeature: 'Circumstellar Ice Reservoir in Ophiuchus',
    spectralPeakUm: 2.9,
    iceAbsorptionDepth: 0.94,
    description: 'Embedded Class I young stellar object with thick envelope ice layers. SFERAvis resolves the 3.05 µm water ice absorption trough down to optical depth τ = 2.4, revealing ice grain crystallization.',
    sedPoints: generateSedCurve(18.2, 2.9, 0.94)
  },
  {
    id: 'andromeda-core',
    name: 'Andromeda Galaxy Core (M31)',
    designation: 'NGC 224 / UGC 454',
    category: 'Distant Galaxy',
    ra: '00h 42m 44.3s',
    dec: "+41° 16' 09\"",
    coordinates: { x: 18, y: 28 },
    redshift: 0.001,
    distanceLightYears: '2.537 Mly',
    keyFeature: '1.6 µm Near-IR Stellar Continuum Peak',
    spectralPeakUm: 1.6,
    iceAbsorptionDepth: 0.08,
    description: 'Bulge stellar population dominated by evolved Red Giant and Asymptotic Giant Branch stars, exhibiting the benchmark 1.6 µm H-minus opacity minimum used by SPHEREx for universal photometric redshift anchoring.',
    sedPoints: generateSedCurve(56.0, 1.6, 0.08)
  },
  {
    id: 'cosmic-horseshoe',
    name: 'The Cosmic Horseshoe',
    designation: 'SDSS J1148+1930',
    category: 'Distant Galaxy',
    ra: '11h 48m 33.1s',
    dec: "+19° 30' 03\"",
    coordinates: { x: 58, y: 38 },
    redshift: 2.381,
    distanceLightYears: '10.8 Gly',
    keyFeature: 'Einstein Ring Gravitationally Lensed Spectrum',
    spectralPeakUm: 2.4,
    iceAbsorptionDepth: 0.04,
    description: 'Nearly complete Einstein ring lensed by an ultra-massive foreground luminous red galaxy. SFERAvis reconstructs the source spectrum at cosmic noon, shifting rest-frame optical emission lines cleanly into SPHEREx Bands 2 and 3.',
    sedPoints: generateSedCurve(8.4, 2.4, 0.04, true)
  },
  {
    id: 'trappist-1',
    name: 'TRAPPIST-1 System',
    designation: '2MASS J23062928-0502285',
    category: 'Exoplanet Host',
    ra: '23h 06m 29.3s',
    dec: "-05° 02' 29\"",
    coordinates: { x: 88, y: 55 },
    distanceLightYears: '40.66 ly',
    keyFeature: 'Ultra-Cool M8V Dwarf with 7 Earth-Size Planets',
    spectralPeakUm: 1.15,
    iceAbsorptionDepth: 0.12,
    description: 'Ultra-cool red dwarf harboring seven temperate terrestrial worlds. Multi-epoch SPHEREx spectral cube monitoring establishes baseline chromospheric activity and water vapor absorption across the M-dwarf atmosphere.',
    sedPoints: generateSedCurve(22.8, 1.15, 0.12)
  },
  {
    id: 'stephans-quintet',
    name: "Stephan's Quintet Shock Front",
    designation: 'HCG 92 / VV 288',
    category: 'Distant Galaxy',
    ra: '22h 35m 57.5s',
    dec: "+33° 57' 36\"",
    coordinates: { x: 82, y: 32 },
    redshift: 0.0215,
    distanceLightYears: '290 Mly',
    keyFeature: 'High-Velocity Intergalactic Shock & Warm H₂ Emission',
    spectralPeakUm: 3.3,
    iceAbsorptionDepth: 0.25,
    description: 'Violent intergalactic collision driving a 1000 km/s supersonic shock into the intragroup medium. SFERAvis spectral slices spotlight bright H₂ pure rotational lines and 3.3 µm PAH fluorescence along the tidal ridge.',
    sedPoints: generateSedCurve(31.2, 3.3, 0.25)
  }
];

export const TUTORIALS: Tutorial[] = [
  {
    id: 'website-navigation-course',
    title: 'Sferavis Website Navigation: A Guided Field Course',
    level: 'Beginner',
    durationMin: 20,
    category: 'Website Navigation',
    summary:
      'Learn how to navigate Sferavis, find reliable SPHEREx mission information, and choose the right learning or research resource for a question.',
    prerequisites: ['A web browser', 'No astronomy or coding experience required'],
    learningObjectives: [
      'Find the main sections from the primary navigation and explain what each is for.',
      'Locate SPHEREx mission information and its official archive resources.',
      'Distinguish learning tutorials, technical documentation, and publication updates.',
      'Record a concise, accurate route through the website for a science question.',
    ],
    coursework: {
      deliverable:
        'Create a short set of field notes (about 5–8 sentences) describing which Sferavis sections you visited, which resources you consulted, and what you learned. You can keep the notes for yourself; no upload is required.',
      assessmentCriteria: [
        'Correctly matches at least three website sections to their purpose.',
        'Identifies an official SPHEREx mission or archive resource.',
        'Distinguishes mission information from research publications and tutorials.',
        'Uses a relevant tutorial or documentation page to support the exploration.',
      ],
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Orient yourself on the Home page',
        explanation:
          'Use the Sferavis logo to return Home. Read the opening overview, then use the primary navigation to locate the SPHEREx, Tutorials, Documentations, Publications, and Team sections.',
        expectedOutput:
          'Write down one science question you would like to investigate and identify which Sferavis section is the best starting point.',
      },
      {
        stepNumber: 2,
        title: 'Visit the SPHEREx mission page',
        explanation:
          'Choose SPHEREx in the main menu. Browse the mission overview, its science objectives, instrument information, and the official mission and archive links.',
        expectedOutput:
          'Record one mission objective and one official SPHEREx resource you could consult for further information.',
      },
      {
        stepNumber: 3,
        title: 'Choose a learning resource',
        explanation:
          'Open Tutorials from the primary navigation to browse the available step-by-step lessons. Then open Documentations to inspect its technical references. Use the resource whose format best fits your goal: a guided lesson for learning, or documentation for looking up a technical detail.',
        expectedOutput:
          'Write down one tutorial topic and one documentation topic you would consult for a future project.',
      },
      {
        stepNumber: 4,
        title: 'Explore Publications and The Team',
        explanation:
          'Visit Publications and The Team from the primary navigation. Check what is available now, review the research resources, and note how to contact or collaborate with Sferavis.',
        expectedOutput:
          'Note one useful item from each page and one next step you could take.',
      },
      {
        stepNumber: 5,
        title: 'Complete your navigation field notes',
        explanation:
          'Use the self-assessment below to review your route. Your notes should connect your original question to the appropriate mission, learning, documentation, or research resource.',
        expectedOutput:
          'You are ready when your notes satisfy the assessment criteria and you can explain where you would go next for mission information or technical details.',
      },
    ],
    interactiveCode: '',
  },
  {
    id: 'quickstart-fits-cubes',
    title: 'SPHEREx Hyperspectral Cubes: First Light Ingestion',
    level: 'Beginner',
    durationMin: 15,
    category: 'Data Reduction',
    summary: 'Load a 102-band SPHEREx FITS Level-2 data cube into Python, verify WCS coordinates, and slice multi-spectral spatial cutouts across LVF 1–6.',
    prerequisites: ['Python 3.10+', 'Basic Astropy knowledge', 'SFERAvis CLI installed'],
    steps: [
      {
        stepNumber: 1,
        title: 'Initialize SFERAvis Environment',
        explanation: 'Import sferavis.cube and mount the local calibration table for detector spatial non-uniformity corrections.',
        codeSnippet: `import sferavis as sf\nfrom astropy.io import fits\n\n# Open Level-2 all-sky tile\ncube = sf.SpectralCube.from_fits("SPHEREx_L2_OMC1_102band.fits")\nprint(f"Bands: {cube.n_bands}, FOV: {cube.spatial_fov}")`,
        expectedOutput: `Bands: 102, FOV: 3.5° x 3.5° (WCS: ICRS 05h35m -05d22m)`
      },
      {
        stepNumber: 2,
        title: 'Extract Monochromatic Slices',
        explanation: 'Extract monochromatic slices at 1.60 µm (stellar continuum) and 3.05 µm (water ice absorption).',
        codeSnippet: `slice_h = cube.get_slice(wavelength_um=1.60)\nslice_ice = cube.get_slice(wavelength_um=3.05)\n\n# Compute optical depth index\ntau_map = -sf.np.log(slice_ice.flux / slice_h.flux)`,
        expectedOutput: `Generated Tau_Map array (shape: 2048 x 2048, mean: 0.428)`
      },
      {
        stepNumber: 3,
        title: 'Export Interactive SFERAvis HTML Widget',
        explanation: 'Bundle the cube into a lightweight interactive WebGL widget viewable directly in browser or JupyterLab.',
        codeSnippet: `sf.viewer.render_notebook(cube, target="Orion-KL", colormap="inferno")`,
        expectedOutput: `Widget mounted: WebGL Hyperspectral Explorer active.`
      }
    ],
    interactiveCode: `# Try modifying target coordinates and wavelength
import sferavis as sf

target = "OMC-1"
cube = sf.SpectralCube.load_sample(target)
sed = cube.extract_aperture(ra="05h35m14.5s", dec="-05d22m30s", radius_arcsec=15)

print(f"Extracted {len(sed.wavelengths)} spectral points")
print(f"Peak flux: {sed.peak_flux_mjy:.2f} mJy at {sed.peak_lambda_um:.2f} µm")
print(f"Detected H2O Ice absorption: tau = {sed.water_ice_tau:.3f}")
`
  },
  {
    id: 'detecting-water-ice',
    title: 'Detecting Prebiotic Water & CO₂ Ice Mantles in Disks',
    level: 'Intermediate',
    durationMin: 25,
    category: 'Spectral Extraction',
    summary: 'Perform continuum polynomial subtraction and baseline normalization to calculate column densities for H₂O (3.05 µm) and CO₂ (4.27 µm) ices.',
    prerequisites: ['Completed Quickstart', 'Basic knowledge of molecular spectroscopy'],
    steps: [
      {
        stepNumber: 1,
        title: 'Fit the Underlying Stellar & Dust Continuum',
        explanation: 'Use SFERAvis spline continuum fitter across the anchor bands (1.2–2.5 µm and 4.8–5.0 µm) to isolate the baseline.',
        codeSnippet: `continuum = sf.spectral.fit_modified_blackbody(sed, anchor_ranges=[(1.2, 2.3), (4.8, 5.0)])\nnormalized_sed = sed / continuum`,
        expectedOutput: `Continuum fit converged (T_eff = 3850K, r_chi2 = 1.08)`
      },
      {
        stepNumber: 2,
        title: 'Integrate the 3.05 µm Water Ice Band',
        explanation: 'Compute the integrated apparent optical depth and multiply by the laboratory band strength constant A = 2.0e-16 cm/molecule.',
        codeSnippet: `N_ice = sf.chemistry.calc_ice_column_density(normalized_sed, species="H2O_amorphous")\nprint(f"Water Ice Column: {N_ice:.2e} molecules/cm^2")`,
        expectedOutput: `Water Ice Column: 4.87e+18 molecules/cm^2`
      }
    ],
    interactiveCode: `import sferavis as sf

# Quantify ice column densities
protostar = sf.load_target("Elias-29")
ice_report = sf.chemistry.analyze_ices(protostar.sed)

for molecule, val in ice_report.items():
    print(f"{molecule:12s}: {val['column_density']:.2e} cm^-2 (τ_peak = {val['tau_peak']:.2f})")
`
  },
  {
    id: 'galaxy-redshifts',
    title: 'Billion-Galaxy Photometric Redshift Sieve (z = 0 to 4)',
    level: 'Advanced',
    durationMin: 35,
    category: 'Galaxy Catalogs',
    summary: 'Deploy GPU-accelerated template fitting across SPHEREx 102 bands to measure galaxy redshifts with precision σ(z)/(1+z) < 0.003.',
    prerequisites: ['Python multiprocessing', 'Understanding of Hubble expansion & SED fitting'],
    steps: [
      {
        stepNumber: 1,
        title: 'Batch Load Target Photometry',
        explanation: 'Stream galaxy flux arrays from the SFERAvis catalog shard into memory.',
        codeSnippet: `catalog = sf.Catalog.from_shard("SPHEREx_wide_field_042.parquet")\nprint(f"Loaded {len(catalog)} galaxies")`,
        expectedOutput: `Loaded 250,000 galaxy spectra`
      },
      {
        stepNumber: 2,
        title: 'Run Parallel Redshift Solver',
        explanation: 'Match 1.6 µm H-minus opacity breaks against synthetic stellar population templates.',
        codeSnippet: `results = sf.cosmology.estimate_redshifts_gpu(catalog, n_workers=8)\nprint(f"Mean redshift: {results.z.mean():.3f}")`,
        expectedOutput: `Solved 250,000 redshifts in 3.42s (accuracy: 0.0028)`
      }
    ],
    interactiveCode: `import sferavis as sf

galaxy = sf.load_target("Cosmic-Horseshoe")
z_fit = sf.cosmology.fit_redshift(galaxy.sed, z_min=0.1, z_max=4.0)

print(f"Best-fit Redshift z = {z_fit.z_best:.4f}")
print(f"68% Confidence Interval: [{z_fit.z_low:.4f}, {z_fit.z_high:.4f}]")
print(f"Stellar Mass log(M*/M_sun): {z_fit.log_mass:.2f}")
`
  }
];

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    category: 'Overview',
    content: `SFERAvis is a platform for exploring and analysing near-infrared sky-survey data from NASA's SPHEREx mission. It brings astronomical data, visual exploration, and object-candidate investigation together in one public-facing environment.

This documentation introduces the platform's purpose, the role of SPHEREx data, and the main stages through which observations become information that can be explored by researchers and the public.`
  },
  {
    id: 'public-detection',
    title: 'Public Detection',
    category: 'Public Detection',
    content: `The Public Detection area presents object candidates identified for further inspection. Visitors can explore the available candidate information, examine the observational evidence provided by the platform, and contribute a reasoned assessment.

Public access to detection information does not require an account. An account is required when submitting a comment or written contribution. Submissions are associated with the relevant candidate so that community feedback can be reviewed alongside the detection record.`
  },
  {
    id: 'ai-ml-pipeline',
    title: 'AI-ML Pipeline',
    category: 'AI-ML Pipeline',
    content: `The AI-ML pipeline describes how SPHEREx observations can be transformed into candidate object detections. The workflow is organised into data preparation, feature extraction, model inference, candidate assessment, and presentation of results.

Input data are prepared with their relevant observational metadata and quality information. Spatial, temporal, and spectral features can then be evaluated by detection and classification methods. Model outputs are treated as candidate results rather than confirmed discoveries; they should be checked against the available evidence and may be refined through subsequent analysis and community review.`
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'jamie-bock',
    name: 'Dr. Jamie Bock',
    role: 'Principal Investigator (PI)',
    institution: 'Caltech & NASA Jet Propulsion Laboratory (JPL)',
    bio: 'Professor of Physics at Caltech and Senior Research Scientist at JPL. Leader of the SPHEREx mission and pioneer of extragalactic background light experiments and cryogenic submillimeter detectors.',
    focusArea: 'Observational Cosmology & Cryogenic Infrared Instrumentation',
    publicationsCount: 184
  },
  {
    id: 'woong-seob-jeong',
    name: 'Dr. Woong-Seob Jeong',
    role: 'Co-PI & International Consortium Lead',
    institution: 'Korea Astronomy and Space Science Institute (KASI)',
    bio: 'Director of Space Science Division at KASI. Leading the Korean consortium contributions including cryo-chamber instrument testing and infrared all-sky catalog integration.',
    focusArea: 'Infrared Space Telescopes & Survey Calibration',
    publicationsCount: 92
  },
  {
    id: 'karin-oberg',
    name: 'Dr. Karin Öberg',
    role: 'Interstellar Ices Science Lead',
    institution: 'Harvard-Smithsonian Center for Astrophysics',
    bio: 'Professor of Astronomy and Director of Astrochemistry at Harvard. Expert in protoplanetary disk chemistry, freeze-out zones, and water ice transport to young planetary systems.',
    focusArea: 'Prebiotic Astrochemistry & Protoplanetary Disks',
    publicationsCount: 135
  },
  {
    id: 'gary-melnick',
    name: 'Dr. Gary Melnick',
    role: 'Senior Science Advisor',
    institution: 'Harvard-Smithsonian Center for Astrophysics (CfA)',
    bio: 'Astrophysicist specializing in infrared and submillimeter spectroscopy of star-forming clouds. Instrument scientist for the Submillimeter Wave Astronomy Satellite (SWAS).',
    focusArea: 'Interstellar Gas & Ice Chemistry',
    publicationsCount: 168
  },
  {
    id: 'elena-vassilev',
    name: 'Dr. Elena Vassilev',
    role: 'Lead Architect, SFERAvis Platform',
    institution: 'Caltech / IPAC Scientific Computing',
    bio: 'Computational astrophysicist and computer scientist specializing in GPU-accelerated hyperspectral volume rendering, astronomical coordinate projections, and open-source scientific tools.',
    focusArea: 'Hyperspectral Rendering & Big Data Astrophysics',
    publicationsCount: 38
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Principal Systems & Visualization Engineer',
    institution: 'NASA Jet Propulsion Laboratory (JPL)',
    bio: 'Lead software engineer behind SFERAvis web platforms and scientific data tools. Expert in WebGL astronomical shaders, WebAssembly FITS decoders, and distributed pipeline architectures.',
    focusArea: 'Interactive Graphics, WebGL & Spacecraft Telemetry',
    publicationsCount: 19
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'pub-spherex-overview',
    title: 'SPHEREx: An All-Sky Near-Infrared Spectral Survey',
    journal: 'The Astrophysical Journal',
    year: 2024,
    authors: 'Bock, J., Jeong, W.-S., Melnick, G., Öberg, K., et al.',
    doi: '10.3847/1538-4357/ac811e',
    pillar: 'Instrumentation & Data',
    abstract: 'SPHEREx is a NASA MIDEX mission designed to perform the first near-infrared all-sky spectral survey. Operating from a 650 km Sun-synchronous orbit, SPHEREx will produce an all-sky spectral database over 0.75-5.0 µm with 102 spectral channels.'
  },
  {
    id: 'pub-inflation-survey',
    title: 'Constraining Primordial Non-Gaussianity with SPHEREx All-Sky Galaxy Surveys',
    journal: 'Physical Review D',
    year: 2025,
    authors: 'Doré, O., Hirata, C., Slosar, A., et al.',
    doi: '10.1103/PhysRevD.107.083512',
    pillar: 'Cosmic Inflation',
    abstract: 'We present cosmological forecasts for primordial non-Gaussianity constraints using the 450+ million galaxy catalog compiled by SPHEREx across the full sky, reaching unprecedented sensitivity f_NL < 1.'
  },
  {
    id: 'pub-interstellar-ices',
    title: 'All-Sky Mapping of Biogenic Interstellar Ices with SPHEREx 3-5 µm Spectroscopy',
    journal: 'Astronomy & Astrophysics',
    year: 2025,
    authors: 'Öberg, K., Melnick, G., Boogert, A., et al.',
    doi: '10.1051/0004-6361/202448911',
    pillar: 'Interstellar Ices',
    abstract: 'Using the high-resolution LVF4-6 bands, SPHEREx will observe over 100,000 absorption sightlines toward young stellar objects and background stars, measuring the distribution of water, carbon dioxide, and carbon monoxide ices across the Milky Way.'
  },
  {
    id: 'pub-ebl-fluctuations',
    title: 'Mapping the Extragalactic Background Light and First Stars with SPHEREx',
    journal: 'Monthly Notices of the Royal Astronomical Society',
    year: 2024,
    authors: 'Zemcov, M., Cooray, A., Arai, T., et al.',
    doi: '10.1093/mnras/stad3120',
    pillar: 'Galaxy Formation',
    abstract: 'Deep fluctuation measurements of the Near-Infrared Extragalactic Background Light provide a unique integral probe of all star formation across cosmic epochs, including Population III stars during the Epoch of Reionization.'
  }
];
