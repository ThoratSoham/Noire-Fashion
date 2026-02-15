
const window = { location: { origin: '', pathname: '', search: '' }, onerror: null, supabaseClient: { auth: { getSession: () => Promise.resolve({ data: {} }), onAuthStateChange: () => {} } } };
const document = { getElementById: () => ({ addEventListener: () => {} }), querySelectorAll: () => [], addEventListener: () => {}, readyState: 'complete', CreateElement: () => ({}) };
const navigator = { clipboard: { writeText: () => Promise.resolve() } };
const Fuse = class { constructor() {} search() { return []; } };
const alert = () => {};

        // Product data (source of truth) - Full array
        const products = [
            // Full products array as before
            {
                id: 1,
                title: "Wide Leg Pants Lounge Set",
                description: "ANRABESS Women 2 Piece Outfits 2025 Fall Fashion",
                image: "https://m.media-amazon.com/images/I/61mFhuYe7AL._AC_SY741_.jpg",
                link: "https://amzn.to/3O0X5sq",
                category: "clothing",
                subCategory: "pants",
                tags: ["lounge", "set", "fall", "fashion"],
                season: "all",
                material: "cotton",
                occasion: "casual",
                price: 45.99,
                gender: "women"
            },
            {
                id: 2,
                title: "Wide Leg Sweatpants",
                description: "AUTOMET Womens Wide Leg Sweatpants Baggy Lounge Travel Pants Fall Fashion Outfits 2025 Winter Clothes Joggers",
                image: "https://m.media-amazon.com/images/I/71gugs4fQDL._AC_SY741_.jpg",
                link: "https://amzn.to/4pSNKAh",
                category: "clothing",
                subCategory: "pants",
                tags: ["sweatpants", "baggy", "travel", "joggers"],
                season: "all",
                material: "cotton",
                occasion: "casual",
                price: 29.99,
                gender: "women"
            },
            {
                id: 3,
                title: "Turtleneck Tank Tops",
                description: "Zeagoo Womens Sleeveless Mock Turtleneck Tank Tops Slim Fit Stretch Ribbed Tops Casual Basic Layering Shirts",
                image: "https://m.media-amazon.com/images/I/71lLX48N1EL._AC_SX569_.jpg",
                link: "https://amzn.to/45Z4zCs",
                category: "clothing",
                subCategory: "tops",
                tags: ["turtleneck", "tank", "slim", "ribbed"],
                season: "all",
                material: "cotton",
                occasion: "casual",
                price: 19.99,
                gender: "women"
            },
            {
                id: 4,
                title: "Trench Coat",
                description: "SOMTHRON Men's Casual Trench Coat Slim Fit Notched Collar Long Jacket Overcoat Single Breasted Pea Coat wih Pockets",
                image: "https://m.media-amazon.com/images/I/71FqcvjgkNL._AC_SX679_.jpg",
                link: "https://amzn.to/49JT2Ic",
                category: "clothing",
                subCategory: "jacket",
                tags: ["trench", "coat", "slim", "notched"],
                season: "all",
                material: "cotton",
                occasion: "casual",
                price: 59.99,
                gender: "men"
            },
            {
                id: 5,
                title: "Men's Winter Jacket",
                description: "TACVASEN Men's Winter Jacket Corduroy Warm Fleece Sherpa Lined Jacket Casual Lapel Work Trucker Coat with Multi Pockets",
                image: "https://m.media-amazon.com/images/I/71ygrjVLdJL._AC_SX569_.jpg",
                link: "https://amzn.to/3ZsHNiH",
                category: "clothing",
                subCategory: "jacket",
                tags: ["winter", "corduroy", "fleece", "sherpa"],
                season: "winter",
                material: "corduroy",
                occasion: "casual",
                price: 49.99,
                gender: "men"
            },
            {
                id: 6,
                title: "G-Shock Casio Octagonal Watch",
                description: "G-Shock Casio Metal Covered Octagonal Black Resin Band Watch GM2100-1A",
                image: "https://m.media-amazon.com/images/I/812fkCn8F9L._AC_SL1500_.jpg",
                link: "https://amzn.to/4sXZYuf",
                category: "accessories",
                subCategory: "watch",
                tags: ["g-shock", "casio", "octagonal", "resin"],
                season: "all",
                material: "resin",
                occasion: "casual",
                price: 129.99,
                gender: "unisex"
            },
            {
                id: 7,
                title: "Mens Knit Polo Shirts",
                description: "COOFANDY Mens Knit Polo Shirts Short Sleeve Ribbed Textured Polo Shirt Lightweight Casual Golf Shirts Collared T Shirt",
                image: "https://m.media-amazon.com/images/I/81lXGiA3PNL._AC_SX569_.jpg",
                link: "https://amzn.to/4sXAtZT",
                category: "clothing",
                subCategory: "shirt",
                tags: ["knit", "polo", "ribbed", "golf"],
                season: "all",
                material: "cotton",
                occasion: "casual",
                price: 25.99,
                gender: "men"
            },
            {
                id: 8,
                title: "TACVASEN Men's Lightweight Bomber Jacket",
                description: "TACVASEN Men's Lightweight Casual Bomber Jacket — Spring/Fall Windbreaker with Full Zipper, Stand Collar, and Comfortable Soft Material for Everyday Wear",
                image: "https://m.media-amazon.com/images/I/71rNJdgvB1L._AC_SX679_.jpg",
                link: "https://amzn.to/49DAElE",
                category: "clothing",
                subCategory: "jacket",
                tags: ["lightweight", "bomber", "windbreaker", "casual"],
                season: "spring",
                material: "polyester",
                occasion: "casual",
                price: 35.98,
                gender: "men"
            },
            {
                id: 9,
                title: "Casio Classic Quartz Men's Watch",
                description: "Casio Classic Quartz Analog Wristwatch for Men — Everyday Casual & Timeless Design with Reliable Quartz Movement, Durable Build, and Water Resistance",
                image: "https://m.media-amazon.com/images/I/51DuIbRU7JL._AC_SX522_.jpg",
                link: "https://amzn.to/4bRiE8N",
                category: "accessories",
                subCategory: "watch",
                tags: ["quartz", "analog", "classic", "casual"],
                season: "all",
                material: "metal & resin",
                occasion: "everyday",
                price: 27.25,
                gender: "men"
            },
            {
                id: 10,
                title: "FULLRON Men's Winter Warm Scarf",
                description: "FULLRON Men's Winter Warm Scarf — Soft, Long, Cashmere-Feel Winter Neck Scarf That Keeps You Warm and Comfortable in Cold Weather",
                image: "https://m.media-amazon.com/images/I/51Z1rPNKXdL._AC_SY741_.jpg",
                link: "https://amzn.to/45we0t0",
                category: "clothing",
                subCategory: "accessory",
                tags: ["winter", "scarf", "warm", "soft", "cashmere feel"],
                season: "winter",
                material: "soft cashmere-feel fabric",
                occasion: "cold weather",
                price: 11.99,
                gender: "men"
            },
            {
                id: 11,
                title: "SISKIN Women's Ribbed Long Sleeve Pullover Sweater",
                description: "SISKIN Women's Ribbed Knit Pullover Sweater — Long Sleeve, Comfortable Fit, Stylish Casual Top Perfect for Fall & Winter Outfit Pairing",
                image: "https://m.media-amazon.com/images/I/716rrd0nH6L._AC_SY741_.jpg",
                link: "https://amzn.to/4r7fvpH",
                category: "clothing",
                subCategory: "sweater",
                tags: ["ribbed", "pullover", "long sleeve", "knit"],
                season: "all",
                material: "knit fabric",
                occasion: "casual",
                price: 36.99,
                gender: "women"
            },
            {
                id: 12,
                title: "Oversized T Shirt for Women",
                description: "Amazon Essentials Women's Lightweight Longer Length Open-Front Cardigan Sweater — Cozy long-sleeve knit cardigan with a relaxed fit and versatile style, perfect for layering in spring, fall & winter.",
                image: "https://m.media-amazon.com/images/I/61DkIsZYPOL._SY879_.jpg",
                link: "https://amzn.to/469MB0c",
                category: "clothing",
                subCategory: "cardigan",
                tags: ["lightweight", "open front", "long sleeve", "knit"],
                season: "all",
                material: "cotton blend knit",
                occasion: "casual",
                price: 4.99,
                gender: "women"
            },
            {
                id: 13,
                title: "GRECIILOOKS Oversized Shirt for Women",
                description: "GRECIILOOKS Women's Stylish Long Shirt — A trendy Korean-style button-down top featuring an oversized fit and lightweight crepe fabric. This versatile piece works perfectly as professional office wear or a relaxed casual top for daily outings.",
                image: "https://m.media-amazon.com/images/I/61dsZfNbDKL._SY879_.jpg",
                link: "https://amzn.to/45IPTYd",
                category: "clothing",
                subCategory: "shirt",
                tags: ["oversized", "korean style", "button down", "breathable", "western wear"],
                season: "all",
                material: "crepe",
                occasion: "casual / office",
                price: 4.99,
                gender: "women"
            },
            {
                id: 14,
                title: "Women's Tie-Dye Pajama Set",
                description: "SMOWKLY Relaxed Fit Sleepwear — A trendy Korean-style lounge set featuring a soft short-sleeve top and matching long pants with functional pockets. Designed for ultimate comfort, this breathable tie-dye set is ideal for both sleeping and all-day lounging.",
                image: "https://m.media-amazon.com/images/I/51lBSIuGIiL.jpg",
                link: "https://amzn.to/3ZJ4AHa",
                category: "clothing",
                subCategory: "nightwear",
                tags: ["tie-dye", "relaxed fit", "pajama set", "loungewear", "korean style"],
                season: "all",
                material: "soft cotton blend",
                occasion: "sleepwear / lounging",
                price: 7.99,
                gender: "women"
            },
            {
                id: 15,
                title: "Women's Front Open Floral Printed Shrug",
                description: "TOPLOT Lightweight Floral Shrug — A breezy, front-open layer crafted from soft chiffon. This versatile regular-fit top features a bohemian floral print, making it an ideal choice for a beach cover-up, a boho-chic outfit, or a casual layer over jeans and a tank top.",
                image: "https://m.media-amazon.com/images/I/81z2CdAtmLL._SY879_.jpg",
                link: "https://amzn.to/4c2LnHO",
                category: "clothing",
                subCategory: "shrug",
                tags: ["floral print", "front open", "chiffon", "boho vibes", "beachwear"],
                season: "summer",
                material: "chiffon / georgette",
                occasion: "casual / beach",
                price: 4.99,
                gender: "women"
            },
            {
                id: 16,
                title: "Men's Polycotton Textured Half Sleeve Shirt",
                description: "GRECIILOOKS Men's Polycotton Shirt — A stylish regular-fit textured half-sleeve shirt made from durable polycotton fabric. Comfortable enough for daily wear and polished enough for office, parties, meetings, and casual outings.",
                image: "https://m.media-amazon.com/images/I/81Z60TWdX4L._SY879_.jpg",
                link: "https://amzn.to/3LWu9kV",
                category: "clothing",
                subCategory: "shirt",
                tags: ["men shirt", "half sleeve", "textured", "polycotton", "casual wear", "office wear"],
                season: "all",
                material: "polycotton",
                occasion: "casual / office / party",
                price: 4.99,
                gender: "men"
            },
            {
                id: 17,
                title: "Men and Boys Super Oversized Embroidered Cotton T-Shirt",
                description: "Potter: The Silent Vow off-white super oversized T-shirt featuring subtle embroidery. Made from soft cotton, designed for casual streetwear comfort with a relaxed, modern fit.",
                image: "https://m.media-amazon.com/images/I/61SZDllAZjL._SY879_.jpg",
                link: "https://amzn.to/4kaOOhH",
                category: "clothing",
                subCategory: "t-shirt",
                tags: ["oversized t-shirt", "streetwear", "embroidered", "round neck", "short sleeves", "cotton"],
                season: "all",
                material: "cotton",
                occasion: "casual / streetwear",
                price: 13.99,
                gender: "men"
            },
            {
                id: 18,
                title: "Men and Boys Oversized Cotton Linen Bomber Jacket",
                description: "The Souled Store Dune lightweight bomber jacket made from a breathable cotton-linen blend. Features a solid design with full sleeves, band neck, and oversized fit, ideal for casual summer streetwear.",
                image: "https://m.media-amazon.com/images/I/51LUZGjutyL._SY879_.jpg",
                link: "https://amzn.to/4bwkQTg",
                category: "clothing",
                subCategory: "jacket",
                tags: ["bomber jacket", "cotton linen", "oversized fit", "streetwear", "lightweight", "summer wear"],
                season: "summer",
                material: "cotton linen",
                occasion: "casual / streetwear",
                price: 23.99,
                gender: "men"
            },
            {
                id: 19,
                title: "Men's Stand-Up Collar Zip-Up Sweatshirt",
                description: "PROSHARX old money aesthetic zip-up sweatshirt featuring a stand-up collar. Designed for premium comfort with a timeless, minimal look suitable for casual and smart streetwear styling.",
                image: "https://m.media-amazon.com/images/I/71PX49awLjL._SX679_.jpg",
                link: "https://amzn.to/3M8LSpb",
                category: "clothing",
                subCategory: "sweatshirt",
                tags: ["zip up sweatshirt", "stand up collar", "old money style", "minimal aesthetic", "casual wear"],
                season: "all",
                material: "cotton blend",
                occasion: "casual / streetwear",
                price: 19.99,
                gender: "men"
            },
            {
                id: 20,
                title: "Vintage Small Rectangle Metal Frame Sunglasses",
                description: "Karsaer vintage-inspired small rectangle sunglasses with a retro square metal frame. Designed for both men and women, offering a trendy unisex look suitable for everyday fashion styling.",
                image: "https://m.media-amazon.com/images/I/71qgi893hdL._SX679_.jpg",
                link: "https://amzn.to/3M8MGud",
                category: "accessories",
                subCategory: "sunglasses",
                tags: ["vintage sunglasses", "rectangle frame", "metal frame", "retro style", "unisex eyewear"],
                season: "all",
                material: "metal",
                occasion: "casual / fashion",
                price: 16.99,
                gender: "unisex"
            },
            {
                id: 21,
                title: "Vintage Rectangular Rimless Sunglasses",
                description: "IFLASH retro-style rectangular rimless sunglasses with a gold frame and grey lenses. Designed for men and women, offering a stylish vintage look for everyday fashion wear.",
                image: "https://m.media-amazon.com/images/I/61Kg4i5JwqL._SY879_.jpg",
                link: "https://amzn.to/4t9A1YC",
                category: "accessories",
                subCategory: "sunglasses",
                tags: ["vintage sunglasses", "rectangular sunglasses", "rimless", "retro style", "unisex eyewear"],
                season: "all",
                material: "metal",
                occasion: "casual / fashion",
                price: 3.99,
                gender: "unisex"
            },
            {
                id: 22,
                title: "Shasmi Women's 3-Piece Co-ord Set",
                description: "Shasmi women's western-style 3-piece co-ord set featuring a solid button-front shirt, strapless tube top, and wide-leg pants. Designed with a loose, comfortable fit, ideal for casual daily wear during spring and fall seasons.",
                image: "https://m.media-amazon.com/images/I/71O2arvsWvL._SY879_.jpg",
                link: "https://amzn.to/4qhX40V",
                category: "clothing",
                subCategory: "co-ord sets",
                tags: ["women co-ord set", "3-piece outfit", "western wear", "casual outfit", "loose fit", "spring fall wear"],
                season: "spring",
                material: "fabric",
                occasion: "casual / daily wear",
                price: 8.99,
                gender: "women"
            },
            {
                id: 23,
                title: "Symbol Premium Women's Solid Sleeveless Wrap Top",
                description: "Symbol Premium women's solid sleeveless wrap top designed in a regular fit, perfect for desk-to-dinner wear. A versatile and elegant piece suitable for office, casual outings, and evening looks. Available in inclusive plus sizes.",
                image: "https://m.media-amazon.com/images/I/71KM6xBLS7L._SY879_.jpg",
                link: "https://amzn.to/4kghcPp",
                category: "clothing",
                subCategory: "tops",
                tags: ["women wrap top", "sleeveless top", "office wear", "desk to dinner", "solid top", "plus size clothing"],
                season: "all",
                material: "fabric",
                occasion: "office / casual / evening wear",
                price: 9.99,
                gender: "women"
            },
            {
                id: 24,
                title: "Istyle Can Women's Slim Fit Solid Rib Knit Stretchable Top",
                description: "Istyle Can women's slim-fit solid rib-knit top featuring a round neck and short sleeves. Made with high-stretch, comfortable fabric, this plain fitted T-shirt is suitable for casual wear as well as office styling. Designed as a regular top for girls and women.",
                image: "https://m.media-amazon.com/images/I/61MrkcD2y3L._SX679_.jpg",
                link: "https://amzn.to/4qTY10h",
                category: "clothing",
                subCategory: "tops",
                tags: ["women slim fit top", "rib knit top", "stretchable t-shirt", "round neck tee", "office casual wear", "plain fitted top"],
                season: "all",
                material: "rib knit fabric",
                occasion: "casual / office wear",
                price: 2.99,
                gender: "women"
            },
            {
                id: 25,
                title: "Women's Long Sleeve Bow Tie Neck Chiffon Blouse",
                description: "Elegant women's long-sleeve blouse crafted from lightweight chiffon fabric, featuring a bow-tie neck and V-neck design. Styled in a relaxed Korean-inspired fit, this blouse is ideal for polished office wear and sophisticated everyday looks. Available in pink and white color options.",
                image: "https://m.media-amazon.com/images/I/51HyyoAsG2L.jpg",
                link: "https://amzn.to/4byZ7Kk",
                category: "clothing",
                subCategory: "blouses",
                tags: ["women chiffon blouse", "bow tie neck top", "korean style blouse", "office wear shirt", "elegant women top", "long sleeve blouse"],
                season: "all",
                material: "chiffon",
                occasion: "office / formal / casual",
                price: 4.99,
                gender: "women"
            },
            {
                id: 26,
                title: "Butterfly Metal Hair Clip",
                description: "Stylish butterfly-shaped metal hair clip designed for women and girls. Durable claw clip construction provides a secure hold while adding an elegant and trendy touch to everyday hairstyles.",
                image: "https://m.media-amazon.com/images/I/51kSNS4AOnL.jpg",
                link: "https://amzn.to/3ZJKg8C",
                category: "accessories",
                subCategory: "hair accessories",
                tags: ["butterfly hair clip", "metal hair clip", "claw clip", "hair accessories for women", "hair accessories for girls"],
                season: "all",
                material: "metal",
                occasion: "casual / daily wear",
                price: 1.99,
                gender: "women"
            }
        ];


        // Global Error Handler for debugging
        window.onerror = function (msg, url, line, col, error) {
            const container = document.getElementById('error-container');
            if (container) {
                container.style.display = 'block';
                container.innerHTML += `<p>Error: ${msg} <br> <small>Line: ${line}</small></p>`;
            }
            console.error('Global error:', msg, error);
            return false;
        };

        // Fuse.js for fuzzy search
        const fuseOptions = {
            keys: [
                { name: 'title', weight: 0.3 },
                { name: 'description', weight: 0.2 },
                { name: 'tags', weight: 0.2 },
                { name: 'category', weight: 0.15 },
                { name: 'subCategory', weight: 0.15 }
            ],
            threshold: 0.4,
            includeScore: true
        };

        let fuse;
        try {
            if (typeof Fuse !== 'undefined') {
                fuse = new Fuse(products, fuseOptions);
            } else {
                console.warn('Fuse.js not loaded - Search will fallback to simple matching');
                const errContainer = document.getElementById('error-container');
                if (errContainer) {
                    errContainer.style.display = 'block';
                    errContainer.innerText = 'Warning: Search functionality reduced (dependency missing).';
                }
            }
        } catch (e) {
            console.error('Error initializing Fuse:', e);
        }

        // Render products with Add to Cart button
        function renderProducts(list) {
            const grid = document.getElementById("product-grid");
            if (!grid) {
                console.error('product-grid element not found');
                return;
            }

            console.log('Rendering', list.length, 'products');
            grid.innerHTML = "";

            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('product');
            let productsToShow = list;

            if (productId) {
                const singleProduct = list.find(p => p.id == productId);
                if (singleProduct) {
                    productsToShow = [singleProduct];
                }
            }

            if (!productsToShow.length) {
                console.warn('No products to show');
                grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;">No products found.</p>`;
                return;
            }

            console.log('Displaying', productsToShow.length, 'products');

            productsToShow.forEach(p => {
                const card = document.createElement("div");
                card.className = "product-card";

                const siteLink = `${window.location.origin}${window.location.pathname}?product=${p.id}`;

                let isInCart = false;
                if (typeof cart !== 'undefined' && cart.isSaved) {
                    try {
                        isInCart = cart.isSaved(p.id);
                    } catch (e) {
                        console.warn('Error checking cart status:', e);
                    }
                }

                card.innerHTML = `
                    <img src="${p.image}" alt="${p.title}">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="price">$${p.price}</div>
                    <a href="${p.link}" target="_blank" class="amazon-button">View on Amazon</a>
                    <button class="share-button" data-link="${siteLink}">Share</button>
                    <button class="add-to-cart-button ${isInCart ? 'added' : ''}" data-id="${p.id}" ${isInCart ? 'disabled' : ''}>${isInCart ? 'Added to Cart' : 'Add to Cart'}</button>
                `;

                grid.appendChild(card);
            });

            // Share button functionality
            document.querySelectorAll(".share-button").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const link = e.target.getAttribute("data-link");
                    navigator.clipboard.writeText(link).then(() => {
                        e.target.textContent = "Copied!";
                        setTimeout(() => { e.target.textContent = "Share"; }, 1500);
                    });
                });
            });

            // Add to Cart button functionality

            document.querySelectorAll(".add-to-cart-button").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const id = parseInt(e.target.dataset.id);
                    if (auth.isLoggedIn) {
                        // Direct add for logged-in users
                        try {
                            await cart.add(id);
                            renderProducts(products);  // Re-render to update button state
                            alert('Product added to your cart!');  // Add success message
                        } catch (err) {
                            alert('Something didn’t work. Please try again.');
                        }
                    } else {
                        // Show login modal for non-logged-in users, then add product
                        auth.showModal(async () => {
                            await cart.add(id);
                            renderProducts(products);
                            alert('Product added to your cart!');  // Add success message here
                        });
                    }
                });
            });


            // Initial render - wait for DOM to be ready
            function startApp() {
                console.log('Starting app...');
                console.log('window.supabaseClient:', window.supabaseClient);
                console.log('auth:', typeof auth);
                console.log('cart:', typeof cart);
                console.log('profile:', typeof profile);

                renderProducts(products);

                if (typeof auth !== 'undefined') {
                    console.log('Initializing auth...');
                    auth.init();
                } else {
                    console.warn('auth not loaded yet');
                }

                if (typeof cart !== 'undefined') {
                    console.log('Fetching cart...');
                    cart.fetch().then(() => {
                        console.log('Cart fetched successfully');
                        renderProducts(products);
                    }).catch(err => {
                        console.warn('Cart fetch failed:', err);
                    });
                }

                if (typeof profile !== 'undefined') {
                    console.log('Loading profile...');
                    profile.load();
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startApp);
            } else {
                startApp();
            }

            // Helper function
            function getCheckedValues(selector) {
                return Array.from(document.querySelectorAll(selector + ":checked"))
                    .map(cb => cb.value);
            }

            // Apply filters
            function applyFilters() {
                const searchInputEl = document.getElementById("search-input");
                const queryRaw = searchInputEl.value.toLowerCase().trim();

                let genderFromText = null;
                if (/\bmen\b/.test(queryRaw)) genderFromText = "men";
                if (/\bwomen\b|\bwoman\b/.test(queryRaw)) genderFromText = "women";

                const cleanQuery = queryRaw.replace(/\bmen\b|\bwomen\b|\bwoman\b/g, "").trim();

                const seasons = getCheckedValues(".filter-season");
                const genders = getCheckedValues(".filter-gender");
                const categories = getCheckedValues(".filter-category");

                let results = [...products];

                // Gender filter
                if (genderFromText) {
                    results = results.filter(p => p.gender === genderFromText || p.gender === "unisex");
                } else if (genders.length) {
                    results = results.filter(p => genders.includes(p.gender));
                }

                // Season filter
                if (seasons.length) {
                    results = results.filter(p => seasons.includes(p.season) || p.season === "all");
                }

                // Category filter
                if (categories.length) {
                    results = results.filter(p => categories.includes(p.category));
                }

                // Search


                // Search
                if (cleanQuery.length) {
                    if (typeof Fuse !== 'undefined' && fuse) {
                        const localFuse = new Fuse(results, fuseOptions);
                        results = localFuse.search(cleanQuery).map(r => r.item);
                    } else {
                        // Fallback simple search
                        results = results.filter(p =>
                            p.title.toLowerCase().includes(cleanQuery) ||
                            p.description.toLowerCase().includes(cleanQuery)
                        );
                    }
                }

                renderProducts(results);
            }

            // Events
            try {
                document.getElementById("search-button").addEventListener("click", applyFilters);
            } catch (e) {
                console.warn('search-button not found:', e);
            }

            try {
                document.getElementById("search-input").addEventListener("input", applyFilters);
            } catch (e) {
                console.warn('search-input not found:', e);
            }

            try {
                document.querySelectorAll(".filter-season, .filter-gender, .filter-category")
                    .forEach(cb => cb.addEventListener("change", applyFilters));
            } catch (e) {
                console.warn('filter checkboxes error:', e);
            }

            // Mobile filter drawer
            try {
                const filterToggle = document.getElementById("filter-toggle");
                const drawer = document.getElementById("filters-drawer");
                const overlay = document.getElementById("overlay");

                if (filterToggle && drawer && overlay) {
                    filterToggle.addEventListener("click", () => {
                        drawer.classList.add("open");
                        overlay.classList.add("show");
                    });

                    overlay.addEventListener("click", () => {
                        drawer.classList.remove("open");
                        overlay.classList.remove("show");
                    });
                } else {
                    console.warn('Filter drawer elements not found');
                }
            } catch (e) {
                console.warn('Filter drawer setup error:', e);
            }
        }
    