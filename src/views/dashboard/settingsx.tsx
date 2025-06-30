import apiClient from "@/api";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import React, { useState } from "react";
import {
  FiBell,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiMoon,
  FiSun,
  FiTrash2,
} from "react-icons/fi";

interface NotificationPreferences {
  emailNotifications: boolean;
  jobAlerts: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme() as unknown as {
    theme: "light" | "dark";
    toggleTheme: () => void;
  };

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    marketingEmails: false,
    smsNotifications: false,
    pushNotifications: true,
  });

  const tabs = [
    { id: "password", label: "Password", icon: FiLock },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "preferences", label: "Preferences", icon: FiGlobe },
  ];

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords don't match", "error");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/profile/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Password changed successfully!", "success");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to change password";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast("Notification preferences updated!", "success");
    } catch (error) {
      showToast("Failed to update preferences", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    showToast(
      "Data export initiated. You'll receive an email shortly.",
      "info"
    );
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      showToast("Account deletion request submitted.", "info");
    }
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        checked ? "bg-primary" : "bg-muted"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const renderPasswordTab = () => (
    <div className="space-y-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Change Password
        </h3>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 pr-12 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCurrentPassword ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FiEye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            className="w-full px-4 py-2.5 pr-12 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showNewPassword ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FiEye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 pr-12 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FiEye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">
          Password Requirements:
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                passwordData.newPassword.length >= 8
                  ? "bg-green-500"
                  : "bg-muted"
              }`}
            />
            At least 8 characters long
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                /[A-Z]/.test(passwordData.newPassword)
                  ? "bg-green-500"
                  : "bg-muted"
              }`}
            />
            Contains uppercase letter
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                /[a-z]/.test(passwordData.newPassword)
                  ? "bg-green-500"
                  : "bg-muted"
              }`}
            />
            Contains lowercase letter
          </li>
          <li className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                /\d/.test(passwordData.newPassword)
                  ? "bg-green-500"
                  : "bg-muted"
              }`}
            />
            Contains a number
          </li>
        </ul>
      </div>

      <button
        onClick={handlePasswordChange}
        disabled={
          isLoading ||
          !passwordData.currentPassword ||
          !passwordData.newPassword ||
          !passwordData.confirmPassword
        }
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <FiLock className="w-4 h-4" />
        )}
        {isLoading ? "Changing..." : "Change Password"}
      </button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Notification Preferences
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose how you want to be notified about updates and activity
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Email Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive updates via email
            </p>
          </div>
          <ToggleSwitch
            checked={notifications.emailNotifications}
            onChange={(checked) =>
              setNotifications({
                ...notifications,
                emailNotifications: checked,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Job Alerts</h4>
            <p className="text-sm text-muted-foreground">
              Get notified about new job matches
            </p>
          </div>
          <ToggleSwitch
            checked={notifications.jobAlerts}
            onChange={(checked) =>
              setNotifications({ ...notifications, jobAlerts: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Application Updates</h4>
            <p className="text-sm text-muted-foreground">
              Updates on your job applications
            </p>
          </div>
          <ToggleSwitch
            checked={notifications.applicationUpdates}
            onChange={(checked) =>
              setNotifications({
                ...notifications,
                applicationUpdates: checked,
              })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">SMS Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Receive important updates via SMS
            </p>
          </div>
          <ToggleSwitch
            checked={notifications.smsNotifications}
            onChange={(checked) =>
              setNotifications({ ...notifications, smsNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Push Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Browser push notifications
            </p>
          </div>
          <ToggleSwitch
            checked={notifications.pushNotifications}
            onChange={(checked) =>
              setNotifications({ ...notifications, pushNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Marketing Emails</h4>
            <p className="text-sm text-muted-foreground">
              Tips, news, and product updates
            </p>
          </div>
          <ToggleSwitch
            checked={notifications.marketingEmails}
            onChange={(checked) =>
              setNotifications({ ...notifications, marketingEmails: checked })
            }
          />
        </div>
      </div>

      <button
        onClick={handleNotificationUpdate}
        disabled={isLoading}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <FiBell className="w-4 h-4" />
        )}
        {isLoading ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          App Preferences
        </h3>
        <p className="text-sm text-muted-foreground">
          Customize your experience with theme and display options
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Theme</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => (theme === "dark" ? toggleTheme() : undefined)}
              disabled={theme === "light"}
              className={`p-3 border rounded-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                theme === "light"
                  ? "border-primary bg-primary/10 cursor-not-allowed opacity-75"
                  : "border-border hover:border-primary/50 cursor-pointer"
              }`}
            >
              <FiSun className="w-5 h-5" />
              <span className="text-sm font-medium">
                Light {theme === "light" && "(Active)"}
              </span>
            </button>
            <button
              onClick={() => (theme === "light" ? toggleTheme() : undefined)}
              disabled={theme === "dark"}
              className={`p-3 border rounded-lg transition-all duration-200 flex flex-col items-center gap-2 ${
                theme === "dark"
                  ? "border-primary bg-primary/10 cursor-not-allowed opacity-75"
                  : "border-border hover:border-primary/50 cursor-pointer"
              }`}
            >
              <FiMoon className="w-5 h-5" />
              <span className="text-sm font-medium">
                Dark {theme === "dark" && "(Active)"}
              </span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Data & Privacy</h4>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 w-full text-left p-3 bg-muted/30 hover:bg-muted/50 border border-border rounded-lg transition-all"
            >
              <FiDownload className="w-4 h-4 text-primary" />
              <div>
                <span className="font-medium text-foreground">
                  Export Your Data
                </span>
                <p className="text-sm text-muted-foreground">
                  Download a copy of your data
                </p>
              </div>
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 w-full text-left p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg transition-all"
            >
              <FiTrash2 className="w-4 h-4 text-red-600" />
              <div>
                <span className="font-medium text-red-600">Delete Account</span>
                <p className="text-sm text-red-500">
                  Permanently delete your account and data
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "password":
        return renderPasswordTab();
      case "notifications":
        return renderNotificationsTab();
      case "preferences":
        return renderPreferencesTab();
      default:
        return renderPasswordTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-card border border-border rounded-xl p-4 sticky top-6">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
