package com.abcd_rn

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "abcd_rn"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
          override fun getLaunchOptions(): Bundle? {
              val bundle = Bundle()
              intent?.extras?.let {
                  bundle.putAll(it)
              }
              return bundle
          }
      }

  override fun onNewIntent(intent: Intent) {
      super.onNewIntent(intent)
      setIntent(intent)
      intent.extras?.let { extras ->
          val reactContext = reactHost?.currentReactContext as? ReactApplicationContext
          if (reactContext != null) {
              val map = Arguments.createMap()
              for (key in extras.keySet()) {
                  val value = extras.get(key)
                  when (value) {
                      is String -> map.putString(key, value)
                      is Int -> map.putInt(key, value)
                      is Boolean -> map.putBoolean(key, value)
                      is Double -> map.putDouble(key, value)
                  }
              }
              NativeBridgeModule.sendAuthUpdate(reactContext, map)
          }
      }
  }
}
