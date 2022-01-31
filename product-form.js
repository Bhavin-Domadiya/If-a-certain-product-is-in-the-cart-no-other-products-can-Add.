--------------------------------------------------
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
      let bool = false;
      let ptags = $('#tags').val().replace(/\s/g,'').split(',');
      let tags;
      $.ajax({
        type: "GET",
        url: "/cart.json",
        dataType: "json",
        success: function (response) {
          var cart_item = response.item_count;
          if(cart_item == 0){
            bool = true;
          }
          $( response.items ).map(function(i) {
            let handle = response.items[i].handle;
            $.ajax({
              type: "GET",
              url: "/products/"+handle+".json",
              dataType: "json",
              success:function(res){
                tags = res.product.tags.replace(/\s/g,'').split(',');
                for(i=0; i < ptags.length; i++){                        
                  if(tags.includes(ptags[i])){
                    bool = true;
                    break;
                  }	
                }
              }
            })
          })
        },
      });
      
      var this_ref = this;
      setTimeout(function(){
      if(bool){
      const submitButton = this_ref.querySelector('[type="submit"]');
      if (submitButton.classList.contains('loading')) return;

      this_ref.handleErrorMessage();
      this_ref.cartNotification.setActiveElement(document.activeElement);

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');
      this_ref.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this_ref.form);
      formData.append('sections', this_ref.cartNotification.getSectionsToRender().map((section) => section.id));
      formData.append('sections_url', window.location.pathname);
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this_ref.handleErrorMessage(response.description);
            return;
          }

          this_ref.cartNotification.renderContents(response);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('aria-disabled');
          this_ref.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }
                 else{
              	$(".specific-pro-error").show();
            }
    },1500);
      
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
}
