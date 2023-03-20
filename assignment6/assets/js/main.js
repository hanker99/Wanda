$(function () {

  var page = window.location.pathname;
  $('.navbar-nav li').find('a').removeClass('active');
  $('.navbar-nav li').find('a[href="' + page + '"]').addClass('active');
});

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      document.getElementById('navbar_top').classList.add('fixed-top');
      // add padding top to show content behind navbar
      navbar_height = document.querySelector('.navbar').offsetHeight;
      document.body.style.paddingTop = navbar_height + 'px';
    } else {
      document.getElementById('navbar_top').classList.remove('fixed-top');
      // remove padding top from body
      document.body.style.paddingTop = '0';
    }
  });
});


function loginFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target);
  const data = Array.from(formData.entries()).reduce((memo, [key, value]) => ({
    ...memo,
    [key]: value,
  }), {});

  fetch('/login', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {

      if (data.success) {
        document.getElementsByTagName('form')[0].reset();
        let elemsList = document.querySelectorAll(".invalid-feedback");
        [].forEach.call(elemsList, function (el) {
          el.innerHTML = ''
        });
        window.location.href = data.data.redirect;
      } else {
        let elems = document.querySelectorAll(".error");

        [].forEach.call(elems, function (el) {
          el.classList.remove("error");
        });
        let errors = data.errors
        for (const property in errors) {
          let child = document.getElementById(property);
          child.parentElement.classList.add('error');
          child.parentElement.querySelector('.invalid-feedback').innerHTML = errors[property]
        }
      }

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function registerFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target);
  const data = Array.from(formData.entries()).reduce((memo, [key, value]) => ({
    ...memo,
    [key]: value,
  }), {});

  fetch('/signup', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementsByTagName('form')[0].reset();
        let elemsList = document.querySelectorAll(".invalid-feedback");
        [].forEach.call(elemsList, function (el) {
          el.innerHTML = ''
        });
        document.getElementById('form-error').innerHTML = ''
        window.location.href = '/login';
      } else {
        let elems = document.querySelectorAll(".error");

        if (data.message !== undefined) {
          document.getElementById('form-error').innerHTML = data.message
        }


        [].forEach.call(elems, function (el) {
          el.classList.remove("error");
        });
        let errors = data.errors
        for (const property in errors) {
          let child = document.getElementById(property);
          child.parentElement.classList.add('error');
          child.parentElement.querySelector('.invalid-feedback').innerHTML = errors[property]
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function loaddataFormSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target);

  fetch('/add-data', {
    method: 'POST', // or 'PUT'
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementsByTagName('form')[0].reset();
        let elemsList = document.querySelectorAll(".invalid-feedback");
        [].forEach.call(elemsList, function (el) {
          el.innerHTML = ''
        });
        //document.getElementById('form-error').innerHTML = '';
        window.location.href = data.data.redirect;
      } else {
        let elems = document.querySelectorAll(".error");

        if (data.message !== undefined) {
          document.getElementById('form-error').innerHTML = data.message
        }


        [].forEach.call(elems, function (el) {
          el.classList.remove("error");
        });
        let errors = data.errors
        for (const property in errors) {
          let child = document.getElementById(property);
          child.parentElement.classList.add('error');
          child.parentElement.querySelector('.invalid-feedback').innerHTML = errors[property]
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deleteMealkit(event) {
  let id = event.target.dataset.key;
  let data = {
    id: id
  }

  let text = "Are you sure to delete?";

  if (confirm(text) == true) {
    fetch('/delete-data', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = data.data.redirect;
        } else {
          console.log('error')
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

function addToCart(e) {
  let id = e.target.dataset.key;
  let data = {
    id: id
  }

  fetch('/add-to-cart', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = data.data.redirect;
      } else {
        console.log('error')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deleteToCart(e) {

  let id = e.target.dataset.key;
  let cartId = e.target.dataset.cartid;
  let data = {
    cartId: cartId,
    id: id
  }

  fetch(`/delete-item-cart/${cartId}/${id}`, {
    method: 'DELETE', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = data.data.redirect;
      } else {
        console.log('error')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function updateCartItemQuantity (event, direction) {
  const parentEle = event.target.parentNode.parentNode.querySelector('input[type=number]');
  const cartId = parentEle.dataset.cartid;
  const itemId = parentEle.dataset.itemid;
  
  if(direction == 'up'){
    parentEle.stepUp()
  } else if(direction == 'down' && parentEle.val > 1) {
      parentEle.stepDown()
  }

  const quantity = parentEle.value;
  const data = {
    cartId: cartId,
    itemId: itemId,
    quantity: quantity
  }
  fetch(`/update-item-cart`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = data.data.redirect;
      } else {
        console.log('error')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function orderPlace (event) {
  const data = {
  }
  fetch(`/place-order`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = data.data.redirect;
      } else {
        console.log('error')
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}





function hideThumbnail(event) {
  //let event.c
  document.getElementById('imageUrl').value = '';
  event.target.parentNode.classList.add("hide");
  event.target.parentNode.previousElementSibling.classList.remove("hide");
}
