# Builder.io TypeScript Interface Validation Report

**Generated:** 2025-06-13T10:27:30.494Z
**Total Models:** 1
**Perfect Matches:** 0/1
**Models with Content:** 1/1

## 📊 Summary

| Model | Status | Content | Schema Fields | Content Fields | Issues |
|-------|--------|---------|---------------|----------------|--------|
| hvac-unit | ⚠️ Partial | 📄 Yes | 15 | 13 | Missing: tags, Missing: similarProducts |

## 📋 Detailed Results


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
        "rev": "6l2kyvchs8c"
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
        "rev": "usutia1z4qi"
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
  "rev": "tsvne0nhpv"
}
```


---


## 🔧 Recommendations

### Perfect Matches ✅
None

### Partial Matches ⚠️
- **hvac-unit**: Missing fields are likely optional - consider adding sample data for: tags, similarProducts

### No Content 📭
None

## 📝 Notes

- **Missing fields** are typically optional fields that aren't populated in the sample content
- **Extra fields** may be Builder.io system fields (like `jsCode`, `inputs`, etc.) for certain model types
- **Perfect matches** indicate the generated TypeScript interfaces accurately reflect the content structure
- This validation uses the first available content entry for each model

---
*Generated by Builder.io MCP TypeScript Validation Tool*
