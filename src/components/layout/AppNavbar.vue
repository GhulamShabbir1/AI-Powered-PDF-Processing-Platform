<template>
  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    width="300"
    class="navbar-drawer"
  >
    <div class="d-flex flex-column h-100 pa-4">
      <!-- Drawer Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div
          class="d-flex align-center"
          @click="
            scrollTo('hero');
            drawer = false;
          "
          style="cursor: pointer"
        >
          <v-icon color="primary" size="28" class="mr-2">mdi-brain</v-icon>
          <span class="text-h5 font-weight-bold">
            AI PDF<span class="text-primary">.</span>
          </span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="drawer = false"
          rounded="lg"
        />
      </div>

      <v-divider class="mb-4"></v-divider>

      <!-- Drawer Navigation Links -->
      <v-list nav class="flex-grow-1">
        <v-list-item
          v-for="item in navLinks"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="activeSection === item.value"
          @click="
            scrollTo(item.value);
            drawer = false;
          "
          class="rounded-lg mb-1"
          active-color="primary"
          link
        />
      </v-list>

      <v-divider class="my-4"></v-divider>

      <!-- Drawer CTA Buttons -->
      <div class="mt-auto">
        <v-btn
          block
          variant="outlined"
          color="primary"
          class="mb-3 rounded-lg text-none font-weight-medium"
          size="large"
          @click="navigateToLogin"
        >
          Login
        </v-btn>

        <v-btn
          block
          color="primary"
          class="rounded-lg text-none font-weight-bold"
          size="large"
          @click="
            scrollTo('cta');
            drawer = false;
          "
        >
          Get Started Free
          <v-icon end size="18" class="ml-2">mdi-rocket-launch</v-icon>
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>

  <!-- Desktop App Bar -->
  <v-app-bar
    app
    :flat="!isScrolled"
    :elevation="isScrolled ? 2 : 0"
    :height="isScrolled ? 64 : 80"
    class="navbar-main"
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <v-container class="px-4 px-md-6 d-flex align-center h-100">
      <!-- Logo -->
      <div class="d-flex align-center cursor-pointer" @click="scrollTo('hero')">
        <v-icon color="primary" size="28" class="mr-2">mdi-brain</v-icon>
        <span class="text-h5 font-weight-bold">
          AI PDF<span class="text-primary">.</span>
        </span>
      </div>

      <v-spacer></v-spacer>

      <!-- Desktop Navigation Links -->
      <div class="d-none d-md-flex align-center ga-2 mx-4">
        <v-btn
          v-for="item in navLinks"
          :key="item.title"
          variant="text"
          :active="activeSection === item.value"
          @click="scrollTo(item.value)"
          class="nav-link-desktop"
          size="default"
        >
          {{ item.title }}
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <!-- Desktop Actions -->
      <div class="d-none d-md-flex align-center ga-3">
        <!-- Theme Toggle Button -->
        <v-btn
          :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          variant="text"
          size="small"
          class="theme-toggle-btn"
          @click="toggleTheme"
        />

        <!-- Login Button -->
        <v-btn
          variant="text"
          color="primary"
          class="login-btn"
          @click="navigateToLogin"
        >
          Login
        </v-btn>

        <!-- Get Started Button -->
        <v-btn color="primary" class="get-started-btn" @click="scrollTo('cta')">
          Get Started
          <v-icon end size="18" class="ml-1">mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <!-- Mobile Menu Button -->
      <v-btn
        class="d-md-none"
        icon="mdi-menu"
        variant="text"
        size="small"
        @click="drawer = true"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'

const theme = useTheme()
const router = useRouter()
const drawer = ref(false)
const isScrolled = ref(false)
const activeSection = ref('hero')

// Theme management
const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: (val) => {
    theme.global.name.value = val ? "dark" : "light";
    localStorage.setItem("theme", val ? "dark" : "light");
  },
});

const navLinks = [
  { title: "Home", value: "hero", icon: "mdi-home-outline" },
  { title: "Features", value: "features", icon: "mdi-lightning-bolt-outline" },
  { title: "How it Works", value: "how-it-works", icon: "mdi-cached" },
  { title: "Pricing", value: "pricing", icon: "mdi-tag-outline" },
];

// Scroll handler with throttling for performance
let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 50;

      const scrollPosition = window.scrollY + 100;
      for (const item of navLinks) {
        const section = document.getElementById(item.value);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            activeSection.value = item.value;
            break;
          }
        }
      }
      ticking = false;
    });
    ticking = true;
  }
};

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -80;
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    drawer.value = false;
  }
};

const navigateToLogin = () => {
  router.push('/login')
}

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// Watch for theme changes
watch(
  isDark,
  (newVal) => {
    document.body.classList.toggle("dark", newVal);
  },
  { immediate: true }
);

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.global.name.value = savedTheme as "light" | "dark";
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Navbar Base Styles */
.navbar-main {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(8px);
}

.navbar-scrolled {
  background: rgba(var(--v-theme-surface), 0.95) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

/* Navigation Links */
.nav-link-desktop {
  text-transform: none !important;
  font-weight: 500;
  font-size: 0.9375rem;
  letter-spacing: normal;
  border-radius: 8px;
  padding: 6px 16px !important;
  transition: all 0.2s ease;
}

.nav-link-desktop:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateY(-1px);
}

.nav-link-desktop.v-btn--active {
  color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.12);
  font-weight: 600;
}

/* Login Button */
.login-btn {
  text-transform: none !important;
  font-weight: 500;
  font-size: 0.9375rem;
  border-radius: 8px;
  padding: 6px 20px !important;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateY(-1px);
}

/* Get Started Button */
.get-started-btn {
  text-transform: none !important;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 8px;
  padding: 6px 24px !important;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.get-started-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

.get-started-btn:active {
  transform: translateY(0);
}

/* Theme Toggle Button */
.theme-toggle-btn {
  border-radius: 8px !important;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: rotate(15deg);
}

/* Mobile Drawer */
.navbar-drawer {
  background: rgba(var(--v-theme-surface), 0.98) !important;
  backdrop-filter: blur(16px);
}

/* Drawer List Items */
:deep(.v-list-item) {
  border-radius: 8px !important;
  margin-bottom: 4px;
}

:deep(.v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-list-item--active .v-list-item__prepend) {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .navbar-main {
    height: 64px !important;
  }

  .navbar-scrolled {
    height: 60px !important;
  }
}

@media (max-width: 600px) {
  .get-started-btn,
  .login-btn {
    padding: 6px 16px !important;
    font-size: 0.875rem !important;
  }
}

/* Cursor pointer utility */
.cursor-pointer {
  cursor: pointer;
}
</style>
