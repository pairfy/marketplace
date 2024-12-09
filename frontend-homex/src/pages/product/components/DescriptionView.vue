<template>
  <Accordion
    :multiple="true"
    class="accordionStyle"
    :activeIndex="[]"
    expandIcon="x"
    collapseIcon="x"
  >
    <AccordionTab header="Features">
      <div class="keywords">
        <li v-for="item in splitKeywords(getProductData.keywords)" :key="item">
          {{ item }}
        </li>
      </div>

      <p class="accordionParagraph">
        {{ getProductData.features }}
      </p>
    </AccordionTab>
    <AccordionTab header="Terms of sale">
      <p class="accordionParagraph">
        {{ getProductData.terms_of_sale }}
      </p>
    </AccordionTab>
    <AccordionTab header="Guarantee">
      <p class="accordionParagraph">
        {{ getProductData.guarantee }}
      </p>
    </AccordionTab>
  </Accordion>
</template>

<script>
import productAPI from "@/pages/product/api/index";

export default {
  setup() {
    const { getProductData } = productAPI();

    const splitKeywords = (value) => {
      return value.split(",");
    };
    return {
      getProductData,
      splitKeywords,
    };
  },
};
</script>

<style lang="css" scoped>
.accordionStyle {
  width: 90%;
  margin-top: 2rem;
}

.keywords {
  list-style: none;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  max-width: 600px;
}

.keywords li {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: var(--text-b);
  font-size: var(--text-size-b);
  border: 1px solid var(--border-b);
}

.accordionParagraph {
  text-align: left;
  line-height: 1.75rem;
  color: var(--text-b);
  font-weight: 300;
  margin-top: 1rem;
}

@media only screen and (max-width: 767px) {
  .keywords {
    width: 80vw;
    padding: 1rem 0;
    margin: initial;
    overflow-x: scroll;
  }

  .accordionStyle {
    width: 100%;
  }

  .accordionParagraph {
    text-align: left;
    font-size: var(--text-size-b);
  }
}

/* Tablets and small deskbanners */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  /* CSS rules for tablets and small deskbanners */
}

/* Medium deskbanners */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  /* CSS rules for medium deskbanners */
}

/* Large deskbanners and widescreen monitors */
@media only screen and (min-width: 1200px) {
  /* CSS rules for large deskbanners and widescreen monitors */
}
</style>
