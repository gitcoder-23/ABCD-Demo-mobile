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
                val intent = Intent(this, com.abcd_rn.MainActivity::class.java)
                startActivity(intent)
                result.success(true)
            } else {
                result.notImplemented()
            }
        }
    }
}

