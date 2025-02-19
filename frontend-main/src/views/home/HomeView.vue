<template>
  <main>
    <div class="body">
      <div class="top">
        <BandComp />
        <CategoryComp />
      </div>
      <div class="bottom">
        <NormalGrid :content="bestSellers"/>
        <template v-for="(item, index) in feedData" :key="index">

          <section v-if="visibilityMap[index]" :class="{ 'visible': visibilityMap[index] }">
            <RowGrid :content="item" :title="index" />
            <NormalGrid :content="item" />
          </section>

          <span class="target" :class="{ 'visible': visibilityMap[index] }" :ref="el => setCategoryRef(el, index)" />
        </template>
      </div>

    </div>
  </main>
</template>

<script setup>
import NormalGrid from '@/views/home/NormalGrid.vue'
import BandComp from '@/views/home/BandComp.vue'
import RowGrid from '@/views/home/RowGrid.vue'
import CategoryComp from '@/views/home/CategoryComp.vue'
import { useIntersectionObserver } from '@vueuse/core'
import { ref, computed, reactive, onMounted } from 'vue'

const products = [
  {
    "id": "PPHKOYV4P73AWQZ19",
    "name": "10 Colors Ballpoint Pen Cartoon Bear 0.5mm Colorful Ink Gel Pens Silicone Kawaii Pens School Office Supplies Korean Stationery",
    "sku": "OSE1:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "happy bear",
    "model": "WJ391",
    "price": 6,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/6G2IzvMxpvsCjpdaf3iM.png",
    "keywords": "pen,cheap,colors",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PE4544UPQ54AXKHPG",
    "name": "MOTARRO 1Pcs Pencil Holder Office Desk Metal Mesh Square Round Pen Pot Cup Case Container Organiser Durable Pencil Case",
    "sku": "OSE2:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Motarro",
    "model": "MI002",
    "price": 10,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/HlzKVAdcziueoffal9Vt.png",
    "keywords": "motarro,desk,organizer",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 25,
    "best_seller": false,
    "sold": 0,
    "available": 15
  },
  {
    "id": "PHRS3RR1FVYEEZ3XF",
    "name": "Ergonomic Office Chair Headrest Attachment Universal, Sponge Head Pillow Adjustable Height & Angle, Upholstered Headrest GZ",
    "sku": "OSE10:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "cosseal brand",
    "model": "black",
    "price": 25,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/mzsMA3NcAMNtcuqlzUF4.png",
    "keywords": "chair,headrest,ergonomic,pillow",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "P7KC6OL9SAL9KZQZL",
    "name": "Mr.paper 6 Styles Plastic Stackable Foldable Stationary Holder Simple Cute Student Office Desktop Storage Stationery Organizer",
    "sku": "OSE4:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Mr Paper",
    "model": "S16990",
    "price": 10,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/r9EjWo689BgXC6vWUstj.png",
    "keywords": "plastic,holder,paper",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PDZF2MAK72SIZRHFN",
    "name": "Large Capacity Desk Accessories 306 ° Rotation Cute Pen Holder Stationery Organizer Pencil Storage Office School Supplies",
    "sku": "OSE11:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Generic",
    "model": "Beige",
    "price": 15,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/EHngUJ00z9eKcNt1mQJN.png",
    "keywords": "pen,holder,desk",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "P4NIUNK1RFGA4DLCN",
    "name": "GUIG Modern Simple Beam Split Foot Metal Computer Chair Comfortable Sedentary Bedroom Office Study Study Home Chair Hot New",
    "sku": "OSE12:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "GUIG",
    "model": "GUIG018",
    "price": 380,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/eCwHCU7DTA8SUJzffCcq.png",
    "keywords": "ergonomic,modern,stainless,comfortable,minimalist",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PUKN3FBHY2QM9P6NC",
    "name": "JFLEGAL Thailand Natural Latex Cushion Relieve Sore Buttocks Cushions Washable Square Office Chair Cushion Cojines Silla Cojin",
    "sku": "OSE7:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Jflegal",
    "model": "Pillow009",
    "price": 80,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/foFlPCtW9AKPtc3WeJRV.png",
    "keywords": "latex,pillow,chair",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PB7SC0I5QDZ8NXWYW",
    "name": "Home Office Chair Ergonomic Desk Chairs Mesh Computer with Lumbar Support Armrest Rolling Swivel Adjustable Black",
    "sku": "OSE8:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Generic",
    "model": "OC-H03 Black",
    "price": 65,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/EYnWXKToEZdXrLpS4ndD.png",
    "keywords": "chair,desk,lumbar,ergonomic,office",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PBQPGB8QQSO6RS1L8",
    "name": "Kawaii Retractable Eraser Cute Cat Korean Stationery Rubber Drawing Erasers Children's school supplies Office",
    "sku": "OSE3:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Twingo",
    "model": "A579",
    "price": 10,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/x64Z578clxGQ7bBP2Ox6.png",
    "keywords": "korean,rubber,drawing",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PAM67L6URR96DLF4A",
    "name": "LINE B5 Notepad Diary Ivory 100GSM Innovation Trend Portable Edition Solid Color 5 Colors Office & School Notepad Supplies",
    "sku": "OSE6:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "line",
    "model": "GX1863",
    "price": 15,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/ZYBCDGPrMbpH3nMlcSyJ.png",
    "keywords": "notes,writing,pen",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PQKBN332GOXPQLLC3",
    "name": "Large Capacity Pencil Case Cute Student Pencil Cases Big Pen Bag Case Storage Box Boy Girl Kid Office School Stationery Supplies",
    "sku": "OSE5:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "angoo",
    "model": "C",
    "price": 15,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/ysM6s6PSmFrtiFv7E46m.png",
    "keywords": "pencil,bag,case",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "P5MGVNGLY292PLO8L",
    "name": "Pen Holder Wooden Container Desk Solid Tabletop Stationery Finishing Storage Office",
    "sku": "OSE9:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Generic",
    "model": "Wood",
    "price": 15,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/mQlGDLjDfyTRIIUjk0um.png",
    "keywords": "pen,wood,desk,rhombus",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PO3M1IB9S9D4GQW2Y",
    "name": "Adjustable Laptop Desk Stand Portable Aluminum Ergonomic Lapdesk For TV Bed Sofa PC Notebook Table Desk Stand With Mouse Pad",
    "sku": "OSE13:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "dook",
    "model": "DNZ-white",
    "price": 50,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/tdRKA75BBKjbdNM709cT.png",
    "keywords": "laptop,stand,adjustable,ergonomic",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PYXIIFM85A75ITGHX",
    "name": "AULA F75 Mechanical Keyboard 2.4G Wireless/Bluetooth/Wired RGB PBT 75% Layout OEM Profile Gasket Customized Pc Gaming Keyboard",
    "sku": "OSE14:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "AULA",
    "model": "F75 green",
    "price": 155,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/dJqBTyVW2C6p6J4enPG6.png",
    "keywords": "Wireless,Mechanical,RGB,Gaming ",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PGE5BCNCSYMTWYE85",
    "name": "USB C Hub USB Hub 3.0, VIENON Aluminum 7 in 1 USB Extender, USB Splitter with 1 X USB 3.0, 4 X USB 2.0 and 2 X USB C Ports",
    "sku": "OSE15:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "Generic",
    "model": "7 in 1 A With C",
    "price": 15,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/GS7FdubBSzrf0fYIDwBm.png",
    "keywords": "USB Hub,Multiport,OTG,Expander",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "P0KFD2M8OIX2HABBO",
    "name": "NIERBO HDMI 2.1 Cable HDMI Cord 8K 60Hz 4K 120Hz 48Gbps EARC ARC HDCP Ultra High Speed HDR for HD TV Laptop Projector PS4 PS5 - 2m",
    "sku": "OSE16:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "NIERBO",
    "model": "2m",
    "price": 15,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/LuxmkXXQ2Kl6OcqEhJiY.png",
    "keywords": "8K HDMI Cable,Ultra High-Speed,HDR Compatible, Gaming Ready",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PYSAH65O94UAZT8DW",
    "name": "Xiaomi 200000mAh 120W Power Bank Super Fast Charging Battery High Capacity Digital Display Power Bank For iPhone Samsung Huawei",
    "sku": "OSE18:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "MIJIA",
    "model": "1410",
    "price": 40,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/1bI1dFljxh7wF1jliwsZ.png",
    "keywords": "Power Bank,Fast Charging,High Capacity,Portable",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  },
  {
    "id": "PARWXFG1EAF42ENY5",
    "name": "AJAZZ AK820 Mechanical Keyboard Multifunctional Knob Gaming Keyboard Wired Connect PC Keyboard",
    "sku": "OSE17:687609784237305307",
    "category": "Office Supplies & Equipment",
    "brand": "AJAZZ",
    "model": "AK820Pro Gift Gray",
    "price": 123,
    "quality": "New",
    "image": "https://pairfy.dev/api/media/get-image/ZgLbbrPMuyvRJAzHCvaE.png",
    "keywords": "Mechanical,Keyboard,RGB Backlight,PBT Keycaps,Wired",
    "rating": 0,
    "reviews": 0,
    "discount": true,
    "discount_value": 10,
    "best_seller": false,
    "sold": 0,
    "available": 0
  }
];


const root = ref(null)
const target = ref(null)
const isVisible = ref(false)

const { isActive, pause, resume } = useIntersectionObserver(
  target,
  ([entry]) => {
    isVisible.value = entry?.isIntersecting || false
  },
  { root },
)

const bestSellers = computed(() => Object.values(feedData.value)[0]);

const feedData = ref({
  "Best Sellers": products,
  "Electronics & Digital Content": products,
  "Clothing & Fashion": products,
  "Health & Beauty": products,
  "Books, Music & Movies": products,
  "Home & Garden": products,
  "Toys, Hobbies & Collectibles": products,
  "Sports & Outdoors & Entertainment": products,
  "Grocery & Gourmet Food": products,
  "Automotive & Industrial": products,
  "Office Supplies & Equipment": products,
  "Pet Supplies": products,
  "Lights & Lighting": products,
  "Mother & Kids": products,
  "Shoes": products
});

const categoryRefs = ref({}); // Store refs for categories

const visibilityMap = reactive({}); // Track which categories are visible

// Initialize visibility map
Object.keys(feedData.value).forEach((category) => {
  visibilityMap[category] = false;
});

const setCategoryRef = (el, category) => {
  if (el) {
    categoryRefs.value[category] = el;

    useIntersectionObserver(
      categoryRefs.value[category],
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          console.log("INTERSECTION", category)

          visibilityMap[category] = true;
        }
      }
    );

    return categoryRefs.value[category]
  }
};





</script>

<style lang="css" scoped>
main {
  min-height: 100vh;
  display: grid;
  width: 100%;
}

section.visible {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(5%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}


.target {
  background: transparent;
  width: 100%;
  height: 1px;
  margin-top: 100px;
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}


.target.visible {
  margin-top: 0px;
}

.top {
  min-height: 300px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  display: flex;
}

.bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 200px;
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
}
</style>