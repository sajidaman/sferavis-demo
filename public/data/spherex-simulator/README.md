# SPHEREx simulator samples

## SPHEREx DR1 all-sky cube & resolution limits

The Atlas uses the official NASA/IPAC IRSA SPHEREx DR1 all-sky HiPS cube,
containing 102 verified spectral channels from 0.753 to 4.988 μm with full-sky
coverage (MOC sky fraction = 1.0).

- **Channel availability & 102 vs. 106 discrepancy**:
  The official IRSA DR1 HiPS cube metadata reports `hips_cube_depth=102` with 102
  distinct wavelengths in `data_cube_crval3_arr`. The SPHEREx focal plane has 6
  detector arrays (D1 to D6), each configured with 17 linear-variable filter
  channels in this release product ($6 \times 17 = 102$). Two frames in the
  sequence (Frame 50 / Band 3 Channel 17 at 2.345 μm and Frame 51 / Band 4
  Channel 1 at 2.399 μm) are documented blank dichroic channels where the beam
  splitter transitions between detectors. Other proposed/unreleased mission
  catalogs (such as prospective 106-channel QR versions) are not part of the
  official DR1 all-sky cube.
- **Native resolution & zoom behavior**:
  The DR1 all-sky cube is published at HiPS order 5 (`hips_order = 5`, 512×512
  pixel tiles), corresponding to a native pixel scale of ~0.00358° (~12.9 arcsec
  per pixel). This provides full all-sky coverage, but zooming into sub-arcminute
  scales hits the native resolution boundary of this cube. The Atlas preserves
  observation-derived data without AI interpolation or fake detail.
- **Progressive observed exposure detail**:
  At zooms of 0.4° or smaller, the Atlas can fetch a real DR1 spectral exposure
  cutout at 6.15 arcsec per detector pixel. This is one exposure, not a
  coadded mosaic; its pixels span a range of wavelengths across the detector
  and are not an exact single-channel cube slice.
- **Display color mapping**:
  The Atlas renders true pixel intensities in grayscale by default and offers a
  magma/purple-gold display mapping option. The purple coloring seen in
  presentations and papers is a false-color visualization mapping, not an
  intrinsic physical property of the infrared photons.
- **Separate reference surveys**:
  2MASS and DSS2 are kept as separate reference layers and are never blended or
  substituted for SPHEREx observations.

The DR1 all-sky cube is separate from the simulator outputs described in Crill
et al. (2025). The simulator FITS cutouts below are small single-exposure
examples, not part of that all-sky cube.

Source: [SPHEREx DR1 all-sky cube](https://doi.org/10.26131/IRSA679), served as
a [HiPS cube by IRSA](https://irsa.ipac.caltech.edu/data/hips/SPHEREx/spherex_allsky_cube).
Reference: [2MASS at IRSA](https://irsa.ipac.caltech.edu/Missions/2mass.html).

## Simulator cutouts

These two 256 × 256 pixel FITS cutouts are cropped from the public simulated
Level-2 exposures discussed in Crill et al. (2025). They preserve the spatial
celestial WCS (including its SIP distortion terms) and the original `MJy / sr`
pixel values:

- `high-latitude-cutout.fits` — from `level2_2025W17_2A_0089_4D1_simu_HighLat.fits`
- `galactic-plane-cutout.fits` — from `level2_2025W17_1A_0001_3D1_GalPlane.fits`

These are representative single-exposure image cutouts for testing FITS/WCS
rendering in Aladin Lite. They are **not** an all-sky map or a complete
102-channel SPHEREx data cube. The source paper describes the simulator and its
models; these example products do not reproduce the full simulated survey.

Sources:

- Crill et al. (2025), *The SPHEREx Sky Simulator: Science Data Modeling for the
  First All-sky Near-infrared Spectral Survey*,
  [doi:10.3847/1538-4365/ae04cc](https://doi.org/10.3847/1538-4365/ae04cc).
- NASA/IPAC Infrared Science Archive (IRSA),
  [SPHEREx archive](https://irsa.ipac.caltech.edu/).
