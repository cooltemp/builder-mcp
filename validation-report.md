# Builder.io TypeScript Interface Validation Report

**Generated:** 2025-06-13T10:28:49.797Z
**Total Models:** 11
**Perfect Matches:** 6/11
**Models with Content:** 10/11

## 📊 Summary

| Model | Status | Content | Schema Fields | Content Fields | Issues |
|-------|--------|---------|---------------|----------------|--------|
| hvac-unit-series | ✅ Perfect | 📄 Yes | 17 | 17 | None |
| testimonial | ✅ Perfect | 📄 Yes | 5 | 5 | None |
| hvac-use-case | ✅ Perfect | 📄 Yes | 6 | 6 | None |
| hvac-unit | ⚠️ Partial | 📄 Yes | 15 | 13 | Missing: tags, Missing: similarProducts |
| hvac-servicing | ✅ Perfect | 📄 Yes | 5 | 5 | None |
| blog-post | ⚠️ Partial | 📄 Yes | 10 | 7 | Missing: thumbnail, Missing: mainImage, Missing: media |
| page | ⚠️ Partial | 📄 Yes | 5 | 6 | Missing: description, Missing: image, Missing: list, Extra: jsCode, Extra: inputs, Extra: url, Extra: state |
| categories | ✅ Perfect | 📄 Yes | 1 | 1 | None |
| author | ⚠️ Partial | 📭 No | 0 | 0 | None |
| hvac-brand | ✅ Perfect | 📄 Yes | 2 | 2 | None |
| hvac-unit-accessories | ⚠️ Partial | 📄 Yes | 12 | 3 | Missing: brand, Missing: summary, Missing: description, Missing: thumbnailImage, Missing: media, Missing: keyFeatures, Missing: color, Missing: warrantyOptions, Missing: documents |

## 📋 Detailed Results


### hvac-unit-series

**Status:** ✅ Perfect Match
**Has Content:** 📄 Yes
**Schema Fields:** 17
**Content Fields:** 17






**Sample Content Structure:**
```json
{
  "id": "dd9fb91daa244270b08426250b6b5d36",
  "name": "PKA Series",
  "published": "published",
  "createdDate": 1743235764498,
  "modelId": "017645db0453454b8f5f6ff753822eb9",
  "data": {
    "seriesCode": "PKA",
    "unitConfig": "High Wall Mounted",
    "smartFeatures": {
      "energyTracking": true,
      "voiceControl": true,
      "appControl": true,
      "homeAutomationIntegration": true
    },
    "keyFeatures": [
      {
        "heading": "Easy Maintenance Design",
        "summary": "Keep your unit running at its best with the Quick Clean Grille feature. The intake grille slides out smoothly for simple cleaning with just water - no special tools or complicated maintenance required.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
      },
      {
        "heading": "Energy-Efficient Technology",
        "summary": "Save on running costs while helping the environment with advanced R32 technology. This next-generation system uses less energy and has a smaller environmental impact than traditional systems, helping you stay comfortable sustainably.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-zap\"><path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/></svg>"
      },
      {
        "heading": "Sleek, Professional Look",
        "summary": "The Auto-Vane Shutter automatically closes when not in use, creating a clean, modern appearance that suits any professional space. Perfect for environments where aesthetics matter.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
      },
      {
        "heading": "Flexible Control Options",
        "summary": "Choose the control system that works best for your space. From the advanced weekly programming of the Deluxe PAR Controller to simple wired remote options, you can customize how you manage your comfort.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
      },
      {
        "heading": "Perfect for Technical Spaces",
        "summary": "Specially designed for areas with sensitive equipment, this unit excels in server rooms and laboratories. Its precise temperature control and efficient cooling protect your valuable equipment while keeping energy costs down.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
      },
      {
        "heading": "Versatile Installation",
        "summary": "The optional drain pump allows installation almost anywhere, with drainage possible up to 800mm above the unit. This flexibility makes it easy to place the unit exactly where you need it, even without direct outdoor access.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
      },
      {
        "heading": "Advanced Air Filtration",
        "summary": "Create a healthier indoor environment with the optional Plasma Quad Connect. This hospital-grade filtration system removes dust, allergens, and other particles, ensuring clean, fresh air throughout your space all year round.",
        "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wind\"><path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/></svg>"
      }
    ],
    "media": [
      {
        "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F74d4e9ce79274bc5950567925d8a8549"
      }
    ],
    "name": "PKA Series",
    "thumbnailImage": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F29d2deff760144bf8a50b547fc8ab894",
    "brand": {
      "@type": "@builder.io/core:Reference",
      "id": "0591a853e7714ed6a4f8dbef86c88e42",
      "model": "hvac-brand",
      "value": {
        "query": [],
        "folders": [],
        "createdDate": 1743229619600,
        "id": "0591a853e7714ed6a4f8dbef86c88e42",
        "name": "Mitsubishi Electric ",
        "modelId": "c83b6d8730a447c38c60569d5d5de9a3",
        "published": "published",
        "meta": {
          "breakpoints": {
            "small": 767,
            "medium": 1479
          },
          "lastPreviewUrl": "",
          "kind": "data"
        },
        "data": {
          "name": "Mitsubishi Electric ",
          "logo": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F9cf73b17aa4946429b30f3a4bc53a136"
        },
        "variations": {},
        "lastUpdated": 1745557275209,
        "firstPublished": 1743229763629,
        "testRatio": 1,
        "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
        "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
        "rev": "pv7rk0gdbek"
      }
    },
    "airFiltration": {
      "dustCollectionFilter": true,
      "antibacterialFilter": true
    },
    "color": [
      {
        "color": "rgba(255, 255, 255, 1)",
        "name": "White"
      }
    ],
    "warrantyOptions": [
      {
        "transferable": true,
        "type": "Full Coverage",
        "documents": [
          {
            "file": "https://www.mitsubishi-electric.co.nz/materials/warranty/aircon.pdf"
          }
        ],
        "durationYears": 5
      }
    ],
    "description": "The PKA Series delivers powerful, efficient climate control in a sleek, professional package. Perfect for technical spaces like server rooms and laboratories, it combines precise temperature control with advanced features that make maintenance simple. Its flexible installation options and choice of control systems let you customize the perfect solution for your space. With energy-efficient operation and optional hospital-grade air filtration, it creates a comfortable, healthy environment while keeping running costs low.",
    "servicePlans": [
      {
        "plan": {
          "@type": "@builder.io/core:Reference",
          "id": "99750f450ffe46508d63e71cfef287ae",
          "model": "hvac-servicing",
          "value": {
            "query": [],
            "folders": [],
            "createdDate": 1742693236497,
            "id": "99750f450ffe46508d63e71cfef287ae",
            "name": "Annual Heat Pump Service",
            "modelId": "4c8ceced5bc240deb161f4523eac1c1a",
            "published": "published",
            "meta": {
              "kind": "data",
              "lastPreviewUrl": "",
              "breakpoints": {
                "small": 767,
                "medium": 1479
              }
            },
            "data": {
              "type": "Annual Heat Pump Service",
              "description": "<p>Keep your heat pump running efficiently year-round with our comprehensive Annual Service. This preventative maintenance visit ensures your system operates at peak performance, reduces energy usage, and helps extend the life of your unit.</p><h4><strong>What's Included:</strong></h4><ul><li>Full inspection of indoor and outdoor units</li><li>Cleaning of air filters and grills</li><li>Check and clean of condensate drain and tray</li><li>Refrigerant pressure and system performance checks</li><li>Electrical connection and control checks</li><li>Airflow and temperature output testing</li><li>System function test in heating and cooling modes</li></ul><p>Our certified technician will also identify any potential issues early — helping to avoid costly repairs and ensure your unit remains under warranty where applicable.</p><h4><strong>Recommended:</strong></h4><p>Once every 12 months for residential systems (more frequently in commercial or high-use environments).</p>",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"50\" height=\"50\" viewBox=\"0 0 50 50\">\n<path d=\"M 49.601563 8.898438 C 49.5 8.601563 49.199219 8.300781 48.898438 8.300781 C 48.601563 8.199219 48.199219 8.300781 48 8.601563 L 42.699219 13.898438 C 42.398438 14.199219 41.800781 14.199219 41.5 13.898438 L 36.199219 8.601563 C 35.898438 8.300781 35.898438 7.699219 36.199219 7.398438 L 41.5 2 C 41.699219 1.800781 41.800781 1.398438 41.800781 1.101563 C 41.699219 0.800781 41.5 0.5 41.199219 0.398438 C 37.199219 -1 30.800781 1.898438 28.199219 4.5 C 25.601563 7.101563 25.300781 10.699219 27.398438 14.601563 L 27.199219 14.800781 L 25 12.5 C 23.101563 10.398438 20.5 9.199219 17.601563 9.101563 C 14.699219 9 12.101563 10.101563 10.101563 12.101563 L 3.101563 19.101563 C -0.898438 23.101563 -0.898438 29.601563 3.101563 33.601563 L 5 35.5 L 2 38.300781 C 1.199219 39.101563 0.300781 40.5 0 42.300781 C -0.101563 43.800781 0 45.898438 2 48 C 3.601563 49.601563 5.300781 50 6.699219 50 C 7 50 7.398438 50 7.699219 49.898438 C 9.5 49.601563 10.898438 48.699219 11.699219 47.898438 L 15.101563 44.398438 C 15.300781 44.398438 15.5 44.5 15.800781 44.5 C 17.398438 44.5 18.898438 43.699219 19.699219 42.398438 C 20.199219 42.601563 20.800781 42.699219 21.300781 42.699219 C 23.601563 42.699219 25.5 41.101563 25.898438 38.898438 C 26.199219 39 26.5 39 26.800781 39 C 29.101563 39 31 37.398438 31.398438 35.199219 C 31.699219 35.300781 32 35.300781 32.300781 35.300781 C 34.898438 35.300781 37 33.199219 37 30.601563 C 37 29.199219 36.300781 27.800781 35.199219 26.898438 L 33.199219 24.898438 L 35.398438 22.699219 C 39.300781 24.800781 42.800781 24.5 45.5 21.898438 C 48.101563 19.199219 51 12.800781 49.601563 8.898438 Z M 10.300781 46.5 C 9.800781 47 8.699219 47.699219 7.398438 47.898438 C 5.898438 48.101563 4.601563 47.601563 3.5 46.5 C 2.300781 45.300781 1.898438 44 2.101563 42.601563 C 2.300781 41.300781 3 40.300781 3.5 39.699219 L 6.398438 36.898438 L 12.199219 42.699219 C 12.5 43 12.800781 43.300781 13.199219 43.601563 Z M 34 28.398438 C 34.699219 28.898438 35.101563 29.699219 35.101563 30.5 C 35.101563 32 33.898438 33.199219 32.398438 33.199219 C 31.898438 33.199219 31.5 33.101563 31 32.800781 L 29.199219 31.699219 L 29.5 33.800781 C 29.5 33.898438 29.5 34 29.5 34.199219 C 29.5 35.699219 28.300781 36.898438 26.800781 36.898438 C 26.300781 36.898438 25.898438 36.800781 25.398438 36.5 L 23.601563 35.398438 L 23.898438 37.5 C 23.898438 37.601563 23.898438 37.699219 23.898438 37.898438 C 23.898438 39.398438 22.699219 40.601563 21.199219 40.601563 C 20.699219 40.601563 20.101563 40.398438 19.699219 40.101563 L 18.601563 39.398438 L 18.199219 40.601563 C 17.800781 41.699219 16.800781 42.398438 15.699219 42.398438 C 14.898438 42.398438 14.101563 42 13.601563 41.398438 L 4.398438 32.199219 C 1.199219 29 1.199219 23.699219 4.398438 20.5 L 11.398438 13.5 C 13 11.898438 15.199219 11 17.5 11.101563 C 19.800781 11.199219 21.898438 12.101563 23.5 13.898438 L 25.800781 16.300781 L 25.199219 16.898438 L 25 16.601563 C 24.601563 16.199219 24 16.199219 23.601563 16.601563 C 23.199219 17 23.199219 17.601563 23.601563 18 L 33.898438 28.300781 Z M 44 20.398438 C 41.300781 23.101563 38 22 35.699219 20.5 C 35.300781 20.300781 34.800781 20.300781 34.5 20.699219 L 31.800781 23.398438 L 26.601563 18.199219 L 29.300781 15.5 C 29.601563 15.199219 29.699219 14.699219 29.5 14.300781 C 28.101563 11.898438 27 8.601563 29.601563 6 C 31.5 4.101563 35.601563 2.101563 38.699219 2 L 34.800781 5.898438 C 33.699219 7 33.699219 8.800781 34.800781 10 L 40.101563 15.300781 C 41.199219 16.398438 43 16.398438 44.199219 15.300781 L 48.101563 11.398438 C 48 14.398438 45.898438 18.5 44 20.398438 Z\"></path>\n</svg>",
              "summary": "Keep your heat pump running efficiently year-round with our comprehensive Annual Service. This preventative maintenance visit ensures your system operates at peak performance, reduces energy usage, and helps extend the life of your unit.",
              "name": "Annual Heat Pump Service"
            },
            "variations": {},
            "lastUpdated": 1742693932692,
            "firstPublished": 1742693546552,
            "testRatio": 1,
            "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "rev": "2up3axtv6qp"
          }
        }
      },
      {
        "plan": {
          "@type": "@builder.io/core:Reference",
          "id": "ded7a1b3b77244579e453fb8c12f6a98",
          "model": "hvac-servicing",
          "value": {
            "query": [],
            "folders": [],
            "createdDate": 1742693800113,
            "id": "ded7a1b3b77244579e453fb8c12f6a98",
            "name": "Deep Clean ",
            "modelId": "4c8ceced5bc240deb161f4523eac1c1a",
            "published": "published",
            "meta": {
              "kind": "data",
              "lastPreviewUrl": "",
              "breakpoints": {
                "small": 767,
                "medium": 1479
              }
            },
            "data": {
              "name": "Deep Clean ",
              "type": "Annual Heat Pump Service",
              "summary": "Breathe easier and restore your heat pump to like-new condition with a professional Deep Clean. Over time, dust, mould, and bacteria can build up inside your unit — affecting air quality, reducing efficiency, and causing unpleasant odours. Our deep clean service targets the hidden grime that regular servicing can’t reach.",
              "description": "<p>Breathe easier and restore your heat pump to like-new condition with a professional Deep Clean. Over time, dust, mould, and bacteria can build up inside your unit — affecting air quality, reducing efficiency, and causing unpleasant odours. Our deep clean service targets the hidden grime that regular servicing can’t reach.</p><h4><strong>What's Included:</strong></h4><ul><li>Removal and deep cleaning of indoor unit casing and filters</li><li>High-pressure clean of the fan barrel and evaporator coil</li><li>Flushing of drain pan and condensate lines</li><li>Antibacterial treatment to kill mould, mildew, and bacteria</li><li>Optional: Outdoor unit rinse and inspection</li><li>System performance and airflow test post-clean</li></ul><p>This service is ideal for homes with pets, allergies, or if your unit hasn't had a deep clean in over a year. You’ll notice fresher air, better airflow, and improved energy efficiency immediately.</p><h4><strong>Recommended:</strong></h4><p>Every 1–2 years, in addition to your regular annual service.</p>",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"50\" height=\"50\" viewBox=\"0 0 50 50\">\n<path d=\"M 46.4375 -0.03125 C 46.269531 -0.0390625 46.097656 -0.0234375 45.9375 0 C 45.265625 0.09375 44.6875 0.421875 44.28125 1.03125 L 44.25 1.09375 L 44.21875 1.125 L 35.65625 17.21875 C 34.691406 16.859375 33.734375 16.648438 32.84375 16.625 C 31.882813 16.601563 30.976563 16.75 30.15625 17.09375 C 28.574219 17.753906 27.378906 19.046875 26.59375 20.6875 C 26.558594 20.738281 26.527344 20.789063 26.5 20.84375 C 26.496094 20.851563 26.503906 20.867188 26.5 20.875 C 26.488281 20.894531 26.476563 20.917969 26.46875 20.9375 C 26.457031 20.976563 26.445313 21.019531 26.4375 21.0625 C 25.894531 22.417969 25.269531 23.636719 24.5625 24.71875 C 24.554688 24.730469 24.539063 24.738281 24.53125 24.75 C 24.441406 24.828125 24.367188 24.925781 24.3125 25.03125 C 24.308594 25.039063 24.316406 25.054688 24.3125 25.0625 C 24.277344 25.113281 24.246094 25.164063 24.21875 25.21875 C 21.832031 28.636719 18.722656 30.695313 15.78125 31.96875 C 11.773438 33.703125 7.9375 33.886719 7.09375 33.8125 C 6.691406 33.773438 6.304688 33.976563 6.113281 34.332031 C 5.925781 34.6875 5.964844 35.125 6.21875 35.4375 C 17.613281 49.5 34.375 50 34.375 50 C 34.574219 50.003906 34.769531 49.949219 34.9375 49.84375 C 34.9375 49.84375 37.007813 48.53125 39.5 45.40625 C 41.371094 43.058594 43.503906 39.664063 45.34375 34.96875 C 45.355469 34.957031 45.363281 34.949219 45.375 34.9375 C 45.605469 34.722656 45.722656 34.410156 45.6875 34.09375 C 45.6875 34.082031 45.6875 34.074219 45.6875 34.0625 C 46.171875 32.753906 46.640625 31.378906 47.0625 29.875 C 47.078125 29.8125 47.089844 29.75 47.09375 29.6875 C 47.09375 29.675781 47.09375 29.667969 47.09375 29.65625 C 48.425781 26.21875 46.941406 22.433594 43.75 20.78125 L 49.9375 3.625 L 49.9375 3.59375 L 49.96875 3.5625 C 50.171875 2.851563 49.9375 2.167969 49.5625 1.625 C 49.207031 1.113281 48.6875 0.710938 48.0625 0.4375 L 48.0625 0.40625 C 48.042969 0.398438 48.019531 0.414063 48 0.40625 C 47.988281 0.402344 47.980469 0.378906 47.96875 0.375 C 47.480469 0.144531 46.945313 -0.0117188 46.4375 -0.03125 Z M 46.3125 2.0625 C 46.539063 2.027344 46.835938 2.027344 47.15625 2.1875 L 47.1875 2.21875 L 47.21875 2.21875 C 47.542969 2.347656 47.8125 2.566406 47.9375 2.75 C 48.0625 2.933594 48.027344 3.042969 48.03125 3.03125 L 41.9375 19.9375 C 41.203125 19.605469 40.695313 19.371094 39.65625 18.90625 C 38.882813 18.558594 38.148438 18.222656 37.5 17.9375 L 45.9375 2.15625 C 45.929688 2.164063 46.085938 2.097656 46.3125 2.0625 Z M 4 8 C 1.800781 8 0 9.800781 0 12 C 0 14.199219 1.800781 16 4 16 C 6.199219 16 8 14.199219 8 12 C 8 9.800781 6.199219 8 4 8 Z M 4 10 C 5.117188 10 6 10.882813 6 12 C 6 13.117188 5.117188 14 4 14 C 2.882813 14 2 13.117188 2 12 C 2 10.882813 2.882813 10 4 10 Z M 13 11 C 11.894531 11 11 11.894531 11 13 C 11 14.105469 11.894531 15 13 15 C 14.105469 15 15 14.105469 15 13 C 15 11.894531 14.105469 11 13 11 Z M 11.5 18 C 8.472656 18 6 20.472656 6 23.5 C 6 26.527344 8.472656 29 11.5 29 C 14.527344 29 17 26.527344 17 23.5 C 17 20.472656 14.527344 18 11.5 18 Z M 32.8125 18.625 C 33.507813 18.644531 34.269531 18.785156 35.125 19.125 C 35.144531 19.136719 35.167969 19.148438 35.1875 19.15625 C 35.414063 19.511719 35.839844 19.6875 36.25 19.59375 C 36.363281 19.640625 36.351563 19.636719 36.46875 19.6875 C 37.144531 19.980469 37.996094 20.339844 38.84375 20.71875 C 40.085938 21.273438 40.871094 21.613281 41.59375 21.9375 C 41.613281 21.960938 41.632813 21.980469 41.65625 22 C 41.871094 22.296875 42.230469 22.453125 42.59375 22.40625 C 42.605469 22.40625 42.613281 22.40625 42.625 22.40625 C 45.015625 23.5 46.070313 26.105469 45.25 28.625 C 44.855469 28.613281 44.554688 28.632813 43.8125 28.46875 C 43.257813 28.347656 42.71875 28.152344 42.3125 27.90625 C 41.90625 27.660156 41.671875 27.417969 41.5625 27.09375 C 41.476563 26.8125 41.269531 26.585938 40.996094 26.472656 C 40.726563 26.355469 40.417969 26.367188 40.15625 26.5 C 39.820313 26.667969 38.972656 26.605469 38.21875 26.21875 C 37.84375 26.027344 37.507813 25.757813 37.28125 25.53125 C 37.054688 25.304688 36.992188 25.089844 37 25.125 C 36.945313 24.832031 36.765625 24.578125 36.503906 24.433594 C 36.246094 24.289063 35.933594 24.269531 35.65625 24.375 C 35.628906 24.386719 35.296875 24.417969 34.90625 24.34375 C 34.515625 24.269531 34.0625 24.109375 33.625 23.90625 C 33.1875 23.703125 32.785156 23.457031 32.53125 23.25 C 32.277344 23.042969 32.253906 22.828125 32.28125 23.09375 C 32.214844 22.566406 31.75 22.179688 31.21875 22.21875 C 30.214844 22.3125 29.273438 21.574219 28.71875 21.09375 C 29.304688 20.105469 30.03125 19.316406 30.9375 18.9375 C 31.492188 18.707031 32.117188 18.605469 32.8125 18.625 Z M 11.5 20 C 13.445313 20 15 21.554688 15 23.5 C 15 25.445313 13.445313 27 11.5 27 C 9.554688 27 8 25.445313 8 23.5 C 8 21.554688 9.554688 20 11.5 20 Z M 27.8125 22.96875 C 28.507813 23.46875 29.472656 23.988281 30.625 24.09375 C 30.808594 24.363281 31.007813 24.582031 31.25 24.78125 C 31.683594 25.140625 32.21875 25.457031 32.78125 25.71875 C 33.34375 25.980469 33.933594 26.199219 34.53125 26.3125 C 34.839844 26.371094 35.15625 26.253906 35.46875 26.25 C 35.617188 26.476563 35.683594 26.777344 35.875 26.96875 C 36.28125 27.375 36.765625 27.71875 37.3125 28 C 38.125 28.417969 39.101563 28.5625 40.0625 28.4375 C 40.390625 28.929688 40.785156 29.34375 41.25 29.625 C 41.933594 30.035156 42.679688 30.285156 43.375 30.4375 C 43.863281 30.542969 44.308594 30.589844 44.71875 30.625 C 44.441406 31.523438 44.140625 32.367188 43.84375 33.1875 C 43.484375 33.175781 43.042969 33.15625 42.5625 33.0625 C 41.46875 32.851563 40.433594 32.367188 40 31.53125 C 39.765625 31.09375 39.246094 30.894531 38.78125 31.0625 C 38.285156 31.238281 37.386719 31.164063 36.625 30.8125 C 35.863281 30.460938 35.285156 29.851563 35.15625 29.40625 C 35.074219 29.136719 34.878906 28.914063 34.621094 28.796875 C 34.367188 28.675781 34.074219 28.671875 33.8125 28.78125 C 33.570313 28.882813 32.625 28.855469 31.84375 28.5 C 31.0625 28.144531 30.558594 27.546875 30.5 27.21875 C 30.449219 26.941406 30.285156 26.703125 30.046875 26.554688 C 29.808594 26.40625 29.519531 26.363281 29.25 26.4375 C 28.304688 26.691406 27.566406 26.355469 26.96875 25.90625 C 26.761719 25.753906 26.609375 25.585938 26.46875 25.4375 C 26.953125 24.667969 27.402344 23.851563 27.8125 22.96875 Z M 25.3125 27.09375 C 25.460938 27.230469 25.601563 27.363281 25.78125 27.5 C 26.519531 28.054688 27.65625 28.449219 28.9375 28.375 C 29.402344 29.246094 30.15625 29.914063 31.03125 30.3125 C 31.894531 30.707031 32.816406 30.832031 33.71875 30.71875 C 34.21875 31.535156 34.914063 32.226563 35.78125 32.625 C 36.707031 33.050781 37.746094 33.160156 38.75 33 C 39.683594 34.167969 41.011719 34.804688 42.1875 35.03125 C 42.5 35.089844 42.808594 35.128906 43.09375 35.15625 C 41.429688 39.175781 39.566406 42.117188 37.9375 44.15625 C 35.851563 46.769531 34.441406 47.757813 34.125 47.96875 C 33.769531 47.953125 31.164063 47.769531 27.5 46.75 C 27.800781 46.554688 28.125 46.351563 28.46875 46.09375 C 30.136719 44.84375 32.320313 42.804688 34.4375 39.65625 C 34.660156 39.332031 34.675781 38.910156 34.472656 38.574219 C 34.269531 38.234375 33.890625 38.046875 33.5 38.09375 C 33.207031 38.125 32.945313 38.285156 32.78125 38.53125 C 30.796875 41.484375 28.753906 43.375 27.25 44.5 C 25.820313 45.570313 24.992188 45.902344 24.90625 45.9375 C 22.65625 45.144531 20.164063 44.058594 17.625 42.53125 C 17.992188 42.410156 18.382813 42.25 18.8125 42.0625 C 20.710938 41.234375 23.25 39.6875 25.84375 36.78125 C 26.15625 36.46875 26.226563 35.988281 26.019531 35.601563 C 25.808594 35.210938 25.371094 35.003906 24.9375 35.09375 C 24.707031 35.132813 24.496094 35.257813 24.34375 35.4375 C 21.9375 38.128906 19.683594 39.496094 18.03125 40.21875 C 16.378906 40.941406 15.4375 41 15.4375 41 C 15.394531 41.007813 15.351563 41.019531 15.3125 41.03125 C 13.238281 39.570313 11.167969 37.792969 9.21875 35.65625 C 11.121094 35.507813 13.570313 35.121094 16.59375 33.8125 C 19.578125 32.519531 22.761719 30.410156 25.3125 27.09375 Z\"></path>\n</svg>"
            },
            "variations": {},
            "lastUpdated": 1742693980852,
            "firstPublished": 1742693884713,
            "testRatio": 1,
            "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "rev": "f8w4h5loul6"
          }
        }
      }
    ],
    "relatedAccessories": [
      {
        "accessory": {
          "@type": "@builder.io/core:Reference",
          "id": "870534bc8ae0432289813e1c60eb57ce",
          "model": "hvac-unit-accessories",
          "value": {
            "query": [],
            "folders": [],
            "createdDate": 1742706453384,
            "id": "870534bc8ae0432289813e1c60eb57ce",
            "name": "Wi-Fi Controller",
            "modelId": "d8424994ed9c41439d24043e71aa5866",
            "published": "published",
            "meta": {
              "breakpoints": {
                "small": 767,
                "medium": 1479
              },
              "kind": "data",
              "lastPreviewUrl": ""
            },
            "data": {
              "show": true,
              "pricing": {},
              "brand": "Mitsubishi",
              "name": "Wi-Fi Controller"
            },
            "variations": {},
            "lastUpdated": 1742706467263,
            "firstPublished": 1742706467251,
            "testRatio": 1,
            "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "rev": "qq518g1145"
          }
        }
      },
      {
        "accessory": {
          "@type": "@builder.io/core:Reference",
          "id": "208731b22aa54ef19c90c6d99b844a45",
          "model": "hvac-unit-accessories",
          "value": {
            "query": [],
            "folders": [],
            "createdDate": 1742706500027,
            "id": "208731b22aa54ef19c90c6d99b844a45",
            "name": "Heat Pump Cover",
            "modelId": "d8424994ed9c41439d24043e71aa5866",
            "published": "published",
            "meta": {
              "breakpoints": {
                "small": 767,
                "medium": 1479
              },
              "kind": "data",
              "lastPreviewUrl": ""
            },
            "data": {
              "show": true,
              "pricing": {},
              "name": "Heat Pump Cover"
            },
            "variations": {},
            "lastUpdated": 1742706513741,
            "firstPublished": 1742706513731,
            "testRatio": 1,
            "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "rev": "2n14xlmgprf"
          }
        }
      },
      {
        "accessory": {
          "@type": "@builder.io/core:Reference",
          "id": "f3e61ba2f75d45a581c286c8e369e3b6",
          "model": "hvac-unit-accessories",
          "value": {
            "query": [],
            "folders": [],
            "createdDate": 1742706625494,
            "id": "f3e61ba2f75d45a581c286c8e369e3b6",
            "name": "Controller",
            "modelId": "d8424994ed9c41439d24043e71aa5866",
            "published": "published",
            "meta": {
              "breakpoints": {
                "small": 767,
                "medium": 1479
              },
              "kind": "data",
              "lastPreviewUrl": ""
            },
            "data": {
              "show": true,
              "pricing": {},
              "name": "Controller"
            },
            "variations": {},
            "lastUpdated": 1742706636051,
            "firstPublished": 1742706636037,
            "testRatio": 1,
            "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
            "rev": "tmpw51pjglj"
          }
        }
      }
    ],
    "class": "Plus",
    "sizes": [
      {
        "sku": "MSZ-PKA71KAL",
        "name": "PKA71"
      },
      {
        "sku": "MSZ-PKA80KAL",
        "name": "PKA80"
      }
    ],
    "documents": [
      {
        "name": "Operation Manual / User Guide",
        "file": "https://mitsubishi-electric.co.nz/materials/aircon/manuals/r32/p-series/pka-m/1_operation/om_pka-m60-100ka(l)_rg79y870h01_eng.pdf"
      },
      {
        "name": "Cleaning Instructions",
        "file": "https://www.mitsubishi-electric.co.nz/materials/Aircon/Info_Guides/Cleaning-Your-Heat-Pump.pdf"
      }
    ]
  },
  "rev": "hxekm2te14i"
}
```


---


### testimonial

**Status:** ✅ Perfect Match
**Has Content:** 📄 Yes
**Schema Fields:** 5
**Content Fields:** 5






**Sample Content Structure:**
```json
{
  "query": [],
  "folders": [],
  "createdDate": 1744000607863,
  "id": "d9ed986643264ac6a90b8bfe4423d56d",
  "name": "John Bloggs",
  "modelId": "01fd93a2f8aa49028bfd6d26c4932278",
  "published": "published",
  "meta": {
    "kind": "data",
    "originalContentId": "b2988328971744d0950637b82750d83c",
    "lastPreviewUrl": "",
    "breakpoints": {
      "small": 767,
      "medium": 1479
    },
    "winningTest": null
  },
  "data": {
    "image": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2Fefea950a1b9c47cc8f1079d36066d199",
    "date": "Wed Oct 16 2024 00:00:00 GMT+1300 (New Zealand Daylight Time)",
    "description": "<p><strong style=\"font-size: 14px;\">Lorem Ipsum</strong><span style=\"font-size: 14px;\">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span></p>",
    "rating": 5,
    "fullName": "John Bloggs"
  },
  "variations": {},
  "lastUpdated": 1744000618056,
  "firstPublished": 1744000618050,
  "testRatio": 1,
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "rev": "vtl80j4zn2m"
}
```


---


### hvac-use-case

**Status:** ✅ Perfect Match
**Has Content:** 📄 Yes
**Schema Fields:** 6
**Content Fields:** 6






**Sample Content Structure:**
```json
{
  "query": [],
  "folders": [],
  "createdDate": 1742625550667,
  "id": "6557f02879c64b35a4d919614c52cb80",
  "name": "Extra Large House",
  "modelId": "0f6fb2207b894668a25ea442ba97a051",
  "published": "published",
  "meta": {
    "breakpoints": {
      "small": 767,
      "medium": 1479
    },
    "kind": "data",
    "lastPreviewUrl": ""
  },
  "data": {
    "spaceVolume": "600m3",
    "powerCapacity": "18kw",
    "spaceArea": "250m2",
    "spaceCeilingHeight": "3m",
    "name": "Extra Large House",
    "order": 9
  },
  "variations": {},
  "lastUpdated": 1743315453626,
  "firstPublished": 1742625558829,
  "testRatio": 1,
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "rev": "m7gbejwttzr"
}
```


---


### hvac-unit

**Status:** ⚠️ Partial Match
**Has Content:** 📄 Yes
**Schema Fields:** 15
**Content Fields:** 13


**Missing in Content:**
- tags
- similarProducts





**Sample Content Structure:**
```json
{
  "id": "b8b662daad3a454aad1b82d48339052d",
  "name": "AP60",
  "published": "published",
  "createdDate": 1743288329586,
  "modelId": "442c1b28773c4e149a70ba26a4834f62",
  "data": {
    "name": "AP60",
    "sku": "MSZ-AP60VGKD2",
    "model": "Plus AP60 High Wall Heat Pump",
    "useCase": {
      "@type": "@builder.io/core:Reference",
      "id": "7837ea59cd8041c5a4ef3b23f4f812e4",
      "model": "hvac-use-case",
      "value": {
        "query": [],
        "folders": [],
        "createdDate": 1742625456571,
        "id": "7837ea59cd8041c5a4ef3b23f4f812e4",
        "name": "Extra Large Room",
        "modelId": "0f6fb2207b894668a25ea442ba97a051",
        "published": "published",
        "meta": {
          "lastPreviewUrl": "",
          "kind": "data",
          "breakpoints": {
            "small": 767,
            "medium": 1479
          }
        },
        "data": {
          "name": "Extra Large Room",
          "order": 5,
          "spaceVolume": "100m3",
          "powerCapacity": "6.0KW",
          "spaceArea": "40m2",
          "spaceCeilingHeight": "2.7m"
        },
        "variations": {},
        "lastUpdated": 1743315419094,
        "firstPublished": 1742625491371,
        "testRatio": 1,
        "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
        "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
        "rev": "py8jxnzsyuc"
      }
    },
    "series": {
      "@type": "@builder.io/core:Reference",
      "id": "ac6cd7cd211d4d28acc33efd9d9e0ecc",
      "model": "hvac-unit-series",
      "value": {
        "id": "ac6cd7cd211d4d28acc33efd9d9e0ecc",
        "name": "AP Plus Series",
        "published": "published",
        "createdDate": 1743235763824,
        "modelId": "017645db0453454b8f5f6ff753822eb9",
        "data": {
          "seriesCode": "AP",
          "unitConfig": "High Wall Mounted",
          "smartFeatures": {
            "energyTracking": true,
            "voiceControl": true,
            "appControl": true,
            "homeAutomationIntegration": true
          },
          "keyFeatures": [
            {
              "heading": "Whisper-Quiet Comfort",
              "summary": "Experience New Zealand's quietest heat pump at just 18dBA - perfect for light sleepers and peaceful living spaces. It's so quiet, you might forget it's there, even on the coldest winter nights.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-sofa\"><path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/><path d=\"M4 18v2\"/><path d=\"M20 18v2\"/><path d=\"M12 4v9\"/></svg>"
            },
            {
              "heading": "Advanced Quiet Technology",
              "summary": "Enjoy whisper-quiet operation thanks to clever engineering: a thinner heat exchanger and larger fan working together to move air more efficiently. This means maximum comfort with minimal noise.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
            },
            {
              "heading": "Smart Energy Tracking",
              "summary": "Take control of your power bills with built-in energy monitoring. See exactly how much energy you're using and what it costs - right from your smartphone. A simple 1°C adjustment can save up to 10% on your energy use.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-gauge\"><path d=\"M15.6 2.7a10 10 0 1 0 5.7 5.7\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M13.4 10.6 L19 5\"/></svg>"
            },
            {
              "heading": "Control from Anywhere",
              "summary": "Never come home to a cold house again. Built-in Wi-Fi lets you warm up or cool down your home from anywhere using your smartphone. Perfect for unexpected schedule changes or preparing your home for your return.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wifi\"><path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.859a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/></svg>"
            },
            {
              "heading": "Self-Cleaning Technology",
              "summary": "The unique Dual Barrier Coating keeps your heat pump clean and efficient year-round. It prevents dust and dirt build-up inside the unit, maintaining peak performance and eliminating unwanted odors while reducing running costs.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
            },
            {
              "heading": "Energy-Efficient Performance",
              "summary": "Save on power bills with next-generation R32 technology. This advanced system delivers superior heating and cooling while using less energy, helping you stay comfortable for less.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-gauge\"><path d=\"M15.6 2.7a10 10 0 1 0 5.7 5.7\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M13.4 10.6 L19 5\"/></svg>"
            },
            {
              "heading": "Cleaner, Healthier Air",
              "summary": "Breathe easier with the washable Air Purifying Filter that captures dust, pollen, and other airborne particles. Perfect for allergy sufferers and families wanting cleaner indoor air.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wind\"><path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/></svg>"
            },
            {
              "heading": "Even Temperature Distribution",
              "summary": "The Wide and Long Airflow modes ensure every corner of your room stays comfortable. Perfect for open-plan spaces, these features let you direct air exactly where you need it.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wind\"><path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/></svg>"
            },
            {
              "heading": "Peaceful Night Mode",
              "summary": "Sleep soundly with Night Mode, which dims the lights, silences beeps, and reduces outdoor unit noise by 3dBA. Both you and your neighbors will enjoy peaceful nights.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-sofa\"><path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/><path d=\"M4 18v2\"/><path d=\"M20 18v2\"/><path d=\"M12 4v9\"/></svg>"
            },
            {
              "heading": "Draft-Free Comfort",
              "summary": "Stay cozy without feeling cold air blowing directly on you. The horizontal airflow system spreads air evenly across the ceiling first, creating consistent comfort throughout your room.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wind\"><path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/></svg>"
            },
            {
              "heading": "Smart Energy Saving",
              "summary": "The Econo Cool function intelligently adjusts airflow to make the room feel cooler while using less energy - perfect for managing summer cooling costs.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-gauge\"><path d=\"M15.6 2.7a10 10 0 1 0 5.7 5.7\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M13.4 10.6 L19 5\"/></svg>"
            },
            {
              "heading": "Convenient Memory Settings",
              "summary": "The i-Save Mode remembers your preferred temperature and fan settings, including an energy-saving 10°C setting for unoccupied rooms. One button press returns your room to perfect comfort.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-settings\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>"
            },
            {
              "heading": "Built for New Zealand Conditions",
              "summary": "The Blue Fin coating protects your heat pump from coastal air and environmental wear, making it perfect for New Zealand homes near the sea.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-leaf\"><path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"/></svg>"
            },
            {
              "heading": "Weekly Programming",
              "summary": "Set up to four temperature changes each day of the week. Wake up warm, come home to comfort, and save energy while you're away - all automatically.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-calendar-1\"><path d=\"M11 14h1v4\"/><path d=\"M16 2v4\"/><path d=\"M3 10h18\"/><path d=\"M8 2v4\"/><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\"/></svg>"
            },
            {
              "heading": "Optional Hospital-Grade Air Filtration",
              "summary": "Add the Plasma Quad Connect for ultimate air quality. This advanced system removes microscopic particles, allergens, and bacteria - bringing hospital-grade air purification to your home.",
              "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-wind\"><path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/></svg>"
            }
          ],
          "media": [
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F3951bb4604c94c6c9f5f675810b26a75"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2Fc4f708b103064fc9879b8f47184f7434"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2Ff25f5a202af242fc853f73af15c316ca"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2Fbdf823ff63454638b3be1a1f36a25109"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F5b71bb0a61ed4deaa86e234d78b89493"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F8f629d03108a4470b612e1d9c2983d73"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F88abceabc387415fb1b5b3726f01e4cb"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F35753736f53944f3a121070b20f5ae37"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2Fe9642b6645d54d50ae8d3abcc74cc1a8"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2Faa1b9d3cb7704a7c8b0583caff5ff239"
            },
            {
              "file": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F8e04eab0b1014ae4a050c6748726ba2e"
            }
          ],
          "name": "AP Plus Series",
          "thumbnailImage": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F9a95513c7a7042e2863f01fe18fcacb0",
          "brand": {
            "@type": "@builder.io/core:Reference",
            "id": "0591a853e7714ed6a4f8dbef86c88e42",
            "model": "hvac-brand"
          },
          "airFiltration": {
            "dustCollectionFilter": true,
            "antibacterialFilter": true
          },
          "color": [
            {
              "color": "rgba(255, 255, 255, 1)",
              "name": "White"
            }
          ],
          "warrantyOptions": [
            {
              "transferable": true,
              "type": "Full Coverage",
              "documents": [
                {
                  "file": "https://www.mitsubishi-electric.co.nz/materials/warranty/aircon.pdf"
                }
              ],
              "durationYears": 5
            }
          ],
          "description": "The AP Plus Series combines New Zealand's quietest heat pump technology with smart energy monitoring, making it the perfect choice for comfort-conscious homeowners. Starting at just 18dBA, it's whisper-quiet while delivering efficient heating and cooling throughout the year. With built-in Wi-Fi Energy Monitoring, homeowners can track and optimize their energy usage right from their smartphone. Its advanced features, including self-cleaning technology and superior air filtration, create the perfect balance of comfort, efficiency, and healthy air quality. Ideal for bedrooms and living spaces where both quietness and smart control matter most.",
          "servicePlans": [
            {
              "plan": {
                "@type": "@builder.io/core:Reference",
                "id": "99750f450ffe46508d63e71cfef287ae",
                "model": "hvac-servicing"
              }
            },
            {
              "plan": {
                "@type": "@builder.io/core:Reference",
                "id": "ded7a1b3b77244579e453fb8c12f6a98",
                "model": "hvac-servicing"
              }
            }
          ],
          "relatedAccessories": [
            {
              "accessory": {
                "@type": "@builder.io/core:Reference",
                "id": "870534bc8ae0432289813e1c60eb57ce",
                "model": "hvac-unit-accessories"
              }
            },
            {
              "accessory": {
                "@type": "@builder.io/core:Reference",
                "id": "208731b22aa54ef19c90c6d99b844a45",
                "model": "hvac-unit-accessories"
              }
            },
            {
              "accessory": {
                "@type": "@builder.io/core:Reference",
                "id": "f3e61ba2f75d45a581c286c8e369e3b6",
                "model": "hvac-unit-accessories"
              }
            }
          ],
          "class": "Premium",
          "sizes": [
            {
              "sku": "MSZ-AP25VGKD2",
              "name": "AP25"
            },
            {
              "sku": "MSZ-AP35VGKD2",
              "name": "AP35"
            },
            {
              "sku": "MSZ-AP42VGKD2",
              "name": "AP42"
            },
            {
              "sku": "MSZ-AP50VGKD2",
              "name": "AP50"
            },
            {
              "sku": "MSZ-AP60VGKD2",
              "name": "AP60"
            },
            {
              "sku": "MSZ-AP71VGKD2",
              "name": "AP71"
            },
            {
              "sku": "MSZ-AP80VGKD2",
              "name": "AP80"
            }
          ],
          "documents": [
            {
              "name": "Brochure",
              "file": "https://mitsubishi-electric.co.nz/materials/aircon/brochures/@msz-ap.pdf"
            },
            {
              "name": "Operation Manual / User Guide",
              "file": "https://mitsubishi-electric.co.nz/materials/aircon/manuals/r32/m-series/msz_muz-ap/1_operation/om_msz-ap25-50vg(k)d2_dg79a0clh01.pdf"
            },
            {
              "name": "Quick Start Guide",
              "file": "https://mitsubishi-electric.co.nz/materials/aircon/info_guides/heat-pump-guide-ap-series.pdf"
            },
            {
              "name": "Cleaning Instructions",
              "file": "https://www.mitsubishi-electric.co.nz/materials/Aircon/Info_Guides/Cleaning-Your-Heat-Pump.pdf"
            }
          ]
        },
        "rev": "vfw7ml1r96"
      }
    },
    "price": {
      "originalPrice": 2803.9,
      "isTaxIncluded": true,
      "currency": "NZD"
    },
    "stock": "In stock",
    "powerCapacity": {
      "coolingKw": 6,
      "heatingKw": 6.8,
      "sizeKw": 6,
      "dehumidifyingCapacityLh": 0
    },
    "energyEfficiency": {
      "annualEnergyEfficiencyRatio": 4.3,
      "starRating": 2.5,
      "annualHeatingConsumptionKw": 1.77,
      "zeroEnergyRatingLabel": {
        "heatingRating": {
          "hotRating": 2.5,
          "coldRating": 2,
          "mixedRating": 2
        },
        "coolingRating": {
          "hotRating": 4,
          "coldRating": 4,
          "mixedRating": 3.5
        }
      },
      "energyEfficiencyRatio": 4.2,
      "coefficientOfPerformance": 3.84,
      "annualCoolingConsumptionKw": 1.43,
      "annualCoefficientOfPerformance": 3.8
    },
    "customerReviews": {
      "reviews": [],
      "totalReviews": 0,
      "rating": 0
    },
    "physicalAttributes": {
      "indoorUnit": {
        "width": 1100,
        "height": 325,
        "depth": 257,
        "unit": "mm",
        "weight": {
          "value": 16,
          "unit": "kg"
        }
      },
      "outdoorUnit": {
        "width": 800,
        "height": 714,
        "depth": 285,
        "unit": "mm",
        "weight": {
          "value": 41,
          "unit": "kg"
        }
      }
    },
    "technical": {
      "heatingOperatingRange": {
        "minTemperature": "-15°C",
        "maxTemperature": "24°C"
      },
      "coolingOperatingRange": {
        "minTemperature": "-10°C",
        "maxTemperature": "46°C"
      },
      "refrigerantType": "R32",
      "powerSupply": "230V / Single Phase / 50Hz",
      "outdoorUnitNoiseDb": 49,
      "operationType": "Single Split, Inverter"
    },
    "shipping": {
      "shippingCost": "Contact dealer",
      "shippingTime": "Contact dealer",
      "dimensions": {
        "indoorUnit": {
          "width": 1100,
          "height": 325,
          "depth": 257,
          "unit": "mm",
          "weight": {
            "value": 16,
            "unit": "kg"
          }
        },
        "outdoorUnit": {
          "width": 800,
          "height": 714,
          "depth": 285,
          "unit": "mm",
          "weight": {
            "value": 41,
            "unit": "kg"
          }
        }
      }
    }
  },
  "rev": "c358p2462g"
}
```


---


### hvac-servicing

**Status:** ✅ Perfect Match
**Has Content:** 📄 Yes
**Schema Fields:** 5
**Content Fields:** 5






**Sample Content Structure:**
```json
{
  "query": [],
  "folders": [],
  "createdDate": 1742693800113,
  "id": "ded7a1b3b77244579e453fb8c12f6a98",
  "name": "Deep Clean ",
  "modelId": "4c8ceced5bc240deb161f4523eac1c1a",
  "published": "published",
  "meta": {
    "kind": "data",
    "lastPreviewUrl": "",
    "breakpoints": {
      "small": 767,
      "medium": 1479
    }
  },
  "data": {
    "name": "Deep Clean ",
    "type": "Annual Heat Pump Service",
    "summary": "Breathe easier and restore your heat pump to like-new condition with a professional Deep Clean. Over time, dust, mould, and bacteria can build up inside your unit — affecting air quality, reducing efficiency, and causing unpleasant odours. Our deep clean service targets the hidden grime that regular servicing can’t reach.",
    "description": "<p>Breathe easier and restore your heat pump to like-new condition with a professional Deep Clean. Over time, dust, mould, and bacteria can build up inside your unit — affecting air quality, reducing efficiency, and causing unpleasant odours. Our deep clean service targets the hidden grime that regular servicing can’t reach.</p><h4><strong>What's Included:</strong></h4><ul><li>Removal and deep cleaning of indoor unit casing and filters</li><li>High-pressure clean of the fan barrel and evaporator coil</li><li>Flushing of drain pan and condensate lines</li><li>Antibacterial treatment to kill mould, mildew, and bacteria</li><li>Optional: Outdoor unit rinse and inspection</li><li>System performance and airflow test post-clean</li></ul><p>This service is ideal for homes with pets, allergies, or if your unit hasn't had a deep clean in over a year. You’ll notice fresher air, better airflow, and improved energy efficiency immediately.</p><h4><strong>Recommended:</strong></h4><p>Every 1–2 years, in addition to your regular annual service.</p>",
    "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" width=\"50\" height=\"50\" viewBox=\"0 0 50 50\">\n<path d=\"M 46.4375 -0.03125 C 46.269531 -0.0390625 46.097656 -0.0234375 45.9375 0 C 45.265625 0.09375 44.6875 0.421875 44.28125 1.03125 L 44.25 1.09375 L 44.21875 1.125 L 35.65625 17.21875 C 34.691406 16.859375 33.734375 16.648438 32.84375 16.625 C 31.882813 16.601563 30.976563 16.75 30.15625 17.09375 C 28.574219 17.753906 27.378906 19.046875 26.59375 20.6875 C 26.558594 20.738281 26.527344 20.789063 26.5 20.84375 C 26.496094 20.851563 26.503906 20.867188 26.5 20.875 C 26.488281 20.894531 26.476563 20.917969 26.46875 20.9375 C 26.457031 20.976563 26.445313 21.019531 26.4375 21.0625 C 25.894531 22.417969 25.269531 23.636719 24.5625 24.71875 C 24.554688 24.730469 24.539063 24.738281 24.53125 24.75 C 24.441406 24.828125 24.367188 24.925781 24.3125 25.03125 C 24.308594 25.039063 24.316406 25.054688 24.3125 25.0625 C 24.277344 25.113281 24.246094 25.164063 24.21875 25.21875 C 21.832031 28.636719 18.722656 30.695313 15.78125 31.96875 C 11.773438 33.703125 7.9375 33.886719 7.09375 33.8125 C 6.691406 33.773438 6.304688 33.976563 6.113281 34.332031 C 5.925781 34.6875 5.964844 35.125 6.21875 35.4375 C 17.613281 49.5 34.375 50 34.375 50 C 34.574219 50.003906 34.769531 49.949219 34.9375 49.84375 C 34.9375 49.84375 37.007813 48.53125 39.5 45.40625 C 41.371094 43.058594 43.503906 39.664063 45.34375 34.96875 C 45.355469 34.957031 45.363281 34.949219 45.375 34.9375 C 45.605469 34.722656 45.722656 34.410156 45.6875 34.09375 C 45.6875 34.082031 45.6875 34.074219 45.6875 34.0625 C 46.171875 32.753906 46.640625 31.378906 47.0625 29.875 C 47.078125 29.8125 47.089844 29.75 47.09375 29.6875 C 47.09375 29.675781 47.09375 29.667969 47.09375 29.65625 C 48.425781 26.21875 46.941406 22.433594 43.75 20.78125 L 49.9375 3.625 L 49.9375 3.59375 L 49.96875 3.5625 C 50.171875 2.851563 49.9375 2.167969 49.5625 1.625 C 49.207031 1.113281 48.6875 0.710938 48.0625 0.4375 L 48.0625 0.40625 C 48.042969 0.398438 48.019531 0.414063 48 0.40625 C 47.988281 0.402344 47.980469 0.378906 47.96875 0.375 C 47.480469 0.144531 46.945313 -0.0117188 46.4375 -0.03125 Z M 46.3125 2.0625 C 46.539063 2.027344 46.835938 2.027344 47.15625 2.1875 L 47.1875 2.21875 L 47.21875 2.21875 C 47.542969 2.347656 47.8125 2.566406 47.9375 2.75 C 48.0625 2.933594 48.027344 3.042969 48.03125 3.03125 L 41.9375 19.9375 C 41.203125 19.605469 40.695313 19.371094 39.65625 18.90625 C 38.882813 18.558594 38.148438 18.222656 37.5 17.9375 L 45.9375 2.15625 C 45.929688 2.164063 46.085938 2.097656 46.3125 2.0625 Z M 4 8 C 1.800781 8 0 9.800781 0 12 C 0 14.199219 1.800781 16 4 16 C 6.199219 16 8 14.199219 8 12 C 8 9.800781 6.199219 8 4 8 Z M 4 10 C 5.117188 10 6 10.882813 6 12 C 6 13.117188 5.117188 14 4 14 C 2.882813 14 2 13.117188 2 12 C 2 10.882813 2.882813 10 4 10 Z M 13 11 C 11.894531 11 11 11.894531 11 13 C 11 14.105469 11.894531 15 13 15 C 14.105469 15 15 14.105469 15 13 C 15 11.894531 14.105469 11 13 11 Z M 11.5 18 C 8.472656 18 6 20.472656 6 23.5 C 6 26.527344 8.472656 29 11.5 29 C 14.527344 29 17 26.527344 17 23.5 C 17 20.472656 14.527344 18 11.5 18 Z M 32.8125 18.625 C 33.507813 18.644531 34.269531 18.785156 35.125 19.125 C 35.144531 19.136719 35.167969 19.148438 35.1875 19.15625 C 35.414063 19.511719 35.839844 19.6875 36.25 19.59375 C 36.363281 19.640625 36.351563 19.636719 36.46875 19.6875 C 37.144531 19.980469 37.996094 20.339844 38.84375 20.71875 C 40.085938 21.273438 40.871094 21.613281 41.59375 21.9375 C 41.613281 21.960938 41.632813 21.980469 41.65625 22 C 41.871094 22.296875 42.230469 22.453125 42.59375 22.40625 C 42.605469 22.40625 42.613281 22.40625 42.625 22.40625 C 45.015625 23.5 46.070313 26.105469 45.25 28.625 C 44.855469 28.613281 44.554688 28.632813 43.8125 28.46875 C 43.257813 28.347656 42.71875 28.152344 42.3125 27.90625 C 41.90625 27.660156 41.671875 27.417969 41.5625 27.09375 C 41.476563 26.8125 41.269531 26.585938 40.996094 26.472656 C 40.726563 26.355469 40.417969 26.367188 40.15625 26.5 C 39.820313 26.667969 38.972656 26.605469 38.21875 26.21875 C 37.84375 26.027344 37.507813 25.757813 37.28125 25.53125 C 37.054688 25.304688 36.992188 25.089844 37 25.125 C 36.945313 24.832031 36.765625 24.578125 36.503906 24.433594 C 36.246094 24.289063 35.933594 24.269531 35.65625 24.375 C 35.628906 24.386719 35.296875 24.417969 34.90625 24.34375 C 34.515625 24.269531 34.0625 24.109375 33.625 23.90625 C 33.1875 23.703125 32.785156 23.457031 32.53125 23.25 C 32.277344 23.042969 32.253906 22.828125 32.28125 23.09375 C 32.214844 22.566406 31.75 22.179688 31.21875 22.21875 C 30.214844 22.3125 29.273438 21.574219 28.71875 21.09375 C 29.304688 20.105469 30.03125 19.316406 30.9375 18.9375 C 31.492188 18.707031 32.117188 18.605469 32.8125 18.625 Z M 11.5 20 C 13.445313 20 15 21.554688 15 23.5 C 15 25.445313 13.445313 27 11.5 27 C 9.554688 27 8 25.445313 8 23.5 C 8 21.554688 9.554688 20 11.5 20 Z M 27.8125 22.96875 C 28.507813 23.46875 29.472656 23.988281 30.625 24.09375 C 30.808594 24.363281 31.007813 24.582031 31.25 24.78125 C 31.683594 25.140625 32.21875 25.457031 32.78125 25.71875 C 33.34375 25.980469 33.933594 26.199219 34.53125 26.3125 C 34.839844 26.371094 35.15625 26.253906 35.46875 26.25 C 35.617188 26.476563 35.683594 26.777344 35.875 26.96875 C 36.28125 27.375 36.765625 27.71875 37.3125 28 C 38.125 28.417969 39.101563 28.5625 40.0625 28.4375 C 40.390625 28.929688 40.785156 29.34375 41.25 29.625 C 41.933594 30.035156 42.679688 30.285156 43.375 30.4375 C 43.863281 30.542969 44.308594 30.589844 44.71875 30.625 C 44.441406 31.523438 44.140625 32.367188 43.84375 33.1875 C 43.484375 33.175781 43.042969 33.15625 42.5625 33.0625 C 41.46875 32.851563 40.433594 32.367188 40 31.53125 C 39.765625 31.09375 39.246094 30.894531 38.78125 31.0625 C 38.285156 31.238281 37.386719 31.164063 36.625 30.8125 C 35.863281 30.460938 35.285156 29.851563 35.15625 29.40625 C 35.074219 29.136719 34.878906 28.914063 34.621094 28.796875 C 34.367188 28.675781 34.074219 28.671875 33.8125 28.78125 C 33.570313 28.882813 32.625 28.855469 31.84375 28.5 C 31.0625 28.144531 30.558594 27.546875 30.5 27.21875 C 30.449219 26.941406 30.285156 26.703125 30.046875 26.554688 C 29.808594 26.40625 29.519531 26.363281 29.25 26.4375 C 28.304688 26.691406 27.566406 26.355469 26.96875 25.90625 C 26.761719 25.753906 26.609375 25.585938 26.46875 25.4375 C 26.953125 24.667969 27.402344 23.851563 27.8125 22.96875 Z M 25.3125 27.09375 C 25.460938 27.230469 25.601563 27.363281 25.78125 27.5 C 26.519531 28.054688 27.65625 28.449219 28.9375 28.375 C 29.402344 29.246094 30.15625 29.914063 31.03125 30.3125 C 31.894531 30.707031 32.816406 30.832031 33.71875 30.71875 C 34.21875 31.535156 34.914063 32.226563 35.78125 32.625 C 36.707031 33.050781 37.746094 33.160156 38.75 33 C 39.683594 34.167969 41.011719 34.804688 42.1875 35.03125 C 42.5 35.089844 42.808594 35.128906 43.09375 35.15625 C 41.429688 39.175781 39.566406 42.117188 37.9375 44.15625 C 35.851563 46.769531 34.441406 47.757813 34.125 47.96875 C 33.769531 47.953125 31.164063 47.769531 27.5 46.75 C 27.800781 46.554688 28.125 46.351563 28.46875 46.09375 C 30.136719 44.84375 32.320313 42.804688 34.4375 39.65625 C 34.660156 39.332031 34.675781 38.910156 34.472656 38.574219 C 34.269531 38.234375 33.890625 38.046875 33.5 38.09375 C 33.207031 38.125 32.945313 38.285156 32.78125 38.53125 C 30.796875 41.484375 28.753906 43.375 27.25 44.5 C 25.820313 45.570313 24.992188 45.902344 24.90625 45.9375 C 22.65625 45.144531 20.164063 44.058594 17.625 42.53125 C 17.992188 42.410156 18.382813 42.25 18.8125 42.0625 C 20.710938 41.234375 23.25 39.6875 25.84375 36.78125 C 26.15625 36.46875 26.226563 35.988281 26.019531 35.601563 C 25.808594 35.210938 25.371094 35.003906 24.9375 35.09375 C 24.707031 35.132813 24.496094 35.257813 24.34375 35.4375 C 21.9375 38.128906 19.683594 39.496094 18.03125 40.21875 C 16.378906 40.941406 15.4375 41 15.4375 41 C 15.394531 41.007813 15.351563 41.019531 15.3125 41.03125 C 13.238281 39.570313 11.167969 37.792969 9.21875 35.65625 C 11.121094 35.507813 13.570313 35.121094 16.59375 33.8125 C 19.578125 32.519531 22.761719 30.410156 25.3125 27.09375 Z\"></path>\n</svg>"
  },
  "variations": {},
  "lastUpdated": 1742693980852,
  "firstPublished": 1742693884713,
  "testRatio": 1,
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "rev": "xyecntit8im"
}
```


---


### blog-post

**Status:** ⚠️ Partial Match
**Has Content:** 📄 Yes
**Schema Fields:** 10
**Content Fields:** 7


**Missing in Content:**
- thumbnail
- mainImage
- media





**Sample Content Structure:**
```json
{
  "id": "1b334360ced74933a1ce061220d2f39c",
  "name": "Understanding Condensation in Heat Pumps",
  "published": "published",
  "createdDate": 1749790838594,
  "modelId": "54ecf7bc07714bc9ba57e2edd72529ca",
  "data": {
    "category": "HVAC Maintenance",
    "name": "Understanding Condensation in Heat Pumps: Causes, Effects, and Solutions",
    "slug": "understanding-condensation-heat-pumps",
    "summary": "Learn about condensation in heat pump systems, why it occurs, and how to manage it effectively for optimal performance. This comprehensive guide covers causes, common areas, management strategies, and when to call a professional.",
    "body": "<h1>Understanding Condensation in Heat Pumps</h1><p>Condensation is a natural phenomenon that occurs in heat pump systems, and understanding it is crucial for proper maintenance and optimal performance.</p><h2>What Causes Condensation?</h2><p>Condensation in heat pumps occurs when warm, humid air comes into contact with the cold evaporator coils. This temperature difference causes water vapor in the air to condense into liquid water droplets.</p><h2>Common Areas Where Condensation Occurs</h2><ul><li><strong>Evaporator Coils:</strong> The primary location where condensation forms</li><li><strong>Ductwork:</strong> Especially in unconditioned spaces</li><li><strong>Indoor Unit:</strong> Around the air handler or indoor coil</li><li><strong>Outdoor Unit:</strong> During heating mode in cold weather</li></ul><h2>Managing Condensation</h2><p>Proper condensation management is essential for:</p><ul><li>Preventing water damage</li><li>Maintaining indoor air quality</li><li>Ensuring system efficiency</li><li>Avoiding mold and mildew growth</li></ul><h2>Solutions and Best Practices</h2><h3>1. Proper Drainage</h3><p>Ensure condensate drains are clear and properly sloped to allow water to flow away from the unit.</p><h3>2. Insulation</h3><p>Properly insulate ductwork and refrigerant lines to minimize temperature differences.</p><h3>3. Regular Maintenance</h3><p>Schedule regular maintenance to clean coils and check drainage systems.</p><h3>4. Humidity Control</h3><p>Maintain appropriate indoor humidity levels (30-50%) to reduce excessive condensation.</p><h2>When to Call a Professional</h2><p>Contact a qualified HVAC technician if you notice:</p><ul><li>Excessive water pooling around the unit</li><li>Water damage or staining</li><li>Musty odors indicating mold growth</li><li>Reduced system performance</li></ul><p>Understanding and properly managing condensation in your heat pump system will help ensure efficient operation and prevent costly repairs.</p>",
    "author": "HVAC Expert",
    "featured": false
  },
  "meta": {
    "title": "Understanding Condensation in Heat Pumps"
  },
  "rev": "dn3hetk9tj"
}
```


---


### page

**Status:** ⚠️ Partial Match
**Has Content:** 📄 Yes
**Schema Fields:** 5
**Content Fields:** 6


**Missing in Content:**
- description
- image
- list



**Extra in Content:**
- jsCode
- inputs
- url
- state



**Sample Content Structure:**
```json
{
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "folders": [],
  "data": {
    "jsCode": "var __awaiter=function(e,t,n,a){return new(n||(n=Promise))((function(r,i){function o(e){try{u(a.next(e))}catch(e){i(e)}}function l(e){try{u(a.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,l)}u((a=a.apply(e,t||[])).next())}))},__generator=function(e,t){var n,a,r,i,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return i={next:l(0),throw:l(1),return:l(2)},\"function\"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function l(i){return function(l){return function(i){if(n)throw new TypeError(\"Generator is already executing.\");for(;o;)try{if(n=1,a&&(r=2&i[0]?a.return:i[0]?a.throw||((r=a.return)&&r.call(a),0):a.next)&&!(r=r.call(a,i[1])).done)return r;switch(a=0,r&&(i=[2&i[0],r.value]),i[0]){case 0:case 1:r=i;break;case 4:return o.label++,{value:i[1],done:!1};case 5:o.label++,a=i[1],i=[0];continue;case 7:i=o.ops.pop(),o.trys.pop();continue;default:if(!(r=(r=o.trys).length>0&&r[r.length-1])&&(6===i[0]||2===i[0])){o=0;continue}if(3===i[0]&&(!r||i[1]>r[0]&&i[1]<r[3])){o.label=i[1];break}if(6===i[0]&&o.label<r[1]){o.label=r[1],r=i;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(i);break}r[2]&&o.ops.pop(),o.trys.pop();continue}i=t.call(e,o)}catch(e){i=[6,e],a=0}finally{n=r=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,l])}}};function main(){return __awaiter(this,void 0,void 0,(function(){var e;return __generator(this,(function(t){switch(t.label){case 0:return Builder.isServer,Builder.isBrowser,Builder.isServer||Builder.isEditing?void 0!==state.page?[3,2]:(e=location.pathname||state.location.pathname,[4,fetch(\"https://cdn.builder.io/api/v1/qwik/page?url=http%3A%2F%2Flocalhost%3A5173\".concat(e.replace(/\\//g,\"%2F\"),\"&apiKey=51506ff347d64e8396d0bb00d1642bff&limit=1&preview=true&cachebust=true&fields=id,name,data&omit=data.blocks,data.jsCode,data.tsCode,data.state,data.inputs,html\")).then((function(e){return e.ok?e.json():null})).then((function(e){e&&(delete e.html,Object.assign(e,e.data),delete e.data,state.page=e)}))]):[3,2];case 1:t.sent(),t.label=2;case 2:return[2]}}))}))}var _virtual_index=main();return _virtual_index",
    "inputs": [],
    "title": "less",
    "blocks": [
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Header",
        "tagName": "header",
        "id": "builder-548b203131904313b1bd619f7a11a322",
        "properties": {
          "data-theme": "primary"
        },
        "meta": {
          "previousId": "builder-abb0ece03fd8455295294309348482be"
        },
        "children": [
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "layerName": "Column",
            "id": "builder-290c0712c20b4c7786d279abacca4044",
            "class": "column",
            "meta": {
              "previousId": "builder-f4a9d39a548045da9cae2231663618f4"
            },
            "children": [
              {
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                "id": "builder-4c4a9a3f65f749f883206989de48fbdf",
                "meta": {
                  "previousId": "builder-a0c6608e50984054a7928900eaf4448f"
                },
                "component": {
                  "name": "Text",
                  "options": {
                    "text": "<h1>8 essential tips for whole home comfort this winter.</h1><p style=\"text-align: justify;\"><strong>Choosing the best heat pump/air conditioner can be a challenge, What size do you need? How much will it cost to run and how noisy will it be? Protect your family's health &amp; well being by getting access to our Free Home Heating &amp; Cooling Cheat Sheet</strong></p>"
                  }
                },
                "responsiveStyles": {
                  "large": {
                    "--heading-one-font-size": "var(--h1-font-size)"
                  },
                  "medium": {
                    "--heading-one-font-size": "var(--h4-font-size)"
                  },
                  "small": {
                    "--heading-one-font-size": "var(--h3-font-size)"
                  }
                }
              },
              {
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                "layerName": "Button",
                "id": "builder-6039fd1f6f1744169d91d9f78ce50c96",
                "class": "btn",
                "meta": {
                  "previousId": "builder-45b70979e08942c788a43166b8d404d1"
                },
                "component": {
                  "name": "Core:Button",
                  "options": {
                    "text": "Click me! __arrow-right",
                    "openLinkInNewTab": false
                  }
                }
              }
            ],
            "responsiveStyles": {
              "large": {
                "maxInlineSize": "45vw",
                "justifySelf": "center",
                "top": "50vh",
                "position": "fixed",
                "--column-translate-x": "-25vw"
              },
              "small": {
                "maxInlineSize": "80vw",
                "--column-translate-x": "calc(var(--section-grid-horizontal-gutter) * -1)"
              }
            }
          },
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "layerName": "Background",
            "id": "builder-0910a8f3d4384415b69935ea14dbe7e1",
            "meta": {
              "previousId": "builder-39d78c9c5bdb44a3bfbcb4a556d96125"
            },
            "children": [
              {
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                "layerName": "Wrapper",
                "id": "builder-c078fd084f1f430cad0a2a78a4ebc671",
                "class": "background-wrapper",
                "meta": {
                  "previousId": "builder-8e4a32bb33b54562bb4e32d578223fd7"
                },
                "children": [
                  {
                    "@type": "@builder.io/sdk:Element",
                    "@version": 2,
                    "layerName": "Living Room Background",
                    "id": "builder-b644a34dfe744bf58860a0fa4a55c036",
                    "class": "background-image",
                    "meta": {
                      "previousId": "builder-847434071e0b48a7a7f56ef4dfec3d4d"
                    },
                    "children": [
                      {
                        "@type": "@builder.io/sdk:Element",
                        "@version": 2,
                        "layerName": "Heat pump",
                        "id": "builder-38b63f619e2d4a45a2ce4a7327ed9614",
                        "meta": {
                          "previousId": "builder-e0fa522192d2463591d5b8c4165af6f2"
                        },
                        "component": {
                          "name": "Image",
                          "options": {
                            "image": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F52a49ab1c1ce49bebc896b590a29ef3a",
                            "backgroundSize": "contain",
                            "backgroundPosition": "center",
                            "lazy": false,
                            "fitContent": true,
                            "aspectRatio": 0.324,
                            "lockAspectRatio": true,
                            "height": 311,
                            "width": 960,
                            "highPriority": true,
                            "altText": "Mitsubishi Heat Pump"
                          }
                        },
                        "children": [
                          {
                            "@type": "@builder.io/sdk:Element",
                            "@version": 2,
                            "layerName": "Relection",
                            "id": "builder-efa0463c71144825900ca69d1c53a870",
                            "class": "reflection",
                            "meta": {
                              "previousId": "builder-f73f1b833332436e83785fa7626585e8"
                            },
                            "responsiveStyles": {
                              "large": {
                                "position": "absolute",
                                "width": "100%",
                                "height": "100%",
                                "background": "linear-gradient(115deg, rgba(0,0,0,1) 60%,  rgba(255,255,255,1) 70%,  rgba(255,255,255,1) 71%, rgba(255,255,255,0) 80%);",
                                "backgroundImage": "url(https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F8eb2239bdf9c410baf539691cfb51c32)",
                                "backgroundRepeat": "no-repeat",
                                "backgroundPosition": "bottom",
                                "backgroundSize": "contain",
                                "filter": "brightness(1.5)"
                              }
                            }
                          }
                        ],
                        "responsiveStyles": {
                          "large": {
                            "width": "40vw",
                            "height": "auto",
                            "position": "absolute",
                            "insetBlockStart": "25vh",
                            "insetInlineStart": "40vw",
                            "overflow": "hidden",
                            "minBlockSize": "calc(40vw * 0.324)",
                            "display": "flex",
                            "justifyContent": "center",
                            "alignItems": "center",
                            "boxShadow": "var(--shadow-6);"
                          },
                          "small": {
                            "transform": "scale(2) translateY(5vh)"
                          }
                        }
                      }
                    ],
                    "responsiveStyles": {
                      "large": {
                        "inlineSize": "100vw",
                        "blockSize": "inherit",
                        "backgroundImage": "url(https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F9ea4811dc5b4494890fad60aef97ca3b)",
                        "backgroundRepeat": "no-repeat",
                        "backgroundPosition": "bottom",
                        "backgroundSize": "contain",
                        "inset": "0"
                      }
                    }
                  }
                ],
                "responsiveStyles": {
                  "large": {
                    "blockSize": "200vh",
                    "inlineSize": "100vw",
                    "insetBlockStart": "0px",
                    "display": "flex",
                    "flexDirection": "column",
                    "position": "fixed",
                    "backgroundColor": "#356370"
                  }
                }
              }
            ],
            "responsiveStyles": {
              "large": {
                "position": "absolute",
                "inset": "0px",
                "z-index": "-1",
                "backgroundRepeat": "no-repeat",
                "backgroundPosition": "center",
                "backgroundSize": "cover",
                "clipPath": " inset(calc(var(--announcement-bar-height) + var(--space-fluid-md)) var(--space-fluid-md) var(--space-fluid-md) var(--space-fluid-md) round calc(var(--radius-4) * 1.5))"
              }
            }
          }
        ],
        "responsiveStyles": {
          "large": {
            "  justify-content": "center",
            "containIntrinsicHeight": "125vh",
            "--section-grid-template-columns": "1fr",
            "  align-items": "flex-start",
            "position": "relative",
            "min-height": "125vh",
            "backgroundColor": "transparent"
          },
          "small": {
            "--section-grid-template-columns": "1fr"
          }
        }
      },
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Main",
        "tagName": "main",
        "id": "builder-0a87bd7dec9e444aa4d0ad00822fbe73",
        "meta": {
          "previousId": "builder-7ea12b122bda478f86c7705d19e32b2f"
        },
        "responsiveStyles": {
          "large": {
            "position": "relative"
          }
        }
      },
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Section",
        "tagName": "section",
        "id": "builder-62c300a46d4f466a8609d4dc0aaaa919",
        "properties": {
          "data-theme": "neutral"
        },
        "meta": {
          "previousId": "builder-fac1c260208a4ab59c9fa7ede02f35e7"
        },
        "children": [
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "id": "builder-e8f6692155594d94a3fbffcadc7e8a38",
            "class": "text-marquee",
            "meta": {
              "previousId": "builder-66d6c4c82c36484fa47c8ec42dce3d77"
            },
            "component": {
              "name": "Text",
              "options": {
                "text": "<h2>Heating Cooling Ventilation Air Purification Heating Cooling Ventilation Air Purification</h2>"
              }
            },
            "responsiveStyles": {
              "large": {
                "--heading-two-font-size": "15vh",
                "display": "flex",
                "alignItems": "center",
                "height": "0px"
              }
            }
          }
        ],
        "responsiveStyles": {
          "large": {
            "  justify-content": "flex-start",
            "containIntrinsicHeight": "25vh",
            "--section-grid-template-columns": "1fr ",
            "  align-items": "center",
            "position": "relative",
            "minHeight": "20VH",
            "backgroundColor": "transparent",
            "maxInlineSize": "100vw",
            "padding": "0px"
          },
          "small": {
            "--section-grid-template-columns": "1fr"
          }
        }
      },
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Section",
        "tagName": "section",
        "id": "builder-0a533b5befe6404481df06f79a697109",
        "properties": {
          "data-theme": "pink"
        },
        "meta": {
          "previousId": "builder-9876b5def70c43b084ff373f0f7aa595"
        },
        "children": [
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "layerName": "Column",
            "id": "builder-6adb49b98b294afb9279588a9052aeae",
            "class": "column",
            "meta": {
              "previousId": "builder-d51dc8df386d45b3b8b2ab5da883bfdf"
            },
            "children": [
              {
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                "bindings": {
                  "component.options.text": "var _virtual_index=state.page.title;return _virtual_index"
                },
                "code": {
                  "bindings": {
                    "component.options.text": "state.page.title"
                  }
                },
                "id": "builder-aee20a9d31334cc3bb95f67196cead83",
                "meta": {
                  "previousId": "builder-4fd4af8d88404e008f6052d38732735c"
                },
                "component": {
                  "name": "Text",
                  "options": {
                    "text": "<h1>What is Lorem Ipsum ?</h1>"
                  }
                },
                "responsiveStyles": {
                  "large": {
                    "--h1-tag-font-size": "var(--h1-font-size)"
                  }
                }
              }
            ]
          },
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "layerName": "Background",
            "id": "builder-051c638cbc624c1fb50e4beb9091bc3b",
            "class": "text-marquee",
            "meta": {
              "previousId": "builder-ad1bf92e8c0c45c4a0bdce20888c2c81"
            },
            "responsiveStyles": {
              "large": {
                "position": "absolute",
                "inset": "0px",
                "z-index": "-1",
                "clipPath": " inset(var(--space-fluid-md) round calc(var(--radius-4) * 1.5))",
                "backgroundColor": "var(--background-color)",
                "border": "40px solid blue"
              }
            }
          }
        ],
        "responsiveStyles": {
          "large": {
            "  justify-content": "flex-start",
            "containIntrinsicHeight": "100vh",
            "--section-grid-template-columns": "1fr ",
            "  align-items": "center",
            "position": "relative",
            "minHeight": "100VH",
            "backgroundColor": "transparent"
          },
          "small": {
            "--section-grid-template-columns": "1fr"
          }
        }
      },
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Section",
        "tagName": "section",
        "id": "builder-c8c0d68388a34603b56495efa938bd31",
        "meta": {
          "previousId": "builder-e44f75c317ba4667afd2a1a0132fc493"
        },
        "children": [
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "id": "builder-fe7b631c3e2640d19d935c34f24d85fe",
            "meta": {
              "previousId": "builder-bec5f507f2bf4f778a6a7e4561e25113"
            },
            "component": {
              "name": "Image",
              "options": {
                "image": "https://cdn.builder.io/api/v1/image/assets%2Ff49a4479fc8b4fff8fa77fa179c7c21b%2F5d60b0b6aac44084b11c0327bc371912?format=webp",
                "backgroundSize": "cover",
                "backgroundPosition": "center",
                "lazy": false,
                "fitContent": true,
                "aspectRatio": 1,
                "lockAspectRatio": false,
                "height": 500,
                "width": 500
              }
            },
            "responsiveStyles": {
              "large": {
                "position": "relative",
                "width": "100%",
                "minHeight": "20px",
                "minWidth": "20px",
                "overflow": "hidden"
              }
            }
          },
          {
            "@type": "@builder.io/sdk:Element",
            "@version": 2,
            "layerName": "Column",
            "id": "builder-134097f48ba9445eb31f773e45d0b7a6",
            "class": "column",
            "meta": {
              "previousId": "builder-0ab7b4e52dda420bb3cf77936aacd24d"
            },
            "children": [
              {
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                "id": "builder-1c2b276327664295853b1268276fd4cd",
                "meta": {
                  "previousId": "builder-cdb49411801f432db297bb5478b5811f"
                },
                "component": {
                  "name": "Text",
                  "options": {
                    "text": "<h1>What is Lorem Ipsum ?</h1><p style=\"text-align: justify;\"><strong>Lorem Ipsum&nbsp;is </strong>simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>"
                  }
                },
                "responsiveStyles": {
                  "large": {
                    "--h1-tag-font-size": "var(--h1-font-size)"
                  }
                }
              },
              {
                "@type": "@builder.io/sdk:Element",
                "@version": 2,
                "layerName": "Button",
                "id": "builder-b156728bde2542eeb4e3f21f0fb3ad25",
                "class": "btn",
                "meta": {
                  "previousId": "builder-40d90291b00a4d24a3c226c968ec29ed"
                },
                "component": {
                  "name": "Core:Button",
                  "options": {
                    "text": "Click me! __arrow-right",
                    "openLinkInNewTab": false
                  }
                }
              }
            ]
          }
        ],
        "responsiveStyles": {
          "large": {
            "  justify-content": "flex-start",
            "height": "100DVH",
            "containIntrinsicHeight": "100dvh",
            "--section-grid-template-columns": "1fr 1fr",
            "  align-items": "center",
            "position": "relative"
          },
          "small": {
            "--section-grid-template-columns": "1fr"
          }
        }
      },
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Box",
        "id": "builder-f41b63f2fc644ff684b218025c2f6c91",
        "meta": {
          "previousId": "builder-b4fa2e65296348a384a12c6a85a09553"
        },
        "responsiveStyles": {
          "large": {
            "height": "400vh"
          }
        }
      },
      {
        "id": "builder-pixel-h97wtri887t",
        "@type": "@builder.io/sdk:Element",
        "tagName": "img",
        "properties": {
          "src": "https://cdn.builder.io/api/v1/pixel?apiKey=51506ff347d64e8396d0bb00d1642bff",
          "aria-hidden": "true",
          "alt": "",
          "role": "presentation",
          "width": "0",
          "height": "0"
        },
        "responsiveStyles": {
          "large": {
            "height": "0",
            "width": "0",
            "display": "inline-block",
            "opacity": "0",
            "overflow": "hidden",
            "pointerEvents": "none"
          }
        }
      }
    ],
    "url": "/test/abc",
    "state": {
      "deviceSize": "large",
      "location": {
        "path": "",
        "query": {}
      }
    }
  },
  "modelId": "69fd11af926347f2b6162210b8e2cd34",
  "query": [
    {
      "@type": "@builder.io/core:Query",
      "property": "urlPath",
      "value": "/test/abc",
      "operator": "is"
    }
  ],
  "published": "published",
  "firstPublished": 1727170486889,
  "testRatio": 1,
  "lastUpdated": 1727173373432,
  "createdDate": 1727170383039,
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "meta": {
    "lastPreviewUrl": "http://localhost:5173/test/abc?builder.space=51506ff347d64e8396d0bb00d1642bff&builder.user.permissions=read%2Ccreate%2Cpublish%2CeditCode%2CeditDesigns%2Cadmin%2CeditLayouts%2CeditLayers&builder.user.role.name=Admin&builder.user.role.id=admin&builder.cachebust=true&builder.preview=page&builder.noCache=true&builder.allowTextEdit=true&__builder_editing__=true&builder.overrides.page=d847656d5ee245d4983914d39a357837&builder.overrides.d847656d5ee245d4983914d39a357837=d847656d5ee245d4983914d39a357837&builder.overrides.page:/test/abc=d847656d5ee245d4983914d39a357837",
    "kind": "page",
    "originalContentId": "98a0a3954bac42deb7db2e484a23d083",
    "breakpoints": {
      "small": 767,
      "medium": 1479
    },
    "hasLinks": false,
    "winningTest": null
  },
  "variations": {},
  "name": "Home 4",
  "id": "d847656d5ee245d4983914d39a357837",
  "rev": "0qfq1ksyta4"
}
```


---


### categories

**Status:** ✅ Perfect Match
**Has Content:** 📄 Yes
**Schema Fields:** 1
**Content Fields:** 1






**Sample Content Structure:**
```json
{
  "folders": [],
  "firstPublished": 1749605161565,
  "createdDate": 1749605153618,
  "id": "af923d3871f74994b905e4889bfbac89",
  "modelId": "6f25af3c26e4456faf3323ded6ad6b1b",
  "query": [],
  "name": "Ventilation",
  "published": "published",
  "data": {
    "name": "Ventilation"
  },
  "meta": {
    "lastPreviewUrl": "",
    "breakpoints": {
      "small": 767,
      "medium": 1479
    },
    "winningTest": null,
    "kind": "data",
    "originalContentId": "d3c767c634744eb295c0717c9962d82a"
  },
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "variations": {},
  "testRatio": 1,
  "lastUpdated": 1749605161575,
  "rev": "c6hhqvkfuat"
}
```


---


### author

**Status:** ⚠️ Partial Match
**Has Content:** 📭 No
**Schema Fields:** 0
**Content Fields:** 0





**No content entries found for this model.**

---


### hvac-brand

**Status:** ✅ Perfect Match
**Has Content:** 📄 Yes
**Schema Fields:** 2
**Content Fields:** 2






**Sample Content Structure:**
```json
{
  "query": [],
  "folders": [],
  "createdDate": 1743229619600,
  "id": "0591a853e7714ed6a4f8dbef86c88e42",
  "name": "Mitsubishi Electric ",
  "modelId": "c83b6d8730a447c38c60569d5d5de9a3",
  "published": "published",
  "meta": {
    "breakpoints": {
      "small": 767,
      "medium": 1479
    },
    "lastPreviewUrl": "",
    "kind": "data"
  },
  "data": {
    "name": "Mitsubishi Electric ",
    "logo": "https://cdn.builder.io/api/v1/image/assets%2F51506ff347d64e8396d0bb00d1642bff%2F9cf73b17aa4946429b30f3a4bc53a136"
  },
  "variations": {},
  "lastUpdated": 1745557275209,
  "firstPublished": 1743229763629,
  "testRatio": 1,
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "rev": "ldt1p27seo"
}
```


---


### hvac-unit-accessories

**Status:** ⚠️ Partial Match
**Has Content:** 📄 Yes
**Schema Fields:** 12
**Content Fields:** 3


**Missing in Content:**
- brand
- summary
- description
- thumbnailImage
- media
- keyFeatures
- color
- warrantyOptions
- documents





**Sample Content Structure:**
```json
{
  "query": [],
  "folders": [],
  "createdDate": 1742706625494,
  "id": "f3e61ba2f75d45a581c286c8e369e3b6",
  "name": "Controller",
  "modelId": "d8424994ed9c41439d24043e71aa5866",
  "published": "published",
  "meta": {
    "breakpoints": {
      "small": 767,
      "medium": 1479
    },
    "kind": "data",
    "lastPreviewUrl": ""
  },
  "data": {
    "show": true,
    "pricing": {},
    "name": "Controller"
  },
  "variations": {},
  "lastUpdated": 1742706636051,
  "firstPublished": 1742706636037,
  "testRatio": 1,
  "createdBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "lastUpdatedBy": "7C2cedIVycObfc5GuvKtrvq0hB82",
  "rev": "ldizhxoz69"
}
```


---


## 🔧 Recommendations

### Perfect Matches ✅
- **hvac-unit-series**: Ready for production use
- **testimonial**: Ready for production use
- **hvac-use-case**: Ready for production use
- **hvac-servicing**: Ready for production use
- **categories**: Ready for production use
- **hvac-brand**: Ready for production use

### Partial Matches ⚠️
- **hvac-unit**: Missing fields are likely optional - consider adding sample data for: tags, similarProducts
- **blog-post**: Missing fields are likely optional - consider adding sample data for: thumbnail, mainImage, media
- **page**: Missing fields are likely optional - consider adding sample data for: description, image, list. Extra fields may be Builder.io system fields - verify if they should be included in interface
- **hvac-unit-accessories**: Missing fields are likely optional - consider adding sample data for: brand, summary, description, thumbnailImage, media, keyFeatures, color, warrantyOptions, documents

### No Content 📭
- **author**: Create sample content entries to validate interface accuracy

## 📝 Notes

- **Missing fields** are typically optional fields that aren't populated in the sample content
- **Extra fields** may be Builder.io system fields (like `jsCode`, `inputs`, etc.) for certain model types
- **Perfect matches** indicate the generated TypeScript interfaces accurately reflect the content structure
- This validation uses the first available content entry for each model

---
*Generated by Builder.io MCP TypeScript Validation Tool*
