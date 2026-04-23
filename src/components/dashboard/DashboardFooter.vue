<template>
  <v-footer
    app
    height="48"
    class="footer-gradient px-3"
  >
    <v-container fluid class="py-0 d-flex flex-column align-center justify-center">

      <!-- Links (compact) -->
      <div class="d-flex flex-wrap justify-center ga-2 mb-1">
        <v-btn variant="text" class="footer-link" size="x-small">
          Privacy
        </v-btn>

        <v-btn variant="text" class="footer-link" size="x-small">
          Terms
        </v-btn>

        <v-btn variant="text" class="footer-link" size="x-small">
          Support
        </v-btn>
      </div>

      <!-- Copyright -->
      <div class="footer-text">
        © {{ new Date().getFullYear() }} AI PDF Tools
      </div>

    </v-container>
  </v-footer>
</template>

<style scoped>
.footer-gradient {
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
  color: white;
  min-height: 48px;
}

/* Links */
.footer-link {
  color: rgba(255, 255, 255, 0.65) !important;
  text-transform: none !important;
  font-weight: 500;
  font-size: 11px;
  padding: 0 !important;
  min-width: auto !important;
  transition: 0.2s ease;
}

.footer-link:hover {
  color: white !important;
}

/* Text */
.footer-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

/* Mobile */
@media (max-width: 600px) {
  .footer-link {
    font-size: 10px;
  }

  .footer-text {
    font-size: 10px;
  }
}
</style>