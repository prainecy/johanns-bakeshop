// IIFE -- Immediately Invoked Function Expression
(function ($) {
    // Ensure jQuery is passed as a parameter to the IIFE
    $(document).ready(function () {
        

        // Form submission confirmation
        $("#contact-form").submit(function (event) {
            if (!confirm("Are you sure you want to submit this message?")) {
                event.preventDefault();
            }
        });

        // Toggle password visibility
        $('#password-peek').on('click', function (e) {
            e.preventDefault();
            var passwordField = $('#password');
            var peekIcon = $('#peek-icon');

            if (passwordField.attr('type') === 'password') {
                passwordField.attr('type', 'text');
                peekIcon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                passwordField.attr('type', 'password');
                peekIcon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });

        // Initialize Bootstrap popovers
        $('[data-toggle="popover"]').popover(({ html: true }));

        // JavaScript for handling logout
        document.getElementById('logoutLink').addEventListener('click', function(event) {
            event.preventDefault();
            $('#logoutModal').modal('show');
        });

        document.getElementById('confirmLogout').addEventListener('click', function() {
            window.location.href = '/logout';
        });

        // Bind click event to open-modal link to show the image modal
        $(document).on('click', '.open-modal', function () {
            var imageUrl = $(this).data('image'); // Get the image URL from the data attribute
            showImageModal(imageUrl);
        });

         // Attach change event handlers
        $('#categoryFilter').change(filterCategory);
        $('#sortFilter').change(sortProducts);

        // Initialize filters on load
        filterCategory();
        sortProducts();


    });

    // Function to show image in a modal popup
    window.showImageModal = function (imageUrl) {
        $('#modalImage').attr('src', imageUrl);
        $('#imageModal').modal('show');
    };

    // Make sure to bind the event to remove the modal after it's closed
    $('#imageModal').on('hidden.bs.modal', function () {
        $('#modalImage').attr('src', '');
    });

    $(document).on('click', '#checkoutButton', proceedToCheckout);

    $(document).on('click', '#clearCartButton', clearCart);

    // Event listener for confirming checkout in the modal
$(document).on('click', '#confirmCheckout', function() {
    fetch('/confirm-checkout', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert("The order has successfully placed."); // Show success message
            window.location.href = '/cart'; // Redirect to update the cart
        })
        .catch(error => console.error('Error:', error));
});



})(jQuery);

// Function to show categories and update active link
function showCategory(category) {
    // Hide all sections and remove 'active' class
    document.querySelectorAll('.product-section').forEach(section => {
        section.classList.remove('active');
        setTimeout(() => section.style.display = 'none', 500);
    });

    // Show the selected category with fade effect
    const selectedSection = document.getElementById(category);
    setTimeout(() => {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active');
    }, 500);

    // Update category links to show active link
    document.querySelectorAll('.category-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(`link-${category}`).classList.add('active');
}

function startCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const countSpan = counter.querySelector('span');
            const count = +countSpan.innerText;

            // Lower inc to slow and higher to speed up
            const inc = target / speed;

            // Check if target is reached
            if (count < target) {
                // Add inc to count and output in counter
                countSpan.innerText = Math.ceil(count + inc);
                // Call function every ms
                setTimeout(updateCount, 1);
            } else {
                countSpan.innerText = target;
            }
        };

        updateCount();
    });
}

function addToCart(productId) {
    fetch(`/add-to-cart/${productId}`, { method: 'POST' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        // Optionally update the UI or redirect
    })
    .catch(error => {
        console.error('Error adding item to cart:', error);
    });
}


function updateQuantity(productId, change) {
    let currentQuantity = parseInt(document.getElementById(`quantity_${productId}`).innerText);
    let newQuantity = currentQuantity + change;

    if (newQuantity > 0) {
        fetch(`/update-cart/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            document.getElementById(`quantity_${productId}`).innerText = newQuantity;
            // Fetch updated cart and update the UI
            fetchUpdatedCart();
            window.location.href = '/cart'
        })
        .catch(error => {
            console.error('Error updating cart:', error);
        });
    }
}



function proceedToCheckout() {
    // Check if cart is empty by the presence of the "Your cart is empty." message
    var cartEmptyMessage = document.getElementsByClassName('empty-cart-message');
    var checkoutButton = document.getElementById('checkoutButton');
    var clearCartButton = document.getElementById('clearcartbtn');

    // If the message exists, disable the buttons
    if (cartEmptyMessage) {
        checkoutButton.disabled = true;
        clearCartButton.disabled = true;
        
    } else {
        // If the cart is not empty, show the checkout modal
        $('#checkoutModal').modal('show');
    }
}

// Function to show the checkout modal
function proceedToCheckout() {
    var cartEmptyMessage = document.getElementById('empty-cart-message');
    if (cartEmptyMessage && cartEmptyMessage.style.display !== 'none') {
        // Cart is empty, disable checkout and clear cart buttons
        $('#checkoutButton').prop('disabled', true);
        $('#clearcartbtn').prop('disabled', true);
    } else {
        // Show checkout modal
        $('#checkoutModal').modal('show');
    }
}

function removeFromCart(productId) {
    fetch(`/remove-from-cart/${productId}`, { method: 'POST' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        window.location.href = '/cart'; // Redirect to the cart page
    })
    .catch(error => {
        console.error('Error removing item from cart:', error);
    });
}





function fetchUpdatedCart() {
    fetch('/cart-data')  // Assume '/cart-data' is a route that returns JSON data of the cart
    .then(response => response.json())
    .then(data => {
        updateCartSummary(data.subtotal, data.tax, data.total);
       
    })
    .catch(error => {
        console.error('Error fetching updated cart:', error);
    });
}




// Function to filter products based on category
function filterCategory() {
    var selectedCategory = $('#categoryFilter').val();
    $('#productsContainer > div').hide(); // Hide all products
    if (selectedCategory === 'All') {
      $('#productsContainer > div').show(); // Show all products
    } else {
      $('#productsContainer > div[data-category="' + selectedCategory + '"]').show(); // Show filtered products
    }
  }
  
  // Function to sort products based on selected sort criteria
  function sortProducts() {
    var sortValue = $('#sortFilter').val();
    var products = $('#productsContainer > div').toArray();

    const categoryPriority = {
        'Cake': 1,
        'Brownies': 2,
        'Cookies': 3,
        'Cupcakes': 4
    };

  
    switch(sortValue) {
      case 'LowToHigh':
        products.sort(function(a, b) {
          return $(a).data('price') - $(b).data('price');
        });
        break;
      case 'HighToLow':
        products.sort(function(a, b) {
          return $(b).data('price') - $(a).data('price');
        });
        break;
      case 'Relevance':
        products.sort(function(a, b) {
          return $(a).data('relevance') - $(b).data('relevance');
        });
        break;
        case 'Default':
            // Sort by the defined category order
            products.sort((a, b) => {
                let categoryA = $(a).data('category');
                let categoryB = $(b).data('category');
                return categoryPriority[categoryA] - categoryPriority[categoryB];
            });
            break;
    }
  
    // Append sorted products back to the container
    products.forEach(function(product) {
      $('#productsContainer').append(product);
    });
  }

// Function to clear the cart
function clearCart() {
    // Make a request to a route that will handle clearing the cart
    fetch('/clear-cart', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Clear the UI elements related to cart items
            document.getElementById('cartItems').innerHTML = '';
            // Reset subtotal, tax, and total price to 0
            updateCartSummary(0, 0, 0);
            window.location.href = '/cart';
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
        });
}

// Function to update cart summary
function updateCartSummary(subtotal, tax, total) {
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}



// Call startCounters when the window loads
window.onload = function() {
    startCounters();
    showCategory('Cakes');
};

function resetForm() {
    document.getElementById("contact-form").reset();
}