// NexusBiz Client-Side Engine (Vanilla JavaScript)
(function () {
  'use strict';

  // 1. Database Manager with LocalStorage Persistence
  const DB = {
    KEY: 'nexus_biz_db',
    get() {
      try {
        const stored = localStorage.getItem(this.KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn('LocalStorage unavailable, using memory fallback');
      }
      return window.NEXUS_DATA || { countries: [], regions: [], cities: [], categories: [], businesses: [], reviews: [], reports: [] };
    },
    save(data) {
      try {
        localStorage.setItem(this.KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    },
    reset() {
      if (window.NEXUS_DATA) {
        this.save(window.NEXUS_DATA);
        location.reload();
      }
    }
  };

  // Ensure DB is initialized
  if (!localStorage.getItem(DB.KEY) && window.NEXUS_DATA) {
    DB.save(window.NEXUS_DATA);
  }

  window.NexusDB = DB;

  // 2. Helper Utilities
  function checkOpenStatus(hours) {
    if (!hours || !hours.length) return null;
    const now = new Date();
    const day = now.getDay();
    const todayHours = hours.find(h => h.day_of_week === day);
    if (!todayHours || todayHours.is_closed) return { isOpen: false, text: 'Closed today' };
    
    const [openH, openM] = (todayHours.opens_at || '09:00').split(':').map(Number);
    const [closeH, closeM] = (todayHours.closes_at || '18:00').split(':').map(Number);
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const openMins = openH * 60 + openM;
    const closeMins = closeH * 60 + closeM;

    if (currentMins >= openMins && currentMins < closeMins) {
      return { isOpen: true, text: `Open now until ${todayHours.closes_at}` };
    }
    return { isOpen: false, text: `Closed now (Opens at ${todayHours.opens_at})` };
  }

  function getCategoryName(db, catId) {
    const cat = db.categories.find(c => c.id === catId);
    return cat ? cat.name : 'Business';
  }

  function getCityName(db, cityId) {
    const city = db.cities.find(c => c.id === cityId);
    return city ? city.name : '';
  }

  function getCountryName(db, countryId) {
    const country = db.countries.find(c => c.id === countryId);
    return country ? country.name : '';
  }

  // 3. Render Business Card HTML
  function renderBusinessCard(biz, db) {
    const catName = getCategoryName(db, biz.category_id);
    const cityName = getCityName(db, biz.city_id);
    const countryName = getCountryName(db, biz.country_id);
    const openStatus = checkOpenStatus(biz.hours);

    return `
      <div class="business-card">
        <div>
          <div class="business-card-header">
            <div>
              <span class="badge-category">${catName}</span>
              <h3 class="business-card-title"><a href="business.html?slug=${biz.slug || biz.id}">${biz.name}</a></h3>
            </div>
            ${biz.is_verified ? '<span class="badge-verified">✓ Verified</span>' : ''}
          </div>
          <p class="business-card-desc">${biz.short_description || biz.description}</p>
        </div>
        <div>
          ${openStatus ? `
            <div style="font-size:0.82rem; margin-bottom:12px; color:${openStatus.isOpen ? '#059669' : '#DC2626'}; font-weight:600;">
              ● ${openStatus.text}
            </div>` : ''}
          <div class="business-card-meta">
            <span class="business-location">📍 ${cityName}${countryName ? ', ' + countryName : ''}</span>
            <span class="business-rating">★ ${biz.rating || '4.8'} <span style="font-weight:400; color:var(--slate);">(${biz.review_count || 12})</span></span>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Initialize Homepage Views
  function initHomePage() {
    const db = DB.get();
    
    // Populate Hero Category Select
    const heroCatSelect = document.getElementById('heroCategory');
    if (heroCatSelect && db.categories) {
      db.categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        heroCatSelect.appendChild(opt);
      });
    }

    // Populate Hero Location Select
    const heroLocSelect = document.getElementById('heroLocation');
    if (heroLocSelect && db.countries) {
      db.countries.forEach(cnt => {
        const opt = document.createElement('option');
        opt.value = cnt.id;
        opt.textContent = `${cnt.flag_emoji} ${cnt.name}`;
        heroLocSelect.appendChild(opt);
      });
    }

    // Featured Businesses Grid
    const featuredContainer = document.getElementById('featuredGrid');
    if (featuredContainer && db.businesses) {
      const approved = db.businesses.filter(b => b.status === 'approved');
      const featured = approved.filter(b => b.is_featured).concat(approved.filter(b => !b.is_featured)).slice(0, 6);
      featuredContainer.innerHTML = featured.map(b => renderBusinessCard(b, db)).join('');
    }

    // Category Grid
    const categoryContainer = document.getElementById('categoryGrid');
    if (categoryContainer && db.categories) {
      categoryContainer.innerHTML = db.categories.map(cat => `
        <a href="search.html?category=${cat.id}" class="category-card">
          <div class="category-icon">🏢</div>
          <div>
            <h4 class="category-title">${cat.name}</h4>
            <p class="category-desc">${cat.description}</p>
          </div>
        </a>
      `).join('');
    }

    // Country Explorer Grid
    const countryContainer = document.getElementById('countryGrid');
    if (countryContainer && db.countries) {
      countryContainer.innerHTML = db.countries.map(cnt => {
        const cities = db.cities.filter(c => c.country_id === cnt.id);
        return `
          <div class="country-card">
            <div class="country-header">
              <span class="country-flag">${cnt.flag_emoji}</span>
              <div>
                <h3 class="country-name">${cnt.name}</h3>
                <span style="font-size:0.85rem; color:var(--slate);">${cities.length} Popular Cities Listed</span>
              </div>
            </div>
            <div class="city-chips">
              ${cities.slice(0, 5).map(c => `
                <a href="search.html?country=${cnt.id}&city=${c.id}" class="city-chip">${c.name}</a>
              `).join('')}
              <a href="directories.html?country=${cnt.slug}" class="city-chip" style="background:#ECFDF5; color:#065F46; font-weight:700;">View All →</a>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 5. Initialize Search Page
  function initSearchPage() {
    const db = DB.get();
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') || '';
    const catParam = urlParams.get('category') || '';
    const countryParam = urlParams.get('country') || '';
    const cityParam = urlParams.get('city') || '';

    // Inputs
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('filterCategory');
    const countrySelect = document.getElementById('filterCountry');
    const citySelect = document.getElementById('filterCity');
    const ratingSelect = document.getElementById('filterRating');
    const sortSelect = document.getElementById('filterSort');
    const resultsGrid = document.getElementById('searchResultsGrid');
    const resultCount = document.getElementById('searchCount');

    if (searchInput) searchInput.value = qParam;

    // Fill Categories
    if (categorySelect && db.categories) {
      categorySelect.innerHTML = '<option value="">All Categories</option>' + 
        db.categories.map(c => `<option value="${c.id}" ${c.id === catParam ? 'selected' : ''}>${c.name}</option>`).join('');
    }

    // Fill Countries
    if (countrySelect && db.countries) {
      countrySelect.innerHTML = '<option value="">All Countries</option>' + 
        db.countries.map(c => `<option value="${c.id}" ${c.id === countryParam ? 'selected' : ''}>${c.flag_emoji} ${c.name}</option>`).join('');
    }

    // Dynamic Dependent Cities Dropdown
    function updateCities(selectedCountryId) {
      if (!citySelect) return;
      let availableCities = db.cities;
      if (selectedCountryId) {
        availableCities = availableCities.filter(c => c.country_id === selectedCountryId);
      }
      citySelect.innerHTML = '<option value="">All Cities</option>' + 
        availableCities.map(c => `<option value="${c.id}" ${c.id === cityParam ? 'selected' : ''}>${c.name}</option>`).join('');
    }

    if (countrySelect) {
      updateCities(countryParam);
      countrySelect.addEventListener('change', (e) => updateCities(e.target.value));
    }

    // Filter Logic
    function applyFilters() {
      const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const cat = categorySelect ? categorySelect.value : '';
      const cnt = countrySelect ? countrySelect.value : '';
      const cty = citySelect ? citySelect.value : '';
      const minRating = ratingSelect ? parseFloat(ratingSelect.value) || 0 : 0;
      const sort = sortSelect ? sortSelect.value : 'popular';

      let results = db.businesses.filter(b => b.status === 'approved');

      if (q) {
        results = results.filter(b => 
          b.name.toLowerCase().includes(q) ||
          (b.short_description && b.short_description.toLowerCase().includes(q)) ||
          (b.description && b.description.toLowerCase().includes(q)) ||
          (b.address && b.address.toLowerCase().includes(q))
        );
      }

      if (cat) results = results.filter(b => b.category_id === cat);
      if (cnt) results = results.filter(b => b.country_id === cnt);
      if (cty) results = results.filter(b => b.city_id === cty);
      if (minRating > 0) results = results.filter(b => (b.rating || 0) >= minRating);

      if (sort === 'rating') results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
      else results.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));

      if (resultCount) resultCount.textContent = `${results.length} Verified Businesses Found`;

      if (resultsGrid) {
        if (!results.length) {
          resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:60px 20px; background:#FFFFFF; border:1px solid var(--border); border-radius:var(--radius-sm);">
              <h3 style="font-size:1.3rem; margin-bottom:8px;">No matching businesses found</h3>
              <p style="color:var(--slate); margin-bottom:20px;">Try adjusting your search keywords, category or location filters.</p>
              <button onclick="window.location.href='search.html'" class="btn btn-outline">Clear All Filters</button>
            </div>
          `;
        } else {
          resultsGrid.innerHTML = results.map(b => renderBusinessCard(b, db)).join('');
        }
      }
    }

    // Attach listeners
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyFilters);
    if (countrySelect) countrySelect.addEventListener('change', applyFilters);
    if (citySelect) citySelect.addEventListener('change', applyFilters);
    if (ratingSelect) ratingSelect.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    applyFilters();
  }

  // 6. Initialize Business Profile Page
  function initBusinessProfile() {
    const db = DB.get();
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug') || urlParams.get('id') || 'systems-limited-lahore';
    
    const biz = db.businesses.find(b => b.slug === slug || b.id === slug);
    if (!biz) {
      document.body.innerHTML = `
        <div class="container" style="padding:100px 20px; text-align:center;">
          <h2>Business Listing Not Found</h2>
          <p style="color:var(--slate); margin:16px 0 24px;">The requested business profile does not exist or has been removed.</p>
          <a href="search.html" class="btn btn-primary">Browse Directory</a>
        </div>
      `;
      return;
    }

    const catName = getCategoryName(db, biz.category_id);
    const cityName = getCityName(db, biz.city_id);
    const countryName = getCountryName(db, biz.country_id);
    const openStatus = checkOpenStatus(biz.hours);

    // Update Page Meta
    document.title = `${biz.name} - ${cityName}, ${countryName} | NexusBiz Directory`;

    // Populate Fields
    const nameEl = document.getElementById('bizName');
    if (nameEl) nameEl.textContent = biz.name;

    const catEl = document.getElementById('bizCategory');
    if (catEl) catEl.textContent = catName;

    const locEl = document.getElementById('bizLocation');
    if (locEl) locEl.textContent = `${biz.address}, ${cityName}, ${countryName} ${biz.postal_code || ''}`;

    const descEl = document.getElementById('bizDescription');
    if (descEl) descEl.textContent = biz.description;

    const shortDescEl = document.getElementById('bizShortDesc');
    if (shortDescEl) shortDescEl.textContent = biz.short_description || '';

    const phoneEl = document.getElementById('bizPhone');
    if (phoneEl) {
      phoneEl.textContent = biz.phone;
      phoneEl.href = `tel:${biz.phone}`;
    }

    const emailEl = document.getElementById('bizEmail');
    if (emailEl) {
      emailEl.textContent = biz.email;
      emailEl.href = `mailto:${biz.email}`;
    }

    const webEl = document.getElementById('bizWebsite');
    if (webEl && biz.website) {
      webEl.href = biz.website;
      webEl.style.display = 'inline-flex';
    }

    const waEl = document.getElementById('bizWhatsApp');
    if (waEl && biz.whatsapp) {
      waEl.href = `https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`;
      waEl.style.display = 'inline-flex';
    }

    const ratingEl = document.getElementById('bizRating');
    if (ratingEl) ratingEl.textContent = `★ ${biz.rating || '4.8'}`;

    const reviewCountEl = document.getElementById('bizReviewCount');
    if (reviewCountEl) reviewCountEl.textContent = `(${biz.review_count || 12} customer reviews)`;

    const openBadgeEl = document.getElementById('bizOpenBadge');
    if (openBadgeEl && openStatus) {
      openBadgeEl.textContent = openStatus.text;
      openBadgeEl.style.color = openStatus.isOpen ? '#059669' : '#DC2626';
      openBadgeEl.style.backgroundColor = openStatus.isOpen ? '#ECFDF5' : '#FEF2F2';
    }

    // Schema.org LocalBusiness JSON-LD injection
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": biz.name,
      "description": biz.short_description || biz.description,
      "telephone": biz.phone,
      "email": biz.email,
      "url": biz.website || window.location.href,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": biz.address,
        "addressLocality": cityName,
        "addressCountry": countryName,
        "postalCode": biz.postal_code || ""
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": biz.rating || "4.8",
        "reviewCount": biz.review_count || "12"
      }
    });
    document.head.appendChild(schemaScript);

    // Render Reviews
    const reviewsListEl = document.getElementById('reviewsList');
    if (reviewsListEl && db.reviews) {
      const bizReviews = db.reviews.filter(r => r.business_id === biz.id && r.status === 'approved');
      if (bizReviews.length) {
        reviewsListEl.innerHTML = bizReviews.map(r => `
          <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:var(--radius-sm); padding:18px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong>${r.user_name}</strong>
              <span style="color:#B45309; font-weight:700;">★ ${r.rating} / 5</span>
            </div>
            <p style="color:var(--slate); font-size:0.92rem;">${r.comment}</p>
          </div>
        `).join('');
      } else {
        reviewsListEl.innerHTML = '<p style="color:var(--slate);">No reviews yet. Be the first to share your experience!</p>';
      }
    }

    // Modal Triggers
    const reviewModal = document.getElementById('reviewModal');
    const writeReviewBtn = document.getElementById('writeReviewBtn');
    const closeReviewBtn = document.getElementById('closeReviewBtn');
    const reviewForm = document.getElementById('reviewForm');

    if (writeReviewBtn && reviewModal) {
      writeReviewBtn.addEventListener('click', () => reviewModal.classList.add('active'));
    }
    if (closeReviewBtn && reviewModal) {
      closeReviewBtn.addEventListener('click', () => reviewModal.classList.remove('active'));
    }

    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userName = document.getElementById('revName').value;
        const userEmail = document.getElementById('revEmail').value;
        const rating = parseInt(document.getElementById('revRating').value, 10);
        const comment = document.getElementById('revComment').value;

        const newReview = {
          id: 'rev-' + Date.now(),
          business_id: biz.id,
          user_name: userName,
          user_email: userEmail,
          rating: rating,
          comment: comment,
          status: 'approved',
          created_at: new Date().toISOString()
        };

        db.reviews = db.reviews || [];
        db.reviews.push(newReview);
        DB.save(db);

        alert('Thank you! Your review has been submitted and published.');
        reviewModal.classList.remove('active');
        location.reload();
      });
    }

    // Report Modal
    const reportModal = document.getElementById('reportModal');
    const reportBtn = document.getElementById('reportBtn');
    const closeReportBtn = document.getElementById('closeReportBtn');
    const reportForm = document.getElementById('reportForm');

    if (reportBtn && reportModal) {
      reportBtn.addEventListener('click', () => reportModal.classList.add('active'));
    }
    if (closeReportBtn && reportModal) {
      closeReportBtn.addEventListener('click', () => reportModal.classList.remove('active'));
    }

    if (reportForm) {
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('repEmail').value;
        const reason = document.getElementById('repReason').value;
        const details = document.getElementById('repDetails').value;

        db.reports = db.reports || [];
        db.reports.push({
          id: 'rep-' + Date.now(),
          business_id: biz.id,
          reporter_email: email,
          reason: reason,
          details: details,
          status: 'open',
          created_at: new Date().toISOString()
        });
        DB.save(db);

        alert('Report received. Our moderation team will review this listing shortly.');
        reportModal.classList.remove('active');
      });
    }
  }

  // 7. Initialize Add Business Form
  function initAddBusiness() {
    const db = DB.get();
    const catSelect = document.getElementById('addCategory');
    const countrySelect = document.getElementById('addCountry');
    const regionSelect = document.getElementById('addRegion');
    const citySelect = document.getElementById('addCity');
    const form = document.getElementById('addBusinessForm');
    const successBanner = document.getElementById('submissionSuccess');

    // Populate categories
    if (catSelect && db.categories) {
      catSelect.innerHTML = '<option value="">Select Primary Category</option>' + 
        db.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    // Populate countries
    if (countrySelect && db.countries) {
      countrySelect.innerHTML = '<option value="">Select Country</option>' + 
        db.countries.map(c => `<option value="${c.id}">${c.flag_emoji} ${c.name}</option>`).join('');
    }

    // Cascading Regions & Cities
    if (countrySelect) {
      countrySelect.addEventListener('change', (e) => {
        const countryId = e.target.value;
        const regions = db.regions.filter(r => r.country_id === countryId);
        const cities = db.cities.filter(c => c.country_id === countryId);

        if (regionSelect) {
          regionSelect.innerHTML = '<option value="">Select State / Region</option>' + 
            regions.map(r => `<option value="${r.id}">${r.name}</option>`).join('');
        }
        if (citySelect) {
          citySelect.innerHTML = '<option value="">Select City</option>' + 
            cities.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('addName').value.trim();
        const categoryId = catSelect.value;
        const countryId = countrySelect.value;
        const regionId = regionSelect ? regionSelect.value : '';
        const cityId = citySelect.value;
        const address = document.getElementById('addAddress').value.trim();
        const postalCode = document.getElementById('addPostal').value.trim();
        const phone = document.getElementById('addPhone').value.trim();
        const email = document.getElementById('addEmail').value.trim();
        const website = document.getElementById('addWebsite').value.trim();
        const whatsapp = document.getElementById('addWhatsApp').value.trim();
        const shortDesc = document.getElementById('addShortDesc').value.trim();
        const description = document.getElementById('addDesc').value.trim();

        if (!name || !categoryId || !countryId || !cityId || !address || !phone || !email || !description) {
          alert('Please fill out all required fields.');
          return;
        }

        // Auto slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const newBiz = {
          id: 'biz-' + Date.now(),
          name,
          slug: slug + '-' + (Math.floor(Math.random() * 899) + 100),
          category_id: categoryId,
          country_id: countryId,
          region_id: regionId,
          city_id: cityId,
          address,
          postal_code: postalCode,
          phone,
          email,
          website,
          whatsapp,
          short_description: shortDesc || description.slice(0, 120),
          description,
          is_verified: false,
          is_featured: false,
          status: 'pending', // Moderation safety
          rating: 5.0,
          review_count: 0,
          created_at: new Date().toISOString()
        };

        db.businesses.push(newBiz);
        DB.save(db);

        form.style.display = 'none';
        if (successBanner) successBanner.style.display = 'block';
      });
    }
  }

  // 8. Initialize Admin Panel
  function initAdmin() {
    const db = DB.get();

    // Stats
    const totalCountEl = document.getElementById('adminTotalListings');
    const pendingCountEl = document.getElementById('adminPendingListings');
    const categoriesCountEl = document.getElementById('adminCategoriesCount');
    const reportsCountEl = document.getElementById('adminReportsCount');

    const pending = db.businesses.filter(b => b.status === 'pending');
    const approved = db.businesses.filter(b => b.status === 'approved');

    if (totalCountEl) totalCountEl.textContent = db.businesses.length;
    if (pendingCountEl) pendingCountEl.textContent = pending.length;
    if (categoriesCountEl) categoriesCountEl.textContent = db.categories.length;
    if (reportsCountEl) reportsCountEl.textContent = (db.reports || []).length;

    // Render Pending Table
    const pendingTableBody = document.getElementById('pendingTableBody');
    if (pendingTableBody) {
      if (!pending.length) {
        pendingTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--slate);">No pending submissions awaiting approval.</td></tr>';
      } else {
        pendingTableBody.innerHTML = pending.map(b => `
          <tr>
            <td><strong>${b.name}</strong></td>
            <td>${getCategoryName(db, b.category_id)}</td>
            <td>${getCityName(db, b.city_id)}, ${getCountryName(db, b.country_id)}</td>
            <td><span class="badge-category" style="background:#FEF3C7; color:#92400E;">Pending</span></td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="window.adminAction('${b.id}', 'approve')">Approve</button>
              <button class="btn btn-sm btn-outline" style="color:#DC2626;" onclick="window.adminAction('${b.id}', 'reject')">Reject</button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Render All Listings Table
    const allTableBody = document.getElementById('allListingsTableBody');
    if (allTableBody) {
      allTableBody.innerHTML = db.businesses.map(b => `
        <tr>
          <td><strong>${b.name}</strong></td>
          <td>${getCategoryName(db, b.category_id)}</td>
          <td>${getCityName(db, b.city_id)}</td>
          <td>
            <span class="badge-category" style="${b.status === 'approved' ? 'background:#ECFDF5; color:#065F46;' : 'background:#FEF3C7; color:#92400E;'}">
              ${b.status}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="window.adminAction('${b.id}', 'toggle_featured')">
              ${b.is_featured ? '★ Featured' : '☆ Feature'}
            </button>
            <button class="btn btn-sm btn-outline" style="color:#DC2626;" onclick="window.adminAction('${b.id}', 'delete')">Delete</button>
          </td>
        </tr>
      `).join('');
    }

    // Global Admin Action Dispatcher
    window.adminAction = function (id, action) {
      const idx = db.businesses.findIndex(b => b.id === id);
      if (idx === -1) return;

      if (action === 'approve') {
        db.businesses[idx].status = 'approved';
        alert('Listing approved and published!');
      } else if (action === 'reject') {
        db.businesses[idx].status = 'rejected';
        alert('Listing rejected.');
      } else if (action === 'toggle_featured') {
        db.businesses[idx].is_featured = !db.businesses[idx].is_featured;
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this listing?')) {
          db.businesses.splice(idx, 1);
        }
      }

      DB.save(db);
      location.reload();
    };
  }

  // 9. Global FAQ Accordion Toggle
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const q = item.querySelector('.faq-question');
      if (q) {
        q.addEventListener('click', () => {
          item.classList.toggle('active');
        });
      }
    });
  }

  // 10. Router Dispatcher
  document.addEventListener('DOMContentLoaded', () => {
    initFaqAccordion();

    const path = window.location.pathname.toLowerCase();
    if (path.includes('search.html')) {
      initSearchPage();
    } else if (path.includes('business.html')) {
      initBusinessProfile();
    } else if (path.includes('add-business.html')) {
      initAddBusiness();
    } else if (path.includes('admin.html')) {
      initAdmin();
    } else {
      initHomePage();
    }
  });

})();
