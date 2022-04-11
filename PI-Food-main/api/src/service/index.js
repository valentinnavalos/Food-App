require("dotenv").config();
const { default: axios } = require("axios");
const { Recipe, Type } = require("./../db");

const apiKey = process.env.API_KEY;

const getApiInfo = async () => {
  try {
    const apiUrl = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&addRecipeInformation=true&number=100`
    );
    const apiInfo = await apiUrl.data.results.map((r) => {
      let arrayDiets = [];
      arrayDiets = r.diets;
      if (r.vegetarian) arrayDiets.push("vegetarian");
      if (r.vegan && !arrayDiets.includes("vegan")) arrayDiets.push("vegan");
      if (r.glutenFree && !arrayDiets.includes("vegan"))
        arrayDiets.push("gluten free");
      return {
        id: r.id,
        title: r.title,
        summary: r.summary,
        spoonacularScore: r.spoonacularScore,
        healthScore: r.healthScore,
        //steps ahora es un array de obj donde cada obj tiene
        // el número de paso y su paso a paso.
        steps: r.analyzedInstructions[0]?.steps?.map((s) => {
          return {
            number: s.number,
            step: s.step,
          };
        }),
        image: r.image,
        //diets tiene que ser un array con todas las dietas que tiene la receta.
        // diets: r.diets,
        // diets: flag? r.diets.push("vegetarian"): r.diets,
        diets: arrayDiets,
      };
    });
    // console.log(apiInfo);
    return apiInfo;
  } catch (error) {
    return error;
  }
};

const getApiInfoByPk = async (id) => {
  try {
    const apiUrl = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );

    const apiInfo = await apiUrl.data;

    let arrayDiets = [];
    arrayDiets = apiInfo.diets;
    if (apiInfo.vegetarian && !arrayDiets.includes("vegetarian"))
      arrayDiets.push("vegetarian");
    if (apiInfo.vegan && !arrayDiets.includes("vegan"))
      arrayDiets.push("vegan");
    if (apiInfo.glutenFree && !arrayDiets.includes("gluten free"))
      arrayDiets.push("gluten free");

    const result = {
      id: apiInfo.id,
      title: apiInfo.title,
      summary: apiInfo.summary,
      spoonacularScore: apiInfo.spoonacularScore
        ? apiInfo.spoonacularScore
        : "No puntuation.",
      healthScore: apiInfo.healthScore
        ? apiInfo.healthScore
        : "No health score.",
      steps: apiInfo.analyzedInstructions[0]?.steps?.map((s) => {
        return {
          number: s.number,
          step: s.step,
        };
      }),
      image: apiInfo.image ? apiInfo.image : "No image.",
      diets: arrayDiets.length ? arrayDiets : "No diets.",
    };

    // console.log(result);
    return result;
  } catch {
    return { msg: `A recipe with id ${id} does not exist.` };
  }
};

const getDbInfo = async () => {
  const allDbInfo = await Recipe.findAll({
    include: {
      model: Type,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });

  // allDbInfo.forEach((r) => (r.types = r.types.map((t) => t.name)));

  // console.log("getDbInfo", allDbInfo);
  // console.log("getDbInfo", allDbInfo[0].types);

  return allDbInfo;
};

const getDbInfoByPk = async (id) => {
  return await Recipe.findByPk(id, {
    include: {
      model: Type,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

const getAllInfo = async () => {
  try {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();

    // const test = dbInfo?.map(el => el.types?.map(t => t.name));
    const resultDb = dbInfo?.map((r) => {
      return {
        id: r.id,
        title: r.title,
        summary: r.summary,
        spoonacularScore: r.spoonacularScore,
        healthScore: r.healthScore,
        steps: r.steps,
        image: r.image,
        // diets: r.diets,
        diets: r.types.map((t) => t.name),
      };
    });
    // console.log("resultDb", resultDb);

    const allInfo = [...apiInfo, ...resultDb];
    // console.log(allInfo);
    return allInfo;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getApiInfo,
  getApiInfoByPk,
  getDbInfo,
  getDbInfoByPk,
  getAllInfo,
};
