# Chhat Runner

An endless runner built with React + Vite. Tap or press Space to jump, tap again in the air to double jump.

## Run it
```
npm install
npm run dev        # opens on your network, so you can test on your phone
npm run build      # production files go to dist/
```

## Change the face
Replace `src/assets/face.png` with another PNG (transparent background works best, about 180 x 240 px).
The head is drawn in `src/App.jsx` in the `player()` function (`hw` and `hh` set its size).

## Turn it into an Android app (optional)
Needs Node and Android Studio on a computer.
```
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Chhat Runner" com.example.chhatrunner --web-dir=dist
npm run build
npx cap add android
npx cap sync
npx cap open android      # then press Run in Android Studio, or Build > Build APK
```
Use only photos of people who agreed to appear in your game.
