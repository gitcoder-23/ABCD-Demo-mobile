package com.abcd_rn

import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class NativeBridgeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NativeBridge"

    companion object {
        fun sendAuthUpdate(reactContext: ReactApplicationContext, data: WritableMap) {
            if (reactContext.hasActiveReactInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onAuthDataReceived", data)
            }
        }
    }

    @ReactMethod
    fun getAuthData(promise: Promise) {
        try {
            val activity = reactContext.currentActivity
            val extras = activity?.intent?.extras
            val map = Arguments.createMap()
            if (extras != null) {
                for (key in extras.keySet()) {
                    val value = extras.get(key)
                    when (value) {
                        is String -> map.putString(key, value)
                        is Int -> map.putInt(key, value)
                        is Boolean -> map.putBoolean(key, value)
                        is Double -> map.putDouble(key, value)
                        null -> map.putNull(key)
                    }
                }
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for React Native built-in NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for React Native built-in NativeEventEmitter
    }
}
