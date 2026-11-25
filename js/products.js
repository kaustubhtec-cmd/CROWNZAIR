// REBELLION Streetwear — Complete Multi-Colorway Catalog Data
// 4 Main Categories x 3 Thematic Sub-Collections | All prices in INR (₹)

window.REBELLION_DATA = {
  categories: [
    {
      id: "hoodies",
      name: "Hoodies",
      tagline: "460 GSM Oversized Heavyweight Fleece",
      count: 4,
      accent: "#FF5E1A",
      heroImg: "assets/products/hoodie-jatayu-black-back.webp",
      altImg: "assets/products/hoodie-falcon-saffron-front.webp"
    },
    {
      id: "jackets",
      name: "Jackets",
      tagline: "Multi-Pocket Water-Repellent Tactical Shells",
      count: 9,
      accent: "#E11D48",
      heroImg: "assets/products/jacket-rudra-black-back.webp",
      altImg: "assets/products/jacket-falcon-crimson-back.webp"
    },
    {
      id: "joggers",
      name: "Joggers",
      tagline: "Utility Buckle Strap Streetwear Cargos",
      count: 3,
      accent: "#10B981",
      heroImg: "assets/products/joggers-botanical-navy-back.webp",
      altImg: "assets/products/joggers-heritage-black-back.webp"
    },
    {
      id: "sneakers",
      name: "Sneakers",
      tagline: "Sculpted Chunky Sole Art-Printed Kicks",
      count: 3,
      accent: "#D4AF37",
      heroImg: "assets/products/sneakers-trishul-black-pair.webp",
      altImg: "assets/products/sneakers-shogun-navy-pair.webp"
    }
  ],

  themes: [
    {
      id: "indian-traditional",
      index: "01",
      name: "Indian Traditional Prints",
      shortName: "Indian Heritage",
      subtitle: "Mythology, Temple Filigree & Royal Motifs",
      description:
        "Reimagining millennia of Indian artistry — from Jatayu & Rudra Tandava chronicles to Mandala, Madhubani, Kalamkari, and sacred temple geometry — engineered onto heavyweight modern streetwear silhouettes.",
      accent: "#FF5E1A",
      bgGradient: "radial-gradient(circle at 65% 35%, rgba(255, 94, 26, 0.34), rgba(180, 60, 12, 0.14) 45%, #070709 82%)",
      tags: ["Mythology", "Mandala", "Madhubani", "Kalamkari", "Temple Gold"],
      featuredImg: "assets/products/jacket-rudra-black-back.webp",
      secondaryImg: "assets/products/hoodie-jatayu-black-back.webp",
      sneakerImg: "assets/products/sneakers-trishul-black-side.webp"
    },
    {
      id: "anime-japanese",
      index: "02",
      name: "Anime & Japanese Theme",
      shortName: "Anime & Japanese",
      subtitle: "Ukiyo-e Waves, Oni Masks & Cyberpunk Tokyo",
      description:
        "High-voltage Japanese street culture meets razor-sharp manga energy — featuring sumi-e ink dragons, Oni masks, Kanji calligraphy, Ukiyo-e swells, and iconic shonen tactical outerwear.",
      accent: "#E11D48",
      bgGradient: "radial-gradient(circle at 65% 35%, rgba(225, 29, 72, 0.34), rgba(37, 99, 235, 0.18) 48%, #070709 84%)",
      tags: ["Ukiyo-e", "Oni Masks", "Shinobi", "Kanji Ink", "Cyber Tokyo"],
      featuredImg: "assets/products/jacket-goku-navy-back.webp",
      secondaryImg: "assets/products/hoodie-dragon-navy-back.webp",
      sneakerImg: "assets/products/sneakers-shogun-black-side.webp"
    },
    {
      id: "animal-nature",
      index: "03",
      name: "Animal & Nature Prints",
      shortName: "Animal & Nature",
      subtitle: "Apex Wildlife, Alpine Peaks & Botanical Ink",
      description:
        "Untamed predatory graphics and earth-toned organic patterns — soaring falcons, roaring alpha lions, nocturnal pine mountains, neon rainforest vines, and bioluminescent ocean waves.",
      accent: "#10B981",
      bgGradient: "radial-gradient(circle at 65% 35%, rgba(16, 185, 129, 0.30), rgba(234, 88, 12, 0.15) 48%, #070709 84%)",
      tags: ["Apex Falcon", "Alpha Lion", "Botanical", "Alpine Forest", "Earth Tones"],
      featuredImg: "assets/products/jacket-lion-saffron-back.webp",
      secondaryImg: "assets/products/joggers-botanical-green-back.webp",
      sneakerImg: "assets/products/sneakers-wilderness-green-side.webp"
    }
  ],

  // Hero Stage slides — Video 1 ("Stand out Without trying") color-morphing showcase
  heroSlides: [
    {
      productId: "hoodie-falcon",
      colorIndex: 0,
      eyebrow: "DROP 01 // ANIMAL & NATURE × JAPANESE INK",
      headline: "STAND OUT WITHOUT TRYING.",
      copy: "460 GSM heavyweight brushed fleece fused with bold falcon ink artwork, mountain pagodas, and crisp urban proportions built for Indian streets.",
      tagline: "Confidence, wrapped in heritage.",
      bgRadial: "radial-gradient(circle at 52% 46%, #c2410c 0%, #7c2d12 36%, #180b06 76%, #070709 100%)",
      accent: "#FF5E1A"
    },
    {
      productId: "hoodie-jatayu",
      colorIndex: 0,
      eyebrow: "DROP 01 // INDIAN TRADITIONAL HERITAGE",
      headline: "MYTHOLOGY REBORN IN STREETWEAR.",
      copy: "Gold-foil Jatayu vs Ravana epic back tapestry on pitch-black 460 GSM French terry. Royal heritage meets uncompromising urban edge.",
      tagline: "Ancient valor. Modern armor.",
      bgRadial: "radial-gradient(circle at 52% 46%, #785513 0%, #3d2a09 36%, #141009 76%, #070709 100%)",
      accent: "#D4AF37"
    },
    {
      productId: "jacket-lion",
      colorIndex: 1,
      eyebrow: "DROP 01 // ALPHA TACTICAL OUTERWEAR",
      headline: "ENGINEERED FOR THE CONCRETE JUNGLE.",
      copy: "Multi-pocket ripstop tactical jacket with buckle cargo hardware and fierce apex lion brush-ink artwork across the back.",
      tagline: "Built to dominate every frame.",
      bgRadial: "radial-gradient(circle at 52% 46%, #9f1239 0%, #580b1f 36%, #17060a 76%, #070709 100%)",
      accent: "#E11D48"
    },
    {
      productId: "jacket-goku",
      colorIndex: 1,
      eyebrow: "DROP 01 // ANIME & JAPANESE ARCHIVE",
      headline: "UNLEASH HIGH-VOLTAGE ANIME ENERGY.",
      copy: "Cobalt-aura tactical streetwear shell with metallic Kanji crest, four buckled front utility pockets, and ultra-vivid back illustration.",
      tagline: "Tokyo nights. Rebellion DNA.",
      bgRadial: "radial-gradient(circle at 52% 46%, #1d4ed8 0%, #102a71 36%, #070d1e 76%, #070709 100%)",
      accent: "#3B82F6"
    },
    {
      productId: "hoodie-dragon",
      colorIndex: 1,
      eyebrow: "DROP 01 // SHINOBI DRAGON SERIES",
      headline: "INK, SHADOW & BLOOD MOON CRAFT.",
      copy: "Forest emerald heavyweight hoodie wrapped in sumi-e coiled dragon sleeves, sakura petals, and a towering blood-moon shinobi back canvas.",
      tagline: "Silent craft. Loud presence.",
      bgRadial: "radial-gradient(circle at 52% 46%, #065f46 0%, #06382a 36%, #061410 76%, #070709 100%)",
      accent: "#10B981"
    }
  ],

  // Video 3 Triple-Stripe Sneaker Showcase Slides
  sneakerSpotlight: [
    {
      productId: "sneakers-trishul",
      colorIndex: 0,
      title: "TRISHUL FLAME",
      subtitle: "INDIAN TRADITIONAL // HIGH-TOP",
      description: "Obsidian leather high-tops ignited with molten tiger & golden Trishul motifs, metallic tactical ankle buckles, and sculpted all-terrain soles.",
      stripeColor: "#FF5E1A",
      stripeGlow: "rgba(255, 94, 26, 0.45)",
      image: "assets/products/sneakers-trishul-black-side.webp",
      thumb: "assets/products/sneakers-trishul-black-side.webp",
      price: 5999
    },
    {
      productId: "sneakers-shogun",
      colorIndex: 0,
      title: "SHOGUN ONI",
      subtitle: "ANIME & JAPANESE // HIGH-TOP",
      description: "Matte jet-black tactical silhouette armed with electric crimson Oni mask print, rising sun rays, Kanji heel tags, and cushioned phylon midsoles.",
      stripeColor: "#E11D48",
      stripeGlow: "rgba(225, 29, 72, 0.45)",
      image: "assets/products/sneakers-shogun-black-side.webp",
      thumb: "assets/products/sneakers-shogun-black-side.webp",
      price: 5799
    },
    {
      productId: "sneakers-shogun",
      colorIndex: 1,
      title: "UKIYOE WAVE",
      subtitle: "ANIME & JAPANESE // HIGH-TOP",
      description: "Deep indigo & ice-white sneaker wrapped in iconic Hokusai Great Wave crests with brushed steel quick-release ankle hardware.",
      stripeColor: "#2563EB",
      stripeGlow: "rgba(37, 99, 235, 0.45)",
      image: "assets/products/sneakers-shogun-navy-side.webp",
      thumb: "assets/products/sneakers-shogun-navy-side.webp",
      price: 5799
    },
    {
      productId: "sneakers-wilderness",
      colorIndex: 3,
      title: "RAINFOREST APEX",
      subtitle: "ANIME & NATURE // TRAIL KICKS",
      description: "Deep botanical forest green upper with lime monstera foliage, antique brass tactical buckles, and speckled trail-grip outsoles.",
      stripeColor: "#10B981",
      stripeGlow: "rgba(16, 185, 129, 0.45)",
      image: "assets/products/sneakers-wilderness-green-side.webp",
      thumb: "assets/products/sneakers-wilderness-green-side.webp",
      price: 4999
    },
    {
      productId: "sneakers-trishul",
      colorIndex: 1,
      title: "IVORY LOTUS",
      subtitle: "INDIAN TRADITIONAL // HIGH-TOP",
      description: "Crisp arctic white architectural high-tops etched in monochrome temple domes, blooming sacred lotus mandalas, and soaring peacock art.",
      stripeColor: "#D4AF37",
      stripeGlow: "rgba(212, 175, 55, 0.45)",
      image: "assets/products/sneakers-trishul-white-side.webp",
      thumb: "assets/products/sneakers-trishul-white-side.webp",
      price: 5999
    },
    {
      productId: "sneakers-wilderness",
      colorIndex: 2,
      title: "TSUNAMI PULSE",
      subtitle: "ANIMAL & NATURE // TRAIL KICKS",
      description: "Electric ocean-wave graphics across deep marine blue tactical mesh with double-lock straps and shock-absorbing sculpted soles.",
      stripeColor: "#06B6D4",
      stripeGlow: "rgba(6, 182, 212, 0.45)",
      image: "assets/products/sneakers-wilderness-navy-side.webp",
      thumb: "assets/products/sneakers-wilderness-navy-side.webp",
      price: 4999
    }
  ],

  // Video 2 Exploded 3D Tech Layers
  craftLayers: [
    {
      id: "shell",
      num: "01",
      title: "460 GSM / RIPSTOP OUTER SHELL",
      subtitle: "WEATHER-RESISTANT ARMOR",
      detail: "Heavyweight combed French terry for hoodies & DWR-coated micro-ripstop nylon for tactical jackets that hold boxy architectural drape wash after wash.",
      accent: "#FF5E1A"
    },
    {
      id: "ink",
      num: "02",
      title: "HD ARTWORK & PUFF INK MATRIX",
      subtitle: "ZERO-CRACK PIGMENT BOND",
      detail: "Ultra-high-definition direct-to-garment & metallic puff inks cured at 180°C so every Indian Mandala line, Kanji stroke, and wildlife texture stays razor-sharp.",
      accent: "#D4AF37"
    },
    {
      id: "core",
      num: "03",
      title: "BREATHABLE THERMAL COMFORT CORE",
      subtitle: "ALL-CLIMATE INDIAN STREET FIT",
      detail: "Moisture-wicking brushed interior lining engineered for evening rides, studio sessions, and monsoon breezes without overheating.",
      accent: "#3B82F6"
    },
    {
      id: "hardware",
      num: "04",
      title: "TACTICAL BUCKLES & REINFORCED SEAMS",
      subtitle: "BUILT TO OUTLAST TRENDS",
      detail: "Anodized matte alloy buckles, heavy-gauge zippers, ribbed 2x2 retention cuffs, and double-needle lockstitching on every stress point.",
      accent: "#10B981"
    }
  ],

  // ALL 19 PRODUCTS (4 Categories x 3 Sub-Sections, Multi-Colorway!)
  products: [
    // ======================== HOODIES ========================
    {
      id: "hoodie-jatayu",
      dropNo: "01",
      name: "Jatayu vs Ravana Mythology Hoodie",
      category: "hoodies",
      theme: "indian-traditional",
      price: 3299,
      mrp: 4499,
      badge: "BEST SELLER",
      featured: true,
      rating: 4.9,
      reviews: 184,
      fabric: "460 GSM 100% Combed Heavyweight Cotton French Terry. Drop-shoulder boxy streetwear cut with double-lined hood & metallic lace tips.",
      care: "Cold gentle machine wash inside-out. Do not bleach or iron directly over metallic artwork. Dry flat in shade.",
      description: "An iconic tribute to Indian epic valor — featuring a bold Om chest emblem, calligraphy sleeve scrolls, and a breathtaking full-back engraving of Jatayu clashing with Ravana above ancient cliffs.",
      colors: [
        {
          name: "Obsidian Gold",
          hex: "#141416",
          accent: "#D4AF37",
          bgGlow: "radial-gradient(circle at 52% 46%, #785513 0%, #3d2a09 36%, #141009 76%, #070709 100%)",
          front: "assets/products/hoodie-jatayu-black-front.webp",
          back: "assets/products/hoodie-jatayu-black-back.webp"
        },
        {
          name: "Ivory Ink",
          hex: "#E6E0D4",
          accent: "#B91C1C",
          bgGlow: "radial-gradient(circle at 52% 46%, #6b6359 0%, #312c27 36%, #131110 76%, #070709 100%)",
          front: "assets/products/hoodie-jatayu-ivory-front.webp",
          back: "assets/products/hoodie-jatayu-ivory-back.webp"
        },
        {
          name: "Royal Crimson",
          hex: "#991B1B",
          accent: "#EF4444",
          bgGlow: "radial-gradient(circle at 52% 46%, #991b1b 0%, #4c0d0d 36%, #170606 76%, #070709 100%)",
          front: "assets/products/hoodie-jatayu-crimson-front.webp",
          back: "assets/products/hoodie-jatayu-crimson-back.webp"
        }
      ]
    },
    {
      id: "hoodie-hanuman",
      dropNo: "02",
      name: "Hanuman's Epic Leap Hoodie",
      category: "hoodies",
      theme: "indian-traditional",
      price: 3499,
      mrp: 4799,
      badge: "LIMITED DROP",
      featured: true,
      rating: 5.0,
      reviews: 219,
      fabric: "460 GSM Super-Combed Bio-Washed Heavy Fleece. Oversized relaxed fit with deep kangaroo pocket & ribbed cuffs.",
      care: "Wash cold inside-out with mild detergent. Hang dry away from direct harsh sunlight to preserve crimson & gold ink depth.",
      description: "Inspired by the legendary leap across the ocean — detailed with sacred temple spires across the front pocket, Devanagari sleeve lettering, and a dramatic full-moon back mural of Lord Hanuman wielding the Gada.",
      colors: [
        {
          name: "Midnight Obsidian",
          hex: "#121215",
          accent: "#FF5E1A",
          bgGlow: "radial-gradient(circle at 52% 46%, #7c2d12 0%, #3b1508 36%, #140906 76%, #070709 100%)",
          front: "assets/products/hoodie-hanuman-black-front.webp",
          back: "assets/products/hoodie-hanuman-black-back.webp"
        },
        {
          name: "Sandstone Cream",
          hex: "#D6CBB8",
          accent: "#DC2626",
          bgGlow: "radial-gradient(circle at 52% 46%, #7c2020 0%, #3b1212 36%, #140a0a 76%, #070709 100%)",
          front: "assets/products/hoodie-hanuman-sandstone-front.webp",
          back: "assets/products/hoodie-hanuman-sandstone-back.webp"
        }
      ]
    },
    {
      id: "hoodie-dragon",
      dropNo: "03",
      name: "Shinobi Dragon Blood-Moon Hoodie",
      category: "hoodies",
      theme: "anime-japanese",
      price: 2999,
      mrp: 3999,
      badge: "TOKYO EDITION",
      featured: true,
      rating: 4.9,
      reviews: 147,
      fabric: "440 GSM Heavyweight Brushed Loopback Cotton. Structured double-layer hood with shuriken crest embroidery.",
      care: "Machine wash cold inside-out. Tumble dry low or dry flat. Do not iron on graphic prints.",
      description: "Ukiyo-e brush-ink meets nocturnal Japanese street style — coiled celestial dragon wrapping the front chest, Kanji calligraphy along both sleeves, and a katana-bearing shinobi crouched beneath a blazing crimson moon.",
      colors: [
        {
          name: "Midnight Navy",
          hex: "#0F1E3A",
          accent: "#EF4444",
          bgGlow: "radial-gradient(circle at 52% 46%, #1e3a8a 0%, #0f1d45 36%, #070b18 76%, #070709 100%)",
          front: "assets/products/hoodie-dragon-navy-front.webp",
          back: "assets/products/hoodie-dragon-navy-back.webp"
        },
        {
          name: "Forest Emerald",
          hex: "#123524",
          accent: "#10B981",
          bgGlow: "radial-gradient(circle at 52% 46%, #065f46 0%, #06382a 36%, #061410 76%, #070709 100%)",
          front: "assets/products/hoodie-dragon-green-front.webp",
          back: "assets/products/hoodie-dragon-green-back.webp"
        }
      ]
    },
    {
      id: "hoodie-falcon",
      dropNo: "04",
      name: "Hayabusa Falcon Mountain Hoodie",
      category: "hoodies",
      theme: "animal-nature",
      price: 2799,
      mrp: 3799,
      badge: "HERO DROP",
      featured: true,
      rating: 4.8,
      reviews: 162,
      fabric: "440 GSM Heavyweight Ring-Spun Cotton Fleece. Pre-shrunk oversized streetwear block with reinforced kangaroo seams.",
      care: "Cold wash inside-out. Avoid fabric softeners to keep vibrant pigments ultra-crisp.",
      description: "Fierce wildlife ink illustration of a soaring Hayabusa falcon sweeping over misty mountain peaks, cliffside pagodas, and ancient torii gates — available in four electric streetwear palettes.",
      colors: [
        {
          name: "Saffron Blaze",
          hex: "#EA580C",
          accent: "#FF5E1A",
          bgGlow: "radial-gradient(circle at 52% 46%, #c2410c 0%, #7c2d12 36%, #180b06 76%, #070709 100%)",
          front: "assets/products/hoodie-falcon-saffron-front.webp",
          back: "assets/products/hoodie-falcon-saffron-back.webp"
        },
        {
          name: "Crimson Ember",
          hex: "#B91C1C",
          accent: "#E11D48",
          bgGlow: "radial-gradient(circle at 52% 46%, #991b1b 0%, #4c0d0d 36%, #170606 76%, #070709 100%)",
          front: "assets/products/hoodie-falcon-crimson-front.webp",
          back: "assets/products/hoodie-falcon-crimson-back.webp"
        },
        {
          name: "Deep Forest",
          hex: "#1B4332",
          accent: "#10B981",
          bgGlow: "radial-gradient(circle at 52% 46%, #065f46 0%, #053326 36%, #05130f 76%, #070709 100%)",
          front: "assets/products/hoodie-falcon-forest-front.webp",
          back: "assets/products/hoodie-falcon-forest-back.webp"
        },
        {
          name: "Storm Indigo",
          hex: "#1E3A5F",
          accent: "#3B82F6",
          bgGlow: "radial-gradient(circle at 52% 46%, #1d4ed8 0%, #0e2461 36%, #070c1c 76%, #070709 100%)",
          front: "assets/products/hoodie-falcon-navy-front.webp",
          back: "assets/products/hoodie-falcon-navy-back.webp"
        }
      ]
    },

    // ======================== JACKETS ========================
    {
      id: "jacket-rudra",
      dropNo: "05",
      name: "Rudra Tandava Tactical Jacket",
      category: "jackets",
      theme: "indian-traditional",
      price: 4699,
      mrp: 6299,
      badge: "SIGNATURE DROP",
      featured: true,
      rating: 5.0,
      reviews: 203,
      fabric: "DWR Water-Repellent Micro-Ripstop Nylon Shell with breathable air-mesh lining, 4 buckled cargo pockets, and cinch-toggle hem.",
      care: "Wipe clean or cold gentle wash zipped up. Do not tumble dry or dry-clean over reflective/high-density print.",
      description: "Commanding Shiva Rudra Tandava artwork across the entire back with Trishul & Om front chest insignias, 'Har Har Mahadev' placket typography, and storm-ready multi-pocket utility architecture.",
      colors: [
        { name: "Obsidian Black", hex: "#111114", accent: "#E5E7EB", front: "assets/products/jacket-rudra-black-front.webp", back: "assets/products/jacket-rudra-black-back.webp" },
        { name: "Royal Cobalt", hex: "#0F2B6B", accent: "#3B82F6", front: "assets/products/jacket-rudra-navy-front.webp", back: "assets/products/jacket-rudra-navy-back.webp" },
        { name: "Arctic White", hex: "#ECEEF2", accent: "#94A3B8", front: "assets/products/jacket-rudra-white-front.webp", back: "assets/products/jacket-rudra-white-back.webp" },
        { name: "Forest Emerald", hex: "#143B1B", accent: "#22C55E", front: "assets/products/jacket-rudra-green-front.webp", back: "assets/products/jacket-rudra-green-back.webp" }
      ]
    },
    {
      id: "jacket-hanuman-ji",
      dropNo: "06",
      name: "Hanuman Ji Devotion Tactical Jacket",
      category: "jackets",
      theme: "indian-traditional",
      price: 4499,
      mrp: 5999,
      badge: "HERITAGE TECH",
      featured: false,
      rating: 4.9,
      reviews: 156,
      fabric: "Windproof Technical Ripstop Shell + Satin-Touch Inner Lining. Matte alloy storm toggles & 4 quick-clip cargo pockets.",
      care: "Cold machine wash gentle cycle inside-out. Line dry in shade.",
      description: "Serene yet fierce monochromatic portrait of Lord Hanuman gripping the Gada across the back panel, paired with Om & Devanagari chest print and razor-sharp sleeve slash strokes.",
      colors: [
        { name: "Obsidian Black", hex: "#111114", accent: "#F59E0B", front: "assets/products/jacket-hanuman-ji-black-front.webp", back: "assets/products/jacket-hanuman-ji-black-back.webp" },
        { name: "Royal Cobalt", hex: "#0F2B6B", accent: "#3B82F6", front: "assets/products/jacket-hanuman-ji-navy-front.webp", back: "assets/products/jacket-hanuman-ji-navy-back.webp" },
        { name: "Arctic White", hex: "#ECEEF2", accent: "#CBD5E1", front: "assets/products/jacket-hanuman-ji-white-front.webp", back: "assets/products/jacket-hanuman-ji-white-back.webp" },
        { name: "Forest Emerald", hex: "#143B1B", accent: "#22C55E", front: "assets/products/jacket-hanuman-ji-green-front.webp", back: "assets/products/jacket-hanuman-ji-green-back.webp" }
      ]
    },
    {
      id: "jacket-hanuman-leap",
      dropNo: "07",
      name: "Hanuman Epic Leap Tactical Jacket",
      category: "jackets",
      theme: "indian-traditional",
      price: 4599,
      mrp: 6199,
      badge: "NEW ARRIVAL",
      featured: false,
      rating: 4.9,
      reviews: 112,
      fabric: "Heavyweight All-Weather Techwear Poly-Cotton Ripstop with articulated elbows, storm hood, and 4 tactical buckle pockets.",
      care: "Gentle cold wash inside-out. Do not iron directly over artwork.",
      description: "Golden palace silhouettes on stormy cliffs meet Hanuman's soaring leap across the ocean — engineered in 4 bold colorways with Trishul placket graphics and luminous sleeve wave cuffs.",
      colors: [
        { name: "Obsidian Black", hex: "#111114", accent: "#D4AF37", front: "assets/products/jacket-hanuman-leap-black-front.webp", back: "assets/products/jacket-hanuman-leap-black-back.webp" },
        { name: "Royal Cobalt", hex: "#0F2B6B", accent: "#3B82F6", front: "assets/products/jacket-hanuman-leap-navy-front.webp", back: "assets/products/jacket-hanuman-leap-navy-back.webp" },
        { name: "Arctic White", hex: "#ECEEF2", accent: "#D4AF37", front: "assets/products/jacket-hanuman-leap-white-front.webp", back: "assets/products/jacket-hanuman-leap-white-back.webp" },
        { name: "Forest Emerald", hex: "#143B1B", accent: "#22C55E", front: "assets/products/jacket-hanuman-leap-green-front.webp", back: "assets/products/jacket-hanuman-leap-green-back.webp" }
      ]
    },
    {
      id: "jacket-goku",
      dropNo: "08",
      name: "Dragon Ball Goku Aura Tactical Jacket",
      category: "jackets",
      theme: "anime-japanese",
      price: 4799,
      mrp: 6499,
      badge: "BEST SELLER",
      featured: true,
      rating: 5.0,
      reviews: 278,
      fabric: "Weather-Shield Ripstop Tech Shell with 4 utility buckle pockets, adjustable storm hood, and luminous multi-layer DTG print.",
      care: "Cold gentle wash inside-out. Hang dry only.",
      description: "High-voltage Saiyan aura & coiled Shenron dragon dominating the back canvas, accented with the iconic Kanji seal on the chest, 4-star Dragon Ball hood crest, and kinetic energy slashes on both sleeves.",
      colors: [
        { name: "Obsidian Ink", hex: "#111114", accent: "#E5E7EB", bgGlow: "radial-gradient(circle at 52% 46%, #3f3f46 0%, #1c1c20 36%, #0d0d10 76%, #070709 100%)", front: "assets/products/jacket-goku-black-front.webp", back: "assets/products/jacket-goku-black-back.webp" },
        { name: "Super Blue Navy", hex: "#0D2B6B", accent: "#3B82F6", bgGlow: "radial-gradient(circle at 52% 46%, #1d4ed8 0%, #102a71 36%, #070d1e 76%, #070709 100%)", front: "assets/products/jacket-goku-navy-front.webp", back: "assets/products/jacket-goku-navy-back.webp" },
        { name: "Manga White", hex: "#EEF0F4", accent: "#94A3B8", bgGlow: "radial-gradient(circle at 52% 46%, #52525b 0%, #27272a 36%, #111114 76%, #070709 100%)", front: "assets/products/jacket-goku-white-front.webp", back: "assets/products/jacket-goku-white-back.webp" },
        { name: "Legendary Emerald", hex: "#133B17", accent: "#22C55E", bgGlow: "radial-gradient(circle at 52% 46%, #15803d 0%, #0b3c1d 36%, #06140b 76%, #070709 100%)", front: "assets/products/jacket-goku-green-front.webp", back: "assets/products/jacket-goku-green-back.webp" }
      ]
    },
    {
      id: "jacket-naruto-uchiha",
      dropNo: "09",
      name: "Naruto Shinobi Clan Tactical Jacket",
      category: "jackets",
      theme: "anime-japanese",
      price: 4899,
      mrp: 6599,
      badge: "ANIME EDITION",
      featured: true,
      rating: 4.9,
      reviews: 194,
      fabric: "Windproof Urban Techwear Shell with storm flap zip, 4 snap-buckle pockets, and clan-specific hood emblem.",
      care: "Cold machine wash inside-out. Do not bleach or iron print.",
      description: "Four legendary shinobi editions in one tactical silhouette: Obsidian Madara, Cobalt Moon Madara, Arctic Ink Sasuke, and Lightning Emerald Kakashi — complete with Konoha chest crest and Japanese sleeve typography.",
      colors: [
        { name: "Obsidian Madara", hex: "#111114", accent: "#E11D48", front: "assets/products/jacket-naruto-uchiha-black-front.webp", back: "assets/products/jacket-naruto-uchiha-black-back.webp" },
        { name: "Cobalt Madara", hex: "#0D2B6B", accent: "#3B82F6", front: "assets/products/jacket-naruto-uchiha-navy-front.webp", back: "assets/products/jacket-naruto-uchiha-navy-back.webp" },
        { name: "Arctic Sasuke", hex: "#EEF0F4", accent: "#CBD5E1", front: "assets/products/jacket-naruto-uchiha-white-front.webp", back: "assets/products/jacket-naruto-uchiha-white-back.webp" },
        { name: "Emerald Kakashi", hex: "#133B17", accent: "#22C55E", front: "assets/products/jacket-naruto-uchiha-green-front.webp", back: "assets/products/jacket-naruto-uchiha-green-back.webp" }
      ]
    },
    {
      id: "jacket-team7",
      dropNo: "10",
      name: "Naruto Team 7 Konoha Utility Jacket",
      category: "jackets",
      theme: "anime-japanese",
      price: 4999,
      mrp: 6799,
      badge: "COLLECTOR'S DROP",
      featured: false,
      rating: 5.0,
      reviews: 141,
      fabric: "Heavyweight Color-Block Technical Twill with dual-tone hood, 6 utility cargo pockets (including sleeve holsters), and custom Konoha hem band.",
      care: "Dry clean or cold hand wash inside-out to protect vibrant anime color-blocking.",
      description: "Collector-grade color-blocked Konoha utility jacket showcasing Naruto, Sasuke, Sakura, and Kakashi in blazing full-color action across the back with contrast cargo straps and Hidden Leaf arm patches.",
      extraGallery: ["assets/products/editorial-team7-showcase.webp"],
      colors: [
        { name: "Konoha White & Flame", hex: "#F4F1EC", accent: "#FF5E1A", front: "assets/products/jacket-team7-white-front.webp", back: "assets/products/jacket-team7-white-back.webp" },
        { name: "Forest Shinobi Green", hex: "#1B5E3F", accent: "#FF5E1A", front: "assets/products/jacket-team7-green-front.webp", back: "assets/products/jacket-team7-green-back.webp" }
      ]
    },
    {
      id: "jacket-onepiece",
      dropNo: "11",
      name: "One Piece Jolly Roger Tactical Jacket",
      category: "jackets",
      theme: "anime-japanese",
      price: 4499,
      mrp: 5999,
      badge: "TRENDING",
      featured: false,
      rating: 4.9,
      reviews: 175,
      fabric: "Water-Repellent Street Ripstop Shell with full-zip storm guard, 4 tactical pockets, and high-opacity pigment back print.",
      care: "Cold wash inside-out. Line dry away from direct heat.",
      description: "Grand Line streetwear armor featuring the Straw Hat Jolly Roger chest emblem, Thousand Sunny storm-sea back mural, and dramatic anime lighting across four distinct colorways.",
      colors: [
        { name: "Obsidian Pirate", hex: "#111114", accent: "#F59E0B", front: "assets/products/jacket-onepiece-black-front.webp", back: "assets/products/jacket-onepiece-black-back.webp" },
        { name: "Grand Line Navy", hex: "#0D2B6B", accent: "#3B82F6", front: "assets/products/jacket-onepiece-navy-front.webp", back: "assets/products/jacket-onepiece-navy-back.webp" },
        { name: "Manga Ivory", hex: "#EEF0F4", accent: "#CBD5E1", front: "assets/products/jacket-onepiece-white-front.webp", back: "assets/products/jacket-onepiece-white-back.webp" },
        { name: "Zoro Emerald", hex: "#133B17", accent: "#22C55E", front: "assets/products/jacket-onepiece-green-front.webp", back: "assets/products/jacket-onepiece-green-back.webp" }
      ]
    },
    {
      id: "jacket-falcon",
      dropNo: "12",
      name: "Apex Falcon Tactical Cargo Jacket",
      category: "jackets",
      theme: "animal-nature",
      price: 4299,
      mrp: 5799,
      badge: "5 COLORWAYS",
      featured: true,
      rating: 4.9,
      reviews: 168,
      fabric: "All-Season Matte Ripstop Nylon with storm-flap placket, 4 quick-buckle cargo pockets, Velcro cuffs, and breathable mesh lining.",
      care: "Cold gentle wash inside-out. Hang dry.",
      description: "Our signature 5-colorway wildlife techwear icon — a diving brush-ink falcon spreading its wings across the entire back, swept feather graphics along both sleeves, and crisp minimalist chest branding.",
      colors: [
        { name: "Obsidian Black", hex: "#121215", accent: "#E5E7EB", front: "assets/products/jacket-falcon-black-front.webp", back: "assets/products/jacket-falcon-black-back.webp" },
        { name: "Electric Crimson", hex: "#B91C1C", accent: "#E11D48", front: "assets/products/jacket-falcon-crimson-front.webp", back: "assets/products/jacket-falcon-crimson-back.webp" },
        { name: "Saffron Orange", hex: "#EA580C", accent: "#FF5E1A", front: "assets/products/jacket-falcon-saffron-front.webp", back: "assets/products/jacket-falcon-saffron-back.webp" },
        { name: "Forest Olive", hex: "#1E3A24", accent: "#10B981", front: "assets/products/jacket-falcon-green-front.webp", back: "assets/products/jacket-falcon-green-back.webp" },
        { name: "Arctic Bone", hex: "#E5E3DD", accent: "#D4AF37", front: "assets/products/jacket-falcon-white-front.webp", back: "assets/products/jacket-falcon-white-back.webp" }
      ]
    },
    {
      id: "jacket-lion",
      dropNo: "13",
      name: "Alpha Lion Roar Tactical Jacket",
      category: "jackets",
      theme: "animal-nature",
      price: 4399,
      mrp: 5899,
      badge: "WILD SERIES",
      featured: true,
      rating: 4.9,
      reviews: 151,
      fabric: "Heavyweight Water-Resistant Ripstop Tech Shell with 4 buckled cargo pockets, adjustable shock-cord hem, and storm hood.",
      care: "Cold gentle cycle inside-out. Do not tumble dry.",
      description: "Untamed predatory presence — razor-sharp claw-slash sleeve graphics paired with a roaring alpha lion portrait across the back, echoing the REBELLION lion crest in raw streetwear form.",
      colors: [
        { name: "Obsidian Black", hex: "#121215", accent: "#E5E7EB", bgGlow: "radial-gradient(circle at 52% 46%, #3f3f46 0%, #1c1c20 36%, #0d0d10 76%, #070709 100%)", front: "assets/products/jacket-lion-black-front.webp", back: "assets/products/jacket-lion-black-back.webp" },
        { name: "Electric Crimson", hex: "#B91C1C", accent: "#E11D48", bgGlow: "radial-gradient(circle at 52% 46%, #9f1239 0%, #580b1f 36%, #17060a 76%, #070709 100%)", front: "assets/products/jacket-lion-crimson-front.webp", back: "assets/products/jacket-lion-crimson-back.webp" },
        { name: "Saffron Orange", hex: "#EA580C", accent: "#FF5E1A", bgGlow: "radial-gradient(circle at 52% 46%, #c2410c 0%, #7c2d12 36%, #180b06 76%, #070709 100%)", front: "assets/products/jacket-lion-saffron-front.webp", back: "assets/products/jacket-lion-saffron-back.webp" },
        { name: "Forest Olive", hex: "#1E3A24", accent: "#10B981", bgGlow: "radial-gradient(circle at 52% 46%, #065f46 0%, #053326 36%, #05130f 76%, #070709 100%)", front: "assets/products/jacket-lion-green-front.webp", back: "assets/products/jacket-lion-green-back.webp" }
      ]
    },

    // ======================== JOGGERS ========================
    {
      id: "joggers-heritage",
      dropNo: "14",
      name: "Mandala Heritage Tactical Cargo Joggers",
      category: "joggers",
      theme: "indian-traditional",
      price: 2299,
      mrp: 3199,
      badge: "HERITAGE CARGO",
      featured: false,
      rating: 4.8,
      reviews: 98,
      fabric: "340 GSM Heavy Cotton-Twill Stretch Blend with elasticated drawstring waist, 6 deep utility pockets, and detachable buckle straps.",
      care: "Cold machine wash inside-out. Wash darks separately. Line dry in shade.",
      description: "Modern cargo engineering meets sacred Indian art — each colorway carries its own heritage artwork: Gold Temple Mandala, Royal Peacock Filigree, Crimson Madhubani Architecture, and Emerald Royal Elephant Paisley.",
      colors: [
        { name: "Obsidian Gold Mandala", hex: "#141416", accent: "#D4AF37", front: "assets/products/joggers-heritage-black-front.webp", back: "assets/products/joggers-heritage-black-back.webp" },
        { name: "Royal Peacock Navy", hex: "#12264A", accent: "#06B6D4", front: "assets/products/joggers-heritage-navy-front.webp", back: "assets/products/joggers-heritage-navy-back.webp" },
        { name: "Arctic Madhubani", hex: "#ECEEEF", accent: "#DC2626", front: "assets/products/joggers-heritage-white-front.webp", back: "assets/products/joggers-heritage-white-back.webp" },
        { name: "Emerald Paisley", hex: "#153D24", accent: "#D4AF37", front: "assets/products/joggers-heritage-green-front.webp", back: "assets/products/joggers-heritage-green-back.webp" }
      ]
    },
    {
      id: "joggers-oni",
      dropNo: "15",
      name: "Cyber Oni & Ukiyo-e Cargo Joggers",
      category: "joggers",
      theme: "anime-japanese",
      price: 2399,
      mrp: 3299,
      badge: "TOKYO STREET",
      featured: false,
      rating: 4.9,
      reviews: 124,
      fabric: "340 GSM Structured Tech-Cotton Fleece with industrial drop-straps, deep cargo compartments, and tapered ankle cuffs.",
      care: "Machine wash cold inside-out. Do not iron directly over puff Kanji prints.",
      description: "Straight from Shibuya night streets — choose from Crimson Oni Mask Black, Electric Great Wave Navy, Rising Sun Samurai White, or Neon Tokyo Dragon Emerald.",
      colors: [
        { name: "Obsidian Crimson Oni", hex: "#141416", accent: "#E11D48", front: "assets/products/joggers-oni-black-front.webp", back: "assets/products/joggers-oni-black-back.webp" },
        { name: "Electric Wave Navy", hex: "#12264A", accent: "#3B82F6", front: "assets/products/joggers-oni-navy-front.webp", back: "assets/products/joggers-oni-navy-back.webp" },
        { name: "Rising Sun White", hex: "#ECEEEF", accent: "#EF4444", front: "assets/products/joggers-oni-white-front.webp", back: "assets/products/joggers-oni-white-back.webp" },
        { name: "Neon Dragon Emerald", hex: "#153D24", accent: "#22C55E", front: "assets/products/joggers-oni-green-front.webp", back: "assets/products/joggers-oni-green-back.webp" }
      ]
    },
    {
      id: "joggers-botanical",
      dropNo: "16",
      name: "Botanical Shadow Tactical Cargo Joggers",
      category: "joggers",
      theme: "animal-nature",
      price: 2199,
      mrp: 2999,
      badge: "BEST SELLER",
      featured: true,
      rating: 4.9,
      reviews: 163,
      fabric: "340 GSM Heavyweight French Terry Cargo with twin buckle thigh straps, D-ring hardware, and 6 spacious pockets.",
      care: "Cold gentle wash inside-out. Dry flat to keep cuff elasticity locked.",
      description: "Nature's wild silhouette wrapped onto multi-pocket streetwear cargos — featuring Silver Autumn Maple, Bioluminescent Cyan Palms, Alpine Fern Forest, and Neon Jungle Vines.",
      colors: [
        { name: "Obsidian Silver Maple", hex: "#131316", accent: "#E5E7EB", front: "assets/products/joggers-botanical-black-front.webp", back: "assets/products/joggers-botanical-black-back.webp" },
        { name: "Neon Cyan Navy", hex: "#0F244A", accent: "#06B6D4", front: "assets/products/joggers-botanical-navy-front.webp", back: "assets/products/joggers-botanical-navy-back.webp" },
        { name: "Alpine Fern White", hex: "#ECEEEF", accent: "#94A3B8", front: "assets/products/joggers-botanical-white-front.webp", back: "assets/products/joggers-botanical-white-back.webp" },
        { name: "Jungle Vine Green", hex: "#153B19", accent: "#22C55E", front: "assets/products/joggers-botanical-green-front.webp", back: "assets/products/joggers-botanical-green-back.webp" }
      ]
    },

    // ======================== SNEAKERS ========================
    {
      id: "sneakers-trishul",
      dropNo: "17",
      name: "Trishul Heritage Tactical High-Tops",
      category: "sneakers",
      theme: "indian-traditional",
      price: 5999,
      mrp: 7999,
      badge: "SIGNATURE KICKS",
      featured: true,
      rating: 5.0,
      reviews: 192,
      fabric: "Premium Full-Grain Vegan Leather & Ballistic Mesh Upper. Dual anodized ankle buckle straps, memory-foam collar, and high-traction chunky EVA/rubber outsole.",
      care: "Wipe with damp microfiber cloth and mild sneaker foam. Air dry away from heat. Use protective water-repellent spray.",
      description: "Museum-grade Indian artistry engineered for concrete streets — featuring Flame Tiger & Golden Trishul, Ivory Peacock & Lotus Temple, Royal Blue Chakra Feather, and Emerald Elephant Filigree.",
      colors: [
        { name: "Flame Trishul Black", hex: "#141416", accent: "#FF5E1A", front: "assets/products/sneakers-trishul-black-pair.webp", back: "assets/products/sneakers-trishul-black-side.webp", angle: "assets/products/sneakers-trishul-black-angle.webp" },
        { name: "Ivory Lotus White", hex: "#EFEFEF", accent: "#D4AF37", front: "assets/products/sneakers-trishul-white-pair.webp", back: "assets/products/sneakers-trishul-white-side.webp", angle: "assets/products/sneakers-trishul-white-angle.webp" },
        { name: "Royal Chakra Navy", hex: "#123278", accent: "#3B82F6", front: "assets/products/sneakers-trishul-navy-pair.webp", back: "assets/products/sneakers-trishul-navy-side.webp", angle: "assets/products/sneakers-trishul-navy-angle.webp" },
        { name: "Emerald Temple Green", hex: "#164628", accent: "#22C55E", front: "assets/products/sneakers-trishul-green-pair.webp", back: "assets/products/sneakers-trishul-green-side.webp", angle: "assets/products/sneakers-trishul-green-angle.webp" }
      ]
    },
    {
      id: "sneakers-shogun",
      dropNo: "18",
      name: "Shogun Oni & Wave Tactical High-Tops",
      category: "sneakers",
      theme: "anime-japanese",
      price: 5799,
      mrp: 7499,
      badge: "CYBER TOKYO",
      featured: true,
      rating: 4.9,
      reviews: 148,
      fabric: "Textured Matte Leather & Engineered Knit Upper with quick-release tactical ankle clasp, shock-absorbing sculpted sole, and padded tongue.",
      care: "Spot clean with soft bristle brush and mild soap. Stuff with paper to retain silhouette.",
      description: "Japanese street icon built on a sculpted chunky platform — choose from Crimson Oni Mask, Hokusai Great Wave Navy, Sakura Katana White, or Cyber Mecha Dragon Emerald.",
      colors: [
        { name: "Crimson Oni Black", hex: "#141416", accent: "#E11D48", front: "assets/products/sneakers-shogun-black-pair.webp", back: "assets/products/sneakers-shogun-black-side.webp", angle: "assets/products/sneakers-shogun-black-angle.webp" },
        { name: "Great Wave Navy", hex: "#18335E", accent: "#3B82F6", front: "assets/products/sneakers-shogun-navy-pair.webp", back: "assets/products/sneakers-shogun-navy-side.webp", angle: "assets/products/sneakers-shogun-navy-angle.webp" },
        { name: "Sakura Katana White", hex: "#F2F2F2", accent: "#F472B6", front: "assets/products/sneakers-shogun-white-pair.webp", back: "assets/products/sneakers-shogun-white-side.webp", angle: "assets/products/sneakers-shogun-white-angle.webp" },
        { name: "Mecha Dragon Green", hex: "#174A2B", accent: "#84CC16", front: "assets/products/sneakers-shogun-green-pair.webp", back: "assets/products/sneakers-shogun-green-side.webp", angle: "assets/products/sneakers-shogun-green-angle.webp" }
      ]
    },
    {
      id: "sneakers-wilderness",
      dropNo: "19",
      name: "Wilderness Trail Tactical Sneakers",
      category: "sneakers",
      theme: "animal-nature",
      price: 4999,
      mrp: 6499,
      badge: "TRAIL TECH",
      featured: false,
      rating: 4.9,
      reviews: 134,
      fabric: "Weather-Sealed Synthetic Nubuck & Breathable Ripstop Panels, dual midfoot lock-buckles, and deep lugged trail outsole.",
      care: "Brush off dry dirt after wear; wipe clean with damp cloth. Do not machine wash.",
      description: "All-terrain low-mid tactical kicks celebrating raw landscapes — Midnight Pine Mountains, Arctic Fern Heritage, Electric Tsunami Waves, and Rainforest Monstera Foliage.",
      colors: [
        { name: "Midnight Alpine Black", hex: "#151518", accent: "#E5E7EB", front: "assets/products/sneakers-wilderness-black-pair.webp", back: "assets/products/sneakers-wilderness-black-side.webp", angle: "assets/products/sneakers-wilderness-black-angle.webp" },
        { name: "Arctic Fern White", hex: "#EFEFEF", accent: "#94A3B8", front: "assets/products/sneakers-wilderness-white-pair.webp", back: "assets/products/sneakers-wilderness-white-side.webp", angle: "assets/products/sneakers-wilderness-white-angle.webp" },
        { name: "Tsunami Wave Navy", hex: "#133570", accent: "#06B6D4", front: "assets/products/sneakers-wilderness-navy-pair.webp", back: "assets/products/sneakers-wilderness-navy-side.webp", angle: "assets/products/sneakers-wilderness-navy-angle.webp" },
        { name: "Rainforest Green", hex: "#1D4D2C", accent: "#22C55E", front: "assets/products/sneakers-wilderness-green-pair.webp", back: "assets/products/sneakers-wilderness-green-side.webp", angle: "assets/products/sneakers-wilderness-green-angle.webp" }
      ]
    }
  ]
};
