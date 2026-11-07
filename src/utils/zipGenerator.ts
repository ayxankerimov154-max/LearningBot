import JSZip from 'jszip';
import { ANDROID_FILES } from '../data/androidFiles';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "TechnovisAzeLearningBot"
include(":app")
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  );

  zip.file(
    'local.properties.example',
    `## This file must NOT be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
# For example:
# sdk.dir=/Users/username/Library/Android/sdk
#
# Gemini AI Studio API Key for TechnovisAze Bot:
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
`
  );

  zip.file(
    'README.md',
    `# TechnovisAze Learning Bot (Android)

Autonomous gaming intelligence bot running silently in the background via a persistent Android **Foreground Service** with \`WAKE_LOCK\` and **Room DB** persistence. Powered by **Google Gemini Generative AI SDK**.

## Sequential Queue
The bot loops strictly in this order:
1. **PUBG Mobile**
2. **Roblox**
3. **Minecraft**
4. Sleeps (30 minutes in production) and repeats.

## Setup Instructions
1. Open **Android Studio** (Hedgehog 2023.1.1 or later).
2. Select **Open** and choose this project folder.
3. Open \`local.properties\` (or copy from \`local.properties.example\`) and add your Gemini API key:
   \`\`\`
   GEMINI_API_KEY=your_actual_gemini_api_key
   \`\`\`
4. Sync Gradle project files.
5. Connect your Android device (or launch emulator running API 26 to 34).
6. Click **Run 'app'**.
7. Tap **Start Autonomous Learning Loop** and grant the Notification permission when prompted.

## Architecture Highlights
- **Service**: \`BackgroundLearningService\` with \`PARTIAL_WAKE_LOCK\` & low-priority \`Dispatchers.IO\` coroutines (0% FPS impact on games).
- **Database**: \`Room\` DB with reactive \`Flow\` queries in \`BotMemoryDao\`.
- **AI**: \`GeminiClient\` using \`com.google.ai.client.generativeai:0.9.0\`.
- **UI**: 100% Jetpack Compose with Material 3.
`
  );

  // Application class
  zip.file(
    'app/src/main/java/com/technovisaze/learningbot/TechnovisAzeApplication.kt',
    `package com.technovisaze.learningbot

import android.app.Application
import android.util.Log

class TechnovisAzeApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.i("TechnovisAzeApp", "TechnovisAze Learning Bot Application initialized")
    }
}
`
  );

  // String resources
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">TechnovisAze Learning Bot</string>
    <string name="gemini_api_key">YOUR_GEMINI_API_KEY_HERE</string>
</resources>
`
  );

  // Add all primary files from androidFiles
  for (const file of ANDROID_FILES) {
    zip.file(file.path, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}
