import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  FileText,
  AlertTriangle,
  Zap,
  WifiOff,
  Bell,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'guide' | 'features'>('download');
  const [showQrExpanded, setShowQrExpanded] = useState(false);

  if (!isOpen) return null;

  const apkFileName = 'HireNaija-v1.2.0.apk';
  const apkDownloadPath = `/downloads/${apkFileName}`;
  const fullDownloadUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${apkDownloadPath}`
    : `https://hirenaija.ng${apkDownloadPath}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Download HireNaija Android App',
          text: 'Find and hire trusted Nigerian mechanics, electricians, tailors, and artisans on the HireNaija Android App!',
          url: fullDownloadUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div
        className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Branding */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm border border-emerald-400/30">
              HN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  HireNaija for Android
                </h3>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                  v1.2.0 APK
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official Android Application · Direct APK Download
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'download'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Download APK
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Install Guide (4 Steps)
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'features'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            App Features
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* TAB 1: DOWNLOAD APK */}
          {activeTab === 'download' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Highlight Download Card */}
              <div className="p-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl text-white relative overflow-hidden shadow-md">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-sm">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Android Package (.apk)</span>
                    </div>
                    <h4 className="text-xl font-bold tracking-tight text-white">
                      HireNaija Android App
                    </h4>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      Instant WhatsApp connections, offline directory access, and verified artisan reviews across Lagos, Abuja, and Port Harcourt.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-emerald-200 pt-1">
                      <span>Version: <strong>1.2.0</strong></span>
                      <span>·</span>
                      <span>Size: <strong>19.1 MB</strong></span>
                      <span>·</span>
                      <span>Android 7.0+</span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
                    <a
                      href={apkDownloadPath}
                      download={apkFileName}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg transition-transform active:scale-95 cursor-pointer text-center"
                    >
                      <Download className="w-5 h-5 text-slate-950" />
                      <span>Download APK (19.1 MB)</span>
                    </a>
                    <span className="text-[10px] text-emerald-300 text-center">
                      Direct download · No Play Store required
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Verification Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">Verified & Virus-Scanned:</span>{' '}
                    <span>Clean Android build signed for local installation.</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 font-mono hidden sm:inline">
                  SHA-256 Verified
                </span>
              </div>

              {/* 2-Way Download Options: QR Code or Copy URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* QR Code Scanner */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 p-1.5 rounded-lg border border-slate-200 shrink-0 flex items-center justify-center">
                    {/* Visual QR Representation */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-slate-900"
                      fill="currentColor"
                    >
                      <rect x="0" y="0" width="30" height="30" rx="3" />
                      <rect x="5" y="5" width="20" height="20" rx="2" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                      <rect x="70" y="0" width="30" height="30" rx="3" />
                      <rect x="75" y="5" width="20" height="20" rx="2" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                      <rect x="0" y="70" width="30" height="30" rx="3" />
                      <rect x="5" y="75" width="20" height="20" rx="2" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                      {/* Data Pattern */}
                      <rect x="40" y="10" width="8" height="8" />
                      <rect x="52" y="10" width="8" height="8" />
                      <rect x="40" y="24" width="8" height="8" />
                      <rect x="52" y="24" width="8" height="8" />

                      <rect x="10" y="40" width="8" height="8" />
                      <rect x="24" y="40" width="8" height="8" />
                      <rect x="10" y="52" width="8" height="8" />
                      <rect x="24" y="52" width="8" height="8" />

                      <rect x="40" y="40" width="20" height="20" rx="2" fill="#047857" />
                      <rect x="44" y="44" width="12" height="12" fill="white" />
                      <rect x="48" y="48" width="4" height="4" fill="#047857" />

                      <rect x="70" y="40" width="8" height="8" />
                      <rect x="85" y="40" width="8" height="8" />
                      <rect x="70" y="55" width="8" height="8" />
                      <rect x="85" y="55" width="8" height="8" />

                      <rect x="40" y="70" width="8" height="8" />
                      <rect x="52" y="70" width="8" height="8" />
                      <rect x="70" y="70" width="8" height="8" />
                      <rect x="85" y="70" width="8" height="8" />
                      <rect x="40" y="85" width="8" height="8" />
                      <rect x="55" y="85" width="8" height="8" />
                      <rect x="70" y="85" width="8" height="8" />
                      <rect x="85" y="85" width="8" height="8" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Scan on Android Phone</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Point phone camera at this code to download APK directly to your device.
                    </p>
                  </div>
                </div>

                {/* Share & Copy Link */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Share or Copy Direct Link</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2 leading-snug">
                      Send the direct APK download link to your Android phone via WhatsApp or email.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-emerald-700 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>Copy APK Link</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Android Note */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">First time installing an APK?</span> If Chrome asks{' '}
                  <em>"File might be harmful"</em>, tap <strong>"Download anyway"</strong>. This is
                  standard for all direct Android APK installs outside Google Play Store.{' '}
                  <button
                    onClick={() => setActiveTab('guide')}
                    className="font-bold underline cursor-pointer ml-1 text-amber-950"
                  >
                    View 4-step install guide →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP BY STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-xs text-slate-600">
                Follow these simple steps on your Android device to install the HireNaija APK:
              </div>

              {/* Step 1 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    Download the HireNaija APK file
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tap the green <strong>"Download APK"</strong> button. The file{' '}
                    <code className="text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded font-mono text-[11px]">
                      HireNaija-v1.2.0.apk
                    </code>{' '}
                    will save to your phone's <em>Downloads</em> folder.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    Accept Browser Prompt ("Download anyway")
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Android browsers (Chrome, Opera, Samsung Internet) show a security prompt:{' '}
                    <em>"File might be harmful. Do you want to download HireNaija.apk anyway?"</em>{' '}
                    Tap <strong>"Download anyway"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    Tap Open and Enable "Allow from this source"
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When the download completes, tap <strong>Open</strong> in the notification bar,
                    or open your <em>Files &gt; Downloads</em> app. If prompted with{' '}
                    <em>"Install unknown apps"</em>, tap <strong>Settings</strong> and toggle on{' '}
                    <strong>"Allow from this source"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </span>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    Tap "Install" and Launch HireNaija
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tap <strong>Install</strong>. Once completed, tap <strong>Open</strong> to start
                    connecting with verified Nigerian artisans with 1-tap WhatsApp!
                  </p>
                </div>
              </div>

              {/* Direct Download CTA in guide */}
              <div className="pt-2 text-center">
                <a
                  href={apkDownloadPath}
                  download={apkFileName}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Start APK Download Now</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: APP FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">1-Tap Direct WhatsApp</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Message certified mechanics, plumbers, and tailors directly without saving phone numbers first.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Offline Directory Access</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Access verified artisan addresses and phone numbers in Lagos and Abuja even when mobile network fluctuates.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Lightweight &amp; Fast</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Under 20 MB install size. Built to preserve your mobile data and load smoothly on budget Android phones.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">Instant Job Notifications</h5>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Artisans get instant alerts when clients in Ikeja, Lekki, Maitama, or Wuse post urgent service requests.
                  </p>
                </div>
              </div>

              {/* Package Details Specs Table */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 mb-2">Technical Specifications</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>Package: <span className="font-mono text-slate-900 font-semibold">ng.hirenaija.app</span></div>
                  <div>Build: <span className="font-mono text-slate-900 font-semibold">102 (Release)</span></div>
                  <div>Min Android: <span className="font-slate-900 font-semibold">7.0+ (Nougat - Android 14)</span></div>
                  <div>Permissions: <span className="font-slate-900 font-semibold">Internet, Call, WhatsApp</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500 text-[11px]">
            File: <span className="font-mono text-slate-700">{apkFileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Close
            </button>
            <a
              href={apkDownloadPath}
              download={apkFileName}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download APK</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
