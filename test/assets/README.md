# Assets Directory

Aquest directori conté tots els recursos estàtics del projecte.

## Estructura

- `models/` - Models 3D (.glb, .gltf)
- `videos/` - Vídeos (.mp4, .webm)
- `images/` - Imatges (.jpg, .png, .webp)
- `targets/` - MindAR image targets (.mind)
- `audio/` - Sons i música (.mp3, .wav, .ogg)

## Notes

- Els fitxers `.mind` es generen amb MindAR Image Compiler
- Utilitza formats WebP per imatges quan sigui possible
- Comprimeix els vídeos per optimitzar la mida
- Els models GLB són preferibles a GLTF per la seva mida

## Exemples de Paths

```javascript
// Model 3D
'./assets/models/test.glb'

// Vídeo
'./assets/videos/belloc.mp4'

// Image target
'./assets/targets/belloc.mind'

// Àudio
'./assets/audio/background.mp3'
```
