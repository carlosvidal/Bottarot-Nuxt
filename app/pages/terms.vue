<template>
  <div class="legal-container">
    <div class="content">
      <h1>{{ t('legal.terms.title') }}</h1>
      <p class="update-date">{{ t('legal.terms.lastUpdated') }}</p>

      <p>{{ t('legal.terms.intro') }}</p>

      <h2>{{ t('legal.terms.s1Title') }}</h2>
      <p>{{ t('legal.terms.s1p1') }}</p>
      <p>{{ t('legal.terms.s1p2') }}</p>
      <p><strong>{{ t('legal.terms.s1p3') }}</strong></p>

      <h2>{{ t('legal.terms.s2Title') }}</h2>
      <p>{{ t('legal.terms.s2intro') }}</p>
      <ul>
        <li><strong>{{ t('legal.terms.s2free') }}</strong></li>
        <li><strong>{{ t('legal.terms.s2trial') }}</strong></li>
        <li><strong>{{ t('legal.terms.s2monthly') }}</strong></li>
        <li><strong>{{ t('legal.terms.s2annual') }}</strong></li>
      </ul>
      <p>{{ t('legal.terms.s2p1') }}</p>
      <p><strong>{{ t('legal.terms.s2p2') }}</strong></p>
      <p><strong>{{ t('legal.terms.s2p3') }}</strong></p>

      <h2>{{ t('legal.terms.s3Title') }}</h2>
      <p>{{ t('legal.terms.s3intro') }}</p>
      <ul>
        <li>{{ t('legal.terms.s3r1') }}</li>
        <li>{{ t('legal.terms.s3r2') }}</li>
        <li>{{ t('legal.terms.s3r3') }}</li>
      </ul>
      <p>{{ t('legal.terms.s3refund') }}</p>

      <h2>{{ t('legal.terms.s4Title') }}</h2>
      <p>{{ t('legal.terms.s4intro') }}</p>
      <ul>
        <li><strong>{{ t('legal.terms.s4free') }}</strong></li>
        <li><strong>{{ t('legal.terms.s4premium') }}</strong>
          <ul>
            <li>{{ t('legal.terms.s4premiumTrial') }}</li>
            <li>{{ t('legal.terms.s4premiumMonthly') }}</li>
            <li>{{ t('legal.terms.s4premiumAnnual') }}</li>
          </ul>
        </li>
      </ul>
      <p><strong>{{ t('legal.terms.s4conditionsTitle') }}</strong></p>
      <ul>
        <li>{{ t('legal.terms.s4c1') }}</li>
        <li>{{ t('legal.terms.s4c2') }}</li>
        <li>{{ t('legal.terms.s4c3') }}</li>
        <li>{{ t('legal.terms.s4c4') }}</li>
      </ul>

      <h2>{{ t('legal.terms.s5Title') }}</h2>
      <p>{{ t('legal.terms.s5intro') }}</p>
      <ul>
        <li>{{ t('legal.terms.s5i1') }}</li>
        <li>{{ t('legal.terms.s5i2') }}</li>
        <li><strong>{{ t('legal.terms.s5i3') }}</strong>
          <ul>
            <li>{{ t('legal.terms.s5i3a') }}</li>
            <li>{{ t('legal.terms.s5i3b') }}</li>
            <li>{{ t('legal.terms.s5i3c') }}</li>
            <li>{{ t('legal.terms.s5i3d') }}</li>
          </ul>
        </li>
        <li>{{ t('legal.terms.s5i4') }}</li>
      </ul>

      <h2>{{ t('legal.terms.s6Title') }}</h2>
      <p>{{ t('legal.terms.s6intro') }}</p>
      <ul>
        <li>{{ t('legal.terms.s6i1') }}</li>
        <li>{{ t('legal.terms.s6i2') }}</li>
        <li>{{ t('legal.terms.s6i3') }}</li>
        <li>{{ t('legal.terms.s6i4') }}</li>
      </ul>

      <h2>{{ t('legal.terms.s7Title') }}</h2>
      <p><strong>{{ t('legal.terms.s7age') }}</strong></p>
      <p><strong>{{ t('legal.terms.s7prohibited') }}</strong></p>
      <ul>
        <li>{{ t('legal.terms.s7p1') }}</li>
        <li>{{ t('legal.terms.s7p2') }}</li>
        <li>{{ t('legal.terms.s7p3') }}</li>
        <li>{{ t('legal.terms.s7p4') }}</li>
        <li>{{ t('legal.terms.s7p5') }}</li>
        <li>{{ t('legal.terms.s7p6') }}</li>
      </ul>

      <h2>{{ t('legal.terms.s8Title') }}</h2>
      <p>{{ t('legal.terms.s8intro') }}</p>
      <ul>
        <li>{{ t('legal.terms.s8i1') }}</li>
        <li>{{ t('legal.terms.s8i2') }}</li>
        <li>{{ t('legal.terms.s8i3') }}</li>
      </ul>
      <p>{{ t('legal.terms.s8liability') }}</p>
      <ul>
        <li>{{ t('legal.terms.s8l1') }}</li>
        <li>{{ t('legal.terms.s8l2') }}</li>
        <li>{{ t('legal.terms.s8l3') }}</li>
      </ul>

      <h2>{{ t('legal.terms.s9Title') }}</h2>
      <p><strong>{{ t('legal.terms.s9byUser') }}</strong></p>
      <ul>
        <li>{{ t('legal.terms.s9u1') }}</li>
        <li>{{ t('legal.terms.s9u2') }}</li>
        <li>{{ t('legal.terms.s9u3') }}</li>
      </ul>
      <p><strong>{{ t('legal.terms.s9byUs') }}</strong></p>
      <ul>
        <li>{{ t('legal.terms.s9b1') }}</li>
        <li>{{ t('legal.terms.s9b2') }}</li>
        <li>{{ t('legal.terms.s9b3') }}</li>
        <li>{{ t('legal.terms.s9b4') }}</li>
      </ul>

      <h2>{{ t('legal.terms.s10Title') }}</h2>
      <p>{{ t('legal.terms.s10intro') }}</p>
      <ul>
        <li>{{ t('legal.terms.s10i1') }}</li>
        <li>{{ t('legal.terms.s10i2') }}</li>
        <li>{{ t('legal.terms.s10i3') }}</li>
      </ul>
      <p>{{ t('legal.terms.s10outro') }}</p>

      <h2>{{ t('legal.terms.s11Title') }}</h2>
      <p>{{ t('legal.terms.s11p1') }}</p>
      <p>{{ t('legal.terms.s11p2') }}</p>
      <p>{{ t('legal.terms.s11p3') }}</p>

      <h2>{{ t('legal.terms.s12Title') }}</h2>
      <p>{{ t('legal.terms.s12intro') }}</p>
      <ul>
        <li>Email: <a href="mailto:support@freetarot.fun">support@freetarot.fun</a></li>
      </ul>

      <div class="related-links">
        <p>{{ t('legal.terms.relatedTitle') }}</p>
        <ul>
          <li><NuxtLink :to="localePath('/privacy')">{{ t('legal.terms.relatedPrivacy') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('/cookies')">{{ t('legal.terms.relatedCookies') }}</NuxtLink></li>
        </ul>
      </div>

      <NuxtLink :to="localePath('/')" class="back-button">{{ t('legal.terms.backButton') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: t('legal.terms.seoTitle'),
  description: t('legal.terms.seoDescription'),
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
ul ul {
  margin-top: 8px;
  margin-bottom: 8px;
}
a {
  color: var(--color-accent-text);
  text-decoration: underline;
}
a:hover {
  color: var(--color-accent);
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
}
</style>
