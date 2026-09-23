# PokeQuest — Actividad 01: Game API App

App móvil en **React Native (con Expo)** que consume la **PokéAPI** (https://pokeapi.co),
100% gratuita y sin necesidad de API key.

## Cómo cumple los requisitos de la actividad

| Requisito | Dónde está |
|---|---|
| Splash Screen | `src/screens/SplashScreen.js` — logo propio (pokébola dibujada con `View`s, sin imagen externa) + nombre de la app |
| Pantalla de inicio | `src/screens/HomeScreen.js` — categorías (tipos de Pokémon) + botón hacia la Pokédex |
| Consumo de API | `src/api/pokeapi.js` — todas las llamadas HTTP a PokeAPI, nada escrito a mano |
| Interacción | Búsqueda por nombre, filtro por tipo, favoritos persistentes, pantalla de detalle |
| Creatividad | Colores dinámicos por tipo, animaciones en el splash, barras de stats |

---

## 1. Cómo usar React Native en este proyecto (con Expo)

React Native por sí solo requiere Android Studio o Xcode instalados y configurados,
lo cual es lento para empezar. **Expo** es un framework sobre React Native que te deja
correr la app en tu propio celular en minutos, sin compilar nada localmente.

### Requisitos previos (una sola vez)
1. Instala **Node.js** (versión 18 o superior): https://nodejs.org
2. Instala la app **Expo Go** en tu celular (disponible en Play Store y App Store).
3. (Opcional) Instala el CLI global: `npm install -g expo-cli` — aunque con `npx` no es
   necesario instalarlo globalmente.

### Pasos para correr este proyecto
```bash
# 1. Entra a la carpeta del proyecto
cd PokeQuest

# 2. Instala las dependencias (lee el package.json)
npm install

# 3. Levanta el servidor de desarrollo de Expo
npx expo start
```

Esto abre una terminal con un **código QR**:
- **En tu celular:** abre la app Expo Go y escanea el QR (Android: escáner integrado
  de Expo Go; iOS: usa la cámara nativa). La app cargará directo en tu teléfono.
- **En un emulador Android:** con Android Studio abierto y un emulador corriendo,
  presiona `a` en la terminal donde corre `expo start`.
- **En simulador iOS** (solo Mac): presiona `i` en la terminal.
- **En el navegador** (vista previa rápida, no representa 100% el resultado móvil):
  presiona `w`.

Cada vez que guardes un archivo, la app se recarga sola en el celular (Fast Refresh).

### Cómo generar el `.apk` o `.ipa` final (para entregar o instalar sin Expo Go)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview   # genera un .apk
eas build -p ios --profile preview       # genera un build de iOS
```
Esto corre en los servidores de Expo (EAS Build), no necesitas Mac para el build de iOS.

---

## 2. Estructura del proyecto

```
PokeQuest/
├── App.js                      # Punto de entrada: navegación + provider de favoritos
├── app.json                    # Configuración de Expo (nombre, splash nativo, etc.)
├── package.json                # Dependencias
├── src/
│   ├── api/
│   │   └── pokeapi.js          # Todas las llamadas a la PokeAPI
│   ├── context/
│   │   └── FavoritesContext.js # Favoritos con persistencia (AsyncStorage)
│   ├── components/
│   │   ├── Pokeball.js         # Logo propio dibujado con Views
│   │   ├── TypeBadge.js        # Chip de color por tipo
│   │   └── PokemonCard.js      # Tarjeta de la lista
│   ├── screens/
│   │   ├── SplashScreen.js
│   │   ├── HomeScreen.js       # Categorías por tipo
│   │   ├── PokedexScreen.js    # Lista + búsqueda + filtro
│   │   └── DetailScreen.js     # Detalle con stats y descripción
│   └── theme/
│       └── colors.js           # Paleta y colores por tipo
```

## 3. Ideas para personalizar y subir la nota

- Cambiar la temática: puedes usar otra API (ej. Rick and Morty API, RAWG para
  videojuegos) — solo tendrías que reescribir `src/api/pokeapi.js` con los nuevos
  endpoints, el resto de la app (navegación, favoritos, búsqueda) queda igual.
- Agregar un splash screen nativo real (imagen fija antes de que cargue JS) editando
  `app.json` → `"splash"` y añadiendo una imagen en `assets/`.
- Agregar comparación entre dos Pokémon (pantalla nueva con dos `PokemonCard`).
- Agregar sonido al abrir un Pokémon con `expo-av`.
- Mostrar evoluciones consultando `/evolution-chain` de la PokeAPI.

## 4. Notas técnicas

- La navegación usa `@react-navigation/native-stack` (stack nativo, transición fluida).
- Los favoritos se guardan en el dispositivo con `AsyncStorage`, así que persisten
  aunque cierres la app.
- Las imágenes se resuelven vía la URL de sprites oficiales de PokeAPI sin necesidad
  de guardarlas localmente, para no inflar el tamaño de la app.
