# Reference Images Directory

Store reference images here for style analysis and prompt generation.

## Directory Structure

```
reference-images/
├── napkin/          # Napkin sketch style references
├── modern-alchemist/ # Modern Alchemist/Intellectual Blueprint references
├── davinci/         # Da Vinci notebook style references
├── excalidraw/      # Excalidraw whiteboard style references
└── custom/          # Custom or one-off reference images
```

## How to Use

### 1. Store Reference Image

Place your reference image in the appropriate style folder:

```bash
# Example: Store a napkin reference
cp ~/Downloads/napkin-example.png .claude/Skills/Art/reference-images/napkin/
```

### 2. Analyze Reference Image

Use the PromptFromImage workflow:

```
"Analyze this reference image and generate a prompt"
[Provide path to reference image]
```

The system will:
- Read and analyze the image
- Extract colors, line quality, texture, composition
- Map to closest style (or identify as custom)
- Generate detailed prompt with hex codes
- Save prompt to templates directory

### 3. Generate Similar Images

Use the generated prompt to create new images in the same style.

## Testing Reference Images

### Quick Test Workflow

1. **Copy your reference image here:**
   ```bash
   cp /path/to/reference.png .claude/Skills/Art/reference-images/napkin/test-reference.png
   ```

2. **Analyze it:**
   ```
   "Analyze .claude/Skills/Art/reference-images/napkin/test-reference.png and extract the prompt"
   ```

3. **Generate test image:**
   ```
   "Generate an image using the extracted prompt but change the concept to [new concept]"
   ```

4. **Compare results:**
   - Reference image vs generated image
   - Check if style transferred correctly
   - Iterate on prompt if needed

## File Naming Convention

Use descriptive names:

```
✅ GOOD:
- napkin-singapore-paradox-reference.png
- modern-alchemist-newsletter-header-ref.png
- davinci-mechanism-sketch-example.png

❌ BAD:
- image1.png
- reference.png
- test.png
```

## Supported Formats

- PNG (preferred)
- JPG/JPEG
- WebP

---

**Note:** Reference images are for style analysis only. Generated images go to their respective project directories.
