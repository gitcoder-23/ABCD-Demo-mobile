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
                    val accessToken = call.argument<String>("accessToken")
                    val refreshToken = call.argument<String>("refreshToken")
                    val userData = call.argument<String>("userData")
                    val targetScreen = call.argument<String>("targetScreen") ?: "TestCatalog"

                    val intent = Intent(this, com.abcd_rn.MainActivity::class.java).apply {
                        putExtra("accessToken", accessToken)
                        putExtra("refreshToken", refreshToken)
                        putExtra("userData", userData)
                        putExtra("targetScreen", targetScreen)
                    }
                    startActivity(intent)
                    result.success(true)
                } catch (e: Exception) {
                    result.error("ERROR", "Failed to start native activity: ${e.message}", null)
                }
            } else {
                result.notImplemented()
            }
        }
    }
}

