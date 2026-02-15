# audioRecording

## Setup

- Install deps: `npm install`
- Run: `npm run ios` or `npm run android`

## Environment variables

These are read at runtime via Expo's `EXPO_PUBLIC_*` envs.

- `EXPO_PUBLIC_DD_CLIENT_TOKEN`
- `EXPO_PUBLIC_DD_APPLICATION_ID`
- `EXPO_PUBLIC_DD_ENV` (default: `dev`)
- `EXPO_PUBLIC_DD_SITE` (default: `US1`)
- `EXPO_PUBLIC_DD_SERVICE` (default: `audio-recording`)

Transcription endpoint:

- `EXPO_PUBLIC_TRANSCRIBE_URL`

The transcription API should accept a `multipart/form-data` POST with a `file` field and respond with JSON:

```json
{ "text": "Hello world" }
```

## Datadog notes

Datadog uses native modules, so run the app with a custom dev client or a prebuild (Expo Go will not include the SDK).

## Atomic design

Components are organized under `src/components/atoms`, `src/components/molecules`, `src/components/organisms`, and `src/components/templates`.

## Screens

- `Record` (voice capture + transcription)
- `Calls` (placeholder for VoIP call transcription)
