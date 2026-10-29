// Global Bizz Hub Directory Initial Seed Data
window.NEXUS_DATA = {
  "site": {
    "name": "Global Bizz Hub",
    "tagline": "Global Verified Business Directory",
    "description": "Discover verified companies, professional services, local stores, and B2B suppliers across Pakistan, the United States, and the United Kingdom.",
    "support_email": "support@nexusbiz.directory",
    "phone": "+1 (800) 555-0199",
    "colors": {
      "primary": "#065F46",
      "action": "#10B981",
      "accent": "#FBBF24",
      "navy": "#172B45"
    }
  },
  "countries": [
    {
      "id": "cnt-pk",
      "name": "Pakistan",
      "slug": "pakistan",
      "code": "PK",
      "flag_emoji": "🇵🇰",
      "phone_prefix": "+92",
      "currency": "PKR",
      "popular_cities": [
        "Lahore",
        "Karachi",
        "Islamabad",
        "Multan",
        "Rawalpindi"
      ]
    },
    {
      "id": "cnt-us",
      "name": "United States",
      "slug": "usa",
      "code": "US",
      "flag_emoji": "🇺🇸",
      "phone_prefix": "+1",
      "currency": "USD",
      "popular_cities": [
        "New York City",
        "San Francisco",
        "Los Angeles",
        "Austin",
        "Chicago"
      ]
    },
    {
      "id": "cnt-gb",
      "name": "United Kingdom",
      "slug": "uk",
      "code": "GB",
      "flag_emoji": "🇬🇧",
      "phone_prefix": "+44",
      "currency": "GBP",
      "popular_cities": [
        "London",
        "Manchester",
        "Birmingham",
        "Edinburgh",
        "Leeds"
      ]
    }
  ],
  "regions": [
    {
      "id": "reg-pk-pb",
      "country_id": "cnt-pk",
      "name": "Punjab",
      "slug": "punjab",
      "code": "PB"
    },
    {
      "id": "reg-pk-sd",
      "country_id": "cnt-pk",
      "name": "Sindh",
      "slug": "sindh",
      "code": "SD"
    },
    {
      "id": "reg-pk-ict",
      "country_id": "cnt-pk",
      "name": "Islamabad Capital Territory",
      "slug": "islamabad-capital",
      "code": "ICT"
    },
    {
      "id": "reg-pk-kp",
      "country_id": "cnt-pk",
      "name": "Khyber Pakhtunkhwa",
      "slug": "khyber-pakhtunkhwa",
      "code": "KP"
    },
    {
      "id": "reg-us-ca",
      "country_id": "cnt-us",
      "name": "California",
      "slug": "california",
      "code": "CA"
    },
    {
      "id": "reg-us-ny",
      "country_id": "cnt-us",
      "name": "New York",
      "slug": "new-york",
      "code": "NY"
    },
    {
      "id": "reg-us-tx",
      "country_id": "cnt-us",
      "name": "Texas",
      "slug": "texas",
      "code": "TX"
    },
    {
      "id": "reg-us-il",
      "country_id": "cnt-us",
      "name": "Illinois",
      "slug": "illinois",
      "code": "IL"
    },
    {
      "id": "reg-gb-eng",
      "country_id": "cnt-gb",
      "name": "England",
      "slug": "england",
      "code": "ENG"
    },
    {
      "id": "reg-gb-sct",
      "country_id": "cnt-gb",
      "name": "Scotland",
      "slug": "scotland",
      "code": "SCT"
    }
  ],
  "cities": [
    {
      "id": "cty-pk-lhr",
      "region_id": "reg-pk-pb",
      "country_id": "cnt-pk",
      "name": "Lahore",
      "slug": "lahore",
      "postal_code": "54000",
      "is_popular": true
    },
    {
      "id": "cty-pk-rwp",
      "region_id": "reg-pk-pb",
      "country_id": "cnt-pk",
      "name": "Rawalpindi",
      "slug": "rawalpindi",
      "postal_code": "46000",
      "is_popular": true
    },
    {
      "id": "cty-pk-mul",
      "region_id": "reg-pk-pb",
      "country_id": "cnt-pk",
      "name": "Multan",
      "slug": "multan",
      "postal_code": "60000",
      "is_popular": true
    },
    {
      "id": "cty-pk-fsd",
      "region_id": "reg-pk-pb",
      "country_id": "cnt-pk",
      "name": "Faisalabad",
      "slug": "faisalabad",
      "postal_code": "38000",
      "is_popular": true
    },
    {
      "id": "cty-pk-khi",
      "region_id": "reg-pk-sd",
      "country_id": "cnt-pk",
      "name": "Karachi",
      "slug": "karachi",
      "postal_code": "74200",
      "is_popular": true
    },
    {
      "id": "cty-pk-isb",
      "region_id": "reg-pk-ict",
      "country_id": "cnt-pk",
      "name": "Islamabad",
      "slug": "islamabad",
      "postal_code": "44000",
      "is_popular": true
    },
    {
      "id": "cty-pk-psh",
      "region_id": "reg-pk-kp",
      "country_id": "cnt-pk",
      "name": "Peshawar",
      "slug": "peshawar",
      "postal_code": "25000",
      "is_popular": true
    },
    {
      "id": "cty-us-nyc",
      "region_id": "reg-us-ny",
      "country_id": "cnt-us",
      "name": "New York City",
      "slug": "new-york-city",
      "postal_code": "10001",
      "is_popular": true
    },
    {
      "id": "cty-us-sf",
      "region_id": "reg-us-ca",
      "country_id": "cnt-us",
      "name": "San Francisco",
      "slug": "san-francisco",
      "postal_code": "94102",
      "is_popular": true
    },
    {
      "id": "cty-us-la",
      "region_id": "reg-us-ca",
      "country_id": "cnt-us",
      "name": "Los Angeles",
      "slug": "los-angeles",
      "postal_code": "90001",
      "is_popular": true
    },
    {
      "id": "cty-us-aus",
      "region_id": "reg-us-tx",
      "country_id": "cnt-us",
      "name": "Austin",
      "slug": "austin",
      "postal_code": "73301",
      "is_popular": true
    },
    {
      "id": "cty-us-chi",
      "region_id": "reg-us-il",
      "country_id": "cnt-us",
      "name": "Chicago",
      "slug": "chicago",
      "postal_code": "60601",
      "is_popular": true
    },
    {
      "id": "cty-gb-lon",
      "region_id": "reg-gb-eng",
      "country_id": "cnt-gb",
      "name": "London",
      "slug": "london",
      "postal_code": "EC1A 1BB",
      "is_popular": true
    },
    {
      "id": "cty-gb-man",
      "region_id": "reg-gb-eng",
      "country_id": "cnt-gb",
      "name": "Manchester",
      "slug": "manchester",
      "postal_code": "M1 1AE",
      "is_popular": true
    },
    {
      "id": "cty-gb-bhm",
      "region_id": "reg-gb-eng",
      "country_id": "cnt-gb",
      "name": "Birmingham",
      "slug": "birmingham",
      "postal_code": "B1 1AA",
      "is_popular": true
    },
    {
      "id": "cty-gb-edi",
      "region_id": "reg-gb-sct",
      "country_id": "cnt-gb",
      "name": "Edinburgh",
      "slug": "edinburgh",
      "postal_code": "EH1 1YZ",
      "is_popular": true
    }
  ],
  "categories": [
    {
      "id": "cat-auto",
      "name": "Automotive",
      "slug": "automotive",
      "icon": "Car",
      "description": "Car dealerships, repair workshops, auto parts, and vehicle rentals."
    },
    {
      "id": "cat-finance",
      "name": "Banking and Finance",
      "slug": "banking-finance",
      "icon": "Building2",
      "description": "Commercial banks, investment firms, microfinance, and insurance providers."
    },
    {
      "id": "cat-realestate",
      "name": "Construction and Real Estate",
      "slug": "construction-real-estate",
      "icon": "Home",
      "description": "Property developers, builders, architects, and real estate brokers."
    },
    {
      "id": "cat-edu",
      "name": "Education",
      "slug": "education",
      "icon": "GraduationCap",
      "description": "Colleges, universities, vocational academies, and tutoring centers."
    },
    {
      "id": "cat-health",
      "name": "Healthcare",
      "slug": "healthcare",
      "icon": "HeartPulse",
      "description": "Hospitals, medical clinics, dental practices, and diagnostics labs."
    },
    {
      "id": "cat-hospitality",
      "name": "Hotels and Travel",
      "slug": "hotels-travel",
      "icon": "Hotel",
      "description": "Hotels, resorts, travel consultants, and holiday transport operators."
    },
    {
      "id": "cat-it",
      "name": "IT and Software",
      "slug": "it-software",
      "icon": "Code2",
      "description": "Software development, cloud architecture, cybersecurity, and digital agencies."
    },
    {
      "id": "cat-legal",
      "name": "Legal Services",
      "slug": "legal-services",
      "icon": "Scale",
      "description": "Corporate law firms, tax attorneys, barristers, and notary offices."
    },
    {
      "id": "cat-mfg",
      "name": "Manufacturing",
      "slug": "manufacturing",
      "icon": "Factory",
      "description": "Textiles, steel fabrication, industrial equipment, and food processors."
    },
    {
      "id": "cat-food",
      "name": "Restaurants and Food",
      "slug": "restaurants-food",
      "icon": "Utensils",
      "description": "Fine dining, authentic cuisines, coffee shops, and bakeries."
    },
    {
      "id": "cat-retail",
      "name": "Shopping and Retail",
      "slug": "shopping-retail",
      "icon": "ShoppingBag",
      "description": "Malls, retail department stores, electronics, and specialty boutiques."
    },
    {
      "id": "cat-services",
      "name": "Home and Professional Services",
      "slug": "home-professional-services",
      "icon": "Wrench",
      "description": "HVAC repair, solar installation, plumbing, cleaning, and facilities management."
    }
  ],
  "businesses": [
    {
      "id": "biz-systems-ltd",
      "name": "Systems Limited",
      "slug": "systems-limited-lahore",
      "category_id": "cat-it",
      "country_id": "cnt-pk",
      "region_id": "reg-pk-pb",
      "city_id": "cty-pk-lhr",
      "address": "E-5, Central Commercial Area, Sector E, Phase 8, DHA, Lahore",
      "postal_code": "54792",
      "phone": "+92 42 111 797 836",
      "email": "info@systemsltd.com",
      "website": "https://www.systemsltd.com",
      "whatsapp": "+92 300 0000000",
      "short_description": "Premier global technology consultancy and digital business transformation enterprise.",
      "description": "Systems Limited is a pioneer in Pakistan's IT export industry, delivering enterprise modernization, cloud transformation, ERP deployment, and AI-driven business intelligence solutions across 16 countries.",
      "is_verified": true,
      "is_featured": true,
      "status": "approved",
      "rating": 4.8,
      "review_count": 42,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "09:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "09:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "09:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "09:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "09:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "10:00",
          "closes_at": "15:00",
          "is_closed": true
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    },
    {
      "id": "biz-shaukat-khanum",
      "name": "Shaukat Khanum Memorial Cancer Hospital & Research Centre",
      "slug": "shaukat-khanum-hospital-lahore",
      "category_id": "cat-health",
      "country_id": "cnt-pk",
      "region_id": "reg-pk-pb",
      "city_id": "cty-pk-lhr",
      "address": "7A Block R-3, Johar Town, Lahore, Punjab",
      "postal_code": "54700",
      "phone": "+92 42 3590 5000",
      "email": "info@skm.org.pk",
      "website": "https://shaukatkhanum.org.pk",
      "whatsapp": "+92 300 1234567",
      "short_description": "World-class tertiary care oncology hospital, diagnostic pathology, and clinical research institute.",
      "description": "Accredited by Joint Commission International (JCI), SKMCH provides state-of-the-art diagnostic imaging, radiation oncology, surgical suites, and comprehensive free cancer treatment for underprivileged patients.",
      "is_verified": true,
      "is_featured": true,
      "status": "approved",
      "rating": 4.9,
      "review_count": 89,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "23:59",
          "is_closed": false
        }
      ]
    },
    {
      "id": "biz-hbl-khi",
      "name": "Habib Bank Limited (HBL) Tower",
      "slug": "hbl-corporate-karachi",
      "category_id": "cat-finance",
      "country_id": "cnt-pk",
      "region_id": "reg-pk-sd",
      "city_id": "cty-pk-khi",
      "address": "HBL Plaza, I.I. Chundrigar Road, Karachi, Sindh",
      "postal_code": "74000",
      "phone": "+92 21 111 111 425",
      "email": "customer.care@hbl.com",
      "website": "https://www.hbl.com",
      "whatsapp": "",
      "short_description": "Pakistan's largest commercial bank providing corporate, retail, trade, and digital banking.",
      "description": "Founded in 1947, HBL serves over 37 million clients worldwide with comprehensive digital cash management, Islamic finance through HBL Islamic, trade finance, and treasury services.",
      "is_verified": true,
      "is_featured": true,
      "status": "approved",
      "rating": 4.6,
      "review_count": 63,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "09:00",
          "closes_at": "17:00",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "09:00",
          "closes_at": "17:00",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "09:00",
          "closes_at": "17:00",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "09:00",
          "closes_at": "17:00",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "09:00",
          "closes_at": "17:00",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    },
    {
      "id": "biz-multan-sultans-travel",
      "name": "Bahauddin Zakariya Travel & Tours",
      "slug": "bahauddin-zakariya-travel-multan",
      "category_id": "cat-hospitality",
      "country_id": "cnt-pk",
      "region_id": "reg-pk-pb",
      "city_id": "cty-pk-mul",
      "address": "Nusrat Road, Cantt, Multan, Punjab",
      "postal_code": "60000",
      "phone": "+92 61 458 9120",
      "email": "reservations@bztours.pk",
      "website": "https://bztours.pk",
      "whatsapp": "+92 301 8887766",
      "short_description": "Premier corporate travel management, domestic heritage tours, and flight bookings in South Punjab.",
      "description": "Specialized in customized historical expeditions throughout the ancient City of Saints, Cholistan desert jeep rallies, and seamless corporate airline logistics.",
      "is_verified": true,
      "is_featured": false,
      "status": "approved",
      "rating": 4.7,
      "review_count": 24,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "09:30",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "09:30",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "09:30",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "09:30",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "09:30",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "10:00",
          "closes_at": "16:00",
          "is_closed": false
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    },
    {
      "id": "biz-bloomberg-nyc",
      "name": "Bloomberg LP Headquarters",
      "slug": "bloomberg-lp-new-york-city",
      "category_id": "cat-finance",
      "country_id": "cnt-us",
      "region_id": "reg-us-ny",
      "city_id": "cty-us-nyc",
      "address": "731 Lexington Avenue, New York, NY",
      "postal_code": "10022",
      "phone": "+1 212 318 2000",
      "email": "inquiries@bloomberg.com",
      "website": "https://www.bloomberg.com",
      "whatsapp": "",
      "short_description": "Global business and financial information, news, data analysis, and trading technology leader.",
      "description": "Delivering financial market transparency and decision intelligence through the Bloomberg Terminal, enterprise data feeds, trading execution tools, and award-winning journalism.",
      "is_verified": true,
      "is_featured": true,
      "status": "approved",
      "rating": 4.9,
      "review_count": 112,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "08:00",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "08:00",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "08:00",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "08:00",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "08:00",
          "closes_at": "19:00",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    },
    {
      "id": "biz-salesforce-sf",
      "name": "Salesforce Tower",
      "slug": "salesforce-tower-san-francisco",
      "category_id": "cat-it",
      "country_id": "cnt-us",
      "region_id": "reg-us-ca",
      "city_id": "cty-us-sf",
      "address": "415 Mission Street, 3rd Floor, San Francisco, CA",
      "postal_code": "94105",
      "phone": "+1 415 901 7000",
      "email": "info@salesforce.com",
      "website": "https://www.salesforce.com",
      "whatsapp": "",
      "short_description": "World leader in customer relationship management (CRM) software, cloud applications, and Agentforce AI.",
      "description": "Salesforce empowers enterprise commerce, customer service automation, field service workflows, and generative autonomous agent orchestration for leading Fortune 500 enterprises.",
      "is_verified": true,
      "is_featured": true,
      "status": "approved",
      "rating": 4.8,
      "review_count": 95,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "08:30",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "08:30",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "08:30",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "08:30",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "08:30",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    },
    {
      "id": "biz-arm-cambridge",
      "name": "Arm Holdings UK Headquarters",
      "slug": "arm-holdings-cambridge-london",
      "category_id": "cat-it",
      "country_id": "cnt-gb",
      "region_id": "reg-gb-eng",
      "city_id": "cty-gb-lon",
      "address": "110 Fulbourn Road, Cambridge (London Operations), UK",
      "postal_code": "CB1 9NJ",
      "phone": "+44 1223 400400",
      "email": "contact@arm.com",
      "website": "https://www.arm.com",
      "whatsapp": "",
      "short_description": "Architect of the world's most ubiquitous microprocessor semiconductor architectures.",
      "description": "Arm designs energy-efficient compute processor intellectual property that powers over 99% of global smartphones, AI edge inferencing devices, and next-generation automotive autonomy.",
      "is_verified": true,
      "is_featured": true,
      "status": "approved",
      "rating": 4.9,
      "review_count": 57,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "09:00",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "09:00",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "09:00",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "09:00",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "09:00",
          "closes_at": "17:30",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    },
    {
      "id": "biz-manchester-royal-eye",
      "name": "Manchester Royal Eye Hospital",
      "slug": "manchester-royal-eye-hospital",
      "category_id": "cat-health",
      "country_id": "cnt-gb",
      "region_id": "reg-gb-eng",
      "city_id": "cty-gb-man",
      "address": "Oxford Road, Manchester, Greater Manchester",
      "postal_code": "M13 9WL",
      "phone": "+44 161 276 1234",
      "email": "eye.enquiries@mft.nhs.uk",
      "website": "https://mft.nhs.uk/royal-eye",
      "whatsapp": "",
      "short_description": "World-renowned specialist ophthalmic hospital and clinical research center.",
      "description": "Part of Manchester University NHS Foundation Trust, providing dedicated surgical ophthalmology, pediatric eye care, corneal transplantation, and retinal disease therapy.",
      "is_verified": true,
      "is_featured": false,
      "status": "approved",
      "rating": 4.7,
      "review_count": 38,
      "hours": [
        {
          "day_of_week": 1,
          "opens_at": "08:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 2,
          "opens_at": "08:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 3,
          "opens_at": "08:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 4,
          "opens_at": "08:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 5,
          "opens_at": "08:00",
          "closes_at": "18:00",
          "is_closed": false
        },
        {
          "day_of_week": 6,
          "opens_at": "09:00",
          "closes_at": "13:00",
          "is_closed": false
        },
        {
          "day_of_week": 0,
          "opens_at": "00:00",
          "closes_at": "00:00",
          "is_closed": true
        }
      ]
    }
  ],
  "reviews": [
    {
      "id": "rev-1",
      "business_id": "biz-systems-ltd",
      "user_name": "Hamza Farooq",
      "user_email": "hamza@example.com",
      "rating": 5,
      "comment": "Exceptional digital transformation deliverables. Delivered our enterprise cloud migration on schedule with zero downtime.",
      "created_at": "2026-03-12T10:00:00Z",
      "status": "approved"
    },
    {
      "id": "rev-2",
      "business_id": "biz-shaukat-khanum",
      "user_name": "Ayesha Siddiqui",
      "user_email": "ayesha@example.com",
      "rating": 5,
      "comment": "Incredible staff and state-of-the-art oncology equipment. The most professional hospital facility in the country.",
      "created_at": "2026-04-01T14:30:00Z",
      "status": "approved"
    }
  ],
  "reports": []
};
