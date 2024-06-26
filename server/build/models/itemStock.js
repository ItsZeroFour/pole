import mongoose from "mongoose";
const itemWheatParamsSchema = new mongoose.Schema({
    class: { type: Number, default: 0 },
    gluten: { type: Number, default: 0 },
    grainAdmixture: { type: Number, default: 0 },
    impurity: { type: Number, default: 0 },
    IDK: { type: Number, default: 0 },
    nature: { type: Number, default: 0 },
    broken: { type: Number, default: 0 },
    damaged: { type: Number, default: 0 },
    cultivatedPlants: { type: Number, default: 0 },
    green: { type: Number, default: 0 },
    weed: { type: Number, default: 0 },
    sprouted: { type: Number, default: 0 },
    shriveled: { type: Number, default: 0 },
}, { _id: false });
const itemPeasParamsSchema = new mongoose.Schema({
    grainAdmixture: { type: Number, default: 0 },
    sprouted: { type: Number, default: 0 },
    shriveled: { type: Number, default: 0 },
    broken: { type: Number, default: 0 },
    damaged: { type: Number, default: 0 },
    cultivatedPlants: { type: Number, default: 0 },
    green: { type: Number, default: 0 },
    weed: { type: Number, default: 0 },
    impurity: { type: Number, default: 0 },
}, { _id: false });
const itemSunflowerParamsSchema = new mongoose.Schema({
    impurity: { type: Number, default: 0 },
    oilImpurity: { type: Number, default: 0 },
}, { _id: false });
const itemNoneParamsSchema = new mongoose.Schema({
    count: { type: Number, default: -1 },
    class: { type: Number, default: -1 },
    gluten: { type: Number, default: -1 },
    humidity: { type: Number, default: -1 },
    grainAdmixture: { type: Number, default: -1 },
    impurity: { type: Number, default: -1 },
    IDK: { type: Number, default: -1 },
    nature: { type: Number, default: -1 },
    broken: { type: Number, default: 1 },
    damaged: { type: Number, default: -1 },
    cultivatedPlants: { type: Number, default: -1 },
    green: { type: Number, default: -1 },
    weed: { type: Number, default: -1 },
    sprouted: { type: Number, default: -1 },
    shriveled: { type: Number, default: -1 },
});
const baseOptions = {
    discriminatorKey: "itemType",
    collection: "itemStocks",
};
const itemStockSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    count: { type: Number, default: -1 },
    humidity: { type: Number, default: -1 },
    description: { type: String, default: "" },
}, baseOptions);
const ItemStock = mongoose.model("ItemStock", itemStockSchema);
const WheatStock = ItemStock.discriminator("Wheat", new mongoose.Schema({
    wheatParams: itemWheatParamsSchema,
}));
const PeasStock = ItemStock.discriminator("Peas", new mongoose.Schema({
    peasParams: itemPeasParamsSchema,
}));
const SunflowerStock = ItemStock.discriminator("Sunflower", new mongoose.Schema({
    sunflowerParams: itemSunflowerParamsSchema,
}));
const NoneStock = ItemStock.discriminator("None", new mongoose.Schema({
    noneParams: itemNoneParamsSchema,
}));
export { ItemStock, WheatStock, PeasStock, SunflowerStock, NoneStock };
//# sourceMappingURL=ItemStock.js.map