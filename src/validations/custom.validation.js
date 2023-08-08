const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    return helpers.message('"{{#label}}" must be a valid uuid id');
  }
  return value;
};


module.exports = {
  objectId
};
