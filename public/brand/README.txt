Official accreditation logos
============================

The ICAEW, ACCA and AAT marks shown on the site are currently typographic
reconstructions (in src/components/ui/brands.tsx). To display the official
artwork, drop the licensed files here and switch them on.

1. Add the files to this folder (public/brand/). SVG is preferred; transparent
   PNG at 2x is fine. Suggested names:

     icaew.svg   – ICAEW "Chartered Accountants" lockup
     acca.svg    – ACCA logo
     aat.svg     – AAT logo

2. Switch each one on in src/components/ui/brands.tsx by setting its path in the
   OFFICIAL_ASSETS map, e.g.:

     const OFFICIAL_ASSETS = {
       icaew: "/brand/icaew.svg",
       acca:  "/brand/acca.svg",
       aat:   "/brand/aat.svg",
     };

   Any entry left as `null` keeps the current reconstruction.

The component renders the file at a sensible default height (h-10/h-12); the
images are sized with object-contain so any aspect ratio displays cleanly.

Note on usage rights: only upload artwork you are entitled to use. Professional
bodies publish brand/member-logo guidelines (ICAEW, ACCA, AAT) — follow them for
sizing, clear space and colour. Google's mark on the reviews card already uses
Google's official four-colour artwork and needs no file here.
