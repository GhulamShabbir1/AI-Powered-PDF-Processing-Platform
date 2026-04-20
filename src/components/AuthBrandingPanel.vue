I am<template>
  <v-col 
    cols="12" 
    md="6" 
    class="branding-panel d-none d-md-flex align-center justify-center"
  >
    <!-- Animated Background Gradient -->
    <div class="gradient-background"></div>
    
    <!-- Floating Shapes -->
    <div class="floating-shape shape-1"></div>
    <div class="floating-shape shape-2"></div>
    <div class="floating-shape shape-3"></div>

    <!-- Content -->
    <div class="content-wrapper text-center pa-12">
      <div class="content-inner">
        <h2 class="text-h3 font-weight-bold mb-6 title-text">
          PDF tools for productive people
        </h2>
        <p class="text-body-1 description-text px-6 mx-auto">
          It helps you convert, edit, e-sign, and protect PDF files quickly and easily. 
          Enjoy a full suite of tools to effectively manage documents.
        </p>
      </div>
    </div>
  </v-col>
</template>

<style scoped>
.branding-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 50%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

/* Animated Gradient Background */
.gradient-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-ai);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: 1;
}

@keyframes gradientShift {
  0% {
    background: linear-gradient(135deg, #4F46E5, #06B6D4);
  }
  25% {
    background: linear-gradient(135deg, #06B6D4, #8B5CF6);
  }
  50% {
    background: linear-gradient(135deg, #8B5CF6, #4F46E5);
  }
  75% {
    background: linear-gradient(135deg, #4F46E5, #06B6D4);
  }
  100% {
    background: linear-gradient(135deg, #4F46E5, #06B6D4);
  }
}

/* Floating Shapes */
.floating-shape {
  position: absolute;
  opacity: 0.15;
  z-index: 2;
  border-radius: 50%;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.3);
  top: -100px;
  right: -100px;
  animation: float-shape-1 8s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.2);
  bottom: 50px;
  left: 50px;
  animation: float-shape-2 10s ease-in-out infinite;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.25);
  top: 50%;
  left: 20%;
  animation: float-shape-3 12s ease-in-out infinite;
}

@keyframes float-shape-1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, 30px);
  }
}

@keyframes float-shape-2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, -30px);
  }
}

@keyframes float-shape-3 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 30px);
  }
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.content-inner {
  animation: fadeInUp 0.8s ease-out;
  max-width: 550px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Text Styles */
.title-text {
  color: white;
  line-height: 1.2;
  font-size: 2.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideInTitle 0.8s ease-out 0.2s both;
}

.description-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 500px;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  animation: slideInTitle 0.8s ease-out 0.4s both;
}

@keyframes slideInTitle {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .branding-panel {
    display: none !important;
  }
}
</style>