/** @format */
$(document).ready(() => {
	$('#cartModal').on('hidden.bs.modal', () => {
		document.getElementById('cartListModal').innerHTML = ''
		document.getElementById('cartListModalQuantity').innerHTML = ''
		document.getElementById('cartListModalTotal').innerHTML = ''
		document.getElementById('clearCart').style.display = 'unset'
		document.getElementById('finishCart').style.display = 'unset'
		document.getElementsByClassName('quantity-products-list')[0].style.display = 'unset'
		document.getElementsByClassName('total-products-list')[0].style.display = 'unset'
	})
	$('#finishPurchase').on('click', () => {
		let validateField = $('#email_user').val()
		if (!validateField) {
			alert('Ingresa un email para poder procesar tu compra')
		} else {
			$('#purchaseModal').modal('hide')
			$('#successModal').modal('show')
		}
	})
	$('#resetParameters').on('click', () => {
		document.getElementById('cartQuantity').innerHTML = 0
		localStorage.setItem('cart', JSON.stringify([]))
	})
})
