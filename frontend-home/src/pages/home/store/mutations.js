const getTimeline = (state, data) => {
  const timelineGrouped = data.timeline.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = {
        category: category,
        items: [],
      };
    }
    acc[category].items.push(item);
    return acc;
  }, {});

  const scheme = {
    timeline: Object.values(timelineGrouped),
  };

  console.log(scheme);

  state.timeline = scheme;
};

export { getTimeline };
