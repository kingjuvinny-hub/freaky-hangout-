const CACHE_NAME = 'freaky-hangout-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/metadata.json',
  '/App.tsx',
  '/icon.svg',
  '/types/index.ts',
  '/constants/dares.ts',
  '/constants/adultPack.ts',
  '/utils/helpers.ts',
  '/context/GameContext.tsx',
  '/hooks/useSounds.ts',
  '/components/PlayerSetup.tsx',
  '/components/GameScreen.tsx',
  '/components/Header.tsx',
  '/components/Spinner.tsx',
  '/components/GameOverScreen.tsx',
  '/components/DareSubmissionScreen.tsx',
  '/components/Modal.tsx',
  '/components/Settings.tsx',
  '/components/AvatarPicker.tsx',
  '/components/Confetti.tsx',
  '/components/CustomPackManager.tsx',
  '/components/GameHistoryModal.tsx',
  '/components/PauseMenu.tsx',
  '/components/Toast.tsx',
  '/components/LifetimeStatsModal.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/icons/FireIcon.tsx',
  '/components/icons/SkipIcon.tsx',
  '/components/icons/StarIcon.tsx',
  '/components/icons/SettingsIcon.tsx',
  '/components/icons/RestartIcon.tsx',
  '/components/icons/QuestionIcon.tsx',
  '/components/icons/CheckIcon.tsx',
  '/components/icons/AwardIcon.tsx',
  '/components/icons/ClockIcon.tsx',
  '/components/icons/PlusIcon.tsx',
  '/components/icons/TeamIcon.tsx',
  '/components/icons/PauseIcon.tsx',
  '/components/icons/PlayIcon.tsx',
  '/components/icons/TrophyIcon.tsx',
  // Critical external assets
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Creepster&family=IM+Fell+English+SC&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        const cachePromises = urlsToCache.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // We don't cache POST requests, etc.
                if(event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});