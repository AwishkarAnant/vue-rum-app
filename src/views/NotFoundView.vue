<template>
  <div class="not-found">
    <div class="not-found-code">404</div>
    <h1 class="not-found-title">Page not found</h1>
    <p class="not-found-sub">The page you're looking for doesn't exist or has been moved.</p>
    <div class="flex gap-3 justify-center" style="margin-top:28px">
      <RouterLink to="/dashboard" class="btn btn-primary">← Back to Dashboard</RouterLink>
      <button class="btn btn-secondary" @click="$router.go(-1)">Go back</button>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 80px 24px;
}
.not-found-code {
  font-size: 120px;
  font-weight: 800;
  color: var(--border-color);
  line-height: 1;
  letter-spacing: -0.06em;
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--accent), var(--violet-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.not-found-title { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
.not-found-sub   { font-size: 15px; color: var(--text-tertiary); }
</style>
