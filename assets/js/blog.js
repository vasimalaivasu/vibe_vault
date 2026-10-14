/**
 * VibeVault - Blog & Editorial Interactive Engine
 * Handles article filtering, live search, featured spotlight rendering,
 * full-screen reader modal, reading progress bar, URL hash routing, and social sharing.
 */

document.addEventListener('DOMContentLoaded', () => {
  const posts = window.VOX_BLOG_POSTS || [];
  if (!posts.length) return;

  // State
  let currentCategory = 'All';
  let searchQuery = '';

  // DOM Elements
  const featuredMount = document.getElementById('blogFeaturedMount');
  const gridMount = document.getElementById('blogGridMount');
  const countDisplay = document.getElementById('blogArticlesCount');
  const categoryContainer = document.getElementById('blogCategoryPills');
  const searchInput = document.getElementById('blogSearchInput');
  const searchClearBtn = document.getElementById('blogSearchClearBtn');
  const noResultsBox = document.getElementById('blogNoResults');

  // Reader Modal Elements
  const modal = document.getElementById('blogReaderModal');
  const modalBackdrop = document.getElementById('blogModalBackdrop');
  const modalCloseBtn = document.getElementById('blogModalCloseBtn');
  const modalProgressBar = document.getElementById('blogModalProgressBar');
  const modalScrollArea = document.getElementById('blogModalScrollArea');
  const modalCategoryBadge = document.getElementById('modalCategoryBadge');
  const modalReadTime = document.getElementById('modalReadTime');
  const modalDate = document.getElementById('modalDate');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthorAvatar = document.getElementById('modalAuthorAvatar');
  const modalAuthorName = document.getElementById('modalAuthorName');
  const modalAuthorRole = document.getElementById('modalAuthorRole');
  const modalCoverImage = document.getElementById('modalCoverImage');
  const modalContentBody = document.getElementById('modalContentBody');
  const modalTagsContainer = document.getElementById('modalTagsContainer');
  const modalCopyLinkBtn = document.getElementById('modalCopyLinkBtn');
  const modalShareTwitter = document.getElementById('modalShareTwitter');
  const modalShareWhatsApp = document.getElementById('modalShareWhatsApp');

  // Helper for Category Colors
  const getCategoryStyles = (category, color) => {
    switch (color) {
      case 'pink':
        return {
          pill: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
          dot: 'bg-pink-400',
          activeBtn: 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.35)]'
        };
      case 'cyan':
        return {
          pill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
          activeBtn: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.35)]'
        };
      case 'purple':
        return {
          pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          activeBtn: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
        };
      case 'amber':
        return {
          pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          activeBtn: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.35)]'
        };
      case 'rose':
        return {
          pill: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          activeBtn: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
        };
      case 'emerald':
        return {
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          activeBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]'
        };
      default:
        return {
          pill: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          activeBtn: 'bg-purple-600 text-white'
        };
    }
  };

  // Render Categories List
  const renderCategories = () => {
    if (!categoryContainer) return;
    const categories = ['All', ...new Set(posts.map(p => p.category))];

    categoryContainer.innerHTML = categories.map(cat => {
      const count = cat === 'All' ? posts.length : posts.filter(p => p.category === cat).length;
      const isActive = cat === currentCategory;

      return `
        <button type="button" 
                data-category="${cat}"
                class="category-tab-btn px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.35)] scale-105' 
                    : 'bg-purple-950/40 text-slate-300 hover:text-white hover:bg-purple-900/40 border border-purple-800/40'
                }">
          <span>${cat}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-purple-900/60 text-slate-400'}">${count}</span>
        </button>
      `;
    }).join('');

    // Attach click handlers
    categoryContainer.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-category');
        renderCategories();
        renderArticles();
      });
    });
  };

  // Render Featured Post
  const renderFeatured = () => {
    if (!featuredMount) return;
    const featured = posts.find(p => p.isFeatured) || posts[0];
    if (!featured) return;

    const styles = getCategoryStyles(featured.category, featured.categoryColor);

    featuredMount.innerHTML = `
      <div class="glass-panel p-6 sm:p-8 lg:p-10 rounded-3xl border border-pink-500/30 bg-gradient-to-br from-purple-950/40 via-[#120e24]/70 to-[#0b0914]/90 shadow-[0_0_40px_rgba(255,0,127,0.15)] relative overflow-hidden group">
        <!-- Background Neon Ambient Glow -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-600/25 transition-all duration-500"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <!-- Image Side -->
          <div class="lg:col-span-7 overflow-hidden rounded-2xl relative shadow-2xl group-hover:shadow-[0_0_30px_rgba(255,0,127,0.3)] transition-all duration-500">
            <div class="aspect-[16/10] overflow-hidden">
              <img src="${featured.image}" 
                   alt="${featured.title}" 
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
            </div>
            <div class="absolute top-4 left-4 flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-600 text-white shadow-lg">
                <i class="bi bi-star-fill text-[10px]"></i> Editor's Spotlight
              </span>
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${styles.pill}">
                ${featured.category}
              </span>
            </div>
          </div>

          <!-- Content Side -->
          <div class="lg:col-span-5 space-y-4 sm:space-y-5">
            <div class="flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1"><i class="bi bi-calendar3 text-pink-400"></i> ${featured.date}</span>
              <span>•</span>
              <span class="flex items-center gap-1"><i class="bi bi-clock text-cyan-400"></i> ${featured.readTime}</span>
            </div>

            <h2 class="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-pink-300 transition-colors leading-tight cursor-pointer" onclick="window.VoxBlog.openArticle('${featured.id}')">
              ${featured.title}
            </h2>

            <p class="text-sm text-slate-300 leading-relaxed">
              ${featured.excerpt}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${featured.tags.map(t => `<span class="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-slate-300">#${t}</span>`).join('')}
            </div>

            <!-- Author & Read CTA -->
            <div class="flex items-center justify-between pt-4 border-t border-purple-800/40 gap-4">
              <div class="flex items-center gap-3">
                <img src="${featured.author.avatar}" alt="${featured.author.name}" class="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500">
                <div>
                  <h4 class="font-bold text-white text-xs sm:text-sm">${featured.author.name}</h4>
                  <p class="text-[11px] text-pink-400">${featured.author.role}</p>
                </div>
              </div>

              <button type="button" 
                      onclick="window.VoxBlog.openArticle('${featured.id}')"
                      class="btn-neon-primary px-5 py-2.5 text-xs sm:text-sm whitespace-nowrap shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                <span>Read Story</span>
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>

          </div>

        </div>
      </div>
    `;
  };

  // Filter Articles
  const getFilteredArticles = () => {
    return posts.filter(post => {
      // Category match
      const matchesCategory = currentCategory === 'All' || post.category === currentCategory;
      if (!matchesCategory) return false;

      // Query match
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  };

  // Render Grid Cards
  const renderArticles = () => {
    if (!gridMount) return;
    const filtered = getFilteredArticles();

    // Update count display
    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}`;
    }

    if (filtered.length === 0) {
      gridMount.innerHTML = '';
      if (noResultsBox) noResultsBox.classList.remove('hidden');
      return;
    }

    if (noResultsBox) noResultsBox.classList.add('hidden');

    gridMount.innerHTML = filtered.map(post => {
      const styles = getCategoryStyles(post.category, post.categoryColor);

      return `
        <article class="glass-panel rounded-3xl border border-purple-800/40 hover:border-pink-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(255,0,127,0.15)]">
          
          <div>
            <!-- Thumbnail Image -->
            <div class="aspect-[16/10] overflow-hidden relative cursor-pointer" onclick="window.VoxBlog.openArticle('${post.id}')">
              <img src="${post.image}" 
                   alt="${post.title}" 
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-transparent to-transparent opacity-60"></div>
              
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${styles.pill}">
                  <span class="w-1.5 h-1.5 rounded-full ${styles.dot}"></span>
                  ${post.category}
                </span>
              </div>
              <div class="absolute bottom-3 right-3">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/70 text-slate-200 backdrop-blur-md">
                  <i class="bi bi-clock text-[10px] text-cyan-400"></i> ${post.readTime}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 space-y-3">
              <div class="text-[11px] text-slate-400 flex items-center gap-2">
                <i class="bi bi-calendar-event text-pink-400"></i>
                <span>${post.date}</span>
              </div>

              <h3 class="font-display font-bold text-lg sm:text-xl text-white group-hover:text-pink-300 transition-colors line-clamp-2 cursor-pointer leading-snug" onclick="window.VoxBlog.openArticle('${post.id}')">
                ${post.title}
              </h3>

              <p class="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                ${post.excerpt}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 pt-2">
                ${post.tags.map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/40 text-slate-400 border border-purple-800/30">#${t}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- Card Footer: Author & Action -->
          <div class="px-6 pb-6 pt-2 border-t border-purple-800/30 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/60">
              <div class="overflow-hidden">
                <p class="font-bold text-white text-xs truncate">${post.author.name}</p>
                <p class="text-[10px] text-slate-400 truncate">${post.author.role}</p>
              </div>
            </div>

            <button type="button" 
                    onclick="window.VoxBlog.openArticle('${post.id}')"
                    class="text-xs font-bold text-pink-400 hover:text-white flex items-center gap-1.5 transition-colors group-hover:translate-x-1 duration-200">
              <span>Read</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>

        </article>
      `;
    }).join('');
  };

  // Open Full-Article Reader Modal
  const openArticle = (id) => {
    const post = posts.find(p => p.id === id);
    if (!post || !modal) return;

    const styles = getCategoryStyles(post.category, post.categoryColor);

    // Update URL hash for sharing
    window.location.hash = `story=${post.id}`;

    // Populate modal fields
    if (modalCategoryBadge) {
      modalCategoryBadge.textContent = post.category;
      modalCategoryBadge.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${styles.pill}`;
    }
    if (modalReadTime) modalReadTime.textContent = post.readTime;
    if (modalDate) modalDate.textContent = post.date;
    if (modalTitle) modalTitle.textContent = post.title;

    if (modalAuthorAvatar) modalAuthorAvatar.src = post.author.avatar;
    if (modalAuthorName) modalAuthorName.textContent = post.author.name;
    if (modalAuthorRole) modalAuthorRole.textContent = post.author.role;

    if (modalCoverImage) {
      modalCoverImage.src = post.image;
      modalCoverImage.alt = post.title;
    }

    if (modalContentBody) {
      modalContentBody.innerHTML = post.content;
    }

    if (modalTagsContainer) {
      modalTagsContainer.innerHTML = post.tags.map(t => `
        <span class="text-xs px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-pink-300 font-medium">
          #${t}
        </span>
      `).join('');
    }

    // Reset Progress Bar and Scroll Area
    if (modalProgressBar) modalProgressBar.style.width = '0%';
    if (modalScrollArea) modalScrollArea.scrollTop = 0;

    // Show Modal
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    // Setup share handlers
    const shareUrl = window.location.href;
    const shareText = `Check out this VibeVault article: "${post.title}"`;

    if (modalShareTwitter) {
      modalShareTwitter.onclick = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      };
    }
    if (modalShareWhatsApp) {
      modalShareWhatsApp.onclick = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
      };
    }
    if (modalCopyLinkBtn) {
      modalCopyLinkBtn.onclick = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          if (window.Toast) {
            window.Toast.neon('Article link copied to clipboard!');
          }
        }).catch(() => {
          if (window.Toast) window.Toast.info('Link ready to share!');
        });
      };
    }
  };

  // Close Modal
  const closeArticle = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    // Clear hash without jump
    if (window.location.hash.startsWith('#story=')) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  // Scroll Progress Bar Tracker
  if (modalScrollArea && modalProgressBar) {
    modalScrollArea.addEventListener('scroll', () => {
      const scrollHeight = modalScrollArea.scrollHeight - modalScrollArea.clientHeight;
      if (scrollHeight <= 0) {
        modalProgressBar.style.width = '100%';
        return;
      }
      const progress = (modalScrollArea.scrollTop / scrollHeight) * 100;
      modalProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    });
  }

  // Modal Close Events
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeArticle);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeArticle);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeArticle();
    }
  });

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        if (searchQuery.length > 0) {
          searchClearBtn.classList.remove('hidden');
        } else {
          searchClearBtn.classList.add('hidden');
        }
      }
      renderArticles();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      searchClearBtn.classList.add('hidden');
      renderArticles();
    });
  }

  // Hash Reader Trigger (e.g., #story=karaoke-birthday-party-guide)
  const checkUrlHash = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#story=')) {
      const storyId = hash.replace('#story=', '');
      openArticle(storyId);
    }
  };

  window.addEventListener('hashchange', checkUrlHash);

  // Expose global controller
  window.VoxBlog = {
    openArticle,
    closeArticle,
    setCategory: (cat) => {
      currentCategory = cat;
      renderCategories();
      renderArticles();
    }
  };

  // Initial Runs
  renderCategories();
  renderFeatured();
  renderArticles();
  checkUrlHash();
});
