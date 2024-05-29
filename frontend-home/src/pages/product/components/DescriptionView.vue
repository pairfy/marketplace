<template>
  <Accordion
    :multiple="true"
    class="accordionStyle"
    expandIcon="x"
    collapseIcon="x"
  >
    <AccordionTab header="Features">
      <div class="keywords">
        <li>New</li>
        <li>Cheap</li>
        <li>Quality</li>
        <li>Multicolor</li>
        <li>Electrical</li>
      </div>

      <p class="accordionParagraph">
        Welcome to our cutting-edge e-commerce platform where innovation meets
        convenience! Step into the future of entertainment with the LG 65” Class
        UQ70 Series LED 4K UHD Smart webOS TV. Immerse yourself in the ultimate
        viewing experience with stunning 4K UHD resolution, bringing every
        detail to life with remarkable clarity and vivid colors. Whether you're
        watching your favorite movies, streaming the latest TV shows, or gaming
        with friends, this TV delivers breathtaking visuals that will captivate
        your senses. Featuring LG's webOS Smart platform, accessing your
        favorite content has never been easier. Navigate seamlessly through a
        world of entertainment with intuitive controls and a user-friendly
        interface. From popular streaming apps to a vast array of content
        options, the possibilities are endless, ensuring there's always
        something to enjoy for everyone in the family. With its sleek and modern
        design, the LG UQ70 Series TV effortlessly complements any living space,
        elevating your home entertainment setup to new heights. Its slim bezels
        and premium finish exude sophistication, making it a focal point in any
        room. But it's not just about looks—the LG UQ70 Series is packed with
        innovative features to enhance your viewing experience. From advanced
        image processing technologies for smoother motion to immersive audio
        capabilities that bring sound to life, every aspect is designed to
        provide you with unparalleled entertainment. Equipped with multiple HDMI
        and USB ports, connecting your favorite devices such as gaming consoles,
        Blu-ray players, and sound systems is a breeze, ensuring you have
        everything you need for a truly immersive entertainment experience.
        Upgrade your home entertainment setup today with the LG 65” Class UQ70
        Series LED 4K UHD Smart webOS TV, where cutting-edge technology meets
        unparalleled convenience.
      </p>
    </AccordionTab>
    <AccordionTab header="Terms of sale">
      <p class="accordionParagraph">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
        numquam eius modi.
      </p>
    </AccordionTab>
    <AccordionTab header="Guarantee">
      <p class="accordionParagraph">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        et quas molestias excepturi sint occaecati cupiditate non provident,
        similique sunt in culpa qui officia deserunt mollitia animi, id est
        laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
        distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
        cumque nihil impedit quo minus.
      </p>
    </AccordionTab>
  </Accordion>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
.accordionStyle {
  width: 90%;
  margin-top: 1rem;
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
  border-radius: 8px;
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
