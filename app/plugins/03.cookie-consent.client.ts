import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

export default defineNuxtPlugin(() => {
  // Local gtag helper that pushes to dataLayer (same pattern nuxt-gtag uses internally)
  function gtag(...args: any[]) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(arguments)
  }

  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'box inline',
        position: 'bottom right',
      },
      preferencesModal: {
        layout: 'box',
        position: 'right',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        enabled: false,
        autoClear: {
          cookies: [
            { name: /^(_ga|_gid|_gat)/ },
          ],
        },
      },
    },

    language: {
      default: 'en',
      autoDetect: 'browser',
      translations: {
        en: {
          consentModal: {
            title: 'This site uses cookies',
            description: 'We use essential cookies for site functionality and analytics cookies to improve your experience. You can accept all or customize your preferences.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Only necessary',
            showPreferencesBtn: 'Customize',
            footer: '<a href="/privacy">Privacy Policy</a>\n<a href="/cookies">Cookie Policy</a>',
          },
          preferencesModal: {
            title: 'Cookie Preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            serviceCounterLabel: 'Service|Services',
            sections: [
              {
                title: 'Cookie Usage',
                description: 'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose to enable/disable each category whenever you want.',
              },
              {
                title: 'Strictly Necessary Cookies <span class="pm__badge">Always Active</span>',
                description: 'These cookies are essential for the proper functioning of the site. Without these cookies, the website would not work properly.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics Cookies',
                description: 'These cookies help us understand how visitors interact with our website by collecting information anonymously. We use Google Analytics for these purposes.',
                linkedCategory: 'analytics',
              },
              {
                title: 'More information',
                description: 'For more information about the use of cookies and your options, please see our <a href="/cookies">Cookie Policy</a> and <a href="/privacy">Privacy Policy</a>.',
              },
            ],
          },
        },
        es: {
          consentModal: {
            title: 'Este sitio usa cookies',
            description: 'Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para mejorar tu experiencia. Puedes aceptar todas o personalizar tus preferencias.',
            acceptAllBtn: 'Aceptar todas',
            acceptNecessaryBtn: 'Solo necesarias',
            showPreferencesBtn: 'Personalizar',
            footer: '<a href="/privacy">Política de Privacidad</a>\n<a href="/cookies">Política de Cookies</a>',
          },
          preferencesModal: {
            title: 'Preferencias de Cookies',
            acceptAllBtn: 'Aceptar todas',
            acceptNecessaryBtn: 'Rechazar todas',
            savePreferencesBtn: 'Guardar preferencias',
            closeIconLabel: 'Cerrar',
            serviceCounterLabel: 'Servicio|Servicios',
            sections: [
              {
                title: 'Uso de Cookies',
                description: 'Utilizamos cookies para asegurar las funcionalidades básicas del sitio web y para mejorar tu experiencia en línea.',
              },
              {
                title: 'Cookies Estrictamente Necesarias <span class="pm__badge">Siempre Activas</span>',
                description: 'Estas cookies son esenciales para el correcto funcionamiento del sitio. Sin estas cookies, el sitio no funcionaría correctamente.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Cookies Analíticas',
                description: 'Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando información de forma anónima. Usamos Google Analytics para estos propósitos.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Más información',
                description: 'Para más información sobre el uso de cookies y tus opciones, por favor consulta nuestra <a href="/cookies">Política de Cookies</a> y <a href="/privacy">Política de Privacidad</a>.',
              },
            ],
          },
        },
        it: {
          consentModal: {
            title: 'Questo sito utilizza i cookie',
            description: 'Utilizziamo cookie essenziali per il funzionamento del sito e cookie analitici per migliorare la tua esperienza. Puoi accettare tutti o personalizzare le tue preferenze.',
            acceptAllBtn: 'Accetta tutti',
            acceptNecessaryBtn: 'Solo necessari',
            showPreferencesBtn: 'Personalizza',
            footer: '<a href="/privacy">Informativa sulla Privacy</a>\n<a href="/cookies">Politica dei Cookie</a>',
          },
          preferencesModal: {
            title: 'Preferenze Cookie',
            acceptAllBtn: 'Accetta tutti',
            acceptNecessaryBtn: 'Rifiuta tutti',
            savePreferencesBtn: 'Salva preferenze',
            closeIconLabel: 'Chiudi',
            serviceCounterLabel: 'Servizio|Servizi',
            sections: [
              {
                title: 'Utilizzo dei Cookie',
                description: 'Utilizziamo i cookie per garantire le funzionalità di base del sito web e per migliorare la tua esperienza online.',
              },
              {
                title: 'Cookie Strettamente Necessari <span class="pm__badge">Sempre Attivi</span>',
                description: 'Questi cookie sono essenziali per il corretto funzionamento del sito.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Cookie Analitici',
                description: 'Questi cookie ci aiutano a capire come i visitatori interagiscono con il nostro sito web raccogliendo informazioni in modo anonimo.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Maggiori informazioni',
                description: 'Per ulteriori informazioni sull\'uso dei cookie, consulta la nostra <a href="/cookies">Politica dei Cookie</a> e <a href="/privacy">Informativa sulla Privacy</a>.',
              },
            ],
          },
        },
        pt: {
          consentModal: {
            title: 'Este site utiliza cookies',
            description: 'Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência. Você pode aceitar todos ou personalizar suas preferências.',
            acceptAllBtn: 'Aceitar todos',
            acceptNecessaryBtn: 'Apenas necessários',
            showPreferencesBtn: 'Personalizar',
            footer: '<a href="/privacy">Política de Privacidade</a>\n<a href="/cookies">Política de Cookies</a>',
          },
          preferencesModal: {
            title: 'Preferências de Cookies',
            acceptAllBtn: 'Aceitar todos',
            acceptNecessaryBtn: 'Rejeitar todos',
            savePreferencesBtn: 'Salvar preferências',
            closeIconLabel: 'Fechar',
            serviceCounterLabel: 'Serviço|Serviços',
            sections: [
              {
                title: 'Uso de Cookies',
                description: 'Utilizamos cookies para garantir as funcionalidades básicas do site e melhorar sua experiência online.',
              },
              {
                title: 'Cookies Estritamente Necessários <span class="pm__badge">Sempre Ativos</span>',
                description: 'Estes cookies são essenciais para o funcionamento correto do site.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Cookies Analíticos',
                description: 'Estes cookies nos ajudam a entender como os visitantes interagem com nosso site, coletando informações de forma anônima.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Mais informações',
                description: 'Para mais informações sobre o uso de cookies, consulte nossa <a href="/cookies">Política de Cookies</a> e <a href="/privacy">Política de Privacidade</a>.',
              },
            ],
          },
        },
        fr: {
          consentModal: {
            title: 'Ce site utilise des cookies',
            description: 'Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies analytiques pour améliorer votre expérience. Vous pouvez accepter tous ou personnaliser vos préférences.',
            acceptAllBtn: 'Accepter tout',
            acceptNecessaryBtn: 'Uniquement nécessaires',
            showPreferencesBtn: 'Personnaliser',
            footer: '<a href="/privacy">Politique de Confidentialité</a>\n<a href="/cookies">Politique de Cookies</a>',
          },
          preferencesModal: {
            title: 'Préférences de Cookies',
            acceptAllBtn: 'Accepter tout',
            acceptNecessaryBtn: 'Rejeter tout',
            savePreferencesBtn: 'Enregistrer les préférences',
            closeIconLabel: 'Fermer',
            serviceCounterLabel: 'Service|Services',
            sections: [
              {
                title: 'Utilisation des Cookies',
                description: 'Nous utilisons des cookies pour assurer les fonctionnalités de base du site web et améliorer votre expérience en ligne.',
              },
              {
                title: 'Cookies Strictement Nécessaires <span class="pm__badge">Toujours Actifs</span>',
                description: 'Ces cookies sont essentiels au bon fonctionnement du site.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Cookies Analytiques',
                description: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site web en collectant des informations de manière anonyme.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Plus d\'informations',
                description: 'Pour plus d\'informations sur l\'utilisation des cookies, consultez notre <a href="/cookies">Politique de Cookies</a> et <a href="/privacy">Politique de Confidentialité</a>.',
              },
            ],
          },
        },
      },
    },

    onConsent: ({ cookie }) => {
      if (cookie.categories.includes('analytics')) {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
        })
      }
    },

    onChange: ({ cookie, changedCategories }) => {
      if (changedCategories.includes('analytics')) {
        gtag('consent', 'update', {
          analytics_storage: cookie.categories.includes('analytics') ? 'granted' : 'denied',
        })
      }
    },
  })

  return {
    provide: {
      cookieConsent: CookieConsent,
    },
  }
})
