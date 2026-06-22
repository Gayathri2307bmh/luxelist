/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown,
  Sparkles,
  ShoppingBag,
  Heart,
  TrendingUp,
  Bell,
  User,
  Settings,
  Plus,
  Trash2,
  Percent,
  LogOut,
  DollarSign,
  Award,
  Download,
  Share2,
  Send,
  X,
  Sliders,
  Calendar,
  Flame,
  Zap,
  CheckCircle,
  Circle,
  RefreshCw,
  Info,
  Check,
  Menu,
  ChevronDown
} from "lucide-react";
import AmbientEffects from "./components/AmbientEffects";
import LuxeLogo from "./components/LuxeLogo";
import { 
  User as LuxeUser,
  ShoppingItem, 
  WishlistItem, 
  Budget, 
  Achievement, 
  Reminder, 
  Suggestion, 
  OptimizationResponse, 
  Recommendation 
} from "./types";

const getPasswordStrength = (pass: string) => {
  if (!pass) return null;
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { label: "Weak ❌", color: "text-rose-400", score: 1 };
  if (score <= 2) return { label: "Fair ⚠️", color: "text-amber-400", score: 2 };
  if (score <= 3) return { label: "Good ⚡", color: "text-indigo-400", score: 3 };
  return { label: "Excellent Shield 💪✨", color: "text-emerald-400", score: 4 };
};

const getFormattedHeaderDate = (date: Date) => {
  const day = date.getDate();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");
  const hrStr = String(hours).padStart(2, "0");
  
  return (
    <>
      <span className="text-slate-400 font-medium">{day} {monthName} {year}</span>
      <span className="text-slate-300 mx-1.5">•</span>
      <span className="font-mono text-purple-600 font-extrabold tracking-wide">
        {hrStr}:{min}:{sec} <span className="text-purple-500 font-bold">{ampm}</span>
      </span>
    </>
  );
};

export default function App() {
  // Application State
  const [user, setUser] = useState<LuxeUser | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "shopping" | "wishlist" | "budgets" | "analytics" | "reminders" | "settings">(() => {
    const saved = localStorage.getItem("luxelist_active_tab");
    const validTabs = ["dashboard", "shopping", "wishlist", "budgets", "analytics", "reminders", "settings"];
    return (saved && validTabs.includes(saved)) ? (saved as any) : "dashboard";
  });
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [budget, setBudget] = useState<Budget>({ user_id: "", monthly_budget: 15000, spent_amount: 0, remaining_amount: 15000 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", text: "Time to buy your lipstick 💄", time: "18:00", active: true, badgeEmoji: "💄" },
    { id: "2", text: "Your lavender essential oils are waiting 🌿", time: "10:30", active: true, badgeEmoji: "🌿" },
    { id: "3", text: "Weekly budget revision routine 💰", time: "15:00", active: false, badgeEmoji: "💰" }
  ]);
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: "info" | "success" | "warning" }[]>([]);
  
  // App Theme configuration
  const [theme, setTheme] = useState<"royal-lavender" | "midnight-lavender" | "classic-orchid">("royal-lavender");

  // Interaction Forms & Modals states
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Beauty");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");

  const [isAddingWish, setIsAddingWish] = useState(false);
  const [newWishName, setNewWishName] = useState("");
  const [newWishPrice, setNewWishPrice] = useState("");
  const [newWishPriority, setNewWishPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newReminderText, setNewReminderText] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("12:00");

  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [currentAuthState, setCurrentAuthState] = useState<"login" | "register" | "forgot" | "reset" | "verify">("login");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState("");
  const [passwordResetLink, setPasswordResetLink] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authValidationError, setAuthValidationError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  // Header profile menu state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // View Profile Modal state
  const [isMyProfileModalOpen, setIsMyProfileModalOpen] = useState(false);
  // Profile edit fields
  const [profileEditName, setProfileEditName] = useState("");
  const [profileEditEmail, setProfileEditEmail] = useState("");
  const [profileEditImage, setProfileEditImage] = useState<string | null>(null);
  
  // AI Interactive state variables
  const [aiItemQuery, setAiItemQuery] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>([]);
  const [isSuggestingLoading, setIsSuggestingLoading] = useState(false);

  const [aiOptimize, setAiOptimize] = useState<OptimizationResponse | null>(null);
  const [analyticsMetric, setAnalyticsMetric] = useState<"completed" | "planned" | "all">("completed");
  const [isOptimizingLoading, setIsOptimizingLoading] = useState(false);

  const [aiRecommend, setAiRecommend] = useState<Recommendation[]>([]);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);

  const [splashCompleted, setSplashCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Interactive Legal / About pages state hooks
  const [openLegalDocument, setOpenLegalDocument] = useState<"privacy" | "terms" | "about" | "contact" | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTopic, setContactTopic] = useState("General Support");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccessTicket, setContactSuccessTicket] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Synchronizing Loader
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSharingList, setIsSharingList] = useState(false);

  const getFormattedListText = () => {
    const itemsText = shoppingItems.length > 0
      ? shoppingItems.map(item => `• ${item.item_name}`).join("\n")
      : "• (No items in your shopping list yet)";

    return `🛒 Shopping List

${itemsText}

Total Budget: ₹${budget.monthly_budget.toLocaleString()}
Budget Used: ₹${totalSpendComputed.toLocaleString()}
Remaining: ₹${(budget.monthly_budget - totalSpendComputed).toLocaleString()}`;
  };

  const copyToClipboard = (text: string, type: "link" | "text" | "instagram") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      spawnToast("Application link copied to clipboard! 🔗", "success");
    } else if (type === "instagram") {
      spawnToast("List copied! Paste it in your Instagram messages or stories 📸💜", "success");
    } else {
      spawnToast("Shopping list copied to clipboard! 📋✨", "success");
    }
  };

  // Load and recover session status
  useEffect(() => {
    const savedUser = localStorage.getItem("luxelist_user");
    const savedTheme = localStorage.getItem("luxelist_theme") as any;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        fetchUserData(parsed.id);
      } catch (err) {
        console.error("Failed to parse saved session", err);
      }
    }
  }, [theme]);

  // Synchronize active tab in localStorage
  useEffect(() => {
    localStorage.setItem("luxelist_active_tab", activeTab);
  }, [activeTab]);

  // Lock body scroll when navigation drawer is open (only on mobile and tablet)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "";
      } else if (isSidebarOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  // Toast Creator Helper
  const spawnToast = (text: string, type: "info" | "success" | "warning" = "success") => {
    const toastId = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id: toastId, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== toastId));
    }, 4500);
  };

  const fetchUserData = async (userId: string) => {
    setIsSyncing(true);

    // 0. Update and track login streak (consecutive days) in user local timezone
    const dStr = new Date();
    const localDate = `${dStr.getFullYear()}-${String(dStr.getMonth() + 1).padStart(2, "0")}-${String(dStr.getDate()).padStart(2, "0")}`;

    try {
      const streakResp = await fetch("/api/auth/streak-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, localDate })
      });
      if (streakResp.ok) {
        const sData = await streakResp.json();
        setUser((prev) => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            current_streak: sData.current_streak,
            longest_streak: sData.longest_streak,
            last_login_date: sData.last_login_date
          };
          localStorage.setItem("luxelist_user", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (streakErr) {
      console.warn("Express server streak-update unreachable. Running local fallback streak calc.", streakErr);
      setUser((prev) => {
        if (!prev) return prev;
        let current = Number(prev.current_streak) || 0;
        let longest = Number(prev.longest_streak) || 0;
        let lastLogin = prev.last_login_date;
        
        if (!lastLogin) {
          current = 1;
          lastLogin = localDate;
        } else if (lastLogin !== localDate) {
          const dPrev = new Date(lastLogin + "T00:00:00");
          const dToday = new Date(localDate + "T00:00:00");
          const diffDays = Math.round((dToday.getTime() - dPrev.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            current += 1;
            lastLogin = localDate;
          } else if (diffDays > 1) {
            current = 1;
            lastLogin = localDate;
          }
        }
        if (current > longest) longest = current;
        const updated = { ...prev, current_streak: current, longest_streak: longest, last_login_date: lastLogin };
        localStorage.setItem("luxelist_user", JSON.stringify(updated));
        return updated;
      });
    }

    try {
      // 1. Fetch item entries
      const listResp = await fetch(`/api/items?userId=${userId}`);
      if (listResp.ok) {
        const data = await listResp.json();
        setShoppingItems(data);
      }

      // 2. Fetch Wishlist entries
      const wishResp = await fetch(`/api/wishlist?userId=${userId}`);
      if (wishResp.ok) {
        const data = await wishResp.json();
        setWishlist(data);
      }

      // 3. Fetch Budgets
      const bResp = await fetch(`/api/budgets?userId=${userId}`);
      if (bResp.ok) {
        const data = await bResp.json();
        setBudget(data);
        setNewBudgetAmount(data.monthly_budget.toString());
      }

      // 4. Fetch Achievements
      const achResp = await fetch(`/api/achievements?userId=${userId}`);
      if (achResp.ok) {
        const data = await achResp.json();
        setAchievements(data);
      }

      // 5. Fetch Reminders
      const remResp = await fetch(`/api/reminders?userId=${userId}`);
      if (remResp.ok) {
        const data = await remResp.json();
        setReminders(data);
      }
    } catch (err) {
      console.warn("Express server unreachable or offline. Running locally with mock sync.");
      // Seed default local dummy items if empty
      seedLocalFallback();
    } finally {
      setIsSyncing(false);
    }
  };

  const seedLocalFallback = () => {
    setShoppingItems([
      { id: "item_fall1", user_id: "guest", item_name: "Velvet Lipstick", emoji: "💄", category: "Beauty", quantity: 1, price: 1200, notes: "Shade: Pink Rose", completed: false, created_at: new Date().toISOString() },
      { id: "item_fall2", user_id: "guest", item_name: "Lavender Perfume", emoji: "🌸", category: "Fragrance", quantity: 1, price: 4500, notes: "100ml spray bottle", completed: false, created_at: new Date().toISOString() },
      { id: "item_fall3", user_id: "guest", item_name: "Ribbed Knit Sweater", emoji: "👗", category: "Fashion", quantity: 1, price: 3800, notes: "Spring apparel styling", completed: true, created_at: new Date().toISOString() }
    ]);
    setWishlist([
      { id: "wish_fall1", user_id: "guest", item_name: "Beaded Crossbody Handbag", emoji: "👜", target_price: 6500, priority: "High", created_at: new Date().toISOString() },
      { id: "wish_fall2", user_id: "guest", item_name: "Sparkle Solitaire Ring", emoji: "💍", target_price: 15000, priority: "Medium", created_at: new Date().toISOString() }
    ]);
    const initBudget = { user_id: "guest", monthly_budget: 15000, spent_amount: 3800, remaining_amount: 11200 };
    setBudget(initBudget);
    setNewBudgetAmount("15000");
    setAchievements([
      { id: "ach_fall1", user_id: "guest", badge_name: "Trend Setter 👗", earned_at: new Date().toISOString() },
      { id: "ach_fall2", user_id: "guest", badge_name: "Budget Master 💰", earned_at: new Date().toISOString() }
    ]);
  };

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthValidationError(null);
    setAuthSuccessMessage(null);
    
    if (currentAuthState === "login") {
      if (!authEmail || !authPassword) {
        setAuthValidationError("Email and password are required.");
        return;
      }
      setIsAuthLoading(true);
      try {
        const resp = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword })
        });
        const data = await resp.json();
        if (resp.ok) {
          const fetchedUser = data.user;
          
          if (fetchedUser.verified === false) {
            // User is not verified, take them to verification screen
            setVerificationToken("");
            // request verification token
            try {
              const resendResp = await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail })
              });
              const resendData = await resendResp.json();
              if (resendResp.ok) {
                setVerificationToken(resendData.verificationToken);
                setVerificationLink(resendData.verificationLink);
              }
            } catch (err) {
              console.error("Resend err", err);
            }
            setCurrentAuthState("verify");
            spawnToast("Please verify your email address to continue.", "info");
          } else {
            setUser(fetchedUser);
            if (rememberMe) {
              localStorage.setItem("luxelist_user", JSON.stringify(fetchedUser));
            } else {
              sessionStorage.setItem("luxelist_user", JSON.stringify(fetchedUser));
            }
            spawnToast(`Welcome back, ${fetchedUser.name}! 🌟`, "success");
            fetchUserData(fetchedUser.id);
          }
        } else {
          setAuthValidationError(data.error || "Invalid credentials.");
        }
      } catch (err) {
        // Fallback local password login for convenience/offline testing
        if (authPassword.length >= 6) {
          const mockUser = {
            id: "u_" + Math.random().toString(36).substring(2, 9),
            name: authName || authEmail.split("@")[0] || "Guest",
            email: authEmail,
            theme: "royal-lavender",
            profile_image: null,
            created_at: new Date().toISOString(),
            verified: true
          };
          setUser(mockUser);
          if (rememberMe) {
            localStorage.setItem("luxelist_user", JSON.stringify(mockUser));
          } else {
            sessionStorage.setItem("luxelist_user", JSON.stringify(mockUser));
          }
          spawnToast("Authenticated (Simulation Bypassed)! ✓", "success");
          seedLocalFallback();
        } else {
          setAuthValidationError("Incorrect email or password. Password must be 6+ chars.");
        }
      } finally {
        setIsAuthLoading(false);
      }
    } else if (currentAuthState === "register") {
      if (!authName || !authEmail || !authPassword) {
        setAuthValidationError("All fields are required.");
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthValidationError("Passwords do not match.");
        return;
      }
      
      // Robust password strength strength front-end check
      if (authPassword.length < 8) {
        setAuthValidationError("Password must be at least 8 characters long.");
        return;
      }
      const hasLetter = /[a-zA-Z]/.test(authPassword);
      const hasNumOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(authPassword);
      if (!hasLetter || !hasNumOrSpecial) {
        setAuthValidationError("Password must contain both letters and numbers/special characters.");
        return;
      }

      setIsAuthLoading(true);
      try {
        const resp = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: authName, email: authEmail, password: authPassword })
        });
        const data = await resp.json();
        if (resp.ok) {
          setVerificationToken(data.verificationToken);
          setVerificationLink(data.verificationLink);
          setAuthSuccessMessage("Account created successfully! Please verify your email.");
          setCurrentAuthState("verify");
          spawnToast("Success! Please proceed with email verification.", "success");
        } else {
          setAuthValidationError(data.error || "Registration failed.");
        }
      } catch (err) {
        setAuthValidationError("Failed to connect to authentication server. Please try again.");
      } finally {
        setIsAuthLoading(false);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthValidationError(null);
    setAuthSuccessMessage(null);
    if (!authEmail) {
      setAuthValidationError("Email address is required.");
      return;
    }

    setIsAuthLoading(true);
    try {
      const resp = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail })
      });
      const data = await resp.json();
      if (resp.ok) {
        setPasswordResetToken(data.resetToken);
        setPasswordResetLink(data.resetLink);
        setAuthSuccessMessage("Reset instructions simulated! Use the verification box below to complete the reset.");
        spawnToast("Instructions simulated successfully!", "success");
      } else {
        setAuthValidationError(data.error || "Email not found.");
      }
    } catch (err) {
      setAuthValidationError("Failed to complete forgot password simulation.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthValidationError(null);
    setAuthSuccessMessage(null);
    if (!authPassword || !authConfirmPassword) {
      setAuthValidationError("Please fill in both password fields.");
      return;
    }
    if (authPassword !== authConfirmPassword) {
      setAuthValidationError("Passwords do not match.");
      return;
    }

    if (authPassword.length < 8) {
      setAuthValidationError("Password must be at least 8 characters.");
      return;
    }

    setIsAuthLoading(true);
    try {
      const resp = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: passwordResetToken, password: authPassword })
      });
      const data = await resp.json();
      if (resp.ok) {
        setAuthSuccessMessage("Password reset successfully! You can now log in.");
        setCurrentAuthState("login");
        setAuthPassword("");
        setAuthConfirmPassword("");
        spawnToast("Password security updated!✓", "success");
      } else {
        setAuthValidationError(data.error || "Reset failed.");
      }
    } catch (err) {
      setAuthValidationError("Failed to update password.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleVerifyEmail = async (tokenToUse: string) => {
    setAuthValidationError(null);
    setAuthSuccessMessage(null);
    setIsAuthLoading(true);
    try {
      const resp = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToUse })
      });
      const data = await resp.json();
      if (resp.ok) {
        setUser(data.user);
        if (rememberMe) {
          localStorage.setItem("luxelist_user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("luxelist_user", JSON.stringify(data.user));
        }
        spawnToast("Email verified successfully! Welcome! 🎉🏆", "success");
        fetchUserData(data.user.id);
      } else {
        setAuthValidationError(data.error || "Invalid or expired token.");
      }
    } catch (err) {
      setAuthValidationError("Verification failed. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setAuthValidationError(null);
    setAuthSuccessMessage(null);
    if (!authEmail) {
      setAuthValidationError("Enter email address to reset/verify.");
      return;
    }
    try {
      const resp = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail })
      });
      const data = await resp.json();
      if (resp.ok) {
        setVerificationToken(data.verificationToken);
        setVerificationLink(data.verificationLink);
        setAuthSuccessMessage("Verification link generated successfully!");
        spawnToast("New validation code dispatched!✓", "info");
      } else {
        setAuthValidationError(data.error || "Failed to resend code.");
      }
    } catch (err) {
      setAuthValidationError("Offline verification simulator activated.");
    }
  };

  const handleGoogleLoginMock = async () => {
    setAuthValidationError(null);
    setIsAuthLoading(true);
    try {
      const resp = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "gayatribellamkonda088@gmail.com",
          name: "Gayatri Bellamkonda",
          profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        localStorage.setItem("luxelist_user", JSON.stringify(data.user));
        spawnToast("Authenticated successfully with Google! ✓", "success");
        fetchUserData(data.user.id);
      }
    } catch (err) {
      // Offline fallback google login
      const mockUser = {
        id: "u_google_mock",
        name: "Gayatri Bellamkonda",
        email: "gayatribellamkonda088@gmail.com",
        theme: "royal-lavender",
        profile_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        created_at: new Date().toISOString(),
        verified: true
      };
      setUser(mockUser);
      localStorage.setItem("luxelist_user", JSON.stringify(mockUser));
      spawnToast("Authenticated with Google Account! ✓", "success");
      seedLocalFallback();
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGuestEnroll = () => {
    const guestUser = {
      id: "u_anonymous_guest",
      name: "Guest User",
      email: "guest@luxelist.app",
      theme: "royal-lavender",
      profile_image: null,
      created_at: new Date().toISOString(),
      verified: true
    };
    setUser(guestUser);
    localStorage.setItem("luxelist_user", JSON.stringify(guestUser));
    spawnToast("Entered as guest! All data stored in active memory.", "success");
    seedLocalFallback();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("luxelist_user");
    sessionStorage.removeItem("luxelist_user");
    // Clear state
    setShoppingItems([]);
    setWishlist([]);
    setBudget({ user_id: "", monthly_budget: 15000, spent_amount: 0, remaining_amount: 15000 });
    setAchievements([]);
    setReminders([]);
    // Back to Login UI
    setCurrentAuthState("login");
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
    setAuthConfirmPassword("");
    setAuthValidationError(null);
    setAuthSuccessMessage(null);
    spawnToast("Successfully signed out.", "info");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!profileEditName.trim()) {
      spawnToast("Full name cannot be blank.", "warning");
      return;
    }

    try {
      const resp = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: profileEditName,
          email: profileEditEmail,
          profileImage: profileEditImage
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        
        // Save current theme setting
        if (localStorage.getItem("luxelist_user")) {
          localStorage.setItem("luxelist_user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("luxelist_user", JSON.stringify(data.user));
        }
        
        setIsMyProfileModalOpen(false);
        spawnToast("User profile synchronized perfectly! 🎭✨", "success");
      } else {
        const err = await resp.json();
        spawnToast(err.error || "Profile synchronization failed.", "warning");
      }
    } catch (err) {
      // Local recovery fallback
      const updated = {
        ...user,
        name: profileEditName,
        email: profileEditEmail,
        profile_image: profileEditImage
      };
      setUser(updated);
      localStorage.setItem("luxelist_user", JSON.stringify(updated));
      setIsMyProfileModalOpen(false);
      spawnToast("User profile updated locally.", "success");
    }
  };

  // Add Item to Shopping List
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) {
      spawnToast("Please complete item description name.", "warning");
      return;
    }

    const priceNum = parseFloat(newItemPrice) || 0;
    const authorId = user?.id || "u_anonymous_guest";

    try {
      const resp = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authorId,
          item_name: newItemName,
          category: newItemCategory,
          quantity: newItemQty,
          price: priceNum,
          notes: newItemNotes
        })
      });

      if (resp.ok) {
        const addedItem = await resp.json();
        setShoppingItems((prev) => [...prev, addedItem]);
        spawnToast(`Added ${addedItem.emoji} ${addedItem.item_name} successfully!`, "success");
        fetchUserData(authorId);
      }
    } catch (err) {
      // Offline implementation
      const simulatedItem: ShoppingItem = {
        id: "item_" + Math.random().toString(36).substring(2, 9),
        user_id: authorId,
        item_name: newItemName,
        emoji: getClientEmoji(newItemName),
        category: newItemCategory,
        quantity: newItemQty,
        price: priceNum,
        notes: newItemNotes || null,
        completed: false,
        created_at: new Date().toISOString()
      };
      setShoppingItems((prev) => [...prev, simulatedItem]);
      spawnToast(`Added ${simulatedItem.emoji} ${simulatedItem.item_name} locally!`, "success");
    } finally {
      setIsAddingItem(false);
      setNewItemName("");
      setNewItemPrice("");
      setNewItemNotes("");
      setNewItemQty(1);
    }
  };

  const getClientEmoji = (name: string): string => {
    const lowered = name.toLowerCase();
    if (lowered.includes("lipstick")) return "💄";
    if (lowered.includes("perfume") || lowered.includes("fragrance") || lowered.includes("parfum")) return "🌸";
    if (lowered.includes("shoes") || lowered.includes("heels")) return "👠";
    if (lowered.includes("handbag") || lowered.includes("purse") || lowered.includes("bag")) return "👜";
    if (lowered.includes("laptop") || lowered.includes("macbook")) return "💻";
    if (lowered.includes("phone") || lowered.includes("iphone")) return "📱";
    if (lowered.includes("book") || lowered.includes("novel")) return "📚";
    if (lowered.includes("cake") || lowered.includes("cupcake") || lowered.includes("bake")) return "🎂";
    if (lowered.includes("coffee") || lowered.includes("latte") || lowered.includes("tea")) return "☕";
    if (lowered.includes("jewelry") || lowered.includes("ring") || lowered.includes("necklace")) return "💍";
    return "🛍️";
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    const authorId = user?.id || "u_anonymous_guest";
    try {
      const resp = await fetch(`/api/items/${id}?userId=${authorId}`, { method: "DELETE" });
      if (resp.ok) {
        setShoppingItems((prev) => prev.filter((it) => it.id !== id));
        spawnToast("Item removed smoothly.", "info");
        fetchUserData(authorId);
      }
    } catch (err) {
      setShoppingItems((prev) => prev.filter((it) => it.id !== id));
      spawnToast("Item deleted locally.", "info");
    }
  };

  // Toggle Completed Status with automated budget recalculations
  const handleToggleCompleted = async (item: ShoppingItem) => {
    const authorId = user?.id || "u_anonymous_guest";
    const nextStatus = !item.completed;

    try {
      const resp = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authorId,
          completed: nextStatus
        })
      });

      if (resp.ok) {
        setShoppingItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, completed: nextStatus } : it))
        );
        if (nextStatus) {
          spawnToast(`Marked ${item.emoji} ${item.item_name} as purchased!`, "success");
        }
        fetchUserData(authorId);
      }
    } catch (err) {
      setShoppingItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, completed: nextStatus } : it))
      );
      spawnToast("Status toggled locally.", "success");
    }
  };

  // Handle Adding item to Wishlist
  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName) return;

    const authorId = user?.id || "u_anonymous_guest";
    const targetPriceNum = parseFloat(newWishPrice) || 0;

    try {
      const resp = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authorId,
          item_name: newWishName,
          target_price: targetPriceNum,
          priority: newWishPriority
        })
      });

      if (resp.ok) {
        const savedWish = await resp.json();
        setWishlist((prev) => [...prev, savedWish]);
        spawnToast(`Added ${savedWish.item_name} to wishlist!`, "success");
        fetchUserData(authorId);
      }
    } catch (err) {
      const generatedWish: WishlistItem = {
        id: "wish_" + Math.random().toString(36).substring(2, 9),
        user_id: authorId,
        item_name: newWishName,
        emoji: getClientEmoji(newWishName),
        target_price: targetPriceNum,
        priority: newWishPriority,
        created_at: new Date().toISOString()
      };
      setWishlist((prev) => [...prev, generatedWish]);
      spawnToast("Added to local wishlist.", "success");
    } finally {
      setIsAddingWish(false);
      setNewWishName("");
      setNewWishPrice("");
    }
  };

  // Delete Wishlist Item
  const handleDeleteWish = async (id: string) => {
    const authorId = user?.id || "u_anonymous_guest";
    try {
      const resp = await fetch(`/api/wishlist/${id}?userId=${authorId}`, { method: "DELETE" });
      if (resp.ok) {
        setWishlist((prev) => prev.filter((it) => it.id !== id));
        spawnToast("Removed item from wish vault.", "info");
      }
    } catch (err) {
      setWishlist((prev) => prev.filter((it) => it.id !== id));
      spawnToast("Wish deleted locally.", "info");
    }
  };

  // Promote WishlistItem to Shopping List
  const handlePromoteToShopping = async (wish: WishlistItem) => {
    const authorId = user?.id || "u_anonymous_guest";
    try {
      // Primary: Create product in shopping items list
      const resp = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authorId,
          item_name: wish.item_name,
          category: "Fashion",
          quantity: 1,
          price: wish.target_price,
          notes: "Promoted and curated from Wishlist!"
        })
      });

      if (resp.ok) {
        const added = await resp.json();
        setShoppingItems((prev) => [...prev, added]);
        // Secondary: Remove from wishlist
        await fetch(`/api/wishlist/${wish.id}?userId=${authorId}`, { method: "DELETE" });
        setWishlist((prev) => prev.filter((it) => it.id !== wish.id));
        spawnToast(`Successfully promoted ${wish.item_name} to shopping list! 🚀`, "success");
        fetchUserData(authorId);
      }
    } catch (err) {
      // Local fallback
      const mockPromoted: ShoppingItem = {
        id: "item_p_" + Math.random().toString(36).substring(2, 9),
        user_id: authorId,
        item_name: wish.item_name,
        emoji: wish.emoji || "🛍️",
        category: "Other",
        quantity: 1,
        price: wish.target_price,
        notes: "Promoted from design wishlist!",
        completed: false,
        created_at: new Date().toISOString()
      };
      setShoppingItems((prev) => [...prev, mockPromoted]);
      setWishlist((prev) => prev.filter((it) => it.id !== wish.id));
      spawnToast("Promoted locally to shopping list.", "success");
    }
  };

  // Update budget configurations
  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetAmount) return;

    const limit = parseFloat(newBudgetAmount) || 0;
    const authorId = user?.id || "u_anonymous_guest";

    try {
      const resp = await fetch("/api/budgets/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authorId, monthly_budget: limit })
      });

      if (resp.ok) {
        const updated = await resp.json();
        setBudget(updated);
        spawnToast(`Budget updated to ₹${updated.monthly_budget}!`, "success");
        fetchUserData(authorId);
      }
    } catch (err) {
      setBudget((prev) => ({
        ...prev,
        monthly_budget: limit,
        remaining_amount: Math.max(0, limit - prev.spent_amount)
      }));
      spawnToast(`Local budget limit set to ₹${limit}`, "success");
    }
  };

  // AI Assistant: Smart Accessory Suggestions
  const handleAiSuggestQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiItemQuery) return;

    setIsSuggestingLoading(true);
    try {
      const resp = await fetch("/api/assistant/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: aiItemQuery })
      });
      if (resp.ok) {
        const data = await resp.json();
        setAiSuggestions(data.suggestions || []);
        spawnToast("AI generated helpful style suggestions! 🌸", "success");
      }
    } catch (err) {
      spawnToast("AI server unavailable. Outputting simulated styling advice.", "info");
      setAiSuggestions([
        { item: `${aiItemQuery} Organizer`, emoji: "🎀", reason: "Saves wear and tear, keeping your items organized.", brandTip: "Save ₹400 on standard utility cases." },
        { item: "Lavender Scent Mist", emoji: "🌸", reason: "Adds a pleasant fresh aroma to the room.", brandTip: "Clean standard finish." }
      ]);
    } finally {
      setIsSuggestingLoading(false);
    }
  };

  // AI Assistant: Ask Gemini to trigger Budget optimizations
  const handleTriggerOptimize = async () => {
    if (shoppingItems.length === 0) {
      spawnToast("Please add items to your shopping list to try optimization.", "warning");
      return;
    }

    setIsOptimizingLoading(true);
    try {
      const resp = await fetch("/api/assistant/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget: budget.monthly_budget,
          items: shoppingItems
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        setAiOptimize(data);
        spawnToast("Budget savings suggestions generated! 💰", "success");
      }
    } catch (err) {
      setAiOptimize({
        recommendations: [
          { originalItem: "Lavender Oud Perfume", alternativeItem: "Organic Lavender Balm", savings: 1500, comment: "Swap spray with organic solid balm to save ₹1,500." }
        ],
        totalSavingsPotential: 1500,
        feedback: "Your spending is well-structured. Adjust list items with savings tips to stay within budget."
      });
      spawnToast("Savings suggestions generated.", "info");
    } finally {
      setIsOptimizingLoading(false);
    }
  };

  // AI Assistant: Generate Personalized lifestyle recommendations based on purchase history
  const handlePersonalizedRecommend = async () => {
    setIsRecommendLoading(true);
    const historyTerms = shoppingItems.map((s) => s.item_name);

    try {
      const resp = await fetch("/api/assistant/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: historyTerms })
      });

      if (resp.ok) {
        const data = await resp.json();
        setAiRecommend(data.recommendations || []);
        spawnToast("Recommendations compiled based on your purchase history!", "success");
      }
    } catch (err) {
      setAiRecommend([
        { item: "Velvet Body Lotion", emoji: "🧴", category: "Beauty", description: "Deeply moisturizing night treatment inspired by spa selections.", estimatedPrice: 2200 },
        { item: "Lavender Bath Salts Collection", emoji: "🌸", category: "Beauty", description: "Infused with organic calming ingredients for evening relaxation.", estimatedPrice: 750 }
      ]);
      spawnToast("Compiled offline recommendations.", "info");
    } finally {
      setIsRecommendLoading(false);
    }
  };

  // Reminder management
  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText) return;

    const authorId = user?.id || "u_anonymous_guest";

    try {
      const resp = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authorId,
          text: newReminderText,
          time: newReminderTime,
          badgeEmoji: getClientEmoji(newReminderText)
        })
      });

      if (resp.ok) {
        const added = await resp.json();
        setReminders((prev) => [...prev, added]);
        spawnToast("Schedule alarm entry logged perfectly! ⏰", "success");
        setNewReminderText("");
      } else {
        throw new Error("Failed to post reminder to server.");
      }
    } catch (err) {
      const newRem: Reminder = {
        id: Math.random().toString(36).substring(2, 9),
        text: newReminderText,
        time: newReminderTime,
        active: true,
        badgeEmoji: getClientEmoji(newReminderText)
      };
      setReminders((prev) => [...prev, newRem]);
      spawnToast("Schedule alarm entry logged locally! ⏰", "success");
      setNewReminderText("");
    }
  };

  const handleToggleReminder = async (id: string) => {
    const r = reminders.find(item => item.id === id);
    if (!r) return;
    const authorId = user?.id || "u_anonymous_guest";
    const nextActive = !r.active;

    try {
      const resp = await fetch(`/api/reminders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authorId,
          active: nextActive
        })
      });

      if (resp.ok) {
        setReminders((prev) =>
          prev.map((item) => (item.id === id ? { ...item, active: nextActive } : item))
        );
        spawnToast("Reminder status updated.", "info");
      } else {
        throw new Error();
      }
    } catch (err) {
      setReminders((prev) =>
        prev.map((item) => (item.id === id ? { ...item, active: nextActive } : item))
      );
      spawnToast("Reminder status updated locally.", "info");
    }
  };

  const handleDeleteReminder = async (id: string) => {
    const authorId = user?.id || "u_anonymous_guest";
    try {
      const resp = await fetch(`/api/reminders/${id}?userId=${authorId}`, { method: "DELETE" });
      if (resp.ok) {
        setReminders((prev) => prev.filter((r) => r.id !== id));
        spawnToast("Alarm entry deleted successfully.", "info");
      } else {
        throw new Error();
      }
    } catch (err) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      spawnToast("Alarm entry deleted locally.", "info");
    }
  };

  // EXPORT DOCUMENTS Handlers
  const handleExportSystem = async (format: "csv" | "text" | "pdf") => {
    if (format === "pdf") {
      // Real-time shopping list generator using Native Print
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        spawnToast("Please enable popups to print the shopping list.", "warning");
        return;
      }
      
      const linesHtml = shoppingItems.map((item, idx) => `
        <tr style="border-bottom: 1px solid #EAEAEA;">
          <td style="padding: 12px; font-size: 14px;">${idx + 1}</td>
          <td style="padding: 12px; font-size: 14px;">${item.emoji} ${item.item_name}</td>
          <td style="padding: 12px; font-size: 14px; color: #8F8F9F">${item.category}</td>
          <td style="padding: 12px; font-size: 14px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; font-size: 14px; text-align: right; font-weight: bold;">₹${item.price.toLocaleString()}</td>
          <td style="padding: 12px; font-size: 14px; text-align: right; color: ${item.completed ? "#10B981" : "#F59E0B"}">${item.completed ? "Completed" : "Pending"}</td>
        </tr>
      `).join("");

      printWindow.document.write(`
        <html>
          <head>
            <title>LuxeList Shopping List & Budget Report</title>
            <style>
              body { font-family: 'Outfit', sans-serif; color: #1E1A34; background: #FAF9FD; padding: 40px; }
              .invoice-card { background: white; border-radius: 20px; box-shadow: 0 10px 45px rgba(0,0,0,0.05); padding: 50px; border: 1px solid #E4D5EC; max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #EADEF7; padding-bottom: 24px; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: 800; color: #7C3AED; display: flex; align-items: center; gap: 8px; }
              .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background: #F3ECF9; color: #6D28D9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
              .total-block { margin-top: 35px; border-top: 2px solid #EADEF7; padding-top: 20px; text-align: right; }
              .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #9A95B6; letter-spacing: 0.5px; border-top: 1px solid #EDEDFC; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="invoice-card">
              <div class="header">
                <div>
                  <div class="logo">🛍️ LuxeList</div>
                  <p style="font-size: 13px; color: #8C84A6; margin-top: 5px;">Shopping List & Smart Budget Report</p>
                </div>
                <div style="text-align: right">
                  <h2 style="margin:0; font-size: 20px; font-weight:300; font-style:italic; color:#6D28D9;">Shopping List</h2>
                  <p style="font-size: 12px; color: #8F8F9F">${new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <p><strong>Shopping List Owner:</strong> ${user?.name || "Guest"} (${user?.email || "anonymous-buyer"})</p>
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Item</th>
                    <th>Category</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Estimated Unit Cost</th>
                    <th style="text-align: right;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${linesHtml}
                </tbody>
              </table>
              <div class="total-block">
                <span style="font-size: 15px; color: #6E688E;">Total Shopping List Estimate:</span>
                <span style="font-size: 26px; font-weight: 800; color: #6D28D9; margin-left: 10px;">₹${shoppingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
              </div>
              <div class="footer">
                Thank you for using LuxeList.
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
      spawnToast("Shopping list opened successfully for printing! 🖨️", "success");
      return;
    }

    // CSV or plain text API calls
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: shoppingItems,
          wishlist: wishlist,
          format: format
        })
      });

      if (response.ok) {
        const textBlob = await response.blob();
        const url = window.URL.createObjectURL(textBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = format === "csv" ? "LuxeList_Spreadsheet.csv" : "LuxeList_Summary_Export.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        spawnToast(`Downloaded ${format.toUpperCase()} record files!`, "success");
      }
    } catch (err) {
      // Local fallback file generator for offline compliance
      let rawText = "🛍️ LUXELIST SHOPPING LIST EXPORT 🛍️\n";
      rawText += `Date: ${new Date().toLocaleDateString()}\n\n`;
      shoppingItems.forEach((si, i) => {
        rawText += `${i+1}. [${si.completed ? "X" : " "}] ${si.emoji} ${si.item_name} (₹${si.price})\n`;
      });
      const blob = new Blob([rawText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "LuxeList_Fallback.txt";
      a.click();
      spawnToast("Processed local text backup download instead.", "success");
    }
  };

  // Profile metadata update from Settings screen
  const handleUpdateProfile = async (themeName: "royal-lavender" | "midnight-lavender" | "classic-orchid") => {
    setTheme(themeName);
    localStorage.setItem("luxelist_theme", themeName);
    
    if (user) {
      try {
        const resp = await fetch("/api/auth/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            theme: themeName
          })
        });
        if (resp.ok) {
          const updated = await resp.json();
          setUser(updated.user);
          localStorage.setItem("luxelist_user", JSON.stringify(updated.user));
          spawnToast(`Aesthetic shifted into ${themeName.split("-").join(" ")} mode!`, "success");
        }
      } catch (err) {
        // Offline theme update
        const updatedUser = { ...user, theme: themeName };
        setUser(updatedUser);
        localStorage.setItem("luxelist_user", JSON.stringify(updatedUser));
        spawnToast("Applied offline theme preferences.", "success");
      }
    } else {
      spawnToast(`Local theme shifted to ${themeName}!`, "success");
    }
  };

  // Derived dashboard metrics
  const totalSpendComputed = shoppingItems
    .filter((it) => it.completed)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const pendingSpendForecast = shoppingItems
    .filter((it) => !it.completed)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const completionPercent = shoppingItems.length > 0 
    ? Math.round((shoppingItems.filter((i) => i.completed).length / shoppingItems.length) * 100) 
    : 0;

  const totalSavingsAchieved = aiOptimize?.totalSavingsPotential || 1200;

  // Shopping Score Formula: stays under budget, completes high priorities, contains nice categories
  const calculatedShoppingScore = Math.min(
    100,
    Math.max(
      45,
      75 + 
      (budget.remaining_amount > 0 ? 15 : -10) +
      (completionPercent > 50 ? 10 : -5) + 
      (shoppingItems.length > 4 ? 5 : 0) -
      (budget.spent_amount > budget.monthly_budget ? 25 : 0)
    )
  );

  return (
    <div 
      className={`min-h-screen relative font-sans transition-all duration-700 select-none pb-12 ${
        theme === "royal-lavender" 
          ? "bg-[#FAF7FD] text-[#2C1D42]" 
          : theme === "midnight-lavender" 
            ? "bg-[#0A0515] text-[#ECE7F2]" 
            : "bg-[#F4F4F6] text-[#1E1E24]"
      }`}
    >
      {/* Floating Sparkles & Ambient effect support */}
      <AmbientEffects theme={theme} />

      {/* Decorative Blur Orbs for aesthetic background atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-purple-300/10 blur-[120px] animate-pulse-glow" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-pink-300/5 blur-[150px] animate-pulse-glow" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-80 h-80 rounded-full bg-indigo-300/10 blur-[130px] animate-pulse-glow" style={{ animationDuration: '10s' }} />
      </div>

      {/* Floating Notification Queue banner */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-2xl flex items-center gap-3 shadow-lg border animate-sparkle ${
              notif.type === "success"
                ? "bg-purple-100 text-purple-900 border-purple-200"
                : notif.type === "warning"
                  ? "bg-pink-100 text-pink-900 border-pink-200"
                  : "bg-slate-100 text-slate-850 border-slate-200"
            }`}
          >
            <span className="text-xl">✨</span>
            <div className="text-xs font-semibold">{notif.text}</div>
          </div>
        ))}
      </div>

      {/* 1. INITIAL SPLASH INTRO */}
      {!splashCompleted ? (
        <div className="fixed inset-0 z-50 bg-[#0F0817] flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15),_transparent_60%)] filter blur-2xl" />
          
          <div className="relative space-y-8 max-w-lg">
            <div className="mx-auto animate-logo-float flex items-center justify-center">
              <LuxeLogo size={130} glow={true} isBadge={true} />
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center">
                <span className="font-logo text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 select-none px-4" style={{ fontFamily: "'Playball', 'Satisfy', 'Dancing Script', 'Parisienne', cursive" }}>
                  LuxeList
                </span>
              </div>
              <p className="text-sm tracking-widest text-[#BD93F9] font-sans font-bold uppercase mt-2">
                Smart Shopping & Budget Tracking
              </p>
              <p className="text-gray-400 text-xs italic font-serif leading-relaxed px-4">
                "Keep your shopping lists and monthly budgets on track with clean, modern visuals."
              </p>
            </div>

            <button
              onClick={() => setSplashCompleted(true)}
              className="px-10 py-4 bg-gradient-to-r from-[#FF79C6] to-[#BD93F9] rounded-full text-sm font-semibold tracking-wider text-black shadow-lg transition-all hover:scale-105 active:scale-95 duration-200 hover:shadow-[0_0_25px_rgba(255,121,198,0.5)] cursor-pointer"
            >
              ENTER APP
            </button>
          </div>
        </div>
      ) : null}

      {/* 2. AUTH CARD SHIELD (IF USER NOT ENROLLED) */}
      {!user && splashCompleted ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0E071C] radial-glow relative overflow-hidden text-white font-sans">
          
          {/* Ambient animations in the back */}
          <div className="absolute inset-0 z-0">
            <AmbientEffects theme={theme} />
          </div>
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,121,198,0.08),_transparent_50%)] z-0" />
          
          <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-6 shadow-2xl z-10">
            {/* Header / Brand logo */}
            <div className="text-center space-y-4 flex flex-col items-center justify-center">
              <LuxeLogo 
                size={82} 
                isBadge={true} 
                showText={true} 
                textType="stacked" 
                textClassName="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 font-bold" 
                color="#FFFFFF"
                showSubtitle={true}
              />
              <p className="text-xs text-purple-200/50 font-sans tracking-wide max-w-xs mx-auto">
                Beautiful shopping lists, wishlists, and spending analytics.
              </p>
            </div>

            {/* Error & Success Alert Bars */}
            {authValidationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/35 rounded-xl text-xs text-rose-300 font-semibold flex items-center gap-2 animate-shake">
                <span className="text-sm">⚠️</span> {authValidationError}
              </div>
            )}
            {authSuccessMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/35 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <span className="text-sm">✓</span> {authSuccessMessage}
              </div>
            )}

            {/* Render Login & Sign Up Sub Tabs */}
            {(currentAuthState === "login" || currentAuthState === "register") && (
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                <button
                  type="button"
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                    currentAuthState === "login" 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => {
                    setCurrentAuthState("login");
                    setAuthValidationError(null);
                    setAuthSuccessMessage(null);
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                    currentAuthState === "register" 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => {
                    setCurrentAuthState("register");
                    setAuthValidationError(null);
                    setAuthSuccessMessage(null);
                  }}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 1: LOGIN FORM */}
            {/* ======================================================== */}
            {currentAuthState === "login" && (
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Email Address</label>
                  <input
                    type="email"
                    placeholder="gayatribellamkonda088@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1 relative">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Password</label>
                    <button
                      type="button"
                      onClick={() => setCurrentAuthState("forgot")}
                      className="text-[10px] text-pink-400 hover:text-pink-300 font-semibold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:border-purple-400 focus:outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer select-none text-xs"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-300 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-pink-500 rounded border-white/30 bg-black/40"
                    />
                    Remember Me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 disabled:opacity-50 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all transform active:scale-95 cursor-pointer flex justify-center items-center gap-2"
                >
                  {isAuthLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Secure Sign In"}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: REGISTER FORM */}
            {/* ======================================================== */}
            {currentAuthState === "register" && (
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Full Name</label>
                  <input
                    type="text"
                    placeholder="Gayatri Bellamkonda"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Email Address</label>
                  <input
                    type="email"
                    placeholder="gayatribellamkonda088@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:border-purple-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Confirm</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:border-purple-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Password strength visualizer bar */}
                {authPassword && (
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-gray-400">Security Index:</span>
                      <span className={`font-bold ${getPasswordStrength(authPassword)?.color.split(" ")[0]}`}>
                        {getPasswordStrength(authPassword)?.label}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          getPasswordStrength(authPassword)?.score === 1 
                            ? "w-1/4 bg-rose-500" 
                            : getPasswordStrength(authPassword)?.score === 2 
                              ? "w-1/2 bg-amber-500" 
                              : getPasswordStrength(authPassword)?.score === 3 
                                ? "w-3/4 bg-indigo-500" 
                                : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 disabled:opacity-50 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all transform active:scale-95 cursor-pointer flex justify-center items-center gap-2"
                >
                  {isAuthLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Register Account"}
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: FORGOT PASSWORD FORM */}
            {/* ======================================================== */}
            {currentAuthState === "forgot" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 uppercase tracking-tight">
                    Reset Security Keys
                  </h3>
                  <p className="text-xs text-purple-100/70">
                    Provide your email address. We will simulate sending a password configuration link instantly because we are sandbox-persistent.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Your Registered Email</label>
                    <input
                      type="email"
                      placeholder="gayatribellamkonda088@gmail.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 disabled:opacity-50 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer flex justify-center items-center gap-2"
                  >
                    Send Simulated Reset Email
                  </button>
                </form>

                {/* Simulated Reset Click Trigger Link Box */}
                {passwordResetLink && (
                  <div className="bg-purple-950/40 p-4 border border-purple-500/20 rounded-2xl space-y-2.5 text-center">
                    <p className="text-[10px] text-pink-300 font-mono tracking-widest uppercase">📥 Mail Simulator Received</p>
                    <p className="text-[11px] text-gray-300">Click the virtual link below to change security password:</p>
                    <button
                      onClick={() => {
                        setCurrentAuthState("reset");
                        setAuthValidationError(null);
                        setAuthSuccessMessage(null);
                      }}
                      className="w-full py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/35 rounded-xl text-xs font-bold text-pink-300 cursor-pointer text-ellipsis overflow-hidden"
                    >
                      {passwordResetLink}
                    </button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setCurrentAuthState("login");
                      setAuthValidationError(null);
                      setAuthSuccessMessage(null);
                    }}
                    className="text-xs text-gray-400 hover:text-white font-medium"
                  >
                    &larr; Back to Secure Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 4: RESET PASSWORD FORM */}
            {/* ======================================================== */}
            {currentAuthState === "reset" && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 uppercase tracking-tight">
                    Establish New Keys
                  </h3>
                  <p className="text-xs text-purple-100/70">
                    Choose a strong, 8+ character password to sync your Luxelist items safely.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Reset Code/Token (Bypassed)</label>
                  <input
                    type="text"
                    value={passwordResetToken}
                    readOnly
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-300 font-mono">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                >
                  Save New Security Password
                </button>

                <div className="text-center pt-1">
                  <button
                    onClick={() => {
                      setCurrentAuthState("login");
                      setAuthValidationError(null);
                      setAuthSuccessMessage(null);
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Cancel and Return
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* VIEW 5: EMAIL VERIFICATION CODE / LINK FORM */}
            {/* ======================================================== */}
            {currentAuthState === "verify" && (
              <div className="space-y-5">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold uppercase tracking-wide text-pink-400 font-sans">Verify Connection</h3>
                  <p className="text-xs text-purple-100/70 leading-relaxed">
                    Confirm your registration to activate secure server syncing.
                  </p>
                </div>

                {/* simulated verification alert and clicker box */}
                {verificationLink && (
                  <div className="bg-purple-950/40 p-4 border border-purple-500/20 rounded-2xl text-center space-y-3">
                    <p className="text-[10px] text-pink-300 font-mono tracking-widest uppercase">💌 Simulated Inbox Arrival</p>
                    <p className="text-[11px] text-gray-300">
                      Simply click this simulated validation link to complete security verification:
                    </p>
                    <button
                      onClick={() => handleVerifyEmail(verificationToken)}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110 rounded-xl text-xs font-bold cursor-pointer border border-[#BD93F9]/30 text-ellipsis overflow-hidden"
                    >
                      Click to Verify: {verificationToken}
                    </button>
                    <div className="flex justify-center gap-4 text-xs font-bold pt-1.5 border-t border-purple-500/10">
                      <button
                        onClick={handleResendVerification}
                        className="text-purple-300 hover:text-white"
                      >
                        Resend Code
                      </button>
                      <button
                        onClick={() => {
                          setCurrentAuthState("login");
                          setAuthValidationError(null);
                          setAuthSuccessMessage(null);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        Sign In Screen
                      </button>
                    </div>
                  </div>
                )}

                {!verificationLink && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter verification code (or Click Resend below)"
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-sm font-mono tracking-wider focus:outline-none"
                    />
                    <button
                      onClick={() => handleVerifyEmail(verificationToken)}
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
                    >
                      Authenticate Code
                    </button>
                    <div className="flex justify-center gap-4 text-xs pt-2">
                      <button onClick={handleResendVerification} className="text-pink-300 hover:text-pink-200">
                        Generate Simulated Link/Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Decorative or alternative entrance routes */}
            {(currentAuthState === "login" || currentAuthState === "register") && (
              <>
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-[#BD93F9] font-black font-mono">Instant Gateway</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleGoogleLoginMock}
                    type="button"
                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span>Google Account</span>
                  </button>
                  <button
                    onClick={handleGuestEnroll}
                    type="button"
                    className="flex items-center justify-center gap-1.5 bg-[#BD93F9]/20 border border-[#BD93F9]/30 py-3 rounded-xl text-xs font-bold text-[#BD93F9] hover:bg-[#BD93F9]/3 w-full cursor-pointer"
                  >
                    <span>👤</span> Explore Guest
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* 3. CORE LUXE-LIST MAIN WORKSPACE */}
      {user && splashCompleted ? (
        <div className="w-full max-w-[1250px] mx-auto h-[100dvh] lg:h-auto lg:min-h-screen p-3 md:p-5 lg:p-6 flex flex-col lg:flex-row lg:items-stretch overflow-hidden lg:overflow-visible relative gap-3 md:gap-5 lg:gap-6" id="luxe-core-workspace-wrapper">

          {/* DESKTOP SIDEBAR */}
          <aside 
            className={`hidden lg:flex sticky top-6 w-72 flex-col justify-between p-5 h-[calc(100vh-3rem)] shadow-xs border rounded-3xl shrink-0 overflow-y-auto overscroll-contain ${
              theme === "royal-lavender" 
                ? "bg-white border-purple-100 text-[#2C1D42]" 
                : theme === "midnight-lavender" 
                  ? "bg-[#120B21]/98 border-[#BD93F9]/25 text-[#E0E0E0]" 
                  : "bg-white border-slate-200 text-slate-800"
            }`}
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="space-y-6 flex flex-col h-full">
              {/* BRAND IDENTIFIER */}
              <div className="flex items-center justify-between pb-3 border-b border-purple-100/30">
                <LuxeLogo 
                  size={38} 
                  showText={true} 
                  showSubtitle={true} 
                  color={theme === "midnight-lavender" ? "#E0D7FC" : "#30136B"}
                  textClassName="text-[25px] font-bold font-logo" 
                />
              </div>

              {/* NAVIGATION LINKS CONTAINER */}
              <nav className="space-y-1.5 flex-1 overflow-y-auto overscroll-contain pr-1 no-scrollbar">
                {[
                  { id: "dashboard", label: "Dashboard", emoji: "📊" },
                  { id: "shopping", label: "Shopping List", emoji: "🛍️" },
                  { id: "wishlist", label: "Wishlist", emoji: "💎" },
                  { id: "budgets", label: "Budgets", emoji: "💰" },
                  { id: "analytics", label: "Spend Analytics", emoji: "📈" },
                  { id: "reminders", label: "Reminders", emoji: "🔔" },
                  { id: "settings", label: "Settings", emoji: "⚙️" },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                      }}
                      className={`w-full flex items-center space-x-3.5 p-3 text-sm rounded-2xl transition-all duration-350 transform hover:translate-x-1 active:scale-[0.98] cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-[#BD93F9]/20 to-[#FF79C6]/25 border-l-4 border-[#BD93F9] font-black text-purple-750 dark:text-purple-300 shadow-[0_4px_12px_rgba(189,147,249,0.12)]"
                          : "text-gray-500 hover:text-purple-600 hover:bg-purple-500/5 font-semibold"
                      }`}
                    >
                      <span className="text-base select-none shrink-0 transition-transform duration-350 hover:scale-110">{item.emoji}</span>
                      <span className="tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* LOWER LEVEL SCORE MILESTONE WIDGET */}
              <div 
                className={`p-4 rounded-2xl border mt-auto ${
                  theme === "royal-lavender" 
                    ? "bg-purple-50/50 border-purple-100/50" 
                    : "bg-white/5 border-white/5"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono font-bold">
                    <span>Shopping Milestone</span>
                    <span className="font-bold text-purple-650 font-mono">{calculatedShoppingScore}/100</span>
                  </div>
                  <div className="w-full bg-purple-100/50 dark:bg-black/20 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500" 
                      style={{ width: `${calculatedShoppingScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MOBILE SLIDING DRAWER & BACKDROP */}
          <AnimatePresence>
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex overflow-hidden">
                {/* Backdrop Overlay with blur and opacity */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-slate-950/45 backdrop-blur-[6px] cursor-pointer"
                  style={{ touchAction: "none" }}
                />

                {/* Drawer Menu Panel */}
                <motion.div
                  drag="x"
                  dragDirectionLock
                  dragConstraints={{ left: -300, right: 0 }}
                  dragElastic={{ left: 0.05, right: 0.15 }}
                  onDragEnd={(event, info) => {
                    // Swipe left to close drawer
                    if (info.offset.x < -60) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 240 }}
                  className={`relative w-[78vw] max-w-[320px] h-[100dvh] flex flex-col justify-between p-4 shadow-2xl border-r rounded-r-[2rem] overflow-hidden ${
                    theme === "royal-lavender" 
                      ? "bg-white/90 border-purple-100 text-[#2C1D42]" 
                      : theme === "midnight-lavender" 
                        ? "bg-[#120B21]/90 border-[#BD93F9]/20 text-[#E0E0E0]" 
                        : "bg-white/90 border-slate-200 text-slate-800"
                  }`}
                  style={{ 
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    touchAction: "pan-y" 
                  }}
                >
                  <div className="flex flex-col h-full space-y-4">
                    
                    {/* Compact Brand Identifier & Close Option */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-purple-500/10">
                      <div className="flex items-center gap-1.5">
                        <LuxeLogo 
                          size={30} 
                          showText={true} 
                          showSubtitle={true}
                          color={theme === "midnight-lavender" ? "#E0D7FC" : "#30136B"}
                          textClassName="text-xl font-bold font-logo" 
                        />
                      </div>
                      <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 hover:bg-purple-500/10 active:scale-90 rounded-full transition-all cursor-pointer"
                        aria-label="Close menu"
                      >
                        <X className="w-4.5 h-4.5 text-purple-400 hover:text-purple-650" />
                      </button>
                    </div>

                    {/* Compact User Identity block */}
                    {user && (
                      <div className="flex items-center gap-3 p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#BD93F9]/30 flex-shrink-0 bg-[#BD93F9]/10 flex items-center justify-center">
                          {user.profile_image ? (
                            <img src={user.profile_image} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-sm font-black text-purple-700">
                              {user.name ? user.name.charAt(0).toUpperCase() : "G"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-purple-950 dark:text-purple-100 truncate">{user.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation list: vertically centered & evenly spaced. Compact heights */}
                    <nav className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-1">
                      {[
                        { id: "dashboard", label: "Dashboard", emoji: "📊" },
                        { id: "shopping", label: "Shopping List", emoji: "🛍️" },
                        { id: "wishlist", label: "Wishlist", emoji: "💎" },
                        { id: "budgets", label: "Budgets", emoji: "💰" },
                        { id: "analytics", label: "Spend Analytics", emoji: "📈" },
                        { id: "reminders", label: "Reminders", emoji: "🔔" },
                        { id: "settings", label: "Settings", emoji: "⚙️" },
                      ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setIsSidebarOpen(false); // Auto close after selecting a menu item.
                            }}
                            className={`w-full flex items-center space-x-3 p-2 text-xs rounded-xl transition-all duration-300 active:scale-95 cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-[#BD93F9]/20 to-[#FF79C6]/25 border-l-4 border-[#BD93F9] font-black text-purple-800 dark:text-purple-300"
                                : "text-gray-500 hover:text-purple-600 hover:bg-purple-500/5 font-semibold"
                            }`}
                          >
                            <span className="text-sm shrink-0 transition-transform">{item.emoji}</span>
                            <span className="tracking-wide select-none">{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>

                    {/* Milestone Widget */}
                    <div className="pt-2 border-t border-purple-500/10">
                      <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10">
                        <div className="flex justify-between text-[9px] text-gray-500 font-mono font-bold mb-1">
                          <span>Milestone</span>
                          <span className="text-[#A855F7]">{calculatedShoppingScore}/100</span>
                        </div>
                        <div className="w-full bg-purple-100/50 dark:bg-black/20 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-500" 
                            style={{ width: `${calculatedShoppingScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MAIN CORE BODY CANVAS AREA */}
          <main className="w-full flex-1 flex flex-col sm:block overflow-hidden sm:overflow-visible min-h-0" id="luxe-core-main-element">
            
            {/* RESPONSIVE TOP HERO BANNER */}
            <header 
              className={`p-3 md:p-5 rounded-[2rem] border flex flex-row justify-between items-center gap-2 sm:gap-4 transition-all duration-500 shadow-sm flex-shrink-0 ${
                theme === "royal-lavender" 
                  ? "bg-white/95 border-[#E6DAF0]" 
                  : theme === "midnight-lavender" 
                    ? "bg-[#110A20]/95 border-[#BD93F9]/20 text-white" 
                    : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-4 w-auto">
                {/* ☰ HAMBURGER BUTTON - hidden on desktop, shown on tablet/mobile */}
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-3 bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100 rounded-full text-purple-500 hover:text-purple-650 transition-all active:scale-95 duration-200 cursor-pointer flex-shrink-0 flex items-center justify-center shadow-xs"
                  aria-label="Toggle navigation drawer"
                >
                  <Menu className="w-5 h-5 text-purple-500" />
                </button>
                <div className="flex flex-col items-start leading-none space-y-1">
                  <LuxeLogo 
                    size={42} 
                    showText={true} 
                    color={theme === "midnight-lavender" ? "#E0D7FC" : "#30136B"}
                    textClassName="text-2xl sm:text-3xl font-extrabold font-logo animate-fade-in tracking-wide leading-none" 
                  />
                  <p className="text-[10px] sm:text-[11.5px] text-slate-400/90 font-sans tracking-wide leading-none mt-1">
                    {getFormattedHeaderDate(currentTime)}
                  </p>
                </div>
              </div>

              {/* Live Aggregate Metrics blocks on header right + Profile Dropdown */}
              <div className="flex items-center gap-2 sm:gap-3.5 w-auto justify-end relative">
                
                {/* 1. Total Savings Metric */}
                <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 text-right border border-purple-100 shadow-xs hidden sm:block">
                  <p className="text-[8px] uppercase tracking-widest text-[#BD93F9] font-black">Savings</p>
                  <p className="text-sm font-extrabold text-purple-700 font-mono">₹{totalSavingsAchieved.toLocaleString()}</p>
                </div>

                {/* 2. Streak Days Metric */}
                <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 text-right border border-amber-100 shadow-xs hidden sm:block">
                  <p className="text-[8px] uppercase tracking-widest text-amber-600 font-black">Streak</p>
                  <p className="text-sm font-extrabold text-amber-700 font-mono">{user?.current_streak || 0} 🔥</p>
                </div>

                {/* 3. Auth or Dropdown Controls */}
                {user.id === "u_anonymous_guest" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setUser(null);
                        setCurrentAuthState("login");
                        setAuthValidationError(null);
                        setAuthSuccessMessage(null);
                      }}
                      className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs border border-purple-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setUser(null);
                        setCurrentAuthState("register");
                        setAuthValidationError(null);
                        setAuthSuccessMessage(null);
                      }}
                      className="px-3 py-2 bg-[#FF79C6] hover:brightness-105 text-black text-xs font-black rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Trigger Button */}
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-1.5 sm:gap-3 p-1 sm:p-1.5 sm:pr-5 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-100 rounded-full transition-all duration-300 cursor-pointer active:scale-95"
                      id="luxe-header-profile-btn"
                    >
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-tr from-[#FF79C6] via-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm sm:text-base border-2 border-white/60 shadow-inner flex-shrink-0">
                        {user.profile_image ? (
                          <img src={user.profile_image} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          user.name ? user.name.charAt(0).toUpperCase() : "G"
                        )}
                      </div>
                      <div className="hidden sm:flex flex-col text-left font-sans max-w-[90px] sm:max-w-[130px] justify-center" id="luxe-header-profile-text">
                        <p className="text-xs sm:text-[13px] font-extrabold text-purple-950 dark:text-purple-100 truncate leading-tight">{user.name}</p>
                        <p className="text-[9px] sm:text-[11px] text-gray-400 font-medium tracking-tight truncate leading-tight mt-0.5">{user.email}</p>
                      </div>
                    </button>

                    {/* Dropdown glass box */}
                    {isProfileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setIsProfileMenuOpen(false)} />
                        <div className="absolute right-0 mt-2.5 w-52 bg-white/95 backdrop-blur-md rounded-2xl border border-purple-100 shadow-xl overflow-hidden z-30 transition-all duration-300 animate-fade-in-up text-slate-800">
                          {/* Dropdown Header */}
                          <div className="p-3 bg-purple-50/45 border-b border-purple-100 text-left">
                            <p className="text-[8px] uppercase tracking-widest text-purple-400 font-extrabold font-mono">Authenticated account</p>
                            <p className="text-xs font-black text-purple-950 truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                          </div>
                          {/* List items */}
                          <div className="p-1.5 space-y-0.5 text-xs font-bold">
                            <button
                              onClick={() => {
                                setProfileEditName(user.name);
                                setProfileEditEmail(user.email);
                                setProfileEditImage(user.profile_image);
                                setIsMyProfileModalOpen(true);
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100/50 hover:text-purple-700 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-purple-500" />
                              <span>My Profile</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab("shopping");
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100/50 hover:text-purple-750 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <span className="text-sm">🛍️</span>
                              <span>My Shopping Lists</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab("settings");
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100/50 hover:text-purple-750 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Settings className="w-3.5 h-3.5 text-purple-500" />
                              <span>Settings</span>
                            </button>
                            <div className="border-t border-purple-50 my-1 mx-1.5" />
                            <button
                              onClick={() => {
                                handleLogout();
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

              </div>
            </header>

            {/* INDEPENDENT INNER SCROLLBOX - REMAINING AREA FOR MOBILE */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 sm:space-y-6 shrink-0 min-h-0 sm:overflow-visible sm:h-auto pb-4 lg:pb-0" id="luxe-remaining-scrollbox">

            {/* ==================== TAB 1: DASHBOARD OVERVIEW ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-fade-in font-sans">
                
                {/* 6 Real-time Overview Bento Grid Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                  
                  {/* Card 1: Total Shopping Items */}
                  <div className="bg-gradient-to-br from-purple-500/5 via-white to-white p-5 rounded-3xl border border-purple-100/55 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-purple-300/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span>🛒</span> Total Items
                      </p>
                      <p className="text-2xl font-black text-purple-950 font-mono">{shoppingItems.length}</p>
                    </div>
                    <div className="text-[10px] text-purple-500 font-bold font-mono pt-1.5 border-t border-purple-50 mt-2">
                      <span>Curation Basket</span>
                    </div>
                  </div>

                  {/* Card 2: Completed Purchases */}
                  <div className="bg-gradient-to-br from-emerald-500/5 via-white to-white p-5 rounded-3xl border border-emerald-100/55 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-emerald-300/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span>🛍️</span> Purchased
                      </p>
                      <p className="text-2xl font-black text-emerald-600 font-mono">
                        {shoppingItems.filter(i => i.completed).length}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold font-mono pt-1.5 border-t border-purple-50 mt-2">
                      <span>Completed ({completionPercent}%)</span>
                    </div>
                  </div>

                  {/* Card 3: Pending Items */}
                  <div className="bg-gradient-to-br from-amber-500/5 via-white to-white p-5 rounded-3xl border border-amber-100/55 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-amber-300/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span>⏳</span> Pending Items
                      </p>
                      <p className="text-2xl font-black text-amber-600 font-mono">
                        {shoppingItems.filter(i => !i.completed).length}
                      </p>
                    </div>
                    <div className="text-[10px] text-amber-600 font-bold font-mono pt-1.5 border-t border-purple-50 mt-2">
                      <span>Needs buying</span>
                    </div>
                  </div>

                  {/* Card 4: Remaining Budget */}
                  <div className="bg-gradient-to-br from-[#BD93F9]/5 via-white to-white p-5 rounded-3xl border border-purple-100/50 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-purple-300/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span>💰</span> Capital Left
                      </p>
                      <p className="text-2xl font-black text-purple-700 font-mono">₹{budget.remaining_amount.toLocaleString()}</p>
                    </div>
                    <div className="text-[10px] text-purple-700 font-bold font-mono pt-1.5 border-t border-purple-50 mt-2">
                      <span>Remaining</span>
                    </div>
                  </div>

                  {/* Card 5: Savings This Month */}
                  <div className="bg-gradient-to-br from-[#FF79C6]/5 via-white to-white p-5 rounded-3xl border border-pink-100/50 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-pink-300/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span>✨</span> Savings
                      </p>
                      <p className="text-2xl font-black text-pink-600 font-mono">
                        ₹{(budget.spent_amount === 0 ? 0 : totalSavingsAchieved).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-[10px] text-pink-500 font-bold font-mono pt-1.5 border-t border-purple-50 mt-2">
                      <span>This Month</span>
                    </div>
                  </div>

                  {/* Card 6: Upcoming Reminders */}
                  <div className="bg-gradient-to-br from-indigo-500/5 via-white to-white p-5 rounded-3xl border border-indigo-100/55 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-indigo-300/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <span>🔔</span> Reminders
                      </p>
                      <p className="text-2xl font-black text-indigo-700 font-mono">
                        {reminders.filter(r => r.active).length}
                      </p>
                    </div>
                    <div className="text-[9px] text-[#A855F7] font-bold font-mono pt-1.5 border-t border-purple-50 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                      {reminders.filter(r => r.active).length > 0 
                        ? reminders.filter(r => r.active)[0].text 
                        : "No active alerts"}
                    </div>
                  </div>

                </div>

                {/* DYNAMIC TIMEZONE-BASED LOGIN STREAK & MILESTONES ROW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 p-6 rounded-3xl border border-purple-100 shadow-sm">
                  {/* Streak Summary */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl animate-bounce">🔥</span>
                        <div>
                          <h3 className="text-base font-extrabold text-purple-950 flex items-center gap-1.5 leading-none">
                            Daily Login Streak
                          </h3>
                          <span className="text-[10px] text-purple-600 tracking-wider font-extrabold uppercase font-sans">
                            Consecutive Activity
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed pt-1">
                        Open LuxeList daily to build your momentum, optimize spending habits, and unlock exclusive financial badges.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 bg-white/70 backdrop-blur-xs p-3 rounded-2xl border border-purple-100/60 font-sans">
                      <div className="text-center p-1">
                        <p className="text-[9px] uppercase font-bold text-gray-400">Current</p>
                        <p className="text-lg font-black text-amber-600 font-mono flex items-center justify-center gap-0.5 mt-0.5">
                          {user?.current_streak || 0} <span className="text-xs">🔥</span>
                        </p>
                      </div>
                      <div className="text-center p-1 border-x border-purple-100/60">
                        <p className="text-[9px] uppercase font-bold text-gray-400">Longest</p>
                        <p className="text-lg font-black text-[#A855F7] font-mono flex items-center justify-center gap-0.5 mt-0.5">
                          {user?.longest_streak || 0} <span className="text-xs">🏆</span>
                        </p>
                      </div>
                      <div className="text-center p-1 font-sans">
                        <p className="text-[9px] uppercase font-bold text-gray-400">Last Login</p>
                        <p className="text-[10px] font-black text-purple-900 font-mono mt-1.5 truncate">
                          {user?.last_login_date ? new Date(user.last_login_date + 'T00:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : "Today"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Milestones */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex justify-between items-center font-sans">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-purple-800 flex items-center gap-1">
                        <span>🏆</span> Streak Achievements
                      </h4>
                      <span className="text-[11px] bg-purple-200/50 text-purple-700 font-bold px-2 py-0.5 rounded-full font-sans">
                        {(() => {
                          const s = user?.current_streak || 0;
                          let unlocked = 0;
                          if (s >= 7) unlocked++;
                          if (s >= 30) unlocked++;
                          if (s >= 100) unlocked++;
                          if (s >= 365) unlocked++;
                          return `${unlocked}/4 Unlocked`;
                        })()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/40 p-4 rounded-2xl border border-purple-100/50">
                      {[
                        { days: 7, label: "7 Days", emoji: "🔥", color: "from-amber-400 to-orange-500", desc: "Bronze Starter" },
                        { days: 30, label: "30 Days", emoji: "🏆", color: "from-pink-400 to-rose-600", desc: "Silver Planner" },
                        { days: 100, label: "100 Days", emoji: "💎", color: "from-cyan-400 to-indigo-500", desc: "Gold Wealthy" },
                        { days: 365, label: "365 Days", emoji: "👑", color: "from-yellow-300 to-amber-600", desc: "Platinum Sage" }
                      ].map((badge) => {
                        const isUnlocked = (user?.current_streak || 0) >= badge.days || (user?.longest_streak || 0) >= badge.days;
                        return (
                          <div 
                            key={badge.days}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 ${
                              isUnlocked 
                                ? "bg-white border-purple-200 shadow-xs scale-100" 
                                : "bg-gray-100/50 border-gray-200/50 opacity-40 scale-95 select-none"
                            }`}
                          >
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl mb-1.5 ${
                              isUnlocked 
                                ? `bg-gradient-to-br ${badge.color} text-white shadow-md animate-pulse` 
                                : "bg-gray-200 text-gray-400"
                            }`}>
                              {badge.emoji}
                            </div>
                            <p className="text-[11px] font-black leading-none text-purple-950 mt-1">{badge.label}</p>
                            <p className="text-[8px] text-gray-400 mt-1 font-sans">{badge.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Dashboard Middle Section with spending chart & AI Assistant summary */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  
                  {/* Spend Weekly Trends Visual Grid */}
                  <div className="xl:col-span-8 bg-[#1A0B2E]/90 border border-[#BD93F9]/20 p-6 rounded-3xl text-white flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-bold font-serif italic">Weekly Spending Analysis</h3>
                        <p className="text-xs text-purple-300">Expense trend overview</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 rounded bg-[#BD93F9]/20 text-[10px] text-[#BD93F9] font-bold uppercase font-mono">Live Calculation</span>
                      </div>
                    </div>

                    {/* Spend bars representation with weekday identifiers */}
                    <div className="flex items-end justify-between h-48 px-2 border-b border-white/10 pb-4 pt-10">
                      {(() => {
                        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                        const daySums = [0, 0, 0, 0, 0, 0, 0];
                        
                        shoppingItems.filter(item => item.completed).forEach(item => {
                          const date = new Date(item.created_at || new Date());
                          const index = (date.getDay() + 6) % 7;
                          daySums[index] += item.price * item.quantity;
                        });

                        const maxAmt = Math.max(...daySums, 1);
                        const currentDayIndex = (new Date().getDay() + 6) % 7;

                        return days.map((day, idx) => {
                          const val = daySums[idx];
                          const percent = val === 0 ? 0 : Math.min(100, Math.max(15, Math.round((val / maxAmt) * 100)));
                          return {
                            day,
                            percent,
                            active: currentDayIndex === idx,
                            amount: `₹${val.toLocaleString()}`
                          };
                        });
                      })().map((bar, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group relative w-12 font-sans">
                          <span className="hidden group-hover:block absolute -top-8 px-2 py-0.5 bg-black text-[9px] rounded text-pink-400 font-mono whitespace-nowrap z-30">
                            {bar.amount}
                          </span>
                          <div className="w-full bg-white/5 hover:bg-white/10 rounded-t-xl h-36 flex items-end overflow-hidden transition-colors">
                            <div 
                              className={`w-full rounded-t-xl transition-all duration-700 ${
                                bar.active 
                                  ? "bg-[#FF79C6] shadow-[0_0_15px_rgba(255,121,198,0.5)] animate-pulse" 
                                  : "bg-[#BD93F9]"
                              }`}
                              style={{ height: `${bar.percent}%` }}
                            />
                          </div>
                          <span className={`text-[10px] uppercase font-mono tracking-wide ${bar.active ? "text-pink-400 font-bold" : "text-gray-400"}`}>{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: AI Assistant Quick Action */}
                  <div className="xl:col-span-4 bg-gradient-to-br from-purple-900 to-[#120721] text-white p-6 rounded-3xl border border-purple-400/20 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                      <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#FF79C6]">Shopping Assistant</h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-2">
                      <p className="text-[10px] uppercase tracking-wider text-purple-300 font-mono font-bold">Savings Tip:</p>
                      <p className="text-gray-200 leading-relaxed font-serif">
                        {aiOptimize?.feedback || `"Try brand substitutions or private label items to save on cost."`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => setActiveTab("budgets")}
                        className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-black font-bold text-xs rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-black" /> Optimize Budget
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("shopping");
                          setIsAddingItem(true);
                        }}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Quick Add Item
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lower Section: Active Shopping items list sample */}
                <div className="p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-[#E6DAF0] space-y-4 shadow-md text-slate-800">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md uppercase font-black tracking-wider text-purple-700">Recent Shopping List</h3>
                    <button 
                      onClick={() => setActiveTab("shopping")}
                      className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                    >
                      View All List →
                    </button>
                  </div>

                  <div className="divide-y divide-[#F1E8FB]">
                    {shoppingItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl p-2 bg-purple-50 rounded-xl">{item.emoji}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{item.item_name}</p>
                            <span className="text-[10px] uppercase tracking-widest text-[#BD93F9] font-mono">{item.category} • qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                          <button 
                            onClick={() => handleToggleCompleted(item)}
                            className="p-1 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs rounded-lg font-bold transition-all cursor-pointer"
                          >
                            {item.completed ? "Purchased ✓" : "Pending"}
                          </button>
                        </div>
                      </div>
                    ))}

                    {shoppingItems.length === 0 && (
                      <p className="text-center py-8 text-gray-400 text-sm italic">
                        "Your shopping list is empty."
                      </p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ==================== TAB 2: SHOPPING BASKET SECTION ==================== */}
            {activeTab === "shopping" && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-purple-50/50 p-4 rounded-3xl border border-purple-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-purple-950">Active Shopping List</h3>
                    <p className="text-xs text-gray-400">Add and track your items and estimate your total costs.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAddingItem(true)}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-transform duration-300 transform hover:scale-[1.02] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>

                    {/* Quick Share List trigger */}
                    <button
                      onClick={() => setIsSharingList(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-[#BD93F9] hover:from-purple-600 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-300 transform hover:scale-[1.03] shadow-[0_4px_14px_rgba(189,147,249,0.3)] cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" /> Share List
                    </button>
                  </div>
                </div>

                {/* ADD ITEM MODAL POPUP */}
                {isAddingItem && (
                  <div className="p-6 bg-white border border-[#E6DAF0] rounded-3xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm uppercase font-black tracking-wider text-purple-700">Add Item</h4>
                      <button 
                        onClick={() => setIsAddingItem(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Product Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Matte Rosé Lipstick"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 text-slate-850 font-bold"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Category Tag</label>
                        <select
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-400 text-slate-850 font-bold"
                        >
                          <option value="Beauty">Beauty 💄</option>
                          <option value="Fragrance">Fragrance 🌸</option>
                          <option value="Fashion">Fashion 👗</option>
                          <option value="Electronics">Electronics 💻</option>
                          <option value="Grocery">Grocery 🥬</option>
                          <option value="Other">Other 🛍️</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Unit Price (₹)</label>
                        <input
                          type="number"
                          placeholder="1200"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Desired Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={newItemQty}
                          onChange={(e) => setNewItemQty(Number(e.target.value))}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Notes & Details</label>
                        <textarea
                          placeholder="e.g. Brand preference or color details."
                          value={newItemNotes}
                          onChange={(e) => setNewItemNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="md:col-span-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-opacity cursor-pointer"
                      >
                        Add to Shopping List
                      </button>
                    </form>
                  </div>
                )}

                {/* Primary Shopping Table list */}
                <div className="bg-white/90 backdrop-blur border border-purple-100 rounded-3xl overflow-hidden shadow-md text-slate-800">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-purple-50 border-b border-purple-100/40">
                          <th className="p-4 text-[10px] uppercase tracking-widest text-[#BD93F9] font-bold">Status</th>
                          <th className="p-4 text-[10px] uppercase tracking-widest text-[#BD93F9] font-bold">Product Item</th>
                          <th className="p-4 text-[10px] uppercase tracking-widest text-[#BD93F9] font-bold">Category</th>
                          <th className="p-4 text-[10px] uppercase tracking-widest text-[#BD93F9] font-bold text-center">Quantity</th>
                          <th className="p-4 text-[10px] uppercase tracking-widest text-[#BD93F9] font-bold text-right">Total Price</th>
                          <th className="p-4 text-[10px] uppercase tracking-widest text-[#BD93F9] font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-50/50">
                        {shoppingItems.map((item) => (
                          <tr key={item.id} className="hover:bg-purple-50/10 transition-colors animate-slide-in">
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleCompleted(item)}
                                className="flex items-center justify-center text-purple-600 hover:scale-105 transition-transform cursor-pointer"
                              >
                                {item.completed ? (
                                  <span className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white font-bold text-[10px]">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="w-6 h-6 rounded border-2 border-[#BD93F9] hover:bg-pink-100 flex items-center justify-center">
                                    
                                  </span>
                                )}
                              </button>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl p-1 bg-pink-50 rounded-lg">{item.emoji}</span>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{item.item_name}</p>
                                  {item.notes && <p className="text-[11px] text-gray-500 italic font-serif">"{item.notes}"</p>}
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 font-bold rounded-full">
                                {item.category}
                              </span>
                            </td>

                            <td className="p-4 text-center text-xs font-mono font-bold">
                              {item.quantity}
                            </td>

                            <td className="p-4 text-right text-sm font-black font-mono">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </td>

                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 px-3 bg-red-50 hover:bg-red-100 hover:text-red-700 text-red-500 text-xs rounded-lg font-semibold transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}

                        {shoppingItems.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-16 text-gray-400 italic text-sm">
                              "The shopping list is empty. Click 'Add Item' to add items."
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer bar */}
                  <div className="bg-purple-50 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-purple-950 border-t border-purple-100">
                    <div className="flex gap-4">
                      <span>Total Forecast: ₹{shoppingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                      <span className="text-emerald-700">Total Spent Completed: ₹{totalSpendComputed.toLocaleString()}</span>
                    </div>

                    <div>
                      <span>Uncompleted Balance: ₹{pendingSpendForecast.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== TAB 3: WISHLIST VAULT SECTION ==================== */}
            {activeTab === "wishlist" && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Header widget */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-pink-50/50 p-4 rounded-3xl border border-pink-100">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#2C1D42]">Wishlist</h3>
                    <p className="text-xs text-purple-500">Items you would like to purchase in the future.</p>
                  </div>

                  <button
                    onClick={() => setIsAddingWish(true)}
                    className="px-5 py-2.5 bg-[#FF79C6] hover:bg-pink-600 text-black font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Wishlist Item
                  </button>
                </div>

                {/* ADD WISHLIST CARD MODAL */}
                {isAddingWish && (
                  <form onSubmit={handleAddWish} className="p-6 bg-white border border-pink-100 rounded-3xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF79C6]">Add Wishlist Item</h4>
                      <button 
                        onClick={() => setIsAddingWish(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        type="button"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Wish Item Name</label>
                        <input
                          type="text"
                          placeholder="Pearl Solitaire Pendant"
                          value={newWishName}
                          onChange={(e) => setNewWishName(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Target Price (₹)</label>
                        <input
                          type="number"
                          placeholder="15000"
                          value={newWishPrice}
                          onChange={(e) => setNewWishPrice(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Priority Level</label>
                        <select
                          value={newWishPriority}
                          onChange={(e) => setNewWishPriority(e.target.value as any)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-850 font-bold"
                        >
                          <option value="High">High Priority ✨</option>
                          <option value="Medium">Medium Priority 🌸</option>
                          <option value="Low">Low Priority ☁️</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-[#BD93F9] rounded-xl text-xs font-bold uppercase tracking-wider text-black transition-opacity hover:opacity-95 cursor-pointer"
                    >
                      Add to Wishlist
                    </button>
                  </form>
                )}

                {/* Wishlist grid display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((wish) => (
                    <div 
                      key={wish.id}
                      className="bg-white/80 p-5 rounded-3xl border border-pink-100 space-y-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl p-1.5 bg-purple-50 rounded-xl">{wish.emoji || "🛍️"}</span>
                          <div>
                            <h4 className="text-md font-bold text-slate-900">{wish.item_name}</h4>
                            <span className="text-[10px] text-gray-400 block font-mono">Added: {new Date(wish.created_at || "").toLocaleDateString()}</span>
                          </div>
                        </div>

                        <span className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold font-mono ${
                          wish.priority === "High"
                            ? "bg-rose-100 text-rose-700"
                            : wish.priority === "Medium"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-750"
                        }`}>
                          {wish.priority} Priority
                        </span>
                      </div>

                      <div className="pt-2 flex justify-between items-center border-t border-purple-50">
                        <div>
                          <p className="text-[9px] text-gray-400 uppercase tracking-wider font-mono">Target Price</p>
                          <p className="text-lg font-black text-purple-700 font-mono">₹{wish.target_price.toLocaleString()}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePromoteToShopping(wish)}
                            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                          >
                            Promote 🚀
                          </button>
                          <button
                            onClick={() => handleDeleteWish(wish.id)}
                            className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {wishlist.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-gray-400 italic text-sm">
                      "Your wishlist is empty."
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ==================== TAB 4: BUDGET TRACKER SECTION ==================== */}
            {activeTab === "budgets" && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Gauge card layouts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Monthly budget modifier */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-purple-950 font-serif italic">Monthly Budget Limit</h3>
                      <p className="text-xs text-gray-400 font-mono">Set your monthly budget limit to track your spending.</p>
                    </div>

                    <form onSubmit={handleUpdateBudget} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Budget Amount (₹)</label>
                        <input
                          type="number"
                          value={newBudgetAmount}
                          onChange={(e) => setNewBudgetAmount(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Update Budget
                      </button>
                    </form>

                    {/* Progress indicators breakdown */}
                    <div className="space-y-3 pt-4 border-t border-purple-50 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span>Spent Amount:</span>
                        <span className="font-bold text-purple-700 font-mono">₹{budget.spent_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Budget:</span>
                        <span className="font-bold text-emerald-700 font-mono">₹{budget.remaining_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Percentage Reserved:</span>
                        <span className="font-bold font-mono">
                          {Math.round((budget.remaining_amount / (budget.monthly_budget || 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Smart recommendation Optimizer */}
                  <div className="md:col-span-7 bg-[#1A0B2E] border border-white/5 text-white p-6 rounded-3xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <span className="p-1 px-2.5 bg-[#FF79C6]/20 border border-[#FF79C6]/30 text-[#FF79C6] text-[10px] font-bold uppercase tracking-wider rounded">AI ASSISTANT</span>
                          <h3 className="text-sm font-semibold tracking-wide font-serif italic">Budget Optimizer</h3>
                        </div>

                        <button
                          onClick={handleTriggerOptimize}
                          disabled={isOptimizingLoading}
                          className="px-4 py-2 bg-[#BD93F9] hover:bg-[#8d69ca] disabled:bg-purple-300 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {isOptimizingLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sliders className="w-3.5 h-3.5 text-black" />}
                          Optimize Budget
                        </button>
                      </div>

                      <p className="text-gray-300 text-xs italic font-serif leading-relaxed pt-2">
                        "The optimization assistant scans your list to analyze pricing patterns and suggest cost-saving substitutions."
                      </p>
                    </div>

                    {/* Optimization dynamic recommendation list results */}
                    {aiOptimize ? (
                      <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
                        <p className="text-[10px] uppercase font-bold text-[#FF79C6] tracking-widest font-mono">
                          Calculated Saving potential: ₹{aiOptimize.totalSavingsPotential.toLocaleString()}
                        </p>
                        
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {aiOptimize.recommendations.map((rec, idx) => (
                            <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-1 hover:border-[#BD93F9]/30 transition-all">
                              <div className="flex justify-between font-bold text-[#BD93F9]">
                                <span>Modify: {rec.originalItem}</span>
                                <span className="text-[#FF79C6] font-mono">Saves ₹{rec.savings}</span>
                              </div>
                              <p className="text-gray-200">Alternative: <strong className="text-emerald-300">{rec.alternativeItem}</strong></p>
                              <p className="text-gray-400 text-[11px] leading-relaxed italic">"{rec.comment}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-gray-500 text-xs italic">
                        "Click 'Optimize Budget' above to view cost-saving recommendations."
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* ==================== TAB 5: SPEND ANALYTICS DASHBOARD ==================== */}
            {activeTab === "analytics" && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* 2 core metric columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Shopping Score & comments */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between items-center text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-serif italic text-purple-950">Active Shopping Score</h3>
                      <p className="text-xs text-gray-400">Track and score your overall budget adherence</p>
                    </div>

                    {/* Circular dial gauge representation using dynamic SVG */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="#F1E8FB"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          stroke="url(#purplePinkGradient)"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={377}
                          strokeDashoffset={377 - (377 * calculatedShoppingScore) / 100}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#EC4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-purple-950 font-mono">{calculatedShoppingScore}</span>
                        <span className="text-[9px] uppercase tracking-wider text-purple-400 font-mono">Excellent</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic px-4 leading-relaxed font-serif">
                      {calculatedShoppingScore >= 80 
                        ? `"Outstanding! You are staying within your budget and tracking your shopping list items responsibly!"`
                        : `"Let's improve! Swapping high-cost items with budget-friendly alternatives can improve your score."`
                      }
                    </p>
                  </div>

                  {/* Categories Spend Analysis dynamic charts list */}
                  {(() => {
                    // Define category definitions with colors and icons
                    const categoryConfig = [
                      { id: "Beauty", label: "Beauty Products 💄", color: "bg-pink-500", rawColor: "#EC4899" },
                      { id: "Fragrance", label: "Fragrance & Care 🌸", color: "bg-purple-500", rawColor: "#A855F7" },
                      { id: "Fashion", label: "Clothing & Apparel 👗", color: "bg-[#BD93F9]", rawColor: "#BD93F9" },
                      { id: "Electronics", label: "Tech & Accessories 💻", color: "bg-emerald-500", rawColor: "#10B981" },
                      { id: "Grocery", label: "Grocery & Home 🥬", color: "bg-lime-500", rawColor: "#84CC16" },
                      { id: "Other", label: "Other Luxe Categories 🛍️", color: "bg-slate-400", rawColor: "#94A3B8" }
                    ];

                    // Sum the price * quantity for each category
                    let totalMetricVolume = 0;
                    const categoryDetails = categoryConfig.map(cat => {
                      const totalItemSum = shoppingItems
                        .filter(item => {
                          const matchedCat = (item.category === cat.id || (cat.id === "Other" && !["Beauty", "Fragrance", "Fashion", "Electronics", "Grocery"].includes(item.category || "")));
                          
                          if (!matchedCat) return false;

                          if (analyticsMetric === "completed") return item.completed;
                          if (analyticsMetric === "planned") return !item.completed;
                          return true; // "all"
                        })
                        .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

                      totalMetricVolume += totalItemSum;
                      return {
                        ...cat,
                        spent: totalItemSum
                      };
                    });

                    // Add percentages and sort categories
                    const formattedCategories = categoryDetails.map(cat => {
                      const percent = totalMetricVolume > 0 
                        ? Math.round((cat.spent / totalMetricVolume) * 100) 
                        : 0;
                      return {
                        ...cat,
                        percent
                      };
                    });

                    const sortedCategories = [...formattedCategories].sort((a, b) => b.spent - a.spent);

                    return (
                      <div className="md:col-span-7 bg-[#1A0B2E] border border-white/5 text-white p-6 rounded-3xl space-y-4 flex flex-col justify-between animate-fade-in" id="luxe-spend-category-analytics">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                            <div>
                              <h3 className="text-sm uppercase font-black text-purple-300 tracking-brand">Spend allocation by Category</h3>
                              <p className="text-xs text-gray-400">
                                {analyticsMetric === "completed" 
                                  ? "Actual spend on completed items" 
                                  : analyticsMetric === "planned" 
                                    ? "Forecasted spend on pending items" 
                                    : "Total combined list volume"}
                              </p>
                            </div>
                            
                            {/* Segmented Switch Control */}
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 self-start sm:self-auto shrink-0 select-none">
                              <button
                                type="button"
                                onClick={() => setAnalyticsMetric("completed")}
                                className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer ${
                                  analyticsMetric === "completed"
                                    ? "bg-gradient-to-r from-[#BD93F9] to-[#FF79C6] text-[#120B21] shadow-md scale-100"
                                    : "text-gray-400 hover:text-white"
                                  }`}
                              >
                                Spent
                              </button>
                              <button
                                type="button"
                                onClick={() => setAnalyticsMetric("planned")}
                                className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer ${
                                  analyticsMetric === "planned"
                                    ? "bg-gradient-to-r from-[#BD93F9] to-[#FF79C6] text-[#120B21] shadow-md scale-100"
                                    : "text-gray-400 hover:text-white"
                                  }`}
                              >
                                Forecast
                              </button>
                              <button
                                type="button"
                                onClick={() => setAnalyticsMetric("all")}
                                className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer ${
                                  analyticsMetric === "all"
                                    ? "bg-gradient-to-r from-[#BD93F9] to-[#FF79C6] text-[#120B21] shadow-md scale-100"
                                    : "text-gray-400 hover:text-white"
                                  }`}
                              >
                                Combined
                              </button>
                            </div>
                          </div>

                          {totalMetricVolume === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-4 rounded-2xl bg-black/25 border border-white/5" id="luxe-analytics-empty-state">
                              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-xl text-purple-400">
                                📊
                              </div>
                              <div className="max-w-xs space-y-1">
                                <p className="text-xs font-bold text-slate-200">No category transactions detected</p>
                                <p className="text-[11px] text-gray-400 leading-relaxed">
                                  {analyticsMetric === "completed" 
                                    ? "You haven't checked off any priced items in your Shopping List as completed yet."
                                    : analyticsMetric === "planned"
                                      ? "There are no pending priced items remaining in your Shopping List."
                                      : "Your Shopping List is currently empty or has no priced layout."}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab("shopping")}
                                className="px-4 py-2 bg-gradient-to-r from-[#BD93F9] to-[#FF79C6] hover:brightness-110 text-purple-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                Manage Shopping List 🛍️
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4" id="luxe-analytics-category-list">
                              {sortedCategories.map((cat, i) => (
                                <div key={i} className={`space-y-1.5 transition-all duration-300 ${cat.spent === 0 ? "opacity-35 hover:opacity-75" : ""}`}>
                                  <div className="flex justify-between text-xs font-bold">
                                    <span className="flex items-center gap-1.5">{cat.label}</span>
                                    <span className="font-mono text-[#FF79C6]">{cat.percent}% (₹{Math.round(cat.spent).toLocaleString()})</span>
                                  </div>
                                  <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-700 ease-out ${cat.color}`} 
                                      style={{ width: `${cat.percent}%` }} 
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {totalMetricVolume > 0 && (
                          <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[11px] text-purple-300 mt-2">
                            <span>Total Analyzed Volume:</span>
                            <span className="font-mono font-black text-white text-xs">₹{Math.round(totalMetricVolume).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>

              </div>
            )}

             {/* ==================== TAB 7: SMART REMINDER CENTER ==================== */}
            {activeTab === "reminders" && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Reminders widget setup */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Create Reminder Form */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-purple-950 font-serif italic text-purple-900">Create Reminders</h3>
                      <p className="text-xs text-gray-400">Set up custom shopping and budget check reminders.</p>
                    </div>

                    <form onSubmit={handleAddReminder} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Alarm Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Time to buy your lipstick 💄"
                          value={newReminderText}
                          onChange={(e) => setNewReminderText(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-mono">Notification Time</label>
                        <input
                          type="time"
                          value={newReminderTime}
                          onChange={(e) => setNewReminderTime(e.target.value)}
                          className="w-full bg-purple-50/50 border border-purple-100 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-slate-850 font-bold font-mono"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#FF79C6] hover:bg-pink-600 text-black font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Create Reminder
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Schedulers lists */}
                  <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4 text-slate-800">
                    <h3 className="text-sm uppercase font-black text-purple-700 tracking-wider">Reminders List</h3>

                    <div className="divide-y divide-purple-50">
                      {reminders.map((rem) => (
                        <div key={rem.id} className="flex justify-between items-center py-3.5">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl p-1.5 bg-pink-50 rounded-xl">{rem.badgeEmoji || "🔔"}</span>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{rem.text}</p>
                              <span className="text-[10px] font-mono text-purple-500 font-bold block">Scheduled for {rem.time} daily</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleReminder(rem.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                rem.active 
                                  ? "bg-purple-100 text-purple-700" 
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                               {rem.active ? "Active" : "Silenced"}
                            </button>
                            <button 
                              onClick={() => handleDeleteReminder(rem.id)}
                              className="p-1 hover:bg-rose-50 text-rose-500 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {reminders.length === 0 && (
                        <p className="text-center py-12 text-gray-400 italic text-sm">
                          "No reminders set. Create a reminder above."
                        </p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ==================== TAB 8: USER SETTINGS ROOM ==================== */}
            {activeTab === "settings" && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Settings workspace panel */}
                <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-8">
                  <div>
                    <h3 className="text-xl font-extrabold text-purple-950 font-serif italic text-purple-950">Settings</h3>
                    <p className="text-xs text-gray-400">Customize visual themes and export list backups easily.</p>
                  </div>

                  {/* Dynamic brand theme presets selectors */}
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Theme Selection</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Theme Option 1: Royal Lavender */}
                      <button
                        onClick={() => handleUpdateProfile("royal-lavender")}
                        className={`p-5 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                          theme === "royal-lavender"
                            ? "bg-purple-50 border-purple-600 ring-2 ring-purple-600/20"
                            : "bg-white border-purple-100 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xl">💜</span>
                          <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded font-mono">SELECTED</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Classic Lavender</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          Chic pastel pink, elegant lavender glass cards, sparkling hearts floating ambience.
                        </p>
                      </button>

                      {/* Theme Option 2: Midnight Lavender */}
                      <button
                        onClick={() => handleUpdateProfile("midnight-lavender")}
                        className={`p-5 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                          theme === "midnight-lavender"
                            ? "bg-[#110A20] border-[#FF79C6] ring-2 ring-pink-500/20 text-white"
                            : "bg-white border-purple-100 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xl">🌙</span>
                          {theme === "midnight-lavender" && (
                            <span className="text-[10px] bg-[#FF79C6] text-black font-bold px-2 py-0.5 rounded font-mono">SELECTED</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Midnight Lavender Dark</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Deep cosmos black, neon pink highlights, glassmorphism cards with glowing highlights.
                        </p>
                      </button>

                      {/* Theme Option 3: Classic Orchid */}
                      <button
                        onClick={() => handleUpdateProfile("classic-orchid" as any)}
                        className={`p-5 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                          theme === "classic-orchid"
                            ? "bg-[#FAF9FC] border-slate-700 ring-2 ring-slate-400/20"
                            : "bg-white border-purple-100 hover:border-purple-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xl">🌸</span>
                          {theme === "classic-orchid" && (
                            <span className="text-[10px] bg-slate-800 text-white font-bold px-2 py-0.5 rounded font-mono">SELECTED</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Classic Orchid</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          Clean elegant minimalist backdrop slate. Focuses purely on typography layout structure.
                        </p>
                      </button>

                    </div>
                  </div>

                  {/* Actions Row: Exports System buttons */}
                  <div className="pt-6 border-t border-purple-50 space-y-4">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Export Data</p>
                    
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => handleExportSystem("pdf")}
                        className="px-5 py-3 bg-[#BD93F9] text-black font-bold text-xs rounded-xl hover:opacity-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-black" /> Download Shopping List PDF
                      </button>

                      <button
                        onClick={() => handleExportSystem("text")}
                        className="px-5 py-3 bg-white border border-purple-200 text-purple-700 font-bold text-xs rounded-xl hover:bg-purple-50 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download Plain Text Records
                      </button>
                    </div>
                  </div>

                  {/* Application Support & Resources */}
                  <div className="pt-6 border-t border-purple-50 space-y-4">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Application Documents & Support</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button onClick={() => setOpenLegalDocument("about")} className="p-4 text-left bg-purple-50/50 hover:bg-purple-100/30 rounded-2xl cursor-pointer border border-[#BD93F9]/20 transition-all hover:scale-[1.01]">
                        <span className="block text-xs font-bold text-purple-950 mb-1">About Us</span>
                        <span className="text-[10px] text-gray-400 block leading-relaxed">Our mission to guide your luxury curations.</span>
                      </button>
                      <button onClick={() => setOpenLegalDocument("privacy")} className="p-4 text-left bg-purple-50/50 hover:bg-purple-100/30 rounded-2xl cursor-pointer border border-[#BD93F9]/20 transition-all hover:scale-[1.01]">
                        <span className="block text-xs font-bold text-purple-950 mb-1">Privacy Policy</span>
                        <span className="text-[10px] text-gray-400 block leading-relaxed">How we secure your budget logs.</span>
                      </button>
                      <button onClick={() => setOpenLegalDocument("terms")} className="p-4 text-left bg-purple-50/50 hover:bg-purple-100/30 rounded-2xl cursor-pointer border border-[#BD93F9]/20 transition-all hover:scale-[1.01]">
                        <span className="block text-xs font-bold text-purple-950 mb-1">Terms of Service</span>
                        <span className="text-[10px] text-gray-400 block leading-relaxed">Rules governing curation tools.</span>
                      </button>
                      <button onClick={() => {
                        setContactSuccessTicket(null);
                        setOpenLegalDocument("contact");
                      }} className="p-4 text-left bg-purple-50/50 hover:bg-purple-100/30 rounded-2xl cursor-pointer border border-[#BD93F9]/20 transition-all hover:scale-[1.01]">
                        <span className="block text-xs font-bold text-purple-950 mb-1 font-sans">Contact Support</span>
                        <span className="text-[10px] text-gray-400 block leading-relaxed">Talk to our concierge style desk.</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* AI SYSTEM COMPLEMENTARY SEARCH FLOATING DRAWER */}
            <div 
              className={`p-6 rounded-3xl border space-y-4 transition-all duration-500 shadow-lg ${
                theme === "royal-lavender" 
                  ? "bg-white border-[#E6DAF0]" 
                  : theme === "midnight-lavender" 
                    ? "bg-[#110A20] border-[#BD93F9]/20 text-white" 
                    : "bg-white border-slate-100"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#FF79C6]" />
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-purple-500">Get Shopping Suggestions</h3>
              </div>

              <form onSubmit={handleAiSuggestQuery} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="Type an item (e.g. Lipstick, Perfume) to query matches..."
                  value={aiItemQuery}
                  onChange={(e) => setAiItemQuery(e.target.value)}
                  className="flex-1 w-full bg-purple-50/50 border border-purple-100/40 rounded-xl px-4 py-3 text-xs focus:border-purple-400 focus:outline-none text-[#2C1D42] font-bold"
                />
                <button
                  type="submit"
                  disabled={isSuggestingLoading}
                  className="w-full sm:w-auto px-5 py-3 bg-[#BD93F9]/80 text-[#120721] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#BD93F9] cursor-pointer shrink-0"
                >
                  {isSuggestingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Get Suggestions
                </button>
              </form>

              {/* Suggestions dropdown lists display */}
              {aiSuggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-purple-50/10">
                  {aiSuggestions.map((sug, i) => (
                    <div key={i} className="p-3 bg-purple-50/10 border border-purple-100/10 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-[#FF79C6]">
                        <span>{sug.emoji} {sug.item}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 italic leading-relaxed">"{sug.reason}"</p>
                      <p className="text-[10px] text-[#BD93F9] font-semibold">💡 tip: {sug.brandTip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LuxeList Aesthetic Footer */}
            <footer className="w-full border-t border-purple-500/10 pt-8 pb-12 mt-12 text-center space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-[#A855F7] dark:text-[#C084FC]">
                <button onClick={() => setOpenLegalDocument("about")} className="hover:underline cursor-pointer">About Us</button>
                <button onClick={() => setOpenLegalDocument("privacy")} className="hover:underline cursor-pointer">Privacy Policy</button>
                <button onClick={() => setOpenLegalDocument("terms")} className="hover:underline cursor-pointer">Terms of Service</button>
                <button onClick={() => {
                  setContactSuccessTicket(null);
                  setOpenLegalDocument("contact");
                }} className="hover:underline cursor-pointer font-sans">Contact Us</button>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-sans">
                  Designed & curated under immaculate standards. All content encrypted securely.
                </p>
                <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase font-bold">
                  Copyright © 2026 LuxeList Inc. • Version 1.4.0
                </p>
              </div>
            </footer>
            
            {/* CLOSE INNER SCROLLBOX */}
            </div>

          </main>

        </div>
      ) : null}

      {/* AESTHETIC LAVENDER SHARE MODAL */}
      {isSharingList && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-purple-100 max-w-md w-full shadow-2xl p-6 relative animate-fade-in-up my-auto max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-purple-100 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <LuxeLogo size={48} glow={true} isBadge={true} />
                <div>
                  <h3 className="text-base font-extrabold text-purple-950">Share Shopping List</h3>
                  <p className="text-[11px] text-gray-500">Send your curated list to friends or family</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSharingList(false)}
                className="p-1.5 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-purple-400 hover:text-purple-600" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto no-scrollbar flex-1 pr-1 mt-4 space-y-5">
              {/* List Preview */}
              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-purple-500 font-mono block mb-2">Message Format Preview</label>
                <div className="bg-purple-50/20 border border-dashed border-purple-200/50 rounded-2xl p-4 font-sans text-xs text-[#2C1D42] whitespace-pre-wrap max-h-40 overflow-y-auto no-scrollbar leading-relaxed shadow-inner">
                  {getFormattedListText()}
                </div>
              </div>

              {/* Sharing Options Grid */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black tracking-wider text-gray-400 font-mono">Select sharing platform</p>
                
                {/* Device Native Web Share */}
                {navigator.share && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: 'My Shopping List',
                        text: getFormattedListText(),
                        url: window.location.href
                      }).then(() => {
                        spawnToast("Shared successfully! 🎉", "success");
                      }).catch((err) => {
                        console.log("Web share canceled or failed:", err);
                      });
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-[#BD93F9] hover:from-purple-700 hover:to-purple-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(147,51,234,0.2)] transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" /> Use Device Native Share
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3 pb-1" id="luxe-share-options-grid">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getFormattedListText())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-emerald-50/40 dark:bg-emerald-500/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-emerald-100/70 dark:border-emerald-500/15 text-emerald-800 dark:text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 text-[#25D366]" fill="currentColor">
                      <path d="M12.004 0C5.378 0 .004 5.373.004 12c0 2.112.551 4.168 1.597 5.978L.022 24l6.166-1.614C7.943 23.407 9.957 24 12.004 24c6.625 0 12-5.373 12-12s-5.375-12-12-12zm0 21.996c-1.879 0-3.722-.505-5.328-1.461l-.382-.227-3.665.959.977-3.571-.249-.395C2.296 15.694 1.761 13.882 1.761 12c0-5.648 4.6-10.245 10.243-10.245 5.646 0 10.247 4.597 10.247 10.245 0 5.649-4.601 10.245-10.247 10.245zm3.816-7.816c-.21-.105-1.24-.61-1.43-.68-.19-.07-.33-.105-.47.105-.14.21-.54.68-.66.82-.12.14-.24.16-.45.055-.21-.105-.89-.328-1.69-1.042-.63-.564-1.05-1.261-1.18-1.472-.12-.21-.01-.328.09-.434.1-.1.21-.245.32-.37.11-.12.14-.21.21-.35.07-.14.03-.265-.015-.37-.05-.105-.47-1.135-.64-1.555-.17-.41-.35-.35-.48-.36l-.41-.01c-.14 0-.37.05-.56.265-.2.21-.75.735-.75 1.79s.77 2.07.88 2.21c.11.14 1.51 2.3 3.66 3.23.51.22.91.35 1.22.45.51.16.98.14 1.35.085.415-.06 1.24-.505 1.41-1.001.17-.49.17-.91.12-1.001-.05-.09-.19-.14-.4-.245z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(getFormattedListText())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-sky-50/40 dark:bg-sky-500/5 hover:bg-sky-50 dark:hover:bg-sky-500/10 border border-sky-100/70 dark:border-sky-500/15 text-sky-800 dark:text-sky-400 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 text-[#229ED9]" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.92 9.06c-.14.63-.52.78-1.04.49l-2.93-2.16-1.41 1.36c-.16.16-.29.29-.6.29l.21-2.99 5.44-4.92c.24-.21-.05-.33-.37-.12l-6.73 4.24-2.9-.91c-.63-.2-.64-.63.13-.93l11.34-4.38c.53-.19.99.12.83.94c.01.01.01.02.01.03z" />
                    </svg>
                    <span>Telegram</span>
                  </a>

                  {/* Gmail */}
                  <a
                    href={`mailto:?subject=My%20Shopping%20List&body=${encodeURIComponent(getFormattedListText())}`}
                    className="p-3 bg-red-50/40 dark:bg-red-500/5 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-100/70 dark:border-red-500/15 text-red-800 dark:text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 text-[#EA4335]" fill="currentColor">
                      <path d="M24 5.457v13.911c0 .905-.733 1.632-1.632 1.632h-3.264V10.222L12 15.011 4.896 10.222v10.778H1.632A1.632 1.632 0 010 19.368V5.457c0-.756.51-1.411 1.25-1.587l10.75 6.002 10.75-6.002c.74.176 1.25.831 1.25 1.587z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Gmail</span>
                  </a>

                  {/* SMS */}
                  <a
                    href={`sms:?&body=${encodeURIComponent(getFormattedListText())}`}
                    className="p-3 bg-emerald-50/30 dark:bg-emerald-500/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-emerald-100/55 dark:border-emerald-500/15 text-emerald-900 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                      <defs>
                        <linearGradient id="smsIconGradient" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm0-3h12v2H6V6zm0 6h8v2H6v-2z" fill="url(#smsIconGradient)" />
                    </svg>
                    <span>SMS / Text</span>
                  </a>

                  {/* Facebook Messenger */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(getFormattedListText())}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-indigo-50/40 dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-indigo-100/70 dark:border-indigo-500/15 text-indigo-850 dark:text-indigo-400 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                      <defs>
                        <linearGradient id="messengerIconGradient" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0066FF" />
                          <stop offset="60%" stopColor="#A100FF" />
                          <stop offset="100%" stopColor="#FF3A3A" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2C6.35 2 1.76 6.36 1.76 11.73c0 2.87 1.33 5.46 3.44 7.21.18.15.28.38.25.62l-.24 2.1c-.05.47.45.83.89.62l2.42-1.15c.18-.09.4-.08.57.02 1.04.59 2.22.9 3.47.9 5.65 0 10.24-4.36 10.24-9.73S17.65 2 12 2zm1.18 12.3l-2.48-2.65-4.84 2.65c-.41.22-.88-.22-.65-.62l2.67-4.66c.15-.26.49-.33.72-.15l2.48 2.65 4.84-2.65c.41-.22.88.22.65.62l-2.67 4.66c-.15.26-.49.33-.72.15z" fill="url(#messengerIconGradient)" />
                    </svg>
                    <span>Messenger</span>
                  </a>

                  {/* Instagram Direct */}
                  <button
                    onClick={() => copyToClipboard(getFormattedListText(), "instagram")}
                    className="p-3 bg-pink-50/40 dark:bg-pink-500/5 hover:bg-pink-50 dark:hover:bg-pink-500/10 border border-pink-100/70 dark:border-pink-500/15 text-pink-850 dark:text-pink-400 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                      <defs>
                        <linearGradient id="instagramIconGradient" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0%" stopColor="#FED731" />
                          <stop offset="25%" stopColor="#F26939" />
                          <stop offset="50%" stopColor="#E1306C" />
                          <stop offset="75%" stopColor="#C13584" />
                          <stop offset="100%" stopColor="#405DE6" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="url(#instagramIconGradient)" />
                    </svg>
                    <span>Instagram Direct</span>
                  </button>

                  {/* Google Keep / Save to Google */}
                  <button
                    onClick={() => {
                      const text = getFormattedListText();
                      copyToClipboard(text, "text");
                      window.open("https://keep.google.com/#create", "_blank", "noopener,noreferrer");
                      spawnToast("Copied list text! Opening Google Keep... 📝✨", "success");
                    }}
                    className="p-3 bg-slate-50/50 dark:bg-slate-500/5 hover:bg-slate-50 dark:hover:bg-slate-500/10 border border-slate-100/70 dark:border-slate-500/15 text-slate-800 dark:text-slate-300 text-xs font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span>Google Keep</span>
                  </button>
                </div>

                {/* Copy links bar */}
                <div className="pt-3 grid grid-cols-2 gap-3 border-t border-purple-100/70">
                  <button
                    onClick={() => copyToClipboard(window.location.href, "link")}
                    className="py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    🔗 Copy Web Link
                  </button>
                  <button
                    onClick={() => copyToClipboard(getFormattedListText(), "text")}
                    className="py-2 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    📋 Copy Text List
                  </button>
                </div>
              </div>

              {/* Prompt Footer design */}
              <div className="text-center pt-2">
                <span className="text-[10px] text-purple-400 font-mono italic">"The beautiful offline companion for aesthetic shopping"</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LEGAL DOCUMENTS & ABOUT MODAL */}
      {openLegalDocument && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 overflow-y-auto p-4 flex items-center justify-center text-slate-800 font-sans">
          <div className="bg-white rounded-3xl border border-purple-100 max-w-2xl w-full shadow-2xl p-6 md:p-8 relative animate-fade-in-up my-auto max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-purple-100 flex-shrink-0">
              <div className="flex items-center gap-3 font-sans">
                <div className="w-11 h-11 bg-purple-600/10 border border-purple-200 rounded-2xl flex items-center justify-center text-xl select-none shrink-0 shadow-xs">
                  {openLegalDocument === "about" ? "⚜️" : openLegalDocument === "privacy" ? "🛡️" : openLegalDocument === "terms" ? "📜" : "✉️"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-950">
                    {openLegalDocument === "about" && "About LuxeList"}
                    {openLegalDocument === "privacy" && "Privacy & Data Policy"}
                    {openLegalDocument === "terms" && "Terms of Service"}
                    {openLegalDocument === "contact" && "Concierge Support Desk"}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {openLegalDocument === "about" && "Learn about our luxurious shopping mission."}
                    {openLegalDocument === "privacy" && "How we safeguard your curation data parameters."}
                    {openLegalDocument === "terms" && "Review licensing limits and platform rules."}
                    {openLegalDocument === "contact" && "Submit a secure inquiry to our specialist teams."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setOpenLegalDocument(null)}
                className="p-1.5 hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-purple-400 hover:text-purple-650" />
              </button>
            </div>

            {/* Scrollable Document Body */}
            <div className="overflow-y-auto flex-1 mt-6 pr-1 space-y-5 text-xs text-slate-600 leading-relaxed no-scrollbar">
              
              {/* CONTENT FOR: ABOUT US */}
              {openLegalDocument === "about" && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-105/30 text-[#2C1D42]">
                    <p className="font-serif italic font-bold text-sm">"Curation is an art form. LuxeList ensures your spending habits reflect the luxury you deserve."</p>
                  </div>
                  <h4 className="text-sm font-bold text-purple-950 pt-2">The LuxeList Vision</h4>
                  <p>LuxeList was conceptualized and crafted for individuals who appreciate premium layout styling, space-age lavender elegance, and structured budget forecasting. Too often, shopping applications feel clinical or cluttered. We set out to design a sanctuary—a modern, responsive canvas where listing items feels like curating an art gallery.</p>
                  
                  <h4 className="text-sm font-bold text-purple-950 pt-2 font-sans">Our Key Pillars</h4>
                  <ul className="space-y-2 pl-4 list-disc marker:text-[#BD93F9] font-sans">
                    <li><strong>Aesthetic Focus:</strong> Deep, eye-safe twilight modes, royal lavender cards, and micro-interactions optimized for visual clarity.</li>
                    <li><strong>Secure Syncing:</strong> Secure server endpoints paired with client-side offline persistence to protect your transaction metrics.</li>
                    <li><strong>Intelligent Curation:</strong> Built-in Gemini AI optimizer designed to instantly recommend alternative, cost-saving brand substitutions.</li>
                  </ul>

                  <h4 className="text-sm font-bold text-purple-950 pt-2">Continuous Perfection</h4>
                  <p>Currently on Version 1.4.0, our developer and interface design teams are committed to expanding list portability, calendar integrations, and custom financial tracking systems to ensure your shopping logs remain immaculate.</p>
                </div>
              )}

              {/* CONTENT FOR: PRIVACY POLICY */}
              {openLegalDocument === "privacy" && (
                <div className="space-y-4">
                  <p className="font-mono text-[10px] text-purple-600 bg-purple-100/30 px-2.5 py-1 rounded-sm inline-block font-bold">LAST REVISED: JUNE 22, 2026</p>
                  <p>At LuxeList, your security and privacy parameters are paramount. We do not engage in the sale, barter, or transfer of your shopping, wishlist, or transaction logs to any external marketing aggregators.</p>
                  
                  <h4 className="text-sm font-bold text-purple-950 pt-2">1. Data Storage & Local State</h4>
                  <p>Your item details, monthly budget configurations, and checklist milestones are stored securely inside our isolated, server-authoritative databases and synced dynamically to your client browser's local cache. This ensures instant performance retrieval on mobile and desktop screens alike.</p>
                  
                  <h4 className="text-sm font-bold text-[#2C1D42] pt-2">2. Encryption & Server Security</h4>
                  <p>All data transit between your viewing terminal and the cloud runs over secure HTTPS channels with TLS 1.3 protocol standards. Passwords, auth sessions, and verification tokens are securely salted and hashed using industry-proven mathematical algorithms.</p>
                  
                  <h4 className="text-sm font-bold text-[#2C1D42] pt-2">3. Cookies & Workspace Preferences</h4>
                  <p>We use localized browser parameters and secure sessions solely to maintain your preferred theme choice (Classic Orchid, Midnight Lavender, or Royal Lavender) and your live session authentication state.</p>
                  
                  <h4 className="text-sm font-bold text-[#2C1D42] pt-2">4. User Rights</h4>
                  <p>You can instantly export all of your active and past items using our PDF/Plaintext modules inside Settings, or contact our support concierge desk to request immediate purging of all synced account records.</p>
                </div>
              )}

              {/* CONTENT FOR: TERMS OF SERVICE */}
              {openLegalDocument === "terms" && (
                <div className="space-y-4 font-sans">
                  <p className="font-mono text-[10px] text-purple-600 bg-purple-100/30 px-2.5 py-1 rounded-sm inline-block font-bold">EFFECTIVE DATE: JUNE 22, 2026</p>
                  <p>Welcome to LuxeList. By creating a secure account, logging in, or adding entries, you agree to comply with the following Terms and licensing provisions:</p>
                  
                  <h4 className="text-sm font-bold text-purple-950 pt-2">1. License & Usage</h4>
                  <p>We grant you a personal, non-exclusive, non-transferable license to access the LuxeList dashboard, item trackers, and AI suggest tools for individual, non-commercial purposes only.</p>
                  
                  <h4 className="text-sm font-bold text-purple-950 pt-2">2. User Accounts</h4>
                  <p>You are solely responsible for protecting your account credentials and passwords. LuxeList cannot be held liable for any data exposures resulting from weak passkeys or shared devices.</p>
                  
                  <h4 className="text-sm font-bold text-purple-950 pt-2">3. AI Suggestions Disclaimer</h4>
                  <p>AI suggestions, optimization parameters, and category tip boxes are generated in real-time. These are informational recommendations—not professional financial or purchasing advice. Users must evaluate standard retail prices on their own.</p>
                  
                  <h4 className="text-sm font-bold text-purple-950 pt-2">4. Disclaimers of Warranty</h4>
                  <p>LuxeList provides all services "as is" and "as available," without warranties of any kind, whether express or implied. Operating speed and sync uptime depend on local browser networks.</p>
                </div>
              )}

              {/* CONTENT FOR: CONTACT US FORM */}
              {openLegalDocument === "contact" && (
                <div className="space-y-4">
                  {!contactSuccessTicket ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setIsSubmittingContact(true);
                        setTimeout(() => {
                          const ticketNum = "LL-" + Math.floor(10000 + Math.random() * 90000);
                          setContactSuccessTicket(ticketNum);
                          setIsSubmittingContact(false);
                          spawnToast(`Support ticket registered successfully under ID ${ticketNum}! 🌸`, "success");
                        }, 1200);
                      }}
                      className="space-y-4"
                    >
                      <p>Need custom support? Have ideas for visual theme iterations? Fill in the details below and our concierge specialists will reach out shortly.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Your Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. Gayatri" 
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-[#FAF7FD] border border-purple-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-405"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Email Address</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="gayatribellamkonda088@gmail.com" 
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-[#FAF7FD] border border-purple-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-405"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Inquiry Category</label>
                        <select 
                          value={contactTopic}
                          onChange={(e) => setContactTopic(e.target.value)}
                          className="w-full bg-[#FAF7FD] border border-purple-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-405"
                        >
                          <option>General Support</option>
                          <option>Account Syncing Issues</option>
                          <option>AI Suggestions Feedback</option>
                          <option>Feature Requests</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Detailed Message</label>
                        <textarea 
                          required 
                          rows={4} 
                          placeholder="Type your feedback or details..." 
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-[#FAF7FD] border border-purple-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-405 resize-none font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer hover:opacity-95"
                      >
                        {isSubmittingContact ? (
                          <span className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Submit Concierge Ticket"
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4 animate-fade-in font-sans">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xl mx-auto shadow-inner select-none animate-bounce-subtle">
                        ✓
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-extrabold text-[#2C1D42]">Inquiry Dispatched Successfully!</h4>
                        <p className="text-gray-400 text-xs px-6">Your ticket has been logged inside our cloud-support hub. Our concierge operators will reach out to you within 2 hours.</p>
                      </div>
                      <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 max-w-xs mx-auto space-y-1">
                        <p className="text-[9px] uppercase text-gray-400 font-mono">Secure Ticket ID</p>
                        <p className="text-xs font-black text-purple-950 font-mono">{contactSuccessTicket}</p>
                      </div>
                      <button
                        onClick={() => {
                          setContactName("");
                          setContactEmail("");
                          setContactMessage("");
                          setContactSuccessTicket(null);
                        }}
                        className="px-5 py-2.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-100 transition-colors cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="text-center pt-4 border-t border-purple-50 flex-shrink-0">
              <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-bold">LuxeList Concierge Space • v1.4.0</span>
            </div>

          </div>
        </div>
      )}

      {/* 4. CHIC MY PROFILE EDIT MODAL */}
      {isMyProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 text-slate-800 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-purple-100 shadow-2xl relative space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-purple-50">
              <div>
                <h3 className="text-lg font-black text-purple-950 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  My LuxeList Profile
                </h3>
                <p className="text-[10px] text-gray-400">View and update your secure synchronized metadata.</p>
              </div>
              <button
                onClick={() => setIsMyProfileModalOpen(false)}
                className="p-1 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Picture Option Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Select Avatar Style</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xl border-2 border-purple-200">
                  {profileEditImage ? (
                    <img src={profileEditImage} alt="Preview Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    profileEditName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-gray-455 italic">Select an aesthetic preset below or paste a custom URL:</p>
                  <input
                    type="url"
                    placeholder="Custom Image URL..."
                    value={profileEditImage || ""}
                    onChange={(e) => setProfileEditImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-purple-400 outline-none"
                  />
                </div>
              </div>

              {/* Preset avatars grid */}
              <div className="grid grid-cols-6 gap-2 pt-2">
                {[
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120"
                ].map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProfileEditImage(url)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                      profileEditImage === url ? "border-purple-600 scale-105 shadow-md" : "border-slate-200 hover:border-purple-300"
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Form Input fields */}
            <form onSubmit={handleProfileUpdate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileEditName}
                  onChange={(e) => setProfileEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-900 font-mono">Registered Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profileEditEmail}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMyProfileModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md hover:brightness-105 flex justify-center items-center gap-1.5"
                >
                  {isAuthLoading ? (
                    <span className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
