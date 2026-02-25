<template>
  <div class="legal-container">
    <div class="content">
      <h1>{{ t('legal.privacy.title') }}</h1>
      <p class="update-date">{{ t('legal.privacy.lastUpdated') }}</p>

      <p>{{ t('legal.privacy.intro') }}</p>

      <h2>{{ t('legal.privacy.s1Title') }}</h2>

      <h3>{{ t('legal.privacy.s1directTitle') }}</h3>
      <ul>
        <li>{{ t('legal.privacy.s1d1') }}</li>
        <li>{{ t('legal.privacy.s1d2') }}</li>
        <li>{{ t('legal.privacy.s1d3') }}</li>
      </ul>

      <h3>{{ t('legal.privacy.s1autoTitle') }}</h3>
      <ul>
        <li>{{ t('legal.privacy.s1a1') }}</li>
        <li>{{ t('legal.privacy.s1a2') }}</li>
        <li>{{ t('legal.privacy.s1a3') }}</li>
      </ul>

      <h3>{{ t('legal.privacy.s1referralTitle') }}</h3>
      <ul>
        <li>{{ t('legal.privacy.s1r1') }}</li>
        <li>{{ t('legal.privacy.s1r2') }}</li>
        <li>{{ t('legal.privacy.s1r3') }}</li>
      </ul>

      <h3>{{ t('legal.privacy.s1anonTitle') }}</h3>
      <p>{{ t('legal.privacy.s1anonP') }}</p>

      <h2>{{ t('legal.privacy.s2Title') }}</h2>
      <p>{{ t('legal.privacy.s2intro') }}</p>

      <table class="data-table">
        <thead>
          <tr>
            <th>{{ t('legal.privacy.s2tHeaderService') }}</th>
            <th>{{ t('legal.privacy.s2tHeaderData') }}</th>
            <th>{{ t('legal.privacy.s2tHeaderPurpose') }}</th>
            <th>{{ t('legal.privacy.s2tHeaderLocation') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>{{ t('legal.privacy.s2tSupabase') }}</strong></td>
            <td>{{ t('legal.privacy.s2tSupabaseData') }}</td>
            <td>{{ t('legal.privacy.s2tSupabasePurpose') }}</td>
            <td>{{ t('legal.privacy.s2tSupabaseLoc') }}</td>
          </tr>
          <tr>
            <td><strong>{{ t('legal.privacy.s2tOpenai') }}</strong></td>
            <td>{{ t('legal.privacy.s2tOpenaiData') }}</td>
            <td>{{ t('legal.privacy.s2tOpenaiPurpose') }}</td>
            <td>{{ t('legal.privacy.s2tOpenaiLoc') }}</td>
          </tr>
          <tr>
            <td><strong>{{ t('legal.privacy.s2tElevenlabs') }}</strong></td>
            <td>{{ t('legal.privacy.s2tElevenlabsData') }}</td>
            <td>{{ t('legal.privacy.s2tElevenlabsPurpose') }}</td>
            <td>{{ t('legal.privacy.s2tElevenlabsLoc') }}</td>
          </tr>
          <tr>
            <td><strong>{{ t('legal.privacy.s2tPaypal') }}</strong></td>
            <td>{{ t('legal.privacy.s2tPaypalData') }}</td>
            <td>{{ t('legal.privacy.s2tPaypalPurpose') }}</td>
            <td>{{ t('legal.privacy.s2tPaypalLoc') }}</td>
          </tr>
          <tr>
            <td><strong>{{ t('legal.privacy.s2tAnalytics') }}</strong></td>
            <td>{{ t('legal.privacy.s2tAnalyticsData') }}</td>
            <td>{{ t('legal.privacy.s2tAnalyticsPurpose') }}</td>
            <td>{{ t('legal.privacy.s2tAnalyticsLoc') }}</td>
          </tr>
        </tbody>
      </table>
      <p>{{ t('legal.privacy.s2outro') }}</p>

      <h2>{{ t('legal.privacy.s3Title') }}</h2>
      <p>{{ t('legal.privacy.s3intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s3i1') }}</li>
        <li>{{ t('legal.privacy.s3i2') }}</li>
        <li>{{ t('legal.privacy.s3i3') }}</li>
        <li>{{ t('legal.privacy.s3i4') }}</li>
        <li>{{ t('legal.privacy.s3i5') }}</li>
        <li>{{ t('legal.privacy.s3i6') }}</li>
      </ul>

      <h2>{{ t('legal.privacy.s4Title') }}</h2>
      <p>{{ t('legal.privacy.s4intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s4i1') }}</li>
        <li>{{ t('legal.privacy.s4i2') }}</li>
        <li>{{ t('legal.privacy.s4i3') }}</li>
        <li>{{ t('legal.privacy.s4i4') }}</li>
        <li>{{ t('legal.privacy.s4i5') }}</li>
      </ul>

      <h2>{{ t('legal.privacy.s5Title') }}</h2>
      <p>{{ t('legal.privacy.s5intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s5i1') }}</li>
        <li>{{ t('legal.privacy.s5i2') }}</li>
        <li>{{ t('legal.privacy.s5i3') }}</li>
        <li>{{ t('legal.privacy.s5i4') }}</li>
      </ul>
      <p>{{ t('legal.privacy.s5outro') }}</p>

      <h2>{{ t('legal.privacy.s6Title') }}</h2>
      <p>{{ t('legal.privacy.s6intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s6i1') }}</li>
        <li>{{ t('legal.privacy.s6i2') }}</li>
      </ul>
      <p>{{ t('legal.privacy.s6outro') }}</p>

      <h2>{{ t('legal.privacy.s7Title') }}</h2>
      <p>{{ t('legal.privacy.s7intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s7i1') }}</li>
        <li>{{ t('legal.privacy.s7i2') }}</li>
        <li>{{ t('legal.privacy.s7i3') }}</li>
        <li>{{ t('legal.privacy.s7i4') }}</li>
        <li>{{ t('legal.privacy.s7i5') }}</li>
        <li>{{ t('legal.privacy.s7i6') }}</li>
        <li>{{ t('legal.privacy.s7i7') }}</li>
      </ul>
      <p><strong>{{ t('legal.privacy.s7howTitle') }}</strong></p>
      <ul>
        <li>{{ t('legal.privacy.s7h1') }}</li>
        <li>{{ t('legal.privacy.s7h2') }}</li>
        <li>{{ t('legal.privacy.s7h3') }}</li>
      </ul>
      <p>{{ t('legal.privacy.s7complaint') }}</p>

      <h2>{{ t('legal.privacy.s8Title') }}</h2>
      <p><strong>{{ t('legal.privacy.s8intro') }}</strong></p>
      <ul>
        <li>{{ t('legal.privacy.s8i1') }}</li>
        <li>{{ t('legal.privacy.s8i2') }}</li>
        <li>{{ t('legal.privacy.s8i3') }}</li>
      </ul>

      <h2>{{ t('legal.privacy.s9Title') }}</h2>
      <p>{{ t('legal.privacy.s9intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s9i1') }}</li>
        <li>{{ t('legal.privacy.s9i2') }}</li>
        <li>{{ t('legal.privacy.s9i3') }}</li>
      </ul>
      <p>{{ t('legal.privacy.s9outro') }}</p>

      <h2>{{ t('legal.privacy.s10Title') }}</h2>
      <p>{{ t('legal.privacy.s10intro') }}</p>
      <ul>
        <li>{{ t('legal.privacy.s10email') }}</li>
        <li>{{ t('legal.privacy.s10support') }}</li>
      </ul>

      <div class="related-links">
        <p>{{ t('legal.privacy.relatedTitle') }}</p>
        <ul>
          <li><NuxtLink :to="localePath('/terms')">{{ t('legal.privacy.relatedTerms') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/cookies')">{{ t('legal.privacy.relatedCookies') }}</NuxtLink></li>
        </ul>
      </div>

      <NuxtLink :to="localePath('/')" class="back-button">{{ t('legal.privacy.backButton') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: t('legal.privacy.seoTitle'),
  description: t('legal.privacy.seoDescription'),
})
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
  margin-bottom: 10px;
}
.update-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 20px;
}
h2 {
  color: var(--color-accent-text);
  font-size: 1.5rem;
  margin-top: 30px;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--border-primary);
  padding-bottom: 8px;
}
h3 {
  color: var(--color-accent-text);
  font-size: 1.2rem;
  margin-top: 20px;
  margin-bottom: 10px;
}
p {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 15px;
}
ul {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 15px;
  padding-left: 25px;
}
ul li {
  margin-bottom: 8px;
}
a {
  color: var(--color-accent-text);
  text-decoration: underline;
}
a:hover {
  color: var(--color-accent);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: var(--bg-overlay-light);
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.9rem;
}
.data-table thead {
  background: var(--bg-overlay-strong);
}
.data-table th,
.data-table td {
  padding: 12px 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.data-table th {
  font-weight: 600;
  color: var(--color-accent-text);
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}
.data-table tbody tr:hover {
  background: var(--bg-overlay-medium);
}
.related-links {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-primary);
}
.related-links p {
  font-weight: 600;
  margin-bottom: 10px;
}
.related-links ul {
  list-style: none;
  padding-left: 0;
}
.related-links li {
  margin-bottom: 5px;
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
  color: var(--color-white);
}

@media (max-width: 600px) {
  .content {
    padding: 20px 15px;
  }
  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.3rem;
  }
  .data-table {
    font-size: 0.8rem;
  }
  .data-table th,
  .data-table td {
    padding: 8px 6px;
  }
}
</style>
