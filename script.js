const PARCEL_RATES = {
    common: 0.0000000011,
    rare: 0.0000000016,
    epic: 0.0000000022,
    legendary: 0.0000000044
};

const DAILY_BOOST = {
    inactive: 1,
    active: function(parcels) {
        if (parcels >= 1 && parcels <= 70) return 20;
        if (parcels >= 71 && parcels <= 100) return 15;
        if (parcels >= 101 && parcels <= 135) return 10;
        if (parcels >= 136 && parcels <= 170) return 8;
        if (parcels >= 171 && parcels <= 200) return 7;
        if (parcels >= 201 && parcels <= 250) return 6;
        if (parcels >= 251 && parcels <= 300) return 5;
        if (parcels >= 301 && parcels <= 350) return 4;
        if (parcels >= 351 && parcels <= 400) return 3;
        if (parcels >= 401) return 2; 
        return 1;
    },
    superRent: 50
};

function getBadgeBoost(badges) {
    if (badges >= 101) return 0.25;
    if (badges >= 61) return 0.20;
    if (badges >= 31) return 0.15;
    if (badges >= 11) return 0.10;
    if (badges >= 1) return 0.05;
    return 0;
}

function calculateIncomeAuto() {
    const common = parseInt(document.getElementById('commonParcels').value) || 0;
    const rare = parseInt(document.getElementById('rareParcels').value) || 0;
    const epic = parseInt(document.getElementById('epicParcels').value) || 0;
    const legendary = parseInt(document.getElementById('legendaryParcels').value) || 0;
    const badges = parseInt(document.getElementById('badges').value) || 0;
    const boostType = document.getElementById('dailyBoost').value;
    const boostHours = parseFloat(document.getElementById('boostHours').value) || 0;

    const totalParcels = common + rare + epic + legendary;
    const badgeBoost = getBadgeBoost(badges);
    
    const basePerSec = ((common * PARCEL_RATES.common) + (rare * PARCEL_RATES.rare) + 
                        (epic * PARCEL_RATES.epic) + (legendary * PARCEL_RATES.legendary)) * (1 + badgeBoost);

    let selectedMult = 1;
    if (boostType === 'active') selectedMult = DAILY_BOOST.active(totalParcels);
    else if (boostType === 'superRent') selectedMult = DAILY_BOOST.superRent;

    const weightedDailyMult = ((selectedMult * boostHours) + (1 * (24 - boostHours))) / 24;

    const day = basePerSec * weightedDailyMult * 86400;
    const hour = day / 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    // Calcul SRB (64h par mois)
    const hoursInMonth = 720; 
    const srbHours = 64;
    const normalHours = hoursInMonth - srbHours;
    const weightedSRBMult = ((50 * boostHours) + (1 * (24 - boostHours))) / 24;

    const monthWithSRB = (basePerSec * weightedSRBMult * srbHours * 3600) + 
                         (basePerSec * weightedDailyMult * normalHours * 3600);
    const yearWithSRB = monthWithSRB * 12;

    displayResults(hour, day, week, month, monthWithSRB, year, yearWithSRB);
    saveSettings();
}

function displayResults(h, d, w, m, mSRB, y, ySRB) {
    const res = document.getElementById('results');
    if(!res) return;
    res.innerHTML = `
        <div class="result-item"><span>Par Heure :</span> <strong>${h.toFixed(10)} $</strong></div>
        <div class="result-item"><span>Par Jour :</span> <strong>${d.toFixed(10)} $</strong></div>
        <div class="result-item"><span>Par Semaine :</span> <strong>${w.toFixed(4)} $</strong></div>
        <div class="result-item"><span>Par Mois :</span> <strong>${m.toFixed(4)} $</strong></div>
        <div class="result-item srb-line"><span>Mois avec SRB (64h) :</span> <strong>${mSRB.toFixed(4)} $</strong></div>
        <div class="result-item"><span>Par An :</span> <strong>${y.toFixed(4)} $</strong></div>
        <div class="result-item srb-line"><span>An avec SRB :</span> <strong>${ySRB.toFixed(4)} $</strong></div>
    `;
}

function toggleBoostHours() {
    const boostType = document.getElementById('dailyBoost').value;
    const container = document.getElementById('boostHoursContainer');
    if(container) container.style.display = (boostType === 'inactive') ? 'none' : 'block';
}

function adjustParcels(type, val) {
    const el = document.getElementById(type + 'Parcels');
    if(el) {
        el.value = Math.max(0, parseInt(el.value) + val);
        calculateIncomeAuto();
    }
}

function adjustBadges(val) {
    const el = document.getElementById('badges');
    if(el) {
        el.value = Math.max(0, parseInt(el.value) + val);
        calculateIncomeAuto();
    }
}

function saveSettings() {
    const settings = {
        common: document.getElementById('commonParcels').value,
        rare: document.getElementById('rareParcels').value,
        epic: document.getElementById('epicParcels').value,
        legendary: document.getElementById('legendaryParcels').value,
        badges: document.getElementById('badges').value,
        boostType: document.getElementById('dailyBoost').value,
        boostHours: document.getElementById('boostHours').value
    };
    localStorage.setItem('ae_calc_v3', JSON.stringify(settings));
}

window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('ae_calc_v3'));
    if (saved) {
        document.getElementById('commonParcels').value = saved.common;
        document.getElementById('rareParcels').value = saved.rare;
        document.getElementById('epicParcels').value = saved.epic;
        document.getElementById('legendaryParcels').value = saved.legendary;
        document.getElementById('badges').value = saved.badges;
        document.getElementById('dailyBoost').value = saved.boostType;
        document.getElementById('boostHours').value = saved.boostHours || 20;
    }
    toggleBoostHours();
    calculateIncomeAuto();
};const PARCEL_RATES = {
    common: 0.0000000011,
    rare: 0.0000000016,
    epic: 0.0000000022,
    legendary: 0.0000000044
};

const DAILY_BOOST = {
    inactive: 1,
    active: function(parcels) {
        if (parcels >= 1 && parcels <= 70) return 20;
        if (parcels >= 71 && parcels <= 100) return 15;
        if (parcels >= 101 && parcels <= 135) return 10;
        if (parcels >= 136 && parcels <= 170) return 8;
        if (parcels >= 171 && parcels <= 200) return 7;
        if (parcels >= 201 && parcels <= 250) return 6;
        if (parcels >= 251 && parcels <= 300) return 5;
        if (parcels >= 301 && parcels <= 350) return 4;
        if (parcels >= 351 && parcels <= 400) return 3;
        if (parcels >= 401) return 2; 
        return 1;
    },
    superRent: 50
};

function getBadgeBoost(badges) {
    if (badges >= 101) return 0.25;
    if (badges >= 61) return 0.20;
    if (badges >= 31) return 0.15;
    if (badges >= 11) return 0.10;
    if (badges >= 1) return 0.05;
    return 0;
}

function calculateIncomeAuto() {
    const common = parseInt(document.getElementById('commonParcels').value) || 0;
    const rare = parseInt(document.getElementById('rareParcels').value) || 0;
    const epic = parseInt(document.getElementById('epicParcels').value) || 0;
    const legendary = parseInt(document.getElementById('legendaryParcels').value) || 0;
    const badges = parseInt(document.getElementById('badges').value) || 0;
    const boostType = document.getElementById('dailyBoost').value;
    const boostHours = parseFloat(document.getElementById('boostHours').value) || 0;

    const totalParcels = common + rare + epic + legendary;
    const badgeBoost = getBadgeBoost(badges);
    
    const basePerSec = ((common * PARCEL_RATES.common) + (rare * PARCEL_RATES.rare) + 
                        (epic * PARCEL_RATES.epic) + (legendary * PARCEL_RATES.legendary)) * (1 + badgeBoost);

    let selectedMult = 1;
    if (boostType === 'active') selectedMult = DAILY_BOOST.active(totalParcels);
    else if (boostType === 'superRent') selectedMult = DAILY_BOOST.superRent;

    const weightedDailyMult = ((selectedMult * boostHours) + (1 * (24 - boostHours))) / 24;

    const day = basePerSec * weightedDailyMult * 86400;
    const hour = day / 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    const hoursInMonth = 720; 
    const srbHours = 64;
    const normalHours = hoursInMonth - srbHours;
    const weightedSRBMult = ((50 * boostHours) + (1 * (24 - boostHours))) / 24;

    const monthWithSRB = (basePerSec * weightedSRBMult * srbHours * 3600) + 
                         (basePerSec * weightedDailyMult * normalHours * 3600);
    const yearWithSRB = monthWithSRB * 12;

    displayResults(hour, day, week, month, monthWithSRB, year, yearWithSRB);
    saveSettings();
}

function displayResults(h, d, w, m, mSRB, y, ySRB) {
    const res = document.getElementById('results');
    // .toFixed(10) pour l'heure et le jour pour voir la précision
    // .toFixed(4) pour les montants plus élevés
    res.innerHTML = `
        <div class="result-item"><span>Par Heure :</span> <strong>${h.toFixed(10)} $</strong></div>
        <div class="result-item"><span>Par Jour :</span> <strong>${d.toFixed(10)} $</strong></div>
        <div class="result-item"><span>Par Semaine :</span> <strong>${w.toFixed(4)} $</strong></div>
        <div class="result-item"><span>Par Mois :</span> <strong>${m.toFixed(4)} $</strong></div>
        <div class="result-item srb-line"><span>Mois avec SRB (64h) :</span> <strong>${mSRB.toFixed(4)} $</strong></div>
        <div class="result-item"><span>Par An :</span> <strong>${y.toFixed(4)} $</strong></div>
        <div class="result-item srb-line"><span>An avec SRB :</span> <strong>${ySRB.toFixed(4)} $</strong></div>
    `;
}

function toggleBoostHours() {
    const boostType = document.getElementById('dailyBoost').value;
    const container = document.getElementById('boostHoursContainer');
    container.style.display = (boostType === 'inactive') ? 'none' : 'block';
}

function adjustParcels(type, val) {
    const el = document.getElementById(type + 'Parcels');
    el.value = Math.max(0, parseInt(el.value) + val);
    calculateIncomeAuto();
}

function adjustBadges(val) {
    const el = document.getElementById('badges');
    el.value = Math.max(0, parseInt(el.value) + val);
    calculateIncomeAuto();
}

function saveSettings() {
    const settings = {
        common: document.getElementById('commonParcels').value,
        rare: document.getElementById('rareParcels').value,
        epic: document.getElementById('epicParcels').value,
        legendary: document.getElementById('legendaryParcels').value,
        badges: document.getElementById('badges').value,
        boostType: document.getElementById('dailyBoost').value,
        boostHours: document.getElementById('boostHours').value
    };
    localStorage.setItem('ae_calc_save_v2', JSON.stringify(settings));
}

window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('ae_calc_save_v2'));
    if (saved) {
        document.getElementById('commonParcels').value = saved.common;
        document.getElementById('rareParcels').value = saved.rare;
        document.getElementById('epicParcels').value = saved.epic;
        document.getElementById('legendaryParcels').value = saved.legendary;
        document.getElementById('badges').value = saved.badges;
        document.getElementById('dailyBoost').value = saved.boostType;
        document.getElementById('boostHours').value = saved.boostHours || 20;
    }
    toggleBoostHours();
    calculateIncomeAuto();
};const PARCEL_RATES = {
    common: 0.0000000011,
    rare: 0.0000000016,
    epic: 0.0000000022,
    legendary: 0.0000000044
};

const DAILY_BOOST = {
    inactive: 1,
    active: function(parcels) {
        if (parcels >= 1 && parcels <= 70) return 20;
        if (parcels >= 71 && parcels <= 100) return 15;
        if (parcels >= 101 && parcels <= 135) return 10;
        if (parcels >= 136 && parcels <= 170) return 8;
        if (parcels >= 171 && parcels <= 200) return 7;
        if (parcels >= 201 && parcels <= 250) return 6;
        if (parcels >= 251 && parcels <= 300) return 5;
        if (parcels >= 301 && parcels <= 350) return 4;
        if (parcels >= 351 && parcels <= 400) return 3;
        if (parcels >= 401) return 2; 
        return 1;
    },
    superRent: 50
};

function getBadgeBoost(badges) {
    if (badges >= 101) return 0.25;
    if (badges >= 61) return 0.20;
    if (badges >= 31) return 0.15;
    if (badges >= 11) return 0.10;
    if (badges >= 1) return 0.05;
    return 0;
}

function calculateIncomeAuto() {
    const common = parseInt(document.getElementById('commonParcels').value) || 0;
    const rare = parseInt(document.getElementById('rareParcels').value) || 0;
    const epic = parseInt(document.getElementById('epicParcels').value) || 0;
    const legendary = parseInt(document.getElementById('legendaryParcels').value) || 0;
    const badges = parseInt(document.getElementById('badges').value) || 0;
    const boostType = document.getElementById('dailyBoost').value;
    const boostHours = parseFloat(document.getElementById('boostHours').value) || 0;

    const totalParcels = common + rare + epic + legendary;
    const badgeBoost = getBadgeBoost(badges);
    
    const basePerSec = ((common * PARCEL_RATES.common) + (rare * PARCEL_RATES.rare) + 
                        (epic * PARCEL_RATES.epic) + (legendary * PARCEL_RATES.legendary)) * (1 + badgeBoost);

    let selectedMult = 1;
    if (boostType === 'active') selectedMult = DAILY_BOOST.active(totalParcels);
    else if (boostType === 'superRent') selectedMult = DAILY_BOOST.superRent;

    const weightedDailyMult = ((selectedMult * boostHours) + (1 * (24 - boostHours))) / 24;

    const day = basePerSec * weightedDailyMult * 86400;
    const hour = day / 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    const hoursInMonth = 720; 
    const srbHours = 64;
    const normalHours = hoursInMonth - srbHours;
    const weightedSRBMult = ((50 * boostHours) + (1 * (24 - boostHours))) / 24;

    const monthWithSRB = (basePerSec * weightedSRBMult * srbHours * 3600) + 
                         (basePerSec * weightedDailyMult * normalHours * 3600);
    const yearWithSRB = monthWithSRB * 12;

    displayResults(hour, day, week, month, monthWithSRB, year, yearWithSRB);
    saveSettings();
}

function displayResults(h, d, w, m, mSRB, y, ySRB) {
    const res = document.getElementById('results');
    // .toFixed(10) pour l'heure et le jour pour voir la précision
    // .toFixed(4) pour les montants plus élevés
    res.innerHTML = `
        <div class="result-item"><span>Par Heure :</span> <strong>${h.toFixed(10)} $</strong></div>
        <div class="result-item"><span>Par Jour :</span> <strong>${d.toFixed(10)} $</strong></div>
        <div class="result-item"><span>Par Semaine :</span> <strong>${w.toFixed(4)} $</strong></div>
        <div class="result-item"><span>Par Mois :</span> <strong>${m.toFixed(4)} $</strong></div>
        <div class="result-item srb-line"><span>Mois avec SRB (64h) :</span> <strong>${mSRB.toFixed(4)} $</strong></div>
        <div class="result-item"><span>Par An :</span> <strong>${y.toFixed(4)} $</strong></div>
        <div class="result-item srb-line"><span>An avec SRB :</span> <strong>${ySRB.toFixed(4)} $</strong></div>
    `;
}

function toggleBoostHours() {
    const boostType = document.getElementById('dailyBoost').value;
    const container = document.getElementById('boostHoursContainer');
    container.style.display = (boostType === 'inactive') ? 'none' : 'block';
}

function adjustParcels(type, val) {
    const el = document.getElementById(type + 'Parcels');
    el.value = Math.max(0, parseInt(el.value) + val);
    calculateIncomeAuto();
}

function adjustBadges(val) {
    const el = document.getElementById('badges');
    el.value = Math.max(0, parseInt(el.value) + val);
    calculateIncomeAuto();
}

function saveSettings() {
    const settings = {
        common: document.getElementById('commonParcels').value,
        rare: document.getElementById('rareParcels').value,
        epic: document.getElementById('epicParcels').value,
        legendary: document.getElementById('legendaryParcels').value,
        badges: document.getElementById('badges').value,
        boostType: document.getElementById('dailyBoost').value,
        boostHours: document.getElementById('boostHours').value
    };
    localStorage.setItem('ae_calc_save_v2', JSON.stringify(settings));
}

window.onload = () => {
    const saved = JSON.parse(localStorage.getItem('ae_calc_save_v2'));
    if (saved) {
        document.getElementById('commonParcels').value = saved.common;
        document.getElementById('rareParcels').value = saved.rare;
        document.getElementById('epicParcels').value = saved.epic;
        document.getElementById('legendaryParcels').value = saved.legendary;
        document.getElementById('badges').value = saved.badges;
        document.getElementById('dailyBoost').value = saved.boostType;
        document.getElementById('boostHours').value = saved.boostHours || 20;
    }
    toggleBoostHours();
    calculateIncomeAuto();
};// Taux des parcelles (en $/seconde)
const PARCEL_RATES = {
    common: 0.0000000011,
    rare: 0.0000000016,
    epic: 0.0000000022,
    legendary: 0.0000000044
};

// Pourcentages de boost des badges
const BADGE_BOOSTS = {
    0: 0,
    1: 0.05, // 5 % pour 1-10 badges
    11: 0.10, // 10 % pour 11-30 badges
    31: 0.15, // 15 % pour 31-60 badges
    61: 0.20, // 20 % pour 61-100 badges
    101: 0.25 // 25 % pour 101-9999 badges
};

// Boost journalier (mis à jour avec tes données, appliqué sur l’ensemble des revenus)
const DAILY_BOOST = {
    inactive: 1, // Pas de boost (multiplicateur de 1)
    active: function(parcelsOwned) { // ParcelsOwned est le nombre total de parcelles possédées
        if (parcelsOwned >= 1 && parcelsOwned <= 70) return 20; // X20
        if (parcelsOwned >= 71 && parcelsOwned <= 100) return 15; // X15
        if (parcelsOwned >= 101 && parcelsOwned <= 135) return 10; // X10
        if (parcelsOwned >= 136 && parcelsOwned <= 170) return 8; // X8
        if (parcelsOwned >= 171 && parcelsOwned <= 200) return 7; // X7
        if (parcelsOwned >= 201 && parcelsOwned <= 250) return 6; // X6
        if (parcelsOwned >= 251 && parcelsOwned <= 300) return 5; // X5
        if (parcelsOwned >= 301 && parcelsOwned <= 350) return 4; // X4
        if (parcelsOwned >= 351 && parcelsOwned <= 400) return 3; // X3
        if (parcelsOwned >= 401 && parcelsOwned <= 1000) return 2; // X2
        if (parcelsOwned >= 3000) return 2; // X2
        if (parcelsOwned >= 6000) return 2; // X2
        if (parcelsOwned >= 10000) return 2; // X2
        return 1; // Par défaut, aucun boost (X1) si aucune condition n'est remplie
    },
    superRent: 50 // X50 pour Super Rent
};

// Fonction pour calculer le boost des badges
function getBadgeBoost(badges) {
    if (badges >= 101) return BADGE_BOOSTS[101];
    if (badges >= 61) return BADGE_BOOSTS[61];
    if (badges >= 31) return BADGE_BOOSTS[31];
    if (badges >= 11) return BADGE_BOOSTS[11];
    if (badges >= 1) return BADGE_BOOSTS[1];
    return BADGE_BOOSTS[0];
}

// Fonction pour calculer le revenu total par seconde
function calculateTotalIncome(common, rare, epic, legendary, badges, dailyBoost) {
    let baseIncome = (common * PARCEL_RATES.common) +
                     (rare * PARCEL_RATES.rare) +
                     (epic * PARCEL_RATES.epic) +
                     (legendary * PARCEL_RATES.legendary);
    
    const badgeBoost = getBadgeBoost(badges);
    const totalParcels = common + rare + epic + legendary;
    let dailyBoostMultiplier = DAILY_BOOST[dailyBoost] || 1;

    if (dailyBoost === 'active') {
        dailyBoostMultiplier = DAILY_BOOST.active(totalParcels); // Multiplicateur direct (X20, X15, etc.)
    }

    // Appliquer d'abord le boost des badges, puis le boost journalier
    return baseIncome * (1 + badgeBoost) * dailyBoostMultiplier;
}

// Fonction pour ouvrir les onglets
function openTab(tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let button of tabButtons) {
        button.classList.remove('active');
    }
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

// Fonction pour ajuster les parcelles (boutons -1/+1)
function adjustParcels(type, change) {
    const input = document.getElementById(`${type}Parcels`);
    let value = parseInt(input.value) || 0;
    value = Math.max(0, value + change); // Empêche les valeurs négatives
    input.value = value;
    calculateIncomeAuto(); // Calcul automatique après modification
    saveSettings(); // Sauvegarde les paramètres après modification
}

// Fonction pour ajuster les badges (boutons -1/+1)
function adjustBadges(change) {
    const input = document.getElementById('badges');
    let value = parseInt(input.value) || 0;
    value = Math.max(0, value + change); // Empêche les valeurs négatives
    input.value = value;
    calculateIncomeAuto(); // Calcul automatique après modification
    saveSettings(); // Sauvegarde les paramètres après modification
}

// Fonction pour ajuster les badges dans l'onglet Prévisions (boutons -1/+1)
function adjustParcelsBadges(change) {
    const input = document.getElementById('parcelsBadges');
    let value = parseInt(input.value) || 0;
    value = Math.max(0, value + change); // Empêche les valeurs négatives
    input.value = value;
    calculateParcelsNeeded(); // Calcul automatique après modification
    saveSettings(); // Sauvegarde les paramètres après modification
}

// Fonction pour calculer et afficher les revenus automatiquement
function calculateIncomeAuto() {
    const common = parseInt(document.getElementById('commonParcels').value) || 0;
    const rare = parseInt(document.getElementById('rareParcels').value) || 0;
    const epic = parseInt(document.getElementById('epicParcels').value) || 0;
    const legendary = parseInt(document.getElementById('legendaryParcels').value) || 0;
    const badges = parseInt(document.getElementById('badges').value) || 0;
    const dailyBoost = document.getElementById('dailyBoost').value;

    const incomePerSecond = calculateTotalIncome(common, rare, epic, legendary, badges, dailyBoost);
    
    const incomePerHour = incomePerSecond * 3600; // Secondes dans une heure
    const incomePerDay = incomePerHour * 24; // Heures dans un jour
    const incomePerWeek = incomePerDay * 7; // Jours dans une semaine
    const incomePerMonth = incomePerDay * 30; // Jours dans un mois (approximatif)
    const incomePerYear = incomePerDay * 365; // Jours dans une année

    const results = document.getElementById('results');
    results.innerHTML = `
        <p>Revenus par heure : $${incomePerHour.toFixed(10)}</p>
        <p>Revenus par jour : $${incomePerDay.toFixed(10)}</p>
        <p>Revenus par semaine : $${incomePerWeek.toFixed(10)}</p>
        <p>Revenus par mois : $${incomePerMonth.toFixed(10)}</p>
        <p>Revenus par an : $${incomePerYear.toFixed(10)}</p>
    `;
    saveSettings(); // Sauvegarde les paramètres après calcul
}

// Fonction pour calculer le temps nécessaire pour gagner un montant cible
function calculateTime() {
    const targetAmount = parseFloat(document.getElementById('targetAmount').value) || 0;
    const common = parseInt(document.getElementById('commonParcels').value) || 0;
    const rare = parseInt(document.getElementById('rareParcels').value) || 0;
    const epic = parseInt(document.getElementById('epicParcels').value) || 0;
    const legendary = parseInt(document.getElementById('legendaryParcels').value) || 0;
    const badges = parseInt(document.getElementById('badges').value) || 0;
    const dailyBoost = document.getElementById('forecastDailyBoost').value;

    const incomePerSecond = calculateTotalIncome(common, rare, epic, legendary, badges, dailyBoost);
    const incomePerDay = incomePerSecond * 3600 * 24;

    if (incomePerDay <= 0) {
        document.getElementById('timeResults').innerHTML = "<p>Aucun revenu généré. Vérifiez vos entrées.</p>";
        return;
    }

    const days = targetAmount / incomePerDay;
    const months = Math.floor(days / 30);
    const remainingDays = Math.floor(days % 30);

    document.getElementById('timeResults').innerHTML = `
        <p>Calcul basé sur vos données actuelles (parcelles et badges).</p>
        <p>Pour gagner $${targetAmount}, il vous faudra :</p>
        <p>${months} mois et ${remainingDays} jours</p>
    `;
    saveSettings(); // Sauvegarde les paramètres après calcul
}

// Fonction pour calculer le nombre de terrains nécessaires
function calculateParcelsNeeded() {
    const targetIncome = parseFloat(document.getElementById('targetIncome').value) || 0;
    const period = document.getElementById('incomePeriod').value;
    const dailyBoost = document.getElementById('parcelsDailyBoost').value;
    const badges = parseInt(document.getElementById('parcelsBadges').value) || 0;

    const badgeBoost = getBadgeBoost(badges);
    let dailyBoostMultiplier = DAILY_BOOST[dailyBoost] || 1;

    if (dailyBoost === 'active') {
        // Placeholder pour le nombre de parcelles, à estimer ou optimiser
        let estimatedParcels = 100; // Valeur par défaut, peut être ajustée
        dailyBoostMultiplier = DAILY_BOOST.active(estimatedParcels); // Appliquer le boost dégressif
    }

    // Convertir le revenu cible en fonction de la période choisie
    let targetPerSecond;
    switch (period) {
        case 'hour':
            targetPerSecond = targetIncome / 3600; // Revenus par heure en secondes
            break;
        case 'day':
            targetPerSecond = targetIncome / (24 * 3600); // Revenus par jour en secondes
            break;
        case 'month':
            targetPerSecond = targetIncome / (30 * 24 * 3600); // Revenus par mois (approximatif) en secondes
            break;
        case 'year':
            targetPerSecond = targetIncome / (365 * 24 * 3600); // Revenus par an en secondes
            break;
        default:
            targetPerSecond = targetIncome / (24 * 3600); // Par défaut : par jour
    }

    const totalBoost = (1 + badgeBoost) * dailyBoostMultiplier;
    const baseRatePerParcel = targetPerSecond / totalBoost; // Revenu par parcelle par seconde nécessaire

    // Répartir équitablement selon les probabilités (50 % commun, 30 % rare, 15 % épique, 5 % légendaire)
    let commonNeeded = 0, rareNeeded = 0, epicNeeded = 0, legendaryNeeded = 0;

    const totalProbability = 0.5 + 0.3 + 0.15 + 0.05; // Somme des probabilités
    const commonFraction = 0.5 / totalProbability;
    const rareFraction = 0.3 / totalProbability;
    const epicFraction = 0.15 / totalProbability;
    const legendaryFraction = 0.05 / totalProbability;

    const totalNeeded = baseRatePerParcel / (PARCEL_RATES.common * commonFraction +
                                            PARCEL_RATES.rare * rareFraction +
                                            PARCEL_RATES.epic * epicFraction +
                                            PARCEL_RATES.legendary * legendaryFraction);

    commonNeeded = Math.ceil(totalNeeded * commonFraction);
    rareNeeded = Math.ceil(totalNeeded * rareFraction);
    epicNeeded = Math.ceil(totalNeeded * epicFraction);
    legendaryNeeded = Math.ceil(totalNeeded * legendaryFraction);

    // Ajouter les terrains déjà possédés pour calculer les terrains supplémentaires
    const currentCommon = parseInt(document.getElementById('commonParcels').value) || 0;
    const currentRare = parseInt(document.getElementById('rareParcels').value) || 0;
    const currentEpic = parseInt(document.getElementById('epicParcels').value) || 0;
    const currentLegendary = parseInt(document.getElementById('legendaryParcels').value) || 0;

    const additionalCommon = Math.max(0, commonNeeded - currentCommon);
    const additionalRare = Math.max(0, rareNeeded - currentRare);
    const additionalEpic = Math.max(0, epicNeeded - currentEpic);
    const additionalLegendary = Math.max(0, legendaryNeeded - currentLegendary);

    const totalAdditional = additionalCommon + additionalRare + additionalEpic + additionalLegendary;

    document.getElementById('parcelsResults').innerHTML = `
        <p>Vous avez besoin de ${totalAdditional} terrains supplémentaires :</p>
        <p class="common">${additionalCommon} terrains communs</p>
        <p class="rare">${additionalRare} terrains rares</p>
        <p class="epic">${additionalEpic} terrains épiques</p>
        <p class="legendary">${additionalLegendary} terrains légendaires</p>
    `;
    saveSettings(); // Sauvegarde les paramètres après calcul
}

// Fonction pour sauvegarder les paramètres dans localStorage
function saveSettings() {
    const settings = {
        commonParcels: document.getElementById('commonParcels').value,
        rareParcels: document.getElementById('rareParcels').value,
        epicParcels: document.getElementById('epicParcels').value,
        legendaryParcels: document.getElementById('legendaryParcels').value,
        badges: document.getElementById('badges').value,
        dailyBoost: document.getElementById('dailyBoost').value,
        targetAmount: document.getElementById('targetAmount').value,
        forecastDailyBoost: document.getElementById('forecastDailyBoost').value,
        targetIncome: document.getElementById('targetIncome').value,
        incomePeriod: document.getElementById('incomePeriod').value,
        parcelsDailyBoost: document.getElementById('parcelsDailyBoost').value,
        parcelsBadges: document.getElementById('parcelsBadges').value
    };
    localStorage.setItem('aeCalculatorSettings', JSON.stringify(settings));
}

// Fonction pour charger les paramètres depuis localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('aeCalculatorSettings')) || {};
    document.getElementById('commonParcels').value = settings.commonParcels || 0;
    document.getElementById('rareParcels').value = settings.rareParcels || 0;
    document.getElementById('epicParcels').value = settings.epicParcels || 0;
    document.getElementById('legendaryParcels').value = settings.legendaryParcels || 0;
    document.getElementById('badges').value = settings.badges || 0;
    document.getElementById('dailyBoost').value = settings.dailyBoost || 'inactive';
    document.getElementById('targetAmount').value = settings.targetAmount || 10;
    document.getElementById('forecastDailyBoost').value = settings.forecastDailyBoost || 'inactive';
    document.getElementById('targetIncome').value = settings.targetIncome || 1;
    document.getElementById('incomePeriod').value = settings.incomePeriod || 'day';
    document.getElementById('parcelsDailyBoost').value = settings.parcelsDailyBoost || 'inactive';
    document.getElementById('parcelsBadges').value = settings.parcelsBadges || 0;
    calculateIncomeAuto(); // Calculer automatiquement les revenus au chargement
}

// Initialiser avec le premier onglet actif et charger les paramètres sauvegardés
window.onload = () => {
    openTab('income');
    loadSettings();
};
