# SPHEREx simulator samples

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
