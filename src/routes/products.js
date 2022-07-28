const { Product,Category,Review ,Qa} = require("../db");
const { Router } = require("express");
const { Op } = require("sequelize");


const router = Router();

router.get("/", async (req, res) => {
  try {
   
    const allProducts = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Qa,
          attributes: ["title","description", "answer", "resolved"],
          through: { attributes: [] },
        },
        {
          model: Review,
          attributes: ["rating", "title", "description"],
          through: { attributes: [] },
        },
      ],
    });
   
  res.status(200).send(allProducts);
    
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

router.get('/size/:id', async(req, res, next)=>{
  try{
      const {id} = req.params;
      const allProducts = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
            through: { attributes: [] },
          },
          {
            model: Qa,
            attributes: ["title","description", "answer", "resolved"],
            through: { attributes: [] },
          },
          {
            model: Review,
            attributes: ["rating", "title", "description"],
            through: { attributes: [] },
          },
        ],
      });
      if (id) {
          const filtered = await allProducts.filter((e) => e.id == id);
          const maped = filtered.map(f=>f.size)
          const maped2 = maped[0]
          const split = maped2.split(/\s*,\s*/)
        
          res.json(split);
        }
  }
  catch(error){
      next(error);
  }
});

router.get("/search", async (req, res) => {
  const { name } = req.query;
  try {
    const searchProducts = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Qa,
          attributes: ["title","description", "answer", "resolved"],
          through: { attributes: [] },
        },
        {
          model: Review,
          attributes: ["rating", "title", "description"],
          through: { attributes: [] },
        },
      
      ],
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
   
    res.status(200).send(searchProducts);
  } catch (err) {
     res.status(400).send({ msg: err.message });
  }
});

router.post("/create", async (req, res) => {
  const { name, price ,description , color, rating, image, image2, image3, image4, stock, size, categories } = req.body;

  try {
    const newProduct = await Product.create({
      name: name.toUpperCase(),
      price,
      description,
      color,
      rating,
      image,
      image2,
      image3,
      image4,
      stock,
      created: true,
      size
    });

    for (let i = 0; i < categories.length; i++) {
      let cat = await Category.findOne({
        where: { name: { [Op.iLike]: `%${categories[i].name}%` } },
      });

      if (cat) {
        await newProduct.addCategory(cat);
      }
    }
    return res.status(201).send({msg:"Producto Creado", producto: newProduct});
  } catch (error) {
    return res.status(400).send({msg: error.message});
  }
});

router.get('/:id', async(req, res, next)=>{
  try{
      const {id} = req.params;
      const allProducts = await Product.findAll({
        include: [
          {
            model: Category,
            attributes: ["name"],
            through: { attributes: [] },
          },
          {
            model: Qa,
            attributes: ["title","description", "answer", "resolved"],
            through: { attributes: [] },
          },
          {
            model: Review,
            attributes: ["rating", "title", "description"],
            through: { attributes: [] },
          },
        ],
      });
      if (id) {
          const filtered = await allProducts.filter((e) => e.id == id);
          res.json(filtered);
        }
  }
  catch(error){
      next(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Product.destroy({where: {id:id}});
    return res.status(200).send({msg: "Producto eliminado"})
  } catch (error) {
    return res.status(400).send({msg: error.message})
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price ,description , color, rating, image, image2, image3, image4, stock, size, categories } = req.body;
  try {
    const newProduct = await Product.update({
      name: name.toUpperCase(),
      price,
      description,
      color,
      rating,
      image,
      image2,
      image3,
      image4,
      stock,
      created: true,
      size
    }, {where: {id:id}});

    if(categories) {
      const productUpdate = await Product.findOne({where: {id:id}})
      for (let i = 0; i < categories.length; i++) {
        let cat = await Category.findOne({
          where: { name: { [Op.iLike]: `%${categories[i].name}%` } },
        });
  
        if (cat) {
          await productUpdate.addCategory(cat);
        }
      }
    };

    return res.status(200).send({msg: "Producto actualizado"});
  } catch (error) {
    return res.status(400).send({msg: error.message});    
  }
})

module.exports = router;
