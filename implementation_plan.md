# Goal: Embed React Native Test Catalog inside Flutter Host App

The objective is to establish the Flutter application (`abcd_fl`) as an "Aggregator" or Super App, which can launch the Test Catalog screen built in the React Native application (`abcd_rn`). 

Integrating two separate cross-platform frameworks (Flutter and React Native) into a single application is highly complex, as it requires bundling two separate runtime engines (Dart and JavaScript V8/Hermes) and managing them via native Android (Kotlin) and iOS (Swift) bridges.

> [!WARNING] 
> **Architectural Complexity**
> Embedding React Native directly inside a Flutter project is not officially supported by either framework. It requires heavy modifications to the native `android` and `ios` build systems. This can lead to increased app size, high memory usage, and complex maintenance in the future.

---

## User Review Required

Please review the proposed approaches below. Because this is a complex architectural decision, I need your confirmation on **which approach** you want to take before I proceed.

---

## Open Questions

### Question 1: How do you want to integrate the apps?

**Option A: True Super App (Native Embedding) - *What you asked for***
We will modify the Flutter app's native Android/iOS source code to physically embed the React Native engine. 
* **Experience:** The user stays inside the Flutter app. A native screen pops up rendering the React Native JS bundle.
* **Effort:** Very High. Requires merging dependencies, editing `build.gradle` / `Podfile`, and writing custom `MethodChannels` in Kotlin and Swift.

**Option B: Deep Linking (App-to-App) - *Recommended Alternative***
Both `abcd_fl` and `abcd_rn` remain separate apps installed on the device. We add a button in Flutter that triggers a Deep Link (e.g. `abcd-rn://tests`).
* **Experience:** Clicking the button in Flutter seamlessly switches the OS to the React Native app directly to the Tests screen.
* **Effort:** Low. Stable and easy to maintain.

*(Please let me know if you prefer Option A or Option B in your next message! If you choose Option A, we will proceed with the changes below).*

---

## Proposed Changes (Assuming Option A: Native Embedding for Android)

If we proceed with embedding React Native directly into the Flutter app for Android, here is the technical plan:

### 1. Flutter UI (Dart)
#### [MODIFY] `abcd_fl/lib/screens/home.dart`
- Add a "Tests" button to the home screen.
- Implement a `MethodChannel` (e.g., `com.abcd/rn_bridge`).
- On button press, invoke a method `launchReactNativeTests` over the channel.

### 2. Native Android Integration (Kotlin / Gradle)
#### [MODIFY] `abcd_fl/android/settings.gradle`
- Link the React Native source paths from `../abcd_rn/node_modules/react-native`.

#### [MODIFY] `abcd_fl/android/app/build.gradle`
- Add the React Native dependencies.
- Configure Javascript bundle build tasks.

#### [MODIFY] `abcd_fl/android/app/src/main/kotlin/com/example/abcd_fl/MainActivity.kt`
- Listen to the `MethodChannel` (`com.abcd/rn_bridge`).
- When triggered, start a new `Intent` targeting a custom `MyReactActivity`.

#### [NEW] `abcd_fl/android/app/src/main/kotlin/com/example/abcd_fl/MyReactActivity.kt`
- Create a new Android Activity that extends `ReactActivity` (or manually boots a `ReactRootView`).
- Configure it to load the `index.android.bundle` and set the initial component name to `abcd_rn`'s App registry.

### 3. React Native Adjustments
#### [MODIFY] `abcd_rn/index.js`
- Ensure the app registry is exposed correctly so the Android activity can load the root component.
- We may need to pass initial props from the Native side to force the React Native router to immediately render the Test Catalog screen instead of the Auth flow.

---

## Verification Plan

### Manual Verification
1. Run `abcd_rn` metro bundler in the background.
2. Compile and launch `abcd_fl` on an Android emulator.
3. Log in to the Flutter app.
4. Click the new "Tests" button on the Home screen.
5. Verify that a new native activity launches, connects to the Metro bundler, and displays the React Native Test Catalog.
