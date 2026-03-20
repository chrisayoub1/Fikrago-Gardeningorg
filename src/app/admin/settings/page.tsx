"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Key,
  CreditCard,
  Shield,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface PayPalSettings {
  clientId: string;
  clientSecret: string;
  mode: string;
  hasSecret: boolean;
}

interface GoogleOAuthInfo {
  instructions: string[];
  authorizedJavascriptOrigins: string[];
  authorizedRedirectUris: string[];
  note: string;
}

export default function AdminSettingsPage() {
  const [paypalSettings, setPaypalSettings] = useState<PayPalSettings>({
    clientId: "",
    clientSecret: "",
    mode: "sandbox",
    hasSecret: false,
  });
  const [googleOAuthInfo, setGoogleOAuthInfo] = useState<GoogleOAuthInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [paypalRes, googleRes] = await Promise.all([
        fetch("/api/settings/paypal"),
        fetch("/api/settings/google"),
      ]);
      
      if (paypalRes.ok) {
        const paypalData = await paypalRes.json();
        setPaypalSettings(paypalData);
      }
      
      if (googleRes.ok) {
        const googleData = await googleRes.json();
        setGoogleOAuthInfo(googleData);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayPal = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: paypalSettings.clientId,
          clientSecret: paypalSettings.clientSecret === "••••••••" ? undefined : paypalSettings.clientSecret,
          mode: paypalSettings.mode,
        }),
      });

      if (response.ok) {
        setSuccessDialog(true);
        fetchSettings();
      } else {
        toast.error("Failed to save PayPal settings");
      }
    } catch (error) {
      console.error("Error saving PayPal settings:", error);
      toast.error("Failed to save PayPal settings");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500">Configure your marketplace integrations and credentials</p>
      </div>

      {/* PayPal Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>PayPal Integration</CardTitle>
              <CardDescription>
                Configure PayPal for split payments. Vendors receive 85%, platform keeps 15% commission.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PayPal Mode */}
          <div className="space-y-2">
            <Label htmlFor="mode">PayPal Environment</Label>
            <Select
              value={paypalSettings.mode}
              onValueChange={(value) => setPaypalSettings({ ...paypalSettings, mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Test</Badge>
                    Sandbox - For Testing
                  </div>
                </SelectItem>
                <SelectItem value="live">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Live</Badge>
                    Production - Real Payments
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Use Sandbox for testing. Switch to Live when ready to accept real payments.
            </p>
          </div>

          <Separator />

          {/* Client ID */}
          <div className="space-y-2">
            <Label htmlFor="clientId">
              PayPal Client ID
              {paypalSettings.clientId && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Set
                </Badge>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                id="clientId"
                type="text"
                placeholder="Enter your PayPal Client ID"
                value={paypalSettings.clientId}
                onChange={(e) => setPaypalSettings({ ...paypalSettings, clientId: e.target.value })}
                className="font-mono text-sm"
              />
              {paypalSettings.clientId && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(paypalSettings.clientId, "Client ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Found in PayPal Developer Dashboard → My Apps → Your App → Client ID
            </p>
          </div>

          {/* Client Secret */}
          <div className="space-y-2">
            <Label htmlFor="clientSecret">
              PayPal Client Secret
              {paypalSettings.hasSecret && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" /> Secured
                </Badge>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                id="clientSecret"
                type={showSecret ? "text" : "password"}
                placeholder="Enter your PayPal Client Secret"
                value={paypalSettings.clientSecret}
                onChange={(e) => setPaypalSettings({ ...paypalSettings, clientSecret: e.target.value })}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Keep this secret! Never share it publicly. Only visible once in PayPal Developer Dashboard.
            </p>
          </div>

          {/* Status Alert */}
          {paypalSettings.clientId && paypalSettings.hasSecret ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">PayPal Configured</AlertTitle>
              <AlertDescription className="text-green-700">
                Your PayPal integration is ready. Split payments will automatically send 85% to vendors and 15% to your platform account.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">PayPal Not Configured</AlertTitle>
              <AlertDescription className="text-amber-700">
                Enter your PayPal credentials above to enable split payments on your marketplace.
              </AlertDescription>
            </Alert>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSavePayPal}
            disabled={saving || !paypalSettings.clientId}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Save PayPal Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Google OAuth Setup */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Google OAuth Setup</CardTitle>
              <CardDescription>
                Configure Google sign-in for vendors and customers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {googleOAuthInfo && (
            <>
              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Setup Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  {googleOAuthInfo.instructions.map((instruction, i) => (
                    <li key={i}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <Separator />

              {/* URLs to configure */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">URLs to Add in Google Cloud Console</h4>
                
                {/* Authorized JavaScript Origins */}
                <div className="space-y-2">
                  <Label>Authorized JavaScript Origins</Label>
                  {googleOAuthInfo.authorizedJavascriptOrigins.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={url} readOnly className="font-mono text-sm bg-gray-50" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(url, "URL")}
                  >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Authorized Redirect URIs */}
                <div className="space-y-2">
                  <Label>Authorized Redirect URIs</Label>
                  {googleOAuthInfo.authorizedRedirectUris.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={url} readOnly className="font-mono text-sm bg-gray-50" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(url, "Redirect URI")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Next Steps</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {googleOAuthInfo.note}
                </AlertDescription>
              </Alert>

              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700"
                onClick={() => window.open("https://console.cloud.google.com/", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Google Cloud Console
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Commission Settings</CardTitle>
          <CardDescription>
            These settings control how revenue is split between vendors and the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-600 font-medium">Platform Commission</p>
              <p className="text-3xl font-bold text-emerald-700">15%</p>
              <p className="text-xs text-emerald-600 mt-1">Automatically deducted from each sale</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Vendor Earnings</p>
              <p className="text-3xl font-bold text-blue-700">85%</p>
              <p className="text-xs text-blue-600 mt-1">Paid directly to vendor PayPal account</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <AlertDialog open={successDialog} onOpenChange={setSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Settings Saved Successfully!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your PayPal credentials have been securely saved. Your marketplace can now process split payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700">
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
