<template>
  <!-- Mobile Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    width="300"
    class="drawer-glass"
  >
    <div class="d-flex flex-column h-100 pa-4">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center cursor-pointer" @click="scrollTo('hero')">
          <v-icon color="primary" class="mr-2">mdi-brain</v-icon>
          <span class="text-h6 font-weight-bold">
            AI PDF<span class="text-primary">.</span>
          </span>
        </div>

        <v-btn icon="mdi-close" variant="text" @click="drawer = false" />
      </div>

      <v-divider class="mb-4" />

      <!-- Nav Links -->
      <v-list nav class="flex-grow-1">
        <v-list-item
          v-for="item in navLinks"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="activeSection === item.value"
          color="primary"
          rounded="lg"
          @click="scrollTo(item.value); drawer = false"
        />
      </v-list>

      <v-divider class="my-4" />

      <!-- Actions -->
      <div>
        <v-btn
          block
          variant="outlined"
          color="primary"
          rounded="lg"
          class="mb-3"
          @click="navigateToLogin"
        >
          Login
        </v-btn>

        <v-btn
          block
          class="gradient-btn"
          @click="scrollTo('cta')"
        >
          Get Started Free
          <v-icon end>mdi-rocket-launch</v-icon>
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>

  <!-- App Bar -->
  <v-app-bar
    app
    :elevation="isScrolled ? 2 : 0"
    :height="isScrolled ? 52 : 64"
    class="navbar-glass"
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <v-container class="d-flex align-center">

      <!-- Logo -->
      <div class="d-flex align-center cursor-pointer" @click="scrollTo('hero')">
        <v-icon color="primary" class="mr-2">mdi-brain</v-icon>
        <span class="text-h6 font-weight-bold">
          AI PDF<span class="text-primary">.</span>
        </span>
      </div>

      <v-spacer />

      <!-- Desktop Nav -->
      <div class="d-none d-md-flex align-center ga-2">
        <v-btn
          v-for="item in navLinks"
          :key="item.title"
          variant="text"
          class="nav-btn"
          :class="{ active: activeSection === item.value }"
          @click="scrollTo(item.value)"
        >
          {{ item.title }}
        </v-btn>
      </div>

      <v-spacer />

      <!-- Actions -->
      <div class="d-none d-md-flex align-center ga-2">
        <v-btn
          :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          variant="text"
          class="theme-btn"
          @click="toggleTheme"
        />

        <v-btn
          variant="text"
          color="primary"
          rounded="lg"
          @click="navigateToLogin"
        >
          Login
        </v-btn>

        <v-btn class="gradient-btn" @click="scrollTo('cta')">
          Get Started
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>

      <!-- Mobile Menu -->
      <v-btn
        class="d-md-none"
        icon="mdi-menu"
        variant="tonal"
        @click="drawer = true"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

const theme = useTheme();
const router = useRouter();

const drawer = ref(false);
const isScrolled = ref(false);
const activeSection = ref("hero");

// Theme
const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: (val) => {
    theme.global.name.value = val ? "dark" : "light";
    localStorage.setItem("theme", val ? "dark" : "light");
  },
});

// Nav links
const navLinks = [
  { title: "Home", value: "hero", icon: "mdi-home-outline" },
  { title: "Features", value: "features", icon: "mdi-lightning-bolt-outline" },
  { title: "How it Works", value: "how-it-works", icon: "mdi-cached" },
  { title: "Pricing", value: "pricing", icon: "mdi-tag-outline" },
];

// Scroll logic
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

// Scroll to section
const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY - 80;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });

  drawer.value = false;
};

// Navigation
const navigateToLogin = () => {
  router.push("/login");
};

// Theme toggle
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// Watch theme
watch(
  isDark,
  (val) => {
    document.body.classList.toggle("dark", val);
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved) theme.global.name.value = saved;

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Navbar Glass */
.navbar-glass {
  background: rgba(var(--v-theme-surface), 0.75);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

/* Drawer */
.drawer-glass {
  background: rgba(var(--v-theme-surface), 0.98);
  backdrop-filter: blur(16px);
}

/* Nav Buttons */
.nav-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08);
  transform: translateY(-1px);
}

.nav-btn.active {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.12);
  font-weight: 600;
}

/* Gradient Buttons */
.gradient-btn {
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  color: white;
  font-weight: 600;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
  transition: all 0.3s ease;
}

.gradient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

/* Theme Button */
.theme-btn:hover {
  transform: rotate(15deg);
}

/* Utility */
.cursor-pointer {
  cursor: pointer;
}
</style>