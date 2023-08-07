const eventSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    $schema: {
      type: "string",
    },
    type: {
      type: "string",
    },
    properties: {
      type: "object",
      properties: {
        type: {
          type: "string",
        },
        properties: {
          type: "object",
          patternProperties: {
            ".+": {
              // This matches any property name
              type: "object",
              properties: {
                type: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["type"],
            },
          },
        },
        required: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
  required: ["$schema", "type", "properties"],
};
