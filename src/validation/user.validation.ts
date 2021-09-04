import Joi from 'joi';
const schema = {
    idControl: Joi.number().min(1),

    create: Joi.object().keys({
        isim: Joi.string().min(1).max(25).required(),
        lokasyon: Joi.string().min(1).max(25).required()
    }),

    update: Joi.object().keys({
        id: Joi.number(),
        isim: Joi.string().min(1).max(25).optional(),
        lokasyon: Joi.string().min(1).max(25).optional()
    }),
}
export default schema;