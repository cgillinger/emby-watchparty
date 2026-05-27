// Theme Management
(function() {
    'use strict';

    var THEME_STORAGE_KEY = 'emby-watchparty-theme';
    var DEFAULT_THEME = 'cozy-hearth';
    var LEGACY_DEFAULTS = ['cyberpunk']; // old saved values we now migrate

    /* ------------------------------------------------------------------
       Theme registry — controls per-theme branding and labels.
       CSS variables and visual treatments live in style.css.
       Each theme can override:
         - brandName, brandSub  (top-bar branding)
         - chatHeading          (chat panel header)
         - partyPillText        (uses %COUNT% placeholder)
         - libraryHeading       (library carousel header)
         - chatPlaceholder      (chat input placeholder)
         - joinTitle            (username modal title)
         - autoplayLabel        (label next to autoplay toggle)
         - brandSvg             (inline SVG for the brand mark)
       ------------------------------------------------------------------ */
    var DEFAULT_BRAND_SVG =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M5 7 H19 V17 H5 Z M10 10 V14 L14 12 Z" fill="#ffffff" opacity="0.92"/>' +
        '</svg>';

    var FLAME_SVG =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M12 3 C 9 7, 7 9, 7 13 a5 5 0 0 0 10 0 c0-2-1-3-2-4 0 2-1 3-2 3 0-3-1-6-1-9z" fill="#ffffff" opacity="0.95"/>' +
        '</svg>';

    // Lindström kaffekopp (water tower as a giant Swedish coffee cup)
    var KAFFEKOPP_SVG =
        '<svg width="30" height="30" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Lindstrom kaffekopp">' +
        // Steam wisps
        '<path d="M22 10 Q24 6, 22 4 Q20 6, 22 10" stroke="#f0e8de" stroke-width="1.2" stroke-linecap="round" opacity="0.7" fill="none"/>' +
        '<path d="M30 10 Q32 5, 30 3 Q28 5, 30 10" stroke="#f0e8de" stroke-width="1.2" stroke-linecap="round" opacity="0.85" fill="none"/>' +
        '<path d="M38 11 Q40 7, 38 4 Q36 7, 38 11" stroke="#f0e8de" stroke-width="1.2" stroke-linecap="round" opacity="0.6" fill="none"/>' +
        // Cup body
        '<path d="M14 16 H50 L48 50 H16 Z" fill="#f0e8de" stroke="#d4a44a" stroke-width="1.5"/>' +
        // Folk-art band
        '<rect x="14" y="22" width="36" height="6" fill="#3a6a9a"/>' +
        '<circle cx="20" cy="25" r="1.5" fill="#d4a44a"/>' +
        '<circle cx="28" cy="25" r="1.5" fill="#5a8a50"/>' +
        '<circle cx="36" cy="25" r="1.5" fill="#d4a44a"/>' +
        '<circle cx="44" cy="25" r="1.5" fill="#5a8a50"/>' +
        // Tower legs
        '<rect x="18" y="50" width="3" height="10" fill="#d4a44a"/>' +
        '<rect x="29" y="50" width="3" height="10" fill="#d4a44a"/>' +
        '<rect x="40" y="50" width="3" height="10" fill="#d4a44a"/>' +
        // Cup handle
        '<path d="M50 22 Q58 26, 58 32 Q58 38, 50 42" stroke="#d4a44a" stroke-width="2" fill="none"/>' +
        '</svg>';

    var THEMES = {
        'cozy-hearth': {
            brandName: 'Watch Party',
            brandSub: 'Cozy Hearth',
            chatHeading: 'Chat',
            partyPillText: 'Watching together · %COUNT%',
            libraryHeading: 'Library · Up next',
            chatPlaceholder: 'Say something cozy…',
            joinTitle: 'Join Watch Party',
            autoplayLabel: 'Up next',
            brandSvg: FLAME_SVG
        },
        'lindstrom': {
            brandName: 'Watch Party',
            brandSub: 'Lindström',
            // "Fikapaus" is the one Swedish word kept — it's the theme's signature.
            chatHeading: 'Fikapaus chat',
            partyPillText: 'Watching together · %COUNT%',
            libraryHeading: 'Library · Up next',
            chatPlaceholder: 'Say something cozy…',
            joinTitle: 'Join Watch Party',
            autoplayLabel: 'Up next',
            brandSvg: KAFFEKOPP_SVG,
            heroImage: true,
            placeholderTitle: 'Välkommen!',
            placeholderText: 'Browse the library below and pick something to watch together.'
        },
        'cyberpunk': {
            brandName: 'Watch Party',
            brandSub: 'Cyberpunk Theater',
            chatHeading: 'Chat',
            partyPillText: 'Watching together · %COUNT%',
            libraryHeading: 'Browse Library',
            chatPlaceholder: 'Type a message…',
            joinTitle: 'Join Watch Party',
            autoplayLabel: 'Next Ep',
            brandSvg: DEFAULT_BRAND_SVG
        }
    };

    function getThemeConfig(theme) {
        return THEMES[theme] || THEMES['cozy-hearth'];
    }

    /* ------------------------------------------------------------------ */
    function getSavedTheme() {
        try {
            var saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (!saved) return DEFAULT_THEME;
            if (LEGACY_DEFAULTS.indexOf(saved) !== -1) {
                // First run after upgrade: migrate the auto-set default.
                // (Users who explicitly picked cyberpunk after the upgrade
                // won't trigger this branch — only if they never changed it.)
                return DEFAULT_THEME;
            }
            return saved;
        } catch (e) {
            return DEFAULT_THEME;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Could not save theme to localStorage');
        }
    }

    /* ----- Material Design random palette -------------------------------- */
    var materialColors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
        '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
        '#ff5722', '#795548', '#607d8b'
    ];

    function pickColor(exclude) {
        var c = materialColors[Math.floor(Math.random() * materialColors.length)];
        while (c === exclude) {
            c = materialColors[Math.floor(Math.random() * materialColors.length)];
        }
        return c;
    }

    function applyMaterialGradients() {
        var primary = pickColor();
        var secondary = pickColor(primary);
        var accent = pickColor();
        var gold = pickColor();

        document.body.style.setProperty('--cyber-primary', primary);
        document.body.style.setProperty('--cyber-secondary', secondary);
        document.body.style.setProperty('--cyber-accent', accent);
        document.body.style.setProperty('--cyber-gold', gold);
        document.body.style.setProperty('--shadow-glow', '0 0 20px ' + primary);
        document.body.style.setProperty('--shadow-theater', '0 0 30px ' + primary);
        document.body.style.setProperty('--brand-grad', 'linear-gradient(135deg, ' + primary + ', ' + secondary + ')');

        console.log('🎨 Material gradients: ' + primary + ' → ' + secondary);
    }

    function clearMaterialStyles() {
        document.body.style.removeProperty('--cyber-primary');
        document.body.style.removeProperty('--cyber-secondary');
        document.body.style.removeProperty('--cyber-accent');
        document.body.style.removeProperty('--cyber-gold');
        document.body.style.removeProperty('--shadow-glow');
        document.body.style.removeProperty('--shadow-theater');
        document.body.style.removeProperty('--brand-grad');
    }

    /* ----- Branding swap on theme change --------------------------------- */
    function applyBranding(theme) {
        var cfg = getThemeConfig(theme);

        var brandName = document.getElementById('brandName');
        if (brandName) brandName.textContent = cfg.brandName;

        var brandSub = document.getElementById('brandSub');
        if (brandSub) brandSub.textContent = cfg.brandSub;

        var brandMark = document.getElementById('brandMark');
        if (brandMark && cfg.brandSvg) brandMark.innerHTML = cfg.brandSvg;

        var chatHeading = document.getElementById('chatHeading');
        if (chatHeading) chatHeading.textContent = cfg.chatHeading;

        var libraryHeading = document.getElementById('libraryHeading');
        if (libraryHeading) libraryHeading.textContent = cfg.libraryHeading;

        var chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.placeholder = cfg.chatPlaceholder;

        var joinTitle = document.getElementById('joinModalTitle');
        if (joinTitle) joinTitle.textContent = cfg.joinTitle;

        var autoplayLabel = document.getElementById('autoplayLabel');
        if (autoplayLabel) autoplayLabel.textContent = cfg.autoplayLabel;

        var heroImage = document.getElementById('heroImage');
        if (heroImage) {
            heroImage.style.display = cfg.heroImage ? 'block' : 'none';
        }

        var placeholderTitle = document.getElementById('placeholderTitle');
        if (placeholderTitle) {
            placeholderTitle.textContent = cfg.placeholderTitle || 'No video selected';
        }

        var placeholderText = document.getElementById('placeholderText');
        if (placeholderText) {
            placeholderText.textContent = cfg.placeholderText || 'Browse the library below and pick something to start watching together.';
        }

        var pillText = document.getElementById('partyPillText');
        var userCountEl = document.getElementById('userCount');
        if (pillText && userCountEl) {
            // Preserve the live #userCount span — replace the surrounding template
            // by rebuilding the pill so the JS-updated count keeps working.
            var countNode = userCountEl;
            var template = cfg.partyPillText.replace('%COUNT%', '|||');
            var parts = template.split('|||');
            pillText.textContent = '';
            pillText.appendChild(document.createTextNode(parts[0]));
            pillText.appendChild(countNode);
            if (parts[1]) pillText.appendChild(document.createTextNode(parts[1]));
        }
    }

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);

        if (theme === 'material') {
            applyMaterialGradients();
        } else {
            clearMaterialStyles();
        }

        applyBranding(theme);

        // Sync any theme selectors on the page
        var selectors = document.querySelectorAll('#themeSelector');
        selectors.forEach(function(selector) { selector.value = theme; });

        console.log('Theme applied: ' + theme);
    }

    function initTheme() {
        applyTheme(getSavedTheme());
    }

    function setupThemeSelector() {
        var selectors = document.querySelectorAll('#themeSelector');
        selectors.forEach(function(selector) {
            selector.addEventListener('change', function(e) {
                var newTheme = e.target.value;
                applyTheme(newTheme);
                saveTheme(newTheme);
            });
        });
    }

    function addRandomizeButton() {
        var selectors = document.querySelectorAll('#themeSelector');
        selectors.forEach(function(selector) {
            if (selector.parentElement.querySelector('.randomize-btn')) return;

            var randomizeBtn = document.createElement('button');
            randomizeBtn.className = 'btn-small randomize-btn';
            randomizeBtn.textContent = '🎲';
            randomizeBtn.title = 'Randomize Material palette';
            randomizeBtn.style.display = 'none';

            randomizeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (document.body.getAttribute('data-theme') === 'material') {
                    applyMaterialGradients();
                }
            });
            selector.parentElement.appendChild(randomizeBtn);

            selector.addEventListener('change', function() {
                randomizeBtn.style.display = selector.value === 'material' ? 'inline-block' : 'none';
            });

            var current = selector.value || getSavedTheme();
            randomizeBtn.style.display = current === 'material' ? 'inline-block' : 'none';
        });
    }

    function bootstrap() {
        initTheme();
        setupThemeSelector();
        setTimeout(addRandomizeButton, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

    window.ThemeManager = {
        applyTheme: applyTheme,
        getSavedTheme: getSavedTheme,
        saveTheme: saveTheme,
        randomizeMaterialColors: applyMaterialGradients,
        getThemeConfig: getThemeConfig
    };
})();
