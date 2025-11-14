// 💰 Modern JavaScript - Kapsamlı Bütçe Yönetim Uygulaması
'use strict';

// 📊 BAŞLANGIÇ VERİLERİ
const initialBudget = [
  { id: 1, value: 250, description: 'Eski TV Satışı 📺', user: 'jonas', category: 'gelir', date: '2025-01-15' },
  { id: 2, value: -45, description: 'Market Alışverişi 🥑', user: 'jonas', category: 'gıda', date: '2025-01-16' },
  { id: 3, value: 3500, description: 'Aylık Maaş 👩‍💻', user: 'jonas', category: 'gelir', date: '2025-01-01' },
  { id: 4, value: 300, description: 'Freelance İş 👩‍💻', user: 'jonas', category: 'gelir', date: '2025-01-20' },
  { id: 5, value: -1100, description: 'Yeni iPhone 📱', user: 'jonas', category: 'teknoloji', date: '2025-01-10' },
  { id: 6, value: -20, description: 'Şeker 🍭', user: 'matilda', category: 'gıda', date: '2025-01-18' },
  { id: 7, value: -125, description: 'Oyuncaklar 🚂', user: 'matilda', category: 'eğlence', date: '2025-01-12' },
  { id: 8, value: -1800, description: 'Yeni Laptop 💻', user: 'jonas', category: 'teknoloji', date: '2025-01-05' },
];

// 🎯 KULLANICI LİMİTLERİ
const userLimits = {
  jonas: 1500,
  matilda: 100,
  default: 0
};

// 📋 KATEGORİ LİMİTLERİ
const categoryLimits = {
  gıda: 500,
  teknoloji: 2000,
  eğlence: 300,
  ulaşım: 400,
  sağlık: 800
};

// =================================================================
// 🔧 YARDIMCI FONKSİYONLAR (Basit ve Anlaşılır)
// =================================================================

// 1️⃣ Kullanıcı limitini getir
const getUserLimit = (user) => userLimits[user] ?? userLimits.default;

// 2️⃣ Kategori limitini getir
const getCategoryLimit = (category) => categoryLimits[category] || 1000;

// 3️⃣ Benzersiz ID oluştur
const generateId = (budget) => Math.max(...budget.map(item => item.id || 0)) + 1;

// 4️⃣ Kullanıcı adını temizle
const cleanUser = (user) => user.toLowerCase().trim();

// 5️⃣ Tarihi formatla
const formatDate = () => new Date().toISOString().split('T')[0];

// =================================================================
// 🎯 ANA FONKSİYONLAR (Pure Functions)
// =================================================================

// ➕ Yeni gider/gelir ekleme
const addTransaction = (budget, value, description, user = 'jonas', category = 'diğer') => {
  const cleanedUser = cleanUser(user);
  const userLimit = getUserLimit(cleanedUser);

  // Gider kontrolü (sadece negatif değerler için)
  if (value < 0 && Math.abs(value) > userLimit) {
    console.log(`❌ ${cleanedUser}: ${Math.abs(value)} TL gider, ${userLimit} TL limitini aşıyor!`);
    return budget;
  }

  const newTransaction = {
    id: generateId(budget),
    value: value,
    description,
    user: cleanedUser,
    category: category.toLowerCase(),
    date: formatDate()
  };

  console.log(`✅ ${value > 0 ? 'Gelir' : 'Gider'} eklendi: ${description} (${Math.abs(value)} TL)`);
  return [...budget, newTransaction];
};

// 🔍 Limit kontrolü
const checkLimits = (budget) => {
  return budget.map(transaction => {
    const userLimit = getUserLimit(transaction.user);
    const categoryLimit = getCategoryLimit(transaction.category);

    let flags = [];

    // Kullanıcı limiti kontrolü
    if (transaction.value < 0 && Math.abs(transaction.value) > userLimit) {
      flags.push('user-limit');
    }

    // Kategori limiti kontrolü
    if (transaction.value < 0 && Math.abs(transaction.value) > categoryLimit) {
      flags.push('category-limit');
    }

    return flags.length > 0
      ? { ...transaction, flags }
      : transaction;
  });
};

// 📊 Kullanıcı bazında özet
const getUserSummary = (budget) => {
  const summary = {};

  budget.forEach(transaction => {
    const user = transaction.user;
    if (!summary[user]) {
      summary[user] = {
        totalIncome: 0,
        totalExpense: 0,
        transactionCount: 0,
        limit: getUserLimit(user)
      };
    }

    if (transaction.value > 0) {
      summary[user].totalIncome += transaction.value;
    } else {
      summary[user].totalExpense += Math.abs(transaction.value);
    }
    summary[user].transactionCount++;
  });

  // Net bakiye hesapla
  Object.keys(summary).forEach(user => {
    summary[user].netBalance = summary[user].totalIncome - summary[user].totalExpense;
    summary[user].limitStatus = summary[user].totalExpense <= summary[user].limit ? '🟢' : '🔴';
  });

  return summary;
};

// 📈 Kategori bazında özet
const getCategorySummary = (budget) => {
  const summary = {};

  budget
    .filter(t => t.value < 0) // Sadece giderler
    .forEach(transaction => {
      const category = transaction.category;
      if (!summary[category]) {
        summary[category] = {
          total: 0,
          count: 0,
          limit: getCategoryLimit(category)
        };
      }
      summary[category].total += Math.abs(transaction.value);
      summary[category].count++;
    });

  // Limit durumu ekle
  Object.keys(summary).forEach(category => {
    summary[category].limitStatus = summary[category].total <= summary[category].limit ? '🟢' : '🔴';
    summary[category].percentage = Math.round((summary[category].total / summary[category].limit) * 100);
  });

  return summary;
};

// 💸 Büyük işlemleri filtrele
const getBigTransactions = (budget, minAmount = 500) => {
  return budget
    .filter(t => Math.abs(t.value) >= minAmount)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .map(t => ({
      ...t,
      type: t.value > 0 ? 'Gelir' : 'Gider',
      amount: Math.abs(t.value)
    }));
};

// 🔍 Arama fonksiyonu
const searchTransactions = (budget, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return budget.filter(t =>
    t.description.toLowerCase().includes(term) ||
    t.user.toLowerCase().includes(term) ||
    t.category.toLowerCase().includes(term)
  );
};

// =================================================================
// 🧪 KAPSAMLI TEST VE DEMO
// =================================================================

console.log('💰 Kapsamlı Bütçe Yönetim Sistemi Demo\n');
console.log('='.repeat(50));

// 1️⃣ Başlangıç durumu
console.log('\n📊 1. BAŞLANGIÇ DURUMU');
console.log(`Toplam işlem sayısı: ${initialBudget.length}`); 

// 2️⃣ Yeni işlemler ekleme
console.log('\n➕ 2. YENİ İŞLEMLER EKLEME');
let currentBudget = initialBudget;

// Gelir ekleme
currentBudget = addTransaction(currentBudget, 500, 'Bonus Ödeme 💰', 'jonas', 'gelir');
currentBudget = addTransaction(currentBudget, 75, 'Harçlık 🎁', 'matilda', 'gelir');

// Gider ekleme
currentBudget = addTransaction(currentBudget, -25, 'Kahve ☕', 'jonas', 'gıda');
currentBudget = addTransaction(currentBudget, -150, 'Kitaplar 📚', 'matilda', 'eğlence');
currentBudget = addTransaction(currentBudget, -50, 'Benzin ⛽', 'jonas', 'ulaşım');

// Limit aşan gider deneme
currentBudget = addTransaction(currentBudget, -200, 'Pahalı Oyuncak 🎮', 'matilda', 'eğlence');

// 3️⃣ Limit kontrolü
console.log('\n🔍 3. LİMİT KONTROLÜ');
const checkedBudget = checkLimits(currentBudget);
const flaggedTransactions = checkedBudget.filter(t => t.flags);
console.log(`Limit aşan işlem sayısı: ${flaggedTransactions.length}`);
flaggedTransactions.forEach(t => {
  console.log(`⚠️ ${t.user}: ${t.description} - ${t.flags.join(', ')}`);
});

// 4️⃣ Kullanıcı özeti
console.log('\n👥 4. KULLANICI ÖZETİ');
const userSummary = getUserSummary(checkedBudget);
Object.entries(userSummary).forEach(([user, data]) => {
  console.log(`${data.limitStatus} ${user.toUpperCase()}:`);
  console.log(`   💰 Toplam Gelir: ${data.totalIncome} TL`);
  console.log(`   💸 Toplam Gider: ${data.totalExpense} TL`);
  console.log(`   💳 Net Bakiye: ${data.netBalance} TL`);
  console.log(`   📊 İşlem Sayısı: ${data.transactionCount}`);
  console.log(`   🎯 Limit: ${data.limit} TL\n`);
});

// 5️⃣ Kategori özeti
console.log('\n📈 5. KATEGORİ ÖZETİ');
const categorySummary = getCategorySummary(checkedBudget);
Object.entries(categorySummary).forEach(([category, data]) => {
  console.log(`${data.limitStatus} ${category.toUpperCase()}:`);
  console.log(`   💸 Toplam: ${data.total} TL`);
  console.log(`   📊 İşlem: ${data.count} adet`);
  console.log(`   🎯 Limit: ${data.limit} TL`);
  console.log(`   📈 Kullanım: %${data.percentage}\n`);
});

// 6️⃣ Büyük işlemler
console.log('\n💸 6. BÜYÜK İŞLEMLER (500 TL üzeri)');
const bigTransactions = getBigTransactions(checkedBudget, 500);
bigTransactions.forEach(t => {
  console.log(`${t.type === 'Gelir' ? '💰' : '💸'} ${t.description}: ${t.amount} TL (${t.user})`);
});

// 7️⃣ Arama testi
console.log('\n🔍 7. ARAMA TESTİ (teknoloji)');
const techTransactions = searchTransactions(checkedBudget, 'teknoloji');
console.log(`Teknoloji kategorisinde ${techTransactions.length} işlem bulundu:`);
techTransactions.forEach(t => {
  console.log(`- ${t.description}: ${Math.abs(t.value)} TL`);
});

// 8️⃣ Özet istatistikler
console.log('\n📊 8. GENEL İSTATİSTİKLER');
const totalIncome = checkedBudget.filter(t => t.value > 0).reduce((sum, t) => sum + t.value, 0);
const totalExpense = checkedBudget.filter(t => t.value < 0).reduce((sum, t) => sum + Math.abs(t.value), 0);
const netBalance = totalIncome - totalExpense;

console.log(`💰 Toplam Gelir: ${totalIncome} TL`);
console.log(`💸 Toplam Gider: ${totalExpense} TL`);
console.log(`💳 Net Bakiye: ${netBalance} TL`);
console.log(`📊 Toplam İşlem: ${checkedBudget.length} adet`);

console.log('\n' + '='.repeat(50));
console.log('✨ PURE FONKSİYON AVANTAJLARI:');
console.log('✅ Yan etkisiz - orijinal veri hiç değişmez');
console.log('✅ Öngörülebilir - aynı girdi, aynı çıktı');
console.log('✅ Test edilebilir - her fonksiyon bağımsız');
console.log('✅ Yeniden kullanılabilir - modüler yapı');
console.log('✅ Hata ayıklama kolay - izole fonksiyonlar');
console.log('✅ Performanslı - memoization uygulanabilir');
