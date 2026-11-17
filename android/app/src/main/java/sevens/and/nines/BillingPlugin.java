package sevens.and.nines;

import android.util.Log;

import androidx.annotation.NonNull;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "BillingPlugin")
public class BillingPlugin extends Plugin implements PurchasesUpdatedListener {

    private static final String TAG = "BillingPlugin";
    private static final String SUBSCRIPTION_ID = "sevens_nines_premium";

    private BillingClient billingClient;
    private ProductDetails subscriptionProductDetails;

    @Override
    public void load() {
        PendingPurchasesParams pendingPurchasesParams = PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .enablePrepaidPlans()
                .build();

        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(pendingPurchasesParams)
                .build();

        connectToGooglePlay();
    }

    private void connectToGooglePlay() {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "Billing client connected successfully");
                    querySubscriptionProduct();
                } else {
                    Log.e(TAG, "Billing setup failed: " + billingResult.getDebugMessage());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                Log.w(TAG, "Billing service disconnected, will retry on next call");
            }
        });
    }

    private void querySubscriptionProduct() {
        QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(SUBSCRIPTION_ID)
                .setProductType(BillingClient.ProductType.SUBS)
                .build();

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(product);

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, queryProductDetailsResult) -> {
            List<ProductDetails> productDetailsList = queryProductDetailsResult != null ? queryProductDetailsResult.getProductDetailsList() : null;
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK
                    && productDetailsList != null && !productDetailsList.isEmpty()) {
                subscriptionProductDetails = productDetailsList.get(0);
                Log.d(TAG, "Product details loaded: " + subscriptionProductDetails.getName());
            } else {
                Log.w(TAG, "Could not load product details: " + billingResult.getDebugMessage());
            }
        });
    }

    @PluginMethod()
    public void purchaseSubscription(PluginCall call) {
        if (subscriptionProductDetails == null) {
            call.reject("Subscription product not available yet. Please try again.");
            return;
        }

        // Get the first offer (which should include the free trial)
        List<ProductDetails.SubscriptionOfferDetails> offers =
                subscriptionProductDetails.getSubscriptionOfferDetails();

        if (offers == null || offers.isEmpty()) {
            call.reject("No subscription offers available.");
            return;
        }

        // Use the first offer (base plan with free trial)
        ProductDetails.SubscriptionOfferDetails offer = offers.get(0);

        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(
                        List.of(BillingFlowParams.ProductDetailsParams.newBuilder()
                                .setProductDetails(subscriptionProductDetails)
                                .setOfferToken(offer.getOfferToken())
                                .build()))
                .build();

        BillingResult result = billingClient.launchBillingFlow(getActivity(), billingFlowParams);

        if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
            // Save the pending call to resolve it when purchase completes
            bridge.saveCall(call);
        } else {
            call.reject("Failed to launch billing flow: " + result.getDebugMessage());
        }
    }

    @PluginMethod()
    public void checkSubscription(PluginCall call) {
        if (billingClient == null || !billingClient.isReady()) {
            JSObject result = new JSObject();
            result.put("isSubscribed", false);
            result.put("error", "Billing client not ready");
            call.resolve(result);
            return;
        }

        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build();

        billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
            boolean isSubscribed = false;

            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        isSubscribed = true;

                        // Acknowledge the purchase if not acknowledged yet
                        if (!purchase.isAcknowledged()) {
                            AcknowledgePurchaseParams ackParams =
                                    AcknowledgePurchaseParams.newBuilder()
                                            .setPurchaseToken(purchase.getPurchaseToken())
                                            .build();
                            billingClient.acknowledgePurchase(ackParams, ackResult -> {
                                Log.d(TAG, "Purchase acknowledged: " + ackResult.getResponseCode());
                            });
                        }
                        break;
                    }
                }
            }

            JSObject result = new JSObject();
            result.put("isSubscribed", isSubscribed);
            call.resolve(result);
        });
    }

    @PluginMethod()
    public void getSubscriptionInfo(PluginCall call) {
        if (subscriptionProductDetails == null) {
            JSObject result = new JSObject();
            result.put("available", false);
            call.resolve(result);
            return;
        }

        JSObject result = new JSObject();
        result.put("available", true);
        result.put("name", subscriptionProductDetails.getName());
        result.put("description", subscriptionProductDetails.getDescription());

        List<ProductDetails.SubscriptionOfferDetails> offers =
                subscriptionProductDetails.getSubscriptionOfferDetails();
        if (offers != null && !offers.isEmpty()) {
            ProductDetails.SubscriptionOfferDetails offer = offers.get(0);
            List<ProductDetails.PricingPhase> pricingPhases =
                    offer.getPricingPhases().getPricingPhaseList();

            // Look for free trial phase
            for (ProductDetails.PricingPhase phase : pricingPhases) {
                if (phase.getPriceAmountMicros() == 0) {
                    result.put("trialPeriod", phase.getBillingPeriod());
                } else {
                    result.put("price", phase.getFormattedPrice());
                    result.put("billingPeriod", phase.getBillingPeriod());
                }
            }
        }

        call.resolve(result);
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult,
                                    List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK
                && purchases != null) {
            for (Purchase purchase : purchases) {
                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    // Acknowledge the purchase
                    if (!purchase.isAcknowledged()) {
                        AcknowledgePurchaseParams ackParams =
                                AcknowledgePurchaseParams.newBuilder()
                                        .setPurchaseToken(purchase.getPurchaseToken())
                                        .build();
                        billingClient.acknowledgePurchase(ackParams, ackResult -> {
                            Log.d(TAG, "Purchase acknowledged after update: "
                                    + ackResult.getResponseCode());
                        });
                    }

                    // Notify the web layer
                    JSObject data = new JSObject();
                    data.put("purchased", true);
                    notifyListeners("purchaseCompleted", data);

                    // Resolve any saved call
                    PluginCall savedCall = bridge.getSavedCall("purchaseSubscription");
                    if (savedCall != null) {
                        JSObject result = new JSObject();
                        result.put("success", true);
                        savedCall.resolve(result);
                        bridge.releaseCall(savedCall);
                    }
                }
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.d(TAG, "User cancelled the purchase");
            PluginCall savedCall = bridge.getSavedCall("purchaseSubscription");
            if (savedCall != null) {
                savedCall.reject("Purchase cancelled by user");
                bridge.releaseCall(savedCall);
            }
        } else {
            Log.e(TAG, "Purchase error: " + billingResult.getDebugMessage());
            PluginCall savedCall = bridge.getSavedCall("purchaseSubscription");
            if (savedCall != null) {
                savedCall.reject("Purchase failed: " + billingResult.getDebugMessage());
                bridge.releaseCall(savedCall);
            }
        }
    }
}
