# SPHEREx simulator samples

## Low-resolution all-sky view

The Atlas uses the public SPHEREx DR1 all-sky HiPS cube, containing 102
spectral channels from 0.753 to 4.988 μm with full-sky coverage. Its channel
slider exposes every frame; frames 50 and 51 are blank dichroic channels. The
HiPS product has a maximum order of 5 (512-pixel tiles), providing a
low-resolution all-sky view. At zooms of 0.4° or smaller, the Atlas can fetch
a real DR1 spectral exposure cutout at 6.15 arcsec per detector pixel. This is
one exposure, not a coadded mosaic; its pixels span a range of wavelengths
across the detector and are not an exact single-channel cube slice. Both
products are observed SPHEREx data, not data from the simulator paper. The
2MASS reference is available separately in the Atlas; it is not blended into
SPHEREx data.

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
