const express = require("express");

const app = express();
const PORT = 25565;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Servidor levantado en el puerto ${PORT}`);
});

const products = [
  { id: 1, name: "Laptop", description: "Portátil de 15 pulgadas con procesador i7" },
  { id: 2, name: "Teléfono", description: "Smartphone con cámara de 108MP" },
  { id: 3, name: "Auriculares", description: "Auriculares inalámbricos con cancelación de ruido" },
  { id: 4, name: "Monitor", description: "Monitor 4K de 27 pulgadas" },
  { id: 5, name: "Teclado", description: "Teclado mecánico retroiluminado" }
];

const users = [
  { id: 1, name: "Juan Pérez", email: "juan.perez@example.com" },
  { id: 2, name: "María Gómez", email: "maria.gomez@example.com" },
  { id: 3, name: "Carlos Ramírez", email: "carlos.ramirez@example.com" },
  { id: 4, name: "Ana Torres", email: "ana.torres@example.com" },
  { id: 5, name: "Luis Martínez", email: "luis.martinez@example.com" }
];

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

app.get("/", (req,res) => {
	res.send("Bienvenido!");
});

app.get("/productos", (req,res) => {
	res.send(products);
});

app.post("/productos", (req,res) => {
	const {name, description} = req.body;
	if(!name || !description) {
		return res.status(400).send({message: "Bad Request"});
	}
	products.push({
		id: products.slice(-1)[0]?.id + 1 || 1,
		name,
		description
	});
	res.status(201).send(products.slice(-1)[0]);
});

app.put("/productos/:id", (req,res) => {
	const id = +req.params.id;
	const {name, description} = req.body;

	if(isNaN(id)) {
		return res.status(400).send({message: "Bad Request"});
	}

	const index = binarySearch(products,id);

	if(index == -1) {
		return res.status(404).send({message: "Not Found"});
	}
	const product = products[index];
	product.name = name || product.name;
	product.description = description || product.description;

	res.send(product);
});

app.delete("/productos/:id", (req,res) => {
	const id = +req.params.id;
	if(isNaN(id)) {
		return res.status(400).send({message: "Bad Request"});
	}
	const index = binarySearch(products,id);
	if(index == -1) {
		return res.status(404).send({message: "Not Found"});
	}
	products.splice(index,1);
	res.send({message: "OK"});
});

// usuarios

app.get("/usuarios", (req,res) => {
	res.send(users);
});

app.post("/usuarios", (req,res) => {
	const {name, email} = req.body;
	if(!name || !email) {
		return res.status(400).send({message: "Bad Request"});
	}
	users.push({
		id: users.slice(-1)[0]?.id + 1 ?? 1,
		name,
		email
	});
	res.status(201).send(users.slice(-1)[0]);
});

app.put("/usuarios/:id", (req,res) => {
	const id = +req.params.id;
	const {name, email} = req.body;

	if(isNaN(id)) {
		return res.status(400).send({message: "Bad Request"});
	}

	const index = binarySearch(users,id);

	if(index == -1) {
		return res.status(404).send({message: "Not Found"});
	}
	const user = users[index];
	user.name = name || user.name;
	user.email = email || user.email;

	res.send(user);
});

app.delete("/usuarios/:id", (req,res) => {
	const id = +req.params.id;

	if(isNaN(id)) {
		return res.status(400).send({message: "Bad Request"});
	}

	const index = binarySearch(users,id);

	if(index == -1) {
		return res.status(404).send({message: "Not Found"});
	}
	users.splice(index,1);
	res.send({message: "OK"});
});
