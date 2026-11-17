package sevens.and.nines;

import android.content.pm.ActivityInfo;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "OrientationPlugin")
public class OrientationPlugin extends Plugin {

    @PluginMethod
    public void lockLandscape(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                // Sensor landscape allows both normal and reverse landscape
                getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                JSObject ret = new JSObject();
                ret.put("locked", true);
                ret.put("orientation", "landscape");
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Failed to lock landscape", e);
            }
        });
    }

    @PluginMethod
    public void unlockOrientation(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                // Allows user sensor rotation (both portrait and landscape)
                getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
                JSObject ret = new JSObject();
                ret.put("locked", false);
                ret.put("orientation", "unspecified");
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("Failed to unlock orientation", e);
            }
        });
    }
}
