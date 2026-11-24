# RemodelVision AI
## Sketch-to-Photoreal Kitchen & Bath Renderer
Team 12 · SRM University AP · Department of CSE

Category: Image-to-Image Translation. Domain: Home Renovation.

## Problem statement
Contractors sketch kitchen and bathroom remodel ideas during consultations. Homeowners may struggle to visualize the completed space. Sketch-conditioned diffusion turns perspective sketches into photorealistic renovation visualizations—not construction plans.

## Frontend
Responsive, semantic HTML/CSS/vanilla JavaScript. Sections: Home, How It Works, Generator, Input & Results, Experiments, Limitations & Future Work, Team. No frameworks or build dependencies.

Serve this directory with any static server (e.g. python -m http.server 8000) and open http://localhost:8000. GitHub Pages serves main at repository root.

The canvas demo accepts PNG/JPEG/WebP under 15 MB or the supplied sample, shows grayscale-inverted 512x512 preprocessing and downloads a PNG. Images stay local. The browser does NOT generate AI images or perform Canny edge detection. Canvas reproduces the stated preprocessing operations, not a bit-for-bit Python/OpenCV equivalence claim.

## Tech stack
- Stable Diffusion 1.5: stable-diffusion-v1-5/stable-diffusion-v1-5
- ControlNet Scribble: lllyasviel/control_v11p_sd15_scribble
- Hugging Face diffusers; UniPC scheduler; float16
- Free Google Colab T4 GPU (subject to availability)
- Gradio generation interface
- OpenCV Canny for photo-to-sketch in the notebook

## Pipeline
Hand-drawn sketch → grayscale / resize to 512x512 / inversion to white-lines-on-black → ControlNet guidance → Stable Diffusion → photorealistic render.

## Run generation on Colab
This repository is the project frontend. Generation runs on Colab, not GitHub Pages.
1. Obtain the team's RemodelVision_AI notebook from Team 12. It is not included here; no public notebook URL was supplied.
2. Open it in Google Colab.
3. Select Runtime → Change runtime type → T4 GPU.
4. Run cells to install dependencies and load models.
5. Open the public Gradio link emitted by the notebook, upload a sketch, enter a prompt and generate.
The Gradio link requires an active notebook session; no permanent inference endpoint is claimed.

## Results and experiments
Team-reported successful Colab T4 timings (not independent benchmarks): model load ~4 min; kitchen + bathroom renders ~19 s total; control-strength ablation (0.5/0.8/1.0) ~26 s total.
0.5 allows more creativity; 0.8 is intermediate; 1.0 emphasizes stricter sketch adherence. No quantitative quality scores are claimed.

## Evidence provenance
- images/photo-23f8f623.jpg: supplied actual Colab screenshot. Kitchen output and part of bathroom output are visible. Hero uses a CSS crop of the kitchen from this same screenshot.
- images/photo-b5b4e0fa.jpg: supplied example hand-drawn bathroom sketch; NOT claimed to be the input for the shown renders.
No stock or fabricated AI render imagery.

## Limitations & future work
512x512 resolution; no top-down floor-plan understanding; dependence on sketch quality; SD 1.5 artifacts and imperfect geometry. Future: higher-resolution models, renovation-specific fine-tuning, floor-plan support and systematic evaluation.

## Team
- Shaik Arshad Basha — input/sketch preprocessing
- Pasumarthi Sreeram Ashish — generation pipeline
- Vadde Jarapati Dhanush Tej — experiments/ablation/demo UI/evaluation

Course project · Team 12 · SRM University AP.
