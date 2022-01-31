--------------------------------------------------
Add this file to main-product.liquid
Change product id (As you want ) in this file
--------------------------------------------------


if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();
    	
      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
    }
  
  	
  
    onSubmitHandler(evt) {
      evt.preventDefault();
      var thisreference = this;
      var is_product_cart = 0;
      
      $.ajax({
            type: 'GET',
            url: '/cart.json',
            dataType: 'jsonp',
            success: function(data) {
                var prod_id = $(".product-form__submit button").attr("data-id");
                console.log();
                var cartitems = data.items;
                cartitems.forEach(function(item) {
                  if(item.id == 39634829148217 || item.id == 39634833539129){
                    is_product_cart = 1;
                  }else{
                    is_product_cart = 0;
                  }
                });
            }
        });
      
      setTimeout(function() {
          if(is_product_cart == 1){
            if($("input[name=id]").val() == 39634829148217 || $("input[name=id]").val() == 39634833539129){
              	console.log(this);
                const submitButton = thisreference.querySelector('[type="submit"]');
                if (submitButton.classList.contains('loading')) return;

                thisreference.handleErrorMessage();
                thisreference.cartNotification.setActiveElement(document.activeElement);

                submitButton.setAttribute('aria-disabled', true);
                submitButton.classList.add('loading');
                thisreference.querySelector('.loading-overlay__spinner').classList.remove('hidden');

                const config = fetchConfig('javascript');
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
                delete config.headers['Content-Type'];

                const formData = new FormData(thisreference.form);
                formData.append('sections', thisreference.cartNotification.getSectionsToRender().map((section) => section.id));
                formData.append('sections_url', window.location.pathname);
                config.body = formData;

                fetch(`${routes.cart_add_url}`, config)
                  .then((response) => response.json())
                  .then((response) => {
                    if (response.status) {
                      thisreference.handleErrorMessage(response.description);
                      return;
                    }

                    thisreference.cartNotification.renderContents(response);
                  })
                  .catch((e) => {
                    console.error(e);
                  })
                  .finally(() => {
                    submitButton.classList.remove('loading');
                    submitButton.removeAttribute('aria-disabled');
                    thisreference.querySelector('.loading-overlay__spinner').classList.add('hidden');
                  });
              
            }else{
              	$(".specific-pro-error").show();
            }
          }else{
                console.log(is_product_cart);
            	console.log("Freame product is not in cart");
				const submitButton = thisreference.querySelector('[type="submit"]');
                if (submitButton.classList.contains('loading')) return;

                thisreference.handleErrorMessage();
                thisreference.cartNotification.setActiveElement(document.activeElement);

                submitButton.setAttribute('aria-disabled', true);
                submitButton.classList.add('loading');
                thisreference.querySelector('.loading-overlay__spinner').classList.remove('hidden');

                const config = fetchConfig('javascript');
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
                delete config.headers['Content-Type'];

                const formData = new FormData(thisreference.form);
                formData.append('sections', thisreference.cartNotification.getSectionsToRender().map((section) => section.id));
                formData.append('sections_url', window.location.pathname);
                config.body = formData;

                fetch(`${routes.cart_add_url}`, config)
                  .then((response) => response.json())
                  .then((response) => {
                    if (response.status) {
                      thisreference.handleErrorMessage(response.description);
                      return;
                    }

                    thisreference.cartNotification.renderContents(response);
                  })
                  .catch((e) => {
                    console.error(e);
                  })
                  .finally(() => {
                    submitButton.classList.remove('loading');
                    submitButton.removeAttribute('aria-disabled');
                    thisreference.querySelector('.loading-overlay__spinner').classList.add('hidden');
                  });
          }
	  }, 3000);
	  
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });

  function checkproductcart(){
    	
    }
}
