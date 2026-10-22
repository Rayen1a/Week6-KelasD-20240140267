const form = document.getElementById('captionForm');
const namaInput = document.getElementById('namaProduk');
const hargaInput = document.getElementById('hargaProduk');
const namaError = document.getElementById('namaError');
const hargaError = document.getElementById('hargaError');
const btnSubmit = document.getElementById('btnSubmit');
const resultBox = document.getElementById('resultBox');
const captionResult = document.getElementById('captionResult');
const btnCopy = document.getElementById('btnCopy');

let isNamaValid = false;
let isHargaValid = false;

// Format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

// Buat Hashtag (PascalCase dari nama produk)
const generateHashtag = (nama) => {
    const words = nama.trim().split(/\s+/);
    const pascal = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    return `#${pascal}`;
};

// Validasi Real-time Nama Produk
namaInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const hasLetter = /[a-zA-Z]/.test(val);
    
    if (!val) {
        namaError.textContent = "Nama produk wajib diisi.";
        isNamaValid = false;
    } else if (val.length < 3 || val.length > 60) {
        namaError.textContent = "Nama produk harus antara 3 - 60 karakter.";
        isNamaValid = false;
    } else if (!hasLetter) {
        namaError.textContent = "Nama produk harus mengandung huruf.";
        isNamaValid = false;
    } else {
        namaError.textContent = "";
        isNamaValid = true;
    }
    checkFormValid();
});

// Validasi Real-time Harga
hargaInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const num = parseInt(val, 10);
    
    if (!val) {
        hargaError.textContent = "Harga wajib diisi.";
        isHargaValid = false;
    } else if (isNaN(num) || !Number.isInteger(num)) {
        hargaError.textContent = "Harga harus berupa angka bulat.";
        isHargaValid = false;
    } else if (num < 1000 || num > 100000000) {
        hargaError.textContent = "Harga harus antara Rp 1.000 hingga Rp 100.000.000.";
        isHargaValid = false;
    } else {
        hargaError.textContent = "";
        isHargaValid = true;
    }
    checkFormValid();
});

const checkFormValid = () => {
    btnSubmit.disabled = !(isNamaValid && isHargaValid);
};

// Event Submit (Buat Caption)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!isNamaValid || !isHargaValid) return;

    const nama = namaInput.value.trim();
    const hargaFormat = formatRupiah(hargaInput.value);
    const template = document.querySelector('input[name="template"]:checked').value;
    const hashtag = generateHashtag(nama);
    
    let captionText = "";

    switch(template) {
        case 'promo':
            captionText = `🎉 DISKON SPESIAL HARI INI! 🎉\n\nSiapa nih yang nungguin promo? Dapatkan ${nama} yang super premium ini cuma dengan ${hargaFormat} aja lho!\n\nStok terbatas banget, jangan sampai nyesel kehabisan. Buruan klik link di bio untuk order sekarang! 👇\n\n${hashtag} #PromoKopi #RoyalBeansUMKM #KopiNusantara`;
            break;
        case 'santai':
            captionText = `Lagi butuh mood booster hari ini? ☕✨\n\nCobain deh ${nama} dari Royal Beans! Rasanya dijamin bikin rileks, dan harganya super terjangkau cuma ${hargaFormat} bestie~\n\nYuk mampir ke kedai kita atau pesen via ojol kesayangan kamu! Ditunggu yaa! 🥰\n\n${hashtag} #NgopiSantai #KopiSore #RoyalBeans`;
            break;
        case 'formal':
            captionText = `Hadirkan kemewahan cita rasa dalam setiap tegukan. ⚜️\n\nKami di Royal Beans dengan bangga mempersembahkan ${nama}. Diracik dengan bahan pilihan terbaik, kini tersedia untuk Anda dengan harga ${hargaFormat}.\n\nKunjungi etalase kami untuk pengalaman menikmati kualitas tanpa kompromi.\n\n${hashtag} #KopiPremium #RoyalBeansCoffee #SpecialtyCoffee`;
            break;
    }

    captionResult.textContent = captionText;
    resultBox.style.display = 'block';
    
    // Smooth scroll ke hasil
    resultBox.scrollIntoView({ behavior: 'smooth' });
});

// Fitur Tambahan: Salin Teks
btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(captionResult.textContent).then(() => {
        const originalText = btnCopy.textContent;
        btnCopy.textContent = "Disalin! ✓";
        setTimeout(() => { btnCopy.textContent = originalText; }, 2000);
    });
});

// Init form check
checkFormValid();