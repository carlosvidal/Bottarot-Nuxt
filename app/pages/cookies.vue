<template>
  <div class="legal-container">
    <div class="content">
      <h1>{{ t('legal.cookies.title') }}</h1>
      <p class="update-date">{{ t('legal.cookies.lastUpdated') }}</p>

      <p>{{ t('legal.cookies.intro') }}</p>

      <h2>{{ t('legal.cookies.s1Title') }}</h2>
      <p>{{ t('legal.cookies.s1p1') }}</p>

      <h2>{{ t('legal.cookies.s2Title') }}</h2>
      <p>{{ t('legal.cookies.s2p1') }}</p>
      <p>{{ t('legal.cookies.s2p2') }}</p>

      <h2>{{ t('legal.cookies.s3Title') }}</h2>

      <h3>{{ t('legal.cookies.s3necessaryTitle') }}</h3>
      <p>{{ t('legal.cookies.s3necessaryIntro') }}</p>
      <table class="cookies-table">
        <thead>
          <tr>
            <th>{{ t('legal.cookies.s3tName') }}</th>
            <th>{{ t('legal.cookies.s3tProvider') }}</th>
            <th>{{ t('legal.cookies.s3tPurpose') }}</th>
            <th>{{ t('legal.cookies.s3tDuration') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ t('legal.cookies.s3n1Name') }}</td>
            <td>{{ t('legal.cookies.s3n1Provider') }}</td>
            <td>{{ t('legal.cookies.s3n1Purpose') }}</td>
            <td>{{ t('legal.cookies.s3n1Duration') }}</td>
          </tr>
          <tr>
            <td>{{ t('legal.cookies.s3n2Name') }}</td>
            <td>{{ t('legal.cookies.s3n2Provider') }}</td>
            <td>{{ t('legal.cookies.s3n2Purpose') }}</td>
            <td>{{ t('legal.cookies.s3n2Duration') }}</td>
          </tr>
          <tr>
            <td>{{ t('legal.cookies.s3n3Name') }}</td>
            <td>{{ t('legal.cookies.s3n3Provider') }}</td>
            <td>{{ t('legal.cookies.s3n3Purpose') }}</td>
            <td>{{ t('legal.cookies.s3n3Duration') }}</td>
          </tr>
        </tbody>
      </table>

      <h3>{{ t('legal.cookies.s3analyticsTitle') }}</h3>
      <p>{{ t('legal.cookies.s3analyticsIntro') }}</p>
      <table class="cookies-table">
        <thead>
          <tr>
            <th>{{ t('legal.cookies.s3tName') }}</th>
            <th>{{ t('legal.cookies.s3tProvider') }}</th>
            <th>{{ t('legal.cookies.s3tPurpose') }}</th>
            <th>{{ t('legal.cookies.s3tDuration') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ t('legal.cookies.s3a1Name') }}</td>
            <td>{{ t('legal.cookies.s3a1Provider') }}</td>
            <td>{{ t('legal.cookies.s3a1Purpose') }}</td>
            <td>{{ t('legal.cookies.s3a1Duration') }}</td>
          </tr>
          <tr>
            <td>{{ t('legal.cookies.s3a2Name') }}</td>
            <td>{{ t('legal.cookies.s3a2Provider') }}</td>
            <td>{{ t('legal.cookies.s3a2Purpose') }}</td>
            <td>{{ t('legal.cookies.s3a2Duration') }}</td>
          </tr>
          <tr>
            <td>{{ t('legal.cookies.s3a3Name') }}</td>
            <td>{{ t('legal.cookies.s3a3Provider') }}</td>
            <td>{{ t('legal.cookies.s3a3Purpose') }}</td>
            <td>{{ t('legal.cookies.s3a3Duration') }}</td>
          </tr>
        </tbody>
      </table>

      <h2>{{ t('legal.cookies.s4Title') }}</h2>
      <p>{{ t('legal.cookies.s4intro') }}</p>
      <ul>
        <li>{{ t('legal.cookies.s4i1') }}</li>
        <li>{{ t('legal.cookies.s4i2') }}</li>
      </ul>

      <h2>{{ t('legal.cookies.s5Title') }}</h2>
      <p>{{ t('legal.cookies.s5intro') }}</p>
      <button class="cookie-settings-button" @click="showCookieSettings">{{ t('legal.cookies.s5button') }}</button>

      <h2>{{ t('legal.cookies.s6Title') }}</h2>
      <p>{{ t('legal.cookies.s6intro') }}</p>
      <p>{{ t('legal.cookies.s6p2') }}</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a></li>
        <li><a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener">Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
        <li><a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener">Edge</a></li>
      </ul>

      <h2>{{ t('legal.cookies.s7Title') }}</h2>
      <p>
        {{ t('legal.cookies.s7p1') }}
        <NuxtLink :to="localePath('/privacy')">{{ t('legal.privacy.title') }}</NuxtLink> /
        <NuxtLink :to="localePath('/terms')">{{ t('legal.terms.title') }}</NuxtLink>.
      </p>

      <NuxtLink :to="localePath('/')" class="back-button">{{ t('legal.cookies.backButton') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: t('legal.cookies.seoTitle'),
  description: t('legal.cookies.seoDescription'),
})

const { $cookieConsent } = useNuxtApp()
const showCookieSettings = () => {
  if (import.meta.client && $cookieConsent) {
    $cookieConsent.showPreferences()
  }
}
</script>

<style scoped>
.legal-container {
  font-family: var(--font-content);
  color: var(--text-primary);
  padding: 40px 20px;
}
.content {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-overlay-strong);
  padding: 30px;
  border-radius: 10px;
}
h1 {
  color: var(--color-accent-text);
  font-size: 2.5rem;
  margin-bottom: 20px;
}
h2 {
  color: var(--color-accent-text);
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 15px;
}
p, ul {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 15px;
}
ul {
  padding-left: 25px;
}
ul li {
  margin-bottom: 8px;
}
h3 {
  color: var(--color-accent-text);
  font-size: 1.5rem;
  margin-top: 25px;
  margin-bottom: 12px;
}
.cookies-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: var(--bg-overlay-light);
  border-radius: 8px;
  overflow: hidden;
}
.cookies-table thead {
  background: var(--bg-overlay-strong);
}
.cookies-table th,
.cookies-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.cookies-table th {
  font-weight: 600;
  color: var(--color-accent-text);
  font-size: 0.95rem;
}
.cookies-table td {
  font-size: 0.95rem;
}
.cookies-table tbody tr:last-child td {
  border-bottom: none;
}
.cookies-table tbody tr:hover {
  background: var(--bg-overlay-medium);
}
.cookie-settings-button {
  display: inline-block;
  margin: 20px 0;
  background: linear-gradient(45deg, var(--btn-primary), var(--btn-primary-hover));
  color: var(--color-white);
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.cookie-settings-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
a {
  color: var(--color-accent-text);
  text-decoration: underline;
}
.back-button {
  display: inline-block;
  margin-top: 30px;
  background: linear-gradient(45deg, var(--btn-primary), var(--btn-primary-hover));
  color: var(--color-white);
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.back-button:hover {
  transform: translateY(-2px);
}
</style>
