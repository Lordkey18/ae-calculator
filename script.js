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
};
