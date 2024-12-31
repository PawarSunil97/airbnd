const Joi = require('joi');

module.exports.listingSchema= Joi.object({
    listing:Joi.object().required({
       title:Joi.string().required(),
       description:Joi.string().required(),
       price:Joi.number().required().min(0),
       location:Joi.string().required(),
       country:Joi.string().required(),
       image:Joi.string().allow("",null)
    })
});

// Export Joi schema as "reviewValidationSchema" for clarity
module.exports.reviewValidationSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().required()
    }).required()
  });
  