const API_URL = 'https://dummyjson.com/products?limit=30';
const productGrid = document.getElementById('productGrid');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

let allProducts = [];

// Format harga ke USD lalu dirupiahkan (opsional, karena datanya $ maka kita asumsikan x 15000)
const formatHarga = (priceUSD) => {
    const hargaRp = priceUSD * 15000;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(hargaRp);
};

// 1. Fetch API
const fetchProducts = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Gagal memuat data produk.');
        
        const data = await response.json();
        allProducts = data.products;
        
        setupCategories(allProducts);
        renderProducts(allProducts);
        
        loadingEl.style.display = 'none';
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = 'Oops! ' + error.message;
        console.error(error);
    }
};

// 2. Tampilkan Produk ke DOM (Memenuhi syarat badge Stok Menipis)
const renderProducts = (products) => {
    productGrid.innerHTML = '';
    
    if(products.length === 0) {
        productGrid.innerHTML = '<div class="status-msg">Tidak ada produk yang ditemukan.</div>';
        return;
    }

    products.forEach(product => {
        const isLowStock = product.stock < 10;
        const badgeHTML = isLowStock ? '<span class="badge">Stok Menipis</span>' : '';
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${badgeHTML}
            <img src="${product.thumbnail}" alt="${product.title}" class="card-img" loading="lazy">
            <div class="card-content">
                <div class="card-category">${product.category.replace('-', ' ')}</div>
                <h3 class="card-title" title="${product.title}">${product.title}</h3>
                <div class="card-price">${formatHarga(product.price)}</div>
            </div>
        `;
        productGrid.appendChild(card);
    });
};

// Setup Kategori Filter Dinamis
const setupCategories = (products) => {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
        categoryFilter.appendChild(option);
    });
};

// 3. Filter & Pencarian
const filterProducts = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = allProducts.filter(p => {
        const matchName = p.title.toLowerCase().includes(searchTerm);
        const matchCat = category === 'all' || p.category === category;
        return matchName && matchCat;
    });

    renderProducts(filtered);
};

searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);

// Init
fetchProducts();