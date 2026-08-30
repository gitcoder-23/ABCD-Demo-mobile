# 🚀 Complete End-to-End Guide: React Native `.AAR` Generation & Flutter Integration

This guide provides a comprehensive, step-by-step walkthrough for building a standalone **Android Archive (`.AAR`)** from a React Native application and integrating it into a **Flutter application**.

---

## 📌 Table of Contents
1. [Prerequisites & Environment](#1-prerequisites--environment)
2. [React Native Project Setup (`abcd_rn`)](#2-react-native-project-setup-abcd_rn)
   - [Step 2.1: Create Library-Specific Manifest](#step-21-create-library-specific-manifest)
   - [Step 2.2: Add Gradle Packaging Tasks to `build.gradle`](#step-22-add-gradle-packaging-tasks-to-buildgradle)
   - [Step 2.3: Configure `package.json` Automation Scripts](#step-23-configure-packagejson-automation-scripts)
3. [CLI Commands: Generating the `.AAR`](#3-cli-commands-generating-the-aar)
   - [Option A: One-Command Build (Recommended)](#option-a-one-command-build-recommended)
   - [Option B: Step-by-Step Manual CLI Execution](#option-b-step-by-step-manual-cli-execution)
4. [Generated AAR Output Files](#4-generated-aar-output-files)
5. [Flutter Integration (`abcd_fl`)](#5-flutter-integration-abcd_fl)
   - [Step 5.1: Copy AAR Packages via CLI](#step-51-copy-aar-packages-via-cli)
   - [Step 5.2: Configure `android/app/build.gradle.kts`](#step-52-configure-androidappbuildgradlekts)
   - [Step 5.3: Configure `android/app/src/main/AndroidManifest.xml`](#step-53-configure-androidappsrcmainandroidmanifestxml)
   - [Step 5.4: Implement Native MethodChannel in Kotlin](#step-54-implement-native-methodchannel-in-kotlin)
   - [Step 5.5: Invoke from Flutter Dart UI](#step-55-invoke-from-flutter-dart-ui)
6. [CLI Commands: Building and Running Flutter App](#6-cli-commands-building-and-running-flutter-app)
7. [Troubleshooting & Gotchas](#7-troubleshooting--gotchas)

---

## 1. Prerequisites & Environment

Ensure you have the following installed on your machine:
- **Node.js**: v18+ or v20+
- **JDK**: Java Development Kit 17 (`openjdk 17`)
- **Android SDK**: API Level 34+ (with Build-Tools `34.0.0` or `35.0.0`)
- **Flutter SDK**: 3.24+ or 3.27+
- **React Native**: 0.76+ / 0.87+ (with Hermes & New Architecture support)

---

## 2. React Native Project Setup (`abcd_rn`)

### Step 2.1: Create Library-Specific Manifest
By default, React Native's `AndroidManifest.xml` has application launcher tags and custom application references that cause conflicts during host app compilation.

Create a new file:
📁 **`abcd_rn/android/app/src/main/AndroidManifest-library.xml`**

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.abcd_rn">

    <uses-permission android:name="android.permission.INTERNET" />

    <application>
      <activity
        android:name="com.abcd_rn.MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:theme="@style/Theme.AppCompat.DayNight.NoActionBar"
        android:exported="true" />
    </application>
</manifest>
```

> **Why AppCompat Theme?**  
> `com.abcd_rn.MainActivity` extends `ReactActivity`, which inherits from `AppCompatActivity`. Android strictly requires an `AppCompat` theme like `@style/Theme.AppCompat.DayNight.NoActionBar` to prevent runtime crashes.

---

### Step 2.2: Add Gradle Packaging Tasks to `build.gradle`
Open 📁 **`abcd_rn/android/app/build.gradle`** and add the following two Gradle tasks at the bottom of the file:

```groovy
// Task 1: Package compiled Kotlin and Java classes into classes.jar
task createJar(type: Jar, dependsOn: ['compileReleaseJavaWithJavac', 'compileReleaseKotlin']) {
    archiveFileName = "classes.jar"
    destinationDirectory = file("${project.buildDir}/intermediates/aar_classes")
    from fileTree(dir: "${project.buildDir}/intermediates/javac/release/compileReleaseJavaWithJavac/classes")
    from fileTree(dir: "${project.buildDir}/tmp/kotlin-classes/release")
}

// Task 2: Package Manifest, classes.jar, assets, JNI C++ libraries, and R.txt into .AAR
task generateAar(type: Zip, dependsOn: ['assembleRelease', 'createJar']) {
    description = "Generates a complete AAR archive for abcd_rn for embedding into host apps"
    group = "build"
    archiveFileName = "abcd_rn-release.aar"
    destinationDirectory = file("${rootDir}/outputs/aar")

    // 1. Library Manifest
    from("${project.projectDir}/src/main/AndroidManifest-library.xml") {
        into ""
        rename { "AndroidManifest.xml" }
    }
    // 2. Compiled Java & Kotlin Bytecode
    from("${project.buildDir}/intermediates/aar_classes/classes.jar") {
        into ""
    }
    // 3. Resource Symbols Table
    from("${project.buildDir}/intermediates/runtime_symbol_list/release/processReleaseResources/R.txt") {
        into ""
    }
    // 4. Bundled JavaScript bundle (index.android.bundle) and assets
    from("${project.buildDir}/intermediates/assets/release/mergeReleaseAssets") {
        into "assets"
    }
    // 5. Drawables and Android resources
    from("${project.projectDir}/src/main/res") {
        into "res"
    }
    // 6. Native TurboModules and C++ shared libraries (libappmodules.so, etc.)
    from("${project.buildDir}/intermediates/stripped_native_libs/release/stripReleaseDebugSymbols/out/lib") {
        into "jni"
    }

    doLast {
        // Collect all autolinked third-party dependency AARs to outputs/aar
        copy {
            from "${rootDir}/../node_modules/@react-native-async-storage/async-storage/android/build/outputs/aar/react-native-async-storage_async-storage-release.aar"
            from "${rootDir}/../node_modules/react-native-safe-area-context/android/build/outputs/aar/react-native-safe-area-context-release.aar"
            from "${rootDir}/../node_modules/react-native-screens/android/build/outputs/aar/react-native-screens-release.aar"
            into "${rootDir}/outputs/aar"
        }
        copy {
            from "${rootDir}/outputs/aar"
            into "${project.buildDir}/outputs/aar"
        }
        println("\n=======================================================")
        println("✅ AAR generation completed successfully!")
        println("Output directory: ${rootDir}/outputs/aar/")
        println("=======================================================\n")
    }
}
```

---

### Step 2.3: Configure `package.json` Automation Scripts
Open 📁 **`abcd_rn/package.json`** and add the following scripts under `"scripts"`:

```json
"scripts": {
  "bundle:android": "react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res",
  "build:aar": "npm run bundle:android && cd android && ./gradlew generateAar"
}
```

---

## 3. CLI Commands: Generating the `.AAR`

### Option A: One-Command Build (Recommended)
Open your terminal, navigate to the React Native project directory, and run:

```bash
# 1. Navigate to React Native project
cd abcd_rn

# 2. Build the JavaScript bundle and package all .AAR files
npm run build:aar
```

---

### Option B: Step-by-Step Manual CLI Execution
If you prefer running each CLI command manually:

```bash
# Step 1: Navigate to React Native project directory
cd abcd_rn

# Step 2: Ensure all npm dependencies are installed
npm install

# Step 3: Create assets folder if not present
mkdir -p android/app/src/main/assets

# Step 4: Bundle JavaScript code and images/assets for Release
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Step 5: Navigate to android folder
cd android

# Step 6: Clean previous builds (optional but recommended)
./gradlew clean

# Step 7: Run the custom generateAar Gradle task
./gradlew generateAar
```

---

## 4. Generated AAR Output Files

Once the CLI command completes, verify the output files generated inside:
📁 **`abcd_rn/android/outputs/aar/`**

Run CLI check:
```bash
ls -lh abcd_rn/android/outputs/aar/
```

You will see:
| File Name | Description |
| :--- | :--- |
| **`abcd_rn-release.aar`** | Main React Native application containing the JavaScript bundle, TurboModules C++ bindings (`libappmodules.so`), `MainActivity`, `MainApplication`, and custom native code. |
| **`react-native-screens-release.aar`** | Native navigation and screen lifecycle library. |
| **`react-native-async-storage_async-storage-release.aar`** | Persistent key-value storage module. |
| **`react-native-safe-area-context-release.aar`** | Inset handling and notch safe area support. |

---

## 5. Flutter Integration (`abcd_fl`)

### Step 5.1: Copy AAR Packages via CLI
Run the following terminal command to copy all generated `.aar` files into Flutter's `libs` directory:

```bash
# 1. Navigate to your project workspace root
cd /path/to/ABCD-Demo

# 2. Create the libs directory inside the Flutter android project
mkdir -p abcd_fl/android/app/libs

# 3. Copy all generated AAR files from React Native to Flutter
cp abcd_rn/android/outputs/aar/*.aar abcd_fl/android/app/libs/

# 4. Verify that files are copied
ls -lh abcd_fl/android/app/libs/
```

---

### Step 5.2: Configure `android/app/build.gradle.kts`
Open 📁 **`abcd_fl/android/app/build.gradle.kts`** and update the configuration:

```kotlin
plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.abcd_fl"
    compileSdk = 37 // Required by React Native API level

    defaultConfig {
        applicationId = "com.example.abcd_fl"
        minSdk = 24     // React Native minimum SDK requirement
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    // Prevents duplicate native C++ .so library collisions during Gradle merge
    packaging {
        jniLibs {
            pickFirsts.add("**/*.so")
        }
    }
}

dependencies {
    // 1. Include all local AAR files from libs directory
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.aar"))))

    // 2. React Native and Hermes Runtime Dependencies
    implementation("com.facebook.react:react-android:0.87.0")
    implementation("com.facebook.hermes:hermes-android:250829098.0.16")
    implementation("com.facebook.fbjni:fbjni:0.7.0")
    implementation("com.facebook.soloader:soloader:0.12.1")

    // 3. AndroidX & Material Design
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")

    // 4. React Native AsyncStorage (Room & SQLite) dependencies
    implementation("androidx.room:room-runtime:2.7.2")
    implementation("androidx.room:room-ktx:2.7.2")
    implementation("io.github.react-native-async-storage:shared-storage-android:1.0.1")
}
```

---

### Step 5.3: Configure `android/app/src/main/AndroidManifest.xml`
Open 📁 **`abcd_fl/android/app/src/main/AndroidManifest.xml`**:
1. Add `xmlns:tools="http://schemas.android.com/tools"` in `<manifest>`.
2. Add `android:name="com.abcd_rn.MainApplication"` and `tools:replace="android:label,android:name"` in `<application>`.
3. Add the React Native Activity declaration:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="abcd_fl"
        android:name="com.abcd_rn.MainApplication"
        android:icon="@mipmap/ic_launcher"
        tools:replace="android:label,android:name">

        <!-- Flutter Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:taskAffinity=""
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>

        <!-- React Native Activity (Loaded from AAR) -->
        <activity
            android:name="com.abcd_rn.MainActivity"
            android:theme="@style/Theme.AppCompat.DayNight.NoActionBar"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true" />

        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
```

---

### Step 5.4: Implement Native MethodChannel in Kotlin
Open 📁 **`abcd_fl/android/app/src/main/kotlin/com/example/abcd_fl/MainActivity.kt`**:

```kotlin
package com.example.abcd_fl

import android.content.Intent
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.example.abcd_fl/native_tests"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            if (call.method == "openNativeTests") {
                try {
                    // Launch the React Native Activity from the AAR
                    val intent = Intent(this, Class.forName("com.abcd_rn.MainActivity"))
                    startActivity(intent)
                    result.success(true)
                } catch (e: Exception) {
                    result.error("UNAVAILABLE", "Failed to start React Native Activity: ${e.message}", null)
                }
            } else {
                result.notImplemented()
            }
        }
    }
}
```

---

### Step 5.5: Invoke from Flutter Dart UI
In 📁 **`abcd_fl/lib/screens/home.dart`**, add the platform channel call and button:

```dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const platform = MethodChannel('com.example.abcd_fl/native_tests');

  Future<void> _openNativeTests() async {
    try {
      await platform.invokeMethod('openNativeTests');
    } on PlatformException catch (e) {
      debugPrint("Failed to launch React Native activity: ${e.message}");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {},
              child: const Text('About Us'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () {},
              child: const Text('Contact Support'),
            ),
            const SizedBox(height: 12),
            // The Button to launch React Native AAR
            OutlinedButton(
              onPressed: _openNativeTests,
              child: const Text('All Tests (Native)'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 6. CLI Commands: Building and Running Flutter App

### Clean & Build APK via CLI
```bash
# 1. Navigate to Flutter directory
cd abcd_fl

# 2. Fetch Flutter packages
flutter pub get

# 3. Clean any old build artifacts
flutter clean

# 4. Build the Debug APK
flutter build apk --debug

# 5. Install APK directly onto connected device/emulator
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

### Run with Live Logs
```bash
flutter run
```

---

## 7. Troubleshooting & Gotchas

### Issue 1: `2 files found with path 'lib/arm64-v8a/lib*.so'`
- **Cause**: Both `react-android` maven artifact and the `.AAR` include common C++ shared libraries (`libc++_shared.so`, `libjsi.so`, etc.).
- **Fix**: In `abcd_fl/android/app/build.gradle.kts`, add:
  ```kotlin
  packaging {
      jniLibs {
          pickFirsts.add("**/*.so")
      }
  }
  ```

### Issue 2: `java.lang.NoClassDefFoundError: Failed resolution of: Landroidx/room/RoomDatabase;`
- **Cause**: `@react-native-async-storage/async-storage` v3 requires AndroidX Room runtime.
- **Fix**: Add Room dependencies in `abcd_fl/android/app/build.gradle.kts`:
  ```kotlin
  implementation("androidx.room:room-runtime:2.7.2")
  implementation("androidx.room:room-ktx:2.7.2")
  implementation("io.github.react-native-async-storage:shared-storage-android:1.0.1")
  ```

### Issue 3: `You need to use a Theme.AppCompat theme (or descendant) with this activity`
- **Cause**: `com.abcd_rn.MainActivity` extends `ReactActivity` (which is an `AppCompatActivity`).
- **Fix**: In `AndroidManifest.xml`, specify:
  ```xml
  android:theme="@style/Theme.AppCompat.DayNight.NoActionBar"
  ```

### Issue 4: `TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found`
- **Cause**: C++ TurboModule registration (`libappmodules.so`) missing from the `.AAR` `jni/` folder.
- **Fix**: Ensure `generateAar` task includes `stripped_native_libs` into `jni/`:
  ```groovy
  from("${project.buildDir}/intermediates/stripped_native_libs/release/stripReleaseDebugSymbols/out/lib") {
      into "jni"
  }
  ```
