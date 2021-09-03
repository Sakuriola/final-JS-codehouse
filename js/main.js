/** @format */

const ProductList = (item) => {
	let list = document.createElement('ul')

	item.forEach((e) => {
		let li = document.createElement('li')
		li.innerHTML = `<div class='item-product-list'>
                      <img class='item-product-list-image' src="${e.image}" alt="${e.name}">
                      <h5>Codigo: <span class='item-product-list-id'>${e.id}</span></h5>
                      <h5>Categoria: <span class='item-product-list-category'>${e.category}</span></h5>
                      <h3>Nombre: <span class='item-product-list-title'>${e.name}</span></h3>
                      <h4>Stock: <span class='item-product-list-stock'>${e.stock}</span></h4>
                      <h4>Precio: <span class='item-product-list-price'>${e.price}</span></h4>
                      <button class='add-to-cart-btn'>Agregar al Carrito</button>
                    </div>
                   `
		list.appendChild(li)
	})
	document.getElementById('mainLoader').style.display = 'none'
	document.getElementById('productMainList').appendChild(list)
}

const GetStoreData = async () => {
	let cart = localStorage.getItem('cart')
	if (!cart) {
		localStorage.setItem('cart', JSON.stringify([]))
	}
	var cfg = {
		apiKey: 'AIzaSyCQQZT_W3C-0yU8JxIBtf33fW1026do-Kg',
		authDomain: 'faby-js.firebaseapp.com',
		projectId: 'faby-js',
		storageBucket: 'faby-js.appspot.com',
		messagingSenderId: '130264108257',
		appId: '1:130264108257:web:508d2b0bc012006cbcfba0',
	}

	firebase.initializeApp(cfg)
	const db = firebase.firestore()
	const data = db.collection('coder-js-store')

	await data.get().then((r) => {
		let array = []

		r.docs.map((item) => {
			return array.push({ ...item.data(), id: item.id })
		})

		ProductList(array)
	})
}

const CartStore = () => {
	const addCart = document.querySelectorAll('.add-to-cart-btn')

	const AddToCart = (e) => {
		const cart = JSON.parse(localStorage.getItem('cart'))
		let data = e.target
		const selected = data.closest('.item-product-list')

		let itemProduct = {
			image: selected.querySelector('.item-product-list-image').src,
			id: selected.querySelector('.item-product-list-id').textContent,
			category: selected.querySelector('.item-product-list-category').textContent,
			name: selected.querySelector('.item-product-list-title').textContent,
			stock: selected.querySelector('.item-product-list-stock').textContent,
			price: selected.querySelector('.item-product-list-price').textContent,
		}

		const request = cart.findIndex((index) => {
			return index.id === itemProduct.id
		})
		if (request === -1) {
			itemProduct = { ...itemProduct, quantity: 1 }
			cart.push(itemProduct)
		} else {
			if (cart[request].quantity >= cart[request].stock) {
				$('#stockModal').modal()
				return
			}
			cart[request].quantity = cart[request].quantity + 1
		}
		localStorage.setItem('cart', JSON.stringify(cart))
		document.getElementById('cartQuantity').innerHTML = CartQuantity(cart)
	}

	addCart.forEach((item) => {
		item.addEventListener('click', AddToCart)
	})
}

const CartQuantity = (e) => {
	let cartQuantity

	if (e) {
		cartQuantity = e.reduce((data, item) => data + item.quantity, 0)
	} else {
		cartQuantity = 0
	}
	return cartQuantity
}

const CartPrice = (i) => {
	return i.reduce((o, e) => o + e.price * e.quantity, 0)
}

const ModalCart = () => {
	const openModalCart = () => {
		const cart = JSON.parse(localStorage.getItem('cart'))
		const emptyCart = () => {
			let container = document.createElement('div')
			container.innerHTML = `<h1>No hay productos en el carrito</h1>`
			document.getElementById('cartListModal').appendChild(container)
			document.getElementsByClassName('quantity-products-list')[0].style.display = 'none'
			document.getElementsByClassName('total-products-list')[0].style.display = 'none'
		}

		if (cart.length > 0) {
			const cartDisplayProducts = (data) => {
				let list = document.createElement('ul')
				data.forEach((e) => {
					let li = document.createElement('li')
					li.innerHTML = `
											<div class='item-product-cart-list'>
												<img class='item-product-cart-list-image' src="${e.image}" alt="${e.name}" width="600" height="400">
												<h5>Codigo: <span class='item-product-cart-list-id'>${e.id}</span></h5>
												<h5>Categoria: <span class='item-product-cart-list-category'>${e.category}</span></h5>
												<h3>Nombre: <span class='item-product-cart-list-title'>${e.name}</span></h3>
												<h4>Stock: <span class='item-product-cart-list-stock'>${e.stock}</span></h4>		
												<h4>Cantidad: <span class='item-product-cart-list-quantity'>${e.quantity}</span></h4>							
												<h4>Precio por unidad: <span class='item-product-cart-list-price'>${e.price}</span></h4>
												<div>
													<button class='item-product-cart-list-quantity-add'>+</button>
													<button class='item-product-cart-list-quantity-delete'>-</button>
												</div>
												<button class='remove-item-cart'>Eliminar</button>
												<hr/>
                    	</div>
                    `
					list.appendChild(li)
				})
				document.getElementById('cartListModal').appendChild(list)
			}

			cartDisplayProducts(cart)

			const modalCartQuantity = document.querySelector('#cartQuantity').textContent
			document.getElementById('cartListModalQuantity').innerHTML = modalCartQuantity
			document.getElementById('cartListModalTotal').innerHTML = CartPrice(cart)

			const deleteCart = (e) => {
				const cart = JSON.parse(localStorage.getItem('cart'))
				let target = e.target

				const targetSelected = target.closest('.item-product-cart-list')
				const idSelected = targetSelected.querySelector(
					'.item-product-cart-list-id'
				).textContent

				const request = cart.findIndex((index) => {
					return index.id === idSelected
				})

				cart.splice(request, 1)
				localStorage.setItem('cart', JSON.stringify(cart))
				const cartQuantityTotal = CartQuantity(cart)
				document.getElementById('cartQuantity').innerHTML = cartQuantityTotal
				document.getElementById('cartListModalQuantity').innerHTML = cartQuantityTotal
				document.getElementById('cartListModalTotal').innerHTML = CartPrice(cart)
				target.closest('li').remove()

				if (cart.length == 0) {
					document.getElementById('finishCart').style.display = 'none'
					document.getElementById('clearCart').style.display = 'none'
					emptyCart()
				}
			}

			const clearCartProducts = () => {
				document.getElementById('cartListModal').innerHTML = ''
				document.getElementById('cartQuantity').innerHTML = 0
				document.getElementById('clearCart').style.display = 'none'
				document.getElementById('finishCart').style.display = 'none'
				localStorage.setItem('cart', JSON.stringify([]))
				emptyCart()
			}

			const addQuantityCart = async (e) => {
				const cart = JSON.parse(localStorage.getItem('cart'))
				const targetSelected = e.target.closest('.item-product-cart-list')
				const idRequest = targetSelected.querySelector('.item-product-cart-list-id').textContent

				const request = cart.findIndex((index) => {
					return index.id === idRequest
				})
				if (cart[request].quantity >= cart[request].stock) {
					alert('No hay mas stock de este producto.')
				} else {
					cart[request].quantity = cart[request].quantity + 1
					const cartQuantityTotal = CartQuantity(cart)
					document.getElementById('cartQuantity').innerHTML = cartQuantityTotal
					document.getElementById('cartListModalQuantity').innerHTML = cartQuantityTotal
					document.getElementById('cartListModalTotal').innerHTML = CartPrice(cart)
					localStorage.setItem('cart', JSON.stringify(cart))
					document.getElementById('cartListModal').innerHTML = ''
					cartDisplayProducts(cart)
					statusCartActions()
				}
			}

			const deleteQuantityCart = (e) => {
				const cart = JSON.parse(localStorage.getItem('cart'))
				const targetSelected = e.target.closest('.item-product-cart-list')
				const idRequest = targetSelected.querySelector('.item-product-cart-list-id').textContent

				const request = cart.findIndex((index) => {
					return index.id === idRequest
				})
				if (cart[request].quantity < 2) {
					alert('El stock minimo es 1')
				} else {
					cart[request].quantity = cart[request].quantity - 1
					const cartQuantityTotal = CartQuantity(cart)
					document.getElementById('cartQuantity').innerHTML = cartQuantityTotal
					document.getElementById('cartListModalQuantity').innerHTML = cartQuantityTotal
					document.getElementById('cartListModalTotal').innerHTML = CartPrice(cart)
					localStorage.setItem('cart', JSON.stringify(cart))
					document.getElementById('cartListModal').innerHTML = ''
					cartDisplayProducts(cart)
					statusCartActions()
				}
			}

			const orderCart = () => {
				$('#cartModal').modal('hide')
				$('#purchaseModal').modal('show')
			}

			const statusCartActions = () => {
				const removeCart = document.querySelectorAll('.remove-item-cart')
				removeCart.forEach((item) => {
					item.addEventListener('click', deleteCart)
				})

				const addCartQuantity = document.querySelectorAll(
					'.item-product-cart-list-quantity-add'
				)
				addCartQuantity.forEach((item) => {
					item.addEventListener('click', addQuantityCart)
				})

				const deleteCartQuantity = document.querySelectorAll(
					'.item-product-cart-list-quantity-delete'
				)
				deleteCartQuantity.forEach((item) => {
					item.addEventListener('click', deleteQuantityCart)
				})
			}

			statusCartActions()

			const finishCart = document.querySelector('#finishCart')
			finishCart.addEventListener('click', orderCart)

			const clearCart = document.querySelector('#clearCart')
			clearCart.addEventListener('click', clearCartProducts)
		} else {
			document.getElementById('finishCart').style.display = 'none'
			document.getElementById('clearCart').style.display = 'none'
			emptyCart()
		}
	}

	const modalCart = document.querySelector('#openCartModal')

	modalCart.addEventListener('click', openModalCart)
}

const DomLoaded = async () => {
	const cart = JSON.parse(localStorage.getItem('cart'))
	await GetStoreData()
	await CartStore()
	document.getElementById('cartQuantity').innerHTML = await CartQuantity(cart)
	await ModalCart()
}

DomLoaded()
