import { logger } from "../../utils/index.js";
import { searchClient } from "../../elastic/index.js";

const processQueryParams = (query: any): any => {
  const must: any = [
    {
      multi_match: {
        query: query.text,
        fields: ["name^3", "category^2", "keywords^1"],
        type: "best_fields",
      },
    },
  ];

  if (query.sku.enabled) {
    must.push({ match: { sku: query.sku.value } });
  }

  if (query.brand.enabled) {
    must.push({ match: { brand: query.brand.value } });
  }

  if (query.model.enabled) {
    must.push({ match: { model: query.model.value } });
  }

  let should: any = [];

  let minimum_should_match: number = 0;

  if (query.category.enabled) {
    const categories = query.category.value.split(",");

    should = categories.map((category: string) => ({
      term: { category }
    }));

    minimum_should_match = 1;
  }

  const filter: any = [];

  if (query.price.enabled) {
    filter.push({
      range: {
        price: { gte: query.price.value.gte, lte: query.price.value.lte },
      },
    });
  }

  if (query.quality.enabled) {
    filter.push({ term: { quality: query.quality.value } });
  }

  if (query.discount.enabled) {
    filter.push({ term: { discount: query.discount.value } });
  }

  if (query.best_seller.enabled) {
    filter.push({ term: { best_seller: query.best_seller.value } });
  }

  let sort: any = [];

  if (query.sort.price.enabled) {
    sort.push({ price: query.sort.price.value });
  }

  if (query.sort.rating.enabled) {
    sort.push({ rating: query.sort.rating.value });
  }

  if (query.sort.reviews.enabled) {
    sort.push({ reviews: query.sort.reviews.value });
  }

  if (query.sort.discount_value.enabled) {
    sort.push({ discount_value: query.sort.discount_value.value });
  }

  const body = {
    query: {
      bool: {
        must,
        should,
        minimum_should_match,
        filter
      }
    },
    sort,
    size: 30,
  };

  console.log(JSON.stringify(body));

  return body;
};

const searchIndex = async (query: any) => {
  let result: any = [];

  try {
    const response = await searchClient.search({
      index: "products",
      body: processQueryParams(query),
    });

    result = response.hits.hits;
  } catch (err) {
    logger.error(err);
  } finally {
    return result;
  }
};

const searchProduct = async (_: any, args: any, context: any) => {
  try {
    const params = args.searchProductInput;

    const search = await searchIndex(params);

    return search;
  } catch (err: any) {
    logger.error(err);
  }
};

export { searchProduct };
