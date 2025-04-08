function selectedPoint() {
  let point = {};

  const handleSelect = (newPointSelected) => {
    point = newPointSelected;
    return point;
  };

  return {
    handleSelect,
    point,
  };
}

export default selectedPoint;
