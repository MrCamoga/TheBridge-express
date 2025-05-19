const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Servidor levantado en el puerto ${PORT}`);
});

const products = {
  description: 'Productos',
  items: [
    { id: 1, nombre: 'Taza de Harry Potter' , precio: 300},
    { id: 2, nombre: 'FIFA 22 PS5' , precio: 1000},
    {  id: 3, nombre: 'Figura Goku Super Saiyan' , precio: 100},
    {  id: 4,  nombre: 'Zelda Breath of the Wild' , precio: 200},
    {  id: 5,  nombre: 'Skin Valorant' , precio: 120},
    {  id: 6, nombre: 'Taza de Star Wars' , precio: 220}
  ]
}

/**
	Returns index if id found, -1 otherwise
*/
function binarySearch(array,id) {
	let start = 0, end = array.length-1;
	while(start <= end) {
		let mid = (end+start)>>1;
		let val = array[mid].id;
		if(val > id) {
			end = mid-1;
		} else if(val < id) {
			start = mid+1;
		} else {
			return mid;
		}
	}

	return -1;
}

app.get("/products", (req,res) => {
	const {price, minPrice, maxPrice } = req.query;
	console.log(price, minPrice, maxPrice)
	const result = products.items.filter(product =>
		(price === undefined || price == product.precio) &&
		(minPrice === undefined || minPrice <=  product.precio) &&
		(maxPrice === undefined || maxPrice >=  product.precio)
	);
	res.send(result);
});

app.post("/products", (req,res) => {
	const {nombre, precio} = req.body;
	if(!nombre || !precio || typeof nombre != "string" || typeof precio != "number") {
		return res.status(400).send({message: "Bad Request"});
	}
	const product = {
		id: products.items.slice(-1)[0]?.id + 1 || 1,
		nombre,
		precio
	};
	products.items.push(product);
	res.status(201).send(product);
});

app.put("/products/:id", (req,res) => {
	const id = +req.params.id;
	let {nombre, precio} = req.body;
	precio = +precio;

	if(isNaN(id) || isNaN(precio)) {
		return res.status(400).send({message: "Bad Request"});
	}

	const index = binarySearch(products.items,id);

	if(index == -1) {
		return res.status(404).send({message: "Not Found"});
	}
	const product = products.items[index];
	if(nombre) product.nombre = nombre;
	if(precio) product.precio = precio;

	res.send(product);
});

app.delete("/products/:id", (req,res) => {
	const id = +req.params.id;
	if(isNaN(id)) {
		return res.status(400).send({message: "Bad Request"});
	}
	const index = binarySearch(products.items,id);
	if(index == -1) {
		return res.status(404).send({message: "Not Found"});
	}
	products.items.splice(index,1);
	res.send({message: "OK"});
});

// id or name
app.get("/products/:id", (req,res) => {
	console.log(req.params.id)
	if(!req.params.id) {
		return res.status(400).send({message: "Bad Request"});
	}
	let id = +req.params.id;
	let result;
	if(!isNaN(id)) {
		const index = binarySearch(products.items,id);
		if(index != -1) {
			result = products.items[index];
		}
	} else {
		const filter = products.items.filter(product => product.nombre === req.params.id);
		if(filter) {
			result = filter[0];
		}
	}
	if(result === undefined) {
		return res.status(404).send({message: "Not Found"});
	}
	res.send(result);
})
